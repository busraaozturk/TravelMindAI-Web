import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fetchWeather(destination: string, startDate: string, days: number) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=tr&format=json`
    );
    const geo = await geoRes.json();
    if (!geo.results?.[0]) return null;
    const { latitude, longitude } = geo.results[0];

    const endDate = new Date(new Date(startDate).getTime() + Math.min(days, 16) * 86400000)
      .toISOString().split("T")[0];

    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&start_date=${startDate}&end_date=${endDate}&timezone=auto&forecast_days=16`
    );
    const w = await wRes.json();
    return w.daily ?? null;
  } catch {
    return null;
  }
}

async function generateAIPlan(
  destination: string, duration: number, budget: number, currency: string,
  interests: string[], transport: string[], hotelInfo: string, flightInfo: string,
  notes: string, travelers: number, startDate: string,
  weatherData: Record<string, unknown> | null
): Promise<Record<string, unknown>> {

  const weatherSummary = weatherData
    ? (weatherData.temperature_2m_max as number[])
        ?.slice(0, Math.min(duration, 7))
        .map((max: number, i: number) => {
          const min = (weatherData.temperature_2m_min as number[])[i];
          const rain = (weatherData.precipitation_probability_max as number[])[i];
          const d = new Date(startDate);
          d.setDate(d.getDate() + i);
          return `Gün ${i + 1} (${d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}): ${min?.toFixed(0)}°C–${max?.toFixed(0)}°C, yağış %${rain}`;
        }).join(" | ")
    : "Hava durumu verisi alınamadı";

  const prompt = `Sen TravelMind AI'sın. ${destination} şehri için ${duration} günlük, kişiselleştirilmiş ve detaylı seyahat planı hazırla.

SEYAHAT BİLGİLERİ:
- Destinasyon: ${destination}
- Başlangıç: ${startDate}
- Süre: ${duration} gün
- Bütçe: ${budget.toLocaleString("tr-TR")} ${currency}
- Kişi sayısı: ${travelers}
- İlgi alanları: ${interests.join(", ") || "Belirtilmemiş"}
- Ulaşım tercihi: ${transport.join(", ") || "Belirtilmemiş"}
${flightInfo ? `- Uçuş bilgisi: ${flightInfo}` : ""}
${hotelInfo ? `- Konaklama bilgisi: ${hotelInfo}` : ""}
${notes ? `- Özel notlar: ${notes}` : ""}

HAVA DURUMU: ${weatherSummary}

KURALLAR:
- Tüm metinler Türkçe olsun
- Destinasyona özel gerçek mekan, restoran ve aktivite isimleri kullan
- Günlük rotalar otelin konumuna göre coğrafi olarak optimize edilmiş olsun
- Her gün için sabah 08:00 - akşam 22:00 arasında 5-7 aktivite planla
- Aktiviteler arasında ulaşım süreleri gerçekçi olsun
- Bütçe dağılımı gerçekçi ve tutarlı olsun (toplamlar budget'a eşit olsun)
- Otel önerilerinde recommended:true olan sadece 1 tane olsun

ÇIKTI FORMATI (sadece geçerli JSON döndür, başka metin ekleme):
{
  "title": "string",
  "summary": "string (2-3 cümle, destinasyona özel, ilgi alanlarını yansıtsın)",
  "interests": ["string"],
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "weather": "string (hava durumu özeti)",
      "isRainy": false,
      "planB": "string veya null",
      "activities": [
        {
          "time": "HH:MM",
          "name": "string (gerçek mekan adı)",
          "description": "string (detaylı açıklama)",
          "why": "string (neden önerildi, kullanıcı tercihlerine bağla)",
          "estimatedCost": 0,
          "duration": "string (ör: 2 saat)",
          "type": "culture|food|nature|shopping|transport|accommodation",
          "rating": 4.5,
          "cuisine": "string veya null"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": { "amount": 0, "percentage": 0 },
    "food": { "amount": 0, "percentage": 0 },
    "activities": { "amount": 0, "percentage": 0 },
    "transport": { "amount": 0, "percentage": 0 },
    "shopping": { "amount": 0, "percentage": 0 },
    "emergency": { "amount": 0, "percentage": 0 }
  },
  "hotelRecommendations": [
    {
      "name": "string (gerçek otel adı)",
      "tier": "economic|midrange|premium",
      "type": "string",
      "pricePerNight": 0,
      "rating": 4.5,
      "description": "string",
      "location": "string",
      "district": "string",
      "whyRecommended": "string",
      "distanceToCenter": "string",
      "nearestTransport": "string",
      "touristAccess": "string",
      "pros": ["string"],
      "cons": ["string"],
      "recommended": false
    }
  ],
  "packingList": {
    "clothing": ["string"],
    "accessories": ["string"],
    "tech": ["string"],
    "health": ["string"]
  },
  "packingTip": "string (destinasyona özel tavsiye)",
  "hiddenGems": [
    { "name": "string", "description": "string", "tip": "string" }
  ],
  "viewpoints": [
    { "name": "string", "description": "string" }
  ],
  "localSpots": [
    { "name": "string", "description": "string" }
  ],
  "rainyDayAlternatives": [
    { "name": "string", "description": "string" }
  ],
  "localTips": [
    { "category": "string", "icon": "bus|shield|globe|zap|tip", "text": "string" }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 8000,
    temperature: 0.7,
  });

  const content = response.choices[0].message.content ?? "{}";
  return JSON.parse(content);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, startDate, endDate, budget, currency, travelers, interests, transport, flightInfo, hotelInfo, notes, duration, userId } = body;

    const weatherData = await fetchWeather(destination, startDate, duration);

    const planData = await generateAIPlan(
      destination, duration, Number(budget), currency,
      interests, transport, hotelInfo ?? "", flightInfo ?? "",
      notes ?? "", Number(travelers), startDate, weatherData
    );

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
        weather_data: weatherData,
        title: planData.title as string,
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
