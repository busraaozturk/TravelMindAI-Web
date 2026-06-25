import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface HotelOption {
  name: string;
  tier: string;
  type: string;
  pricePerNight: number;
  rating: number;
  description: string;
  location: string;
  district: string;
  whyRecommended: string;
  distanceToCenter: string;
  nearestTransport: string;
  touristAccess: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
}

// Konaklama tercihi → tier eşlemesi
function preferredTier(hotelInfo: string, transport: string[]): string {
  const info = hotelInfo?.toLowerCase() ?? "";
  if (info.includes("lüks") || info.includes("luxury") || info.includes("premium") || info.includes("5 yıldız")) return "premium";
  if (info.includes("ekonomik") || info.includes("hostel") || info.includes("ucuz") || info.includes("bütçe")) return "economic";
  return "midrange"; // varsayılan
}

function generateHotels(destination: string, budget: number, hotelInfo: string, transport: string[], interests: string[]): HotelOption[] {
  const preferred = preferredTier(hotelInfo, transport);
  const hasPublicTransport = transport.includes("Toplu Taşıma") || transport.includes("Metro");
  const isCulture = interests.includes("Tarih & Kültür") || interests.includes("Müze & Galeri");
  const isNature = interests.includes("Doğa & Macera") || interests.includes("Plaj & Deniz");

  const hotels: HotelOption[] = [
    {
      name: `${destination} Merkez Otel`,
      tier: "economic",
      type: "Otel",
      pricePerNight: Math.round(budget * 0.034),
      rating: 4.3,
      description: "Merkeze yakın, temiz ve işlevsel odalar. Bütçe dostu seçenek.",
      location: `${destination} Merkez`,
      district: "Şehir merkezi yakını",
      whyRecommended: isCulture
        ? `Tarihi mekanların büyük çoğunluğuna yürüme mesafesinde. Kültür turları için ideal başlangıç noktası.`
        : hasPublicTransport
          ? `Merkezi konumu sayesinde toplu taşıma ile tüm noktalara kolayca ulaşılabilir.`
          : `${destination} merkezine yakın konumuyla tüm turistik noktalara erişim kolaylığı sağlar.`,
      distanceToCenter: "300m – 1km",
      nearestTransport: "Metro/otobüs durağı yürüme mesafesinde",
      touristAccess: "Ana turistik bölgelere yürüme mesafesi",
      pros: ["Uygun fiyat", "Merkezi konum", "Toplu taşımaya yakın"],
      cons: ["Oda boyutları küçük olabilir", "Cadde gürültüsü"],
      recommended: preferred === "economic",
    },
    {
      name: `${destination} Butik & Spa`,
      tier: "midrange",
      type: "Butik",
      pricePerNight: Math.round(budget * 0.10),
      rating: 4.5,
      description: "Şık tasarım, kahvaltı dahil ve spa hizmeti sunan merkezi butik otel.",
      location: `${destination} Tarihi Bölge`,
      district: "Tarihi merkez",
      whyRecommended: isCulture
        ? `Tarihi merkez içinde konuşlu; müze ve tarihi yapılara yürüyerek ulaşım sağlanır. Kültür ağırlıklı programınızla mükemmel uyum.`
        : isNature
          ? `Şehrin doğal güzelliklerine kolay erişim sağlar. Günübirlik doğa turları için ideal merkez.`
          : `Bütçeniz ve konfor beklentinizle örtüşen en dengeli seçenek. Konum ve fiyat açısından tarzınıza uygun.`,
      distanceToCenter: "100m – 600m",
      nearestTransport: "Tramvay/metro 3–5 dk yürüme",
      touristAccess: "Başlıca cazibe merkezlerine yürüme mesafesi",
      pros: ["Kahvaltı dahil", "Konforlu odalar", "Tarihi dokuyla iç içe"],
      cons: ["Otopark imkânı sınırlı", "Yüksek sezonda erken rezervasyon gerekli"],
      recommended: preferred === "midrange",
    },
    {
      name: `${destination} Grand Resort`,
      tier: "premium",
      type: "Resort",
      pricePerNight: Math.round(budget * 0.32),
      rating: 4.7,
      description: "Panoramik manzara, özel servis, spa ve restoranlarıyla premium konaklama.",
      location: `${destination} Prestij Bölgesi`,
      district: "Şehrin en prestijli bölgesi",
      whyRecommended: isNature
        ? `Doğa manzarasına hâkim konumuyla dinlendirici bir konaklama deneyimi sunar. Özel plaj ve spa ile seyahatinize ayrı bir lüks katılır.`
        : `Tüm önemli noktalara özel transfer imkânı. En yüksek konfor ve hizmet standardı için ideal tercih.`,
      distanceToCenter: "500m – 2km",
      nearestTransport: "Otel servisi / taksi",
      touristAccess: "Özel araç veya otel transferiyle tüm noktalara erişim",
      pros: ["Panoramik manzara", "Özel servis & transfer", "Spa & fine dining"],
      cons: ["Yüksek gecelik fiyat", "Merkeze uzaklık ekstra ulaşım gerektirir"],
      recommended: preferred === "premium",
    },
  ];

  // Önerilen otel bulunamazsa midrange varsayılan olsun
  if (!hotels.some(h => h.recommended)) {
    hotels[1].recommended = true;
  }

  return hotels;
}

