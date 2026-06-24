import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function getWeather(destination: string, startDate: string, days: number) {
  try {
    const geocodeRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=tr&format=json`
    );
    const geocode = await geocodeRes.json();
    if (!geocode.results?.[0]) return null;

    const { latitude, longitude } = geocode.results[0];
    const endDate = new Date(new Date(startDate).getTime() + days * 86400000).toISOString().split("T")[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&start_date=${startDate}&end_date=${endDate}&timezone=auto&forecast_days=16`
    );
    const weather = await weatherRes.json();
    return weather.daily;
  } catch {
    return null;
  }
}

async function getExchangeRate(from: string, to: string = "TRY") {
  try {
    if (from === to) return 1;
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();
    return data.rates?.[to] ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, startDate, endDate, budget, currency, travelers, interests, transport, flightInfo, hotelInfo, notes, duration, userId } = body;

    const [weather, exchangeRate] = await Promise.all([
      getWeather(destination, startDate, Math.min(duration, 16)),
      getExchangeRate(currency),
    ]);

    const weatherSummary = weather
      ? weather.temperature_2m_max
          .slice(0, Math.min(duration, 16))
          .map((max: number, i: number) => {
            const date = new Date(new Date(startDate).getTime() + i * 86400000);
            const dateStr = date.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" });
            const isRainy = weather.precipitation_sum[i] > 5;
            return `${dateStr}: ${weather.temperature_2m_min[i].toFixed(0)}°C - ${max.toFixed(0)}°C${isRainy ? " 🌧️ Yağmurlu" : ""}`;
          })
          .join("\n")
      : "Hava durumu bilgisi alınamadı.";

    const prompt = `Sen TravelMind AI'sın. Kullanıcıya ${destination} için ${duration} günlük detaylı seyahat planı hazırla.

SEYAHAT BİLGİLERİ:
- Destinasyon: ${destination}
- Tarih: ${startDate} - ${endDate} (${duration} gün)
- Bütçe: ${Number(budget).toLocaleString("tr-TR")} ${currency}${exchangeRate ? ` (yaklaşık ${(Number(budget) * exchangeRate).toLocaleString("tr-TR")} TL)` : ""}
- Kişi sayısı: ${travelers}
- İlgi alanları: ${interests.join(", ") || "Genel"}
- Ulaşım tercihi: ${transport.join(", ") || "Belirtilmemiş"}
${flightInfo ? `- Uçuş: ${flightInfo}` : ""}
${hotelInfo ? `- Konaklama: ${hotelInfo}` : ""}
${notes ? `- Notlar: ${notes}` : ""}

HAVA DURUMU TAHMİNİ:
${weatherSummary}

ÇIKTI FORMATI (JSON):

{
  "title": "Plan başlığı",
  "summary": "2-3 cümle özet",
  "days": [
    {
      "day": 1,
      "date": "tarih",
      "weather": "hava özeti",
      "isRainy": false,
      "activities": [
        {
          "time": "09:00",
          "name": "Aktivite adı",
          "description": "Açıklama",
          "why": "Neden öneriliyor",
          "estimatedCost": 150,
          "duration": "2 saat",
          "type": "culture|food|nature|shopping|transport|accommodation"
        }
      ],
      "planB": null
    }
  ],
  "budgetBreakdown": {
    "accommodation": { "amount": 1500, "percentage": 30 },
    "food": { "amount": 1000, "percentage": 20 },
    "activities": { "amount": 750, "percentage": 15 },
    "transport": { "amount": 500, "percentage": 10 },
    "shopping": { "amount": 500, "percentage": 10 },
    "emergency": { "amount": 750, "percentage": 15 }
  },
  "hotelRecommendations": [
    { "name": "Otel adı", "tier": "economic|midrange|premium", "pricePerNight": 500, "description": "Açıklama", "location": "Konum" }
  ],
  "packingList": {
    "clothing": ["item1"],
    "accessories": ["item1"],
    "tech": ["item1"],
    "health": ["item1"],
    "documents": ["item1"]
  },
  "hiddenGems": [
    { "name": "Yer adı", "description": "Açıklama", "tip": "İpucu" }
  ],
  "localTips": ["Tavsiye 1", "Tavsiye 2"]
}

Sadece JSON döndür, başka metin ekleme. Tüm metinler Türkçe olsun. Saatlik aktiviteler gerçekçi ve detaylı olsun. Yağmurlu günler için planB öner.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    let planData;
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      planData = JSON.parse(jsonMatch?.[0] ?? content.text);
    } catch {
      throw new Error("JSON parse error");
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("travel_plans")
      .insert({
        user_id: userId,
        destination,
        start_date: startDate,
        end_date: endDate,
        duration_days: duration,
        budget: Number(budget),
        currency,
        travelers: Number(travelers),
        interests,
        transport_preferences: transport,
        flight_info: flightInfo,
        hotel_info: hotelInfo,
        notes,
        plan_data: planData,
        weather_data: weather,
        title: planData.title,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Plan oluşturulamadı" }, { status: 500 });
  }
}