function generateDays(destination: string, duration: number, budget: number, interests: string[], transport: string[], recommendedHotel: HotelOption) {
  const activitySets = [
    // Gün 1 — Varış + Otel çevresi
    [
      { time: "10:00", name: "Otel Check-in & Çevre Keşfi", description: `${recommendedHotel.district} bölgesini yürüyerek keşfedin, mahalleyi tanıyın.`, why: `Otelin bulunduğu ${recommendedHotel.district} bölgesi, ilk gün için mükemmel bir başlangıç noktası. Gereksiz ulaşım olmadan şehre ısınabilirsiniz.`, estimatedCost: 0, duration: "1 saat", type: "culture", rating: 4.6, transitToNext: { walking: { time: "5 dk", distance: "0.3 km" }, transit: { time: "—", type: "Yürüyüş mesafesi" }, taxi: { time: "2 dk", cost: Math.round(budget * 0.002) } } },
      { time: "11:30", name: "Yerel Kahvaltı & Pazar", description: "Bölgedeki geleneksel kahvaltı mekanlarından birinde güne başlayın.", why: "Otele yakın olması sayesinde zaman ve ulaşım maliyeti sıfır.", estimatedCost: Math.round(budget * 0.01), duration: "1 saat", type: "food", cuisine: "Yerel Mutfak", rating: 4.4, transitToNext: { walking: { time: "12 dk", distance: "0.9 km" }, transit: { time: "8 dk", type: "Tramvay" }, taxi: { time: "4 dk", cost: Math.round(budget * 0.003) } } },
      { time: "13:00", name: `${destination} Tarihi Merkez Turu`, description: "Şehrin simge yapıları ve tarihi meydanlarını keşfedin.", why: interests.includes("Tarih & Kültür") ? "İlgi alanlarınıza özel seçildi. Otelinizdeki konuma göre en verimli başlangıç güzergahı." : "Şehri tanımanın en iyi yolu; otele yakın güzergah planlandı.", estimatedCost: Math.round(budget * 0.02), duration: "2.5 saat", type: "culture", rating: 4.7, transitToNext: { walking: { time: "18 dk", distance: "1.4 km" }, transit: { time: "10 dk", type: "Metro" }, taxi: { time: "5 dk", cost: Math.round(budget * 0.004) } } },
      { time: "16:00", name: interests.includes("Yemek & Gastronomi") ? "Sokak Lezzetleri Turu" : "Tarihi Çarşı Gezisi", description: interests.includes("Yemek & Gastronomi") ? "Bölgenin meşhur sokak yemeklerini tadın." : "Geleneksel çarşıda yerel ürünleri keşfedin.", why: "Otele dönüş güzergahı üzerinde planlandı; ekstra ulaşım gerekmez.", estimatedCost: Math.round(budget * 0.015), duration: "1.5 saat", type: interests.includes("Yemek & Gastronomi") ? "food" : "shopping", cuisine: interests.includes("Yemek & Gastronomi") ? "Sokak Yemekleri" : undefined, rating: 4.3, transitToNext: { walking: { time: "8 dk", distance: "0.6 km" }, transit: { time: "5 dk", type: "Otobüs" }, taxi: { time: "3 dk", cost: Math.round(budget * 0.002) } } },
      { time: "18:30", name: "Gün Batımı Manzara Noktası", description: `${destination}'nın en güzel panoramik noktasından şehri izleyin.`, why: "Akşam yemeği öncesi kısa bir durak; otele yürüme mesafesinde.", estimatedCost: 0, duration: "45 dk", type: "nature", rating: 4.8, transitToNext: { walking: { time: "10 dk", distance: "0.8 km" }, transit: { time: "7 dk", type: "Tramvay" }, taxi: { time: "4 dk", cost: Math.round(budget * 0.003) } } },
      { time: "20:00", name: "Akşam Yemeği", description: "Otel çevresindeki yerel restoranlarda bölge mutfağını deneyin.", why: "Otele yakın restoranlar tercih edildi, uzun ulaşım masrafı oluşmaz.", estimatedCost: Math.round(budget * 0.02), duration: "1.5 saat", type: "food", cuisine: "Yerel Mutfak", rating: 4.5, transitToNext: null },
    ],
    // Gün 2 — Uzak bölgeler
    [
      { time: "09:00", name: "Sabah Kahvaltısı", description: "Güne erken başlamak için otel kahvaltısı veya yakın bir kafe.", why: "Erken çıkış, toplu taşıma kalabalığından önce hareket etmenizi sağlar.", estimatedCost: Math.round(budget * 0.008), duration: "45 dk", type: "food", cuisine: "Kahvaltı", rating: 4.2, transitToNext: { walking: { time: "20 dk", distance: "1.6 km" }, transit: { time: "12 dk", type: "Metro" }, taxi: { time: "6 dk", cost: Math.round(budget * 0.005) } } },
      { time: "10:00", name: interests.includes("Müze & Galeri") ? `${destination} Arkeoloji Müzesi` : `${destination} Doğa Parkı`, description: interests.includes("Müze & Galeri") ? "Şehrin en kapsamlı müzesinde tarihi eserleri inceleyin." : "Şehre yakın doğal parkta yürüyüş ve manzara keyfi.", why: interests.includes("Müze & Galeri") ? "İlgi alanlarınıza göre seçildi. Toplu taşıma ile kolay erişim." : "Doğa tercihleriniz gözetilerek eklendi.", estimatedCost: Math.round(budget * 0.02), duration: "2 saat", type: interests.includes("Müze & Galeri") ? "culture" : "nature", rating: 4.6, transitToNext: { walking: { time: "8 dk", distance: "0.7 km" }, transit: { time: "5 dk", type: "Tramvay" }, taxi: { time: "3 dk", cost: Math.round(budget * 0.003) } } },
      { time: "12:30", name: "Öğle Yemeği — Yerel Lezzet", description: "Bölgenin en çok tercih edilen restoranlarından birinde öğle molası.", why: "Müze/park çıkışına yakın; ek ulaşım gerekmez.", estimatedCost: Math.round(budget * 0.015), duration: "1 saat", type: "food", cuisine: "Yöresel Mutfak", rating: 4.4, transitToNext: { walking: { time: "15 dk", distance: "1.2 km" }, transit: { time: "10 dk", type: "Otobüs" }, taxi: { time: "5 dk", cost: Math.round(budget * 0.004) } } },
      { time: "14:00", name: interests.includes("Alışveriş") ? "Alışveriş Merkezi & Çarşı" : "Kültürel Mahalle Gezisi", description: interests.includes("Alışveriş") ? "Şehrin ünlü alışveriş bölgesini gezip yerel markalar ve hediyelikler keşfedin." : "Turistlerin az uğradığı otantik mahalleleri yürüyerek keşfedin.", why: "Öğleden sonra güzergahı, otel dönüşüne uygun planlandı.", estimatedCost: Math.round(budget * 0.03), duration: "2 saat", type: interests.includes("Alışveriş") ? "shopping" : "culture", rating: 4.3, transitToNext: { walking: { time: "12 dk", distance: "0.9 km" }, transit: { time: "8 dk", type: "Metro" }, taxi: { time: "4 dk", cost: Math.round(budget * 0.003) } } },
      { time: "17:00", name: "Kafe Molası & Dinlenme", description: "Şehrin popüler bir kafesinde dinlenin, yerel içecekleri deneyin.", why: "Uzun gün sonrası ara mola; otele dönüş güzergahında.", estimatedCost: Math.round(budget * 0.008), duration: "1 saat", type: "food", cuisine: "Kafe", rating: 4.1, transitToNext: { walking: { time: "22 dk", distance: "1.8 km" }, transit: { time: "14 dk", type: "Tramvay" }, taxi: { time: "7 dk", cost: Math.round(budget * 0.006) } } },
      { time: "19:30", name: "Akşam Yemeği & Gece Turu", description: "Şehrin gece hayatını keşfedin, aydınlanmış sokaklarda yürüyüş yapın.", why: interests.includes("Gece Hayatı") ? "Gece hayatı tercihinize göre seçildi." : "Geceyi verimli geçirmek için kısa bir şehir turu.", estimatedCost: Math.round(budget * 0.022), duration: "2 saat", type: "food", cuisine: "Akdeniz Mutfağı", rating: 4.5, transitToNext: null },
    ],
  ];

  return Array.from({ length: Math.min(duration, 7) }, (_, i) => {
    const isRainy = i % 3 === 2;
    const activities = activitySets[i % activitySets.length];
    return {
      day: i + 1,
      date: new Date(Date.now() + i * 86400000).toISOString().split("T")[0],
      weather: isRainy ? "Parçalı bulutlu, 18°C – 24°C" : "Güneşli, 22°C – 28°C",
      isRainy,
      activities,
      planB: isRainy
        ? `Yağmurlu hava alternatifi: ${recommendedHotel.district} bölgesindeki kapalı müzeler, yerel kafeler ve alışveriş merkezleri. ${transport.includes("Toplu Taşıma") ? "Toplu taşıma ile kuru kalarak gezebilirsiniz." : "Taksi ile kısa mesafeli kapalı mekânlar tercih edilebilir."}`
        : null,
    };
  });
}

function generateMockPlan(
  destination: string,
  duration: number,
  budget: number,
  currency: string,
  interests: string[],
  transport: string[],
  hotelInfo: string,
) {
  const hotels = generateHotels(destination, budget, hotelInfo, transport, interests);
  const recommendedHotel = hotels.find(h => h.recommended) ?? hotels[1];
  const days = generateDays(destination, duration, budget, interests, transport, recommendedHotel);

  const interestTags = interests.length > 0 ? interests.slice(0, 4) : ["Kültür", "Gastronomi", "Keşif", "Dinlence"];

  return {
    title: `${destination} ${duration} Günlük Seyahat Planı`,
    summary: `Bu ${duration} günlük ${destination} planı, ${interestTags.join(", ").toLowerCase()} ağırlıklı deneyimler sunarken konfor ve bütçeyi dengeleyerek şehri verimli şekilde keşfetmenizi sağlar. Rota ${recommendedHotel.district} bölgesindeki konaklamanıza göre optimize edildi; günler coğrafi olarak mantıklı sıraya kondu ve toplam ${budget.toLocaleString("tr-TR")} ${currency} bütçeniz beş kaleme dağıtıldı.`,
    interests: interestTags,
    days,
    budgetBreakdown: {
      accommodation: { amount: Math.round(budget * 0.30), percentage: 30 },
      food:          { amount: Math.round(budget * 0.22), percentage: 22 },
      activities:    { amount: Math.round(budget * 0.18), percentage: 18 },
      transport:     { amount: Math.round(budget * 0.15), percentage: 15 },
      shopping:      { amount: Math.round(budget * 0.10), percentage: 10 },
      emergency:     { amount: Math.round(budget * 0.05), percentage: 5 },
    },
    hotelRecommendations: hotels,
    packingList: {
      clothing: [
        "Hafif, nefes alan kıyafetler",
        "Şapka veya kep",
        "Güneş gözlüğü",
        "Rahat yürüyüş ayakkabısı/sandalet",
        "İnce bir hırka (klimalı mekanlar için)",
        "Su geçirmez/spor ayakkabı ve hızlı kuruyan kıyafet",
      ],
      accessories: [
        "Güneş kremi (SPF50)",
        "Mini yelpaze / el fanı",
        "Su matarası",
        "Hafif sırt çantası",
        "Ekstra hafıza kartı ve lens bezi",
      ],
      tech: [
        "Powerbank (en az 10.000 mAh)",
        "Telefon şarj kablosu",
        "Telefon için su geçirmez kılıf",
        "Çevrimdışı harita ve seyahat uygulamaları",
      ],
      health: [
        "Kişisel ilaçlarınızı ve reçetelerinizi yanınıza taşıyın",
        "Seyahat sağlık sigortası yaptırın",
        "Kalabalık turistik noktalarda çantanızı önde taşıyın. Taksilerde taksimetre açtırın veya uygulama üzerinden çağırın.",
        "Sıcak saatlerde bol su içip güneşten korunun",
      ],
    },
    packingTip: `Bu seyahatte günlük ortalama ${Math.round(duration * 2.5 / duration * 10) / 10} km yürüyüş planlandığı için rahat bir ayakkabı tercih edilmesi önerilir.`,
    hiddenGems: [
      { name: `${destination} Eski Mahallesi`, description: "Turistlerin pek uğramadığı, otantik yerel yaşamı gözlemleyebileceğiniz tarihi sokaklar.", tip: "Sabah erken saatlerde ziyaret edin, daha sakin ve fotoğraf çekimi için ideal." },
      { name: "Yerel Pazar", description: "Taze ürünler ve el yapımı hediyelikler sunan geleneksel pazar.", tip: "Pazarlık yapmaktan çekinmeyin." },
      { name: "Gizli Vadi & Yürüyüş Yolu", description: "Şehrin hemen dışında sakin bir yürüyüş parkuru.", tip: "Su ve atıştırmalık götürün." },
    ],
    rainyDayAlternatives: [
      { name: `${destination} Modern Sanat Müzesi`, description: "Çağdaş sanat koleksiyonu, şehir manzaralı kafe" },
      { name: "Kapalı Çarşı & Tarihi Han", description: "Binlerce dükkânlı dev kapalı alan, yağmurdan etkilenmez" },
      { name: "Yerel Sinema & Kültür Merkezi", description: "Orijinal dilde film seansları ve sanatsal etkinlikler" },
    ],
    localSpots: [
      { name: `${destination} Sahili`, description: "Yerel halkın akşamüstü buluşma ve yürüyüş noktası" },
      { name: `${destination} Çarşı İçi Esnaf Lokantaları`, description: "Mahalle sakinlerinin günlük tercih ettiği ev yemeği mekanları" },
      { name: `${destination} Sahil Parkı`, description: "Yerel halkın piknik ve dinlenme alanı, turistlerin pek bilmediği huzurlu köşe" },
    ],
    viewpoints: [
      { name: `${destination} Manzara Tepesi`, description: "Şehrin iki yakasını birden gören en yüksek nokta" },
      { name: `${destination} Kule Terası`, description: "360° panorama, gün batımı için ideal" },
      { name: `${destination} Sahil Yürüyüş Yolu`, description: "Sahil manzarası, yürüyerek kolay erişim" },
    ],
    localTips: [
      {
        category: "Ulaşım",
        icon: "bus",
        text: `${destination} ulaşım kartı alın; vapur, metro ve tramvayda geçerli. Trafik saatlerinde (08–10 / 17–20) raylı sistem ve vapuru tercih edin.`,
      },
      {
        category: "Güvenlik",
        icon: "shield",
        text: "Kalabalık turistik noktalarda çantanızı önde taşıyın. Taksilerde taksimetre açtırın veya uygulama üzerinden çağırın.",
      },
      {
        category: "Kültür",
        icon: "globe",
        text: "Dini mekânlara girerken omuz ve diz kapalı olmalı; kadınlar için örtü girişlerde temin edilebilir. Pazarda pazarlık doğaldır.",
      },
      {
        category: "Yerel İpucu",
        icon: "zap",
        text: `Müze girişlerinde müze kartı / geçiş pasını değerlendirin. Şehrin düzenli feribot hatları, turistik tekne turuna kıyasla aynı manzarayı çok daha uygun fiyata sunar.`,
      },
    ],
  };
}

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, startDate, endDate, budget, currency, travelers, interests, transport, flightInfo, hotelInfo, notes, duration, userId } = body;

    const [planData, weatherData] = await Promise.all([
      Promise.resolve(generateMockPlan(destination, duration, Number(budget), currency, interests, transport, hotelInfo ?? "")),
      fetchWeather(destination, startDate, duration),
    ]);

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
