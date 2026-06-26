"use client";

import { useState, useRef } from "react";
import { Search, Wind, Droplets, Eye, Thermometer, Sun, CloudRain, Navigation, MapPin } from "lucide-react";

const WMO: Record<number, { label: string; icon: string }> = {
  0:  { label: "Açık",                icon: "☀️" },
  1:  { label: "Çoğunlukla açık",     icon: "🌤️" },
  2:  { label: "Parçalı bulutlu",     icon: "⛅" },
  3:  { label: "Kapalı",              icon: "☁️" },
  45: { label: "Sisli",               icon: "🌫️" },
  48: { label: "Dondurucu sis",       icon: "🌫️" },
  51: { label: "Hafif çisenti",       icon: "🌦️" },
  53: { label: "Orta çisenti",        icon: "🌦️" },
  55: { label: "Yoğun çisenti",       icon: "🌧️" },
  61: { label: "Hafif yağmur",        icon: "🌧️" },
  63: { label: "Orta yağmur",         icon: "🌧️" },
  65: { label: "Yoğun yağmur",        icon: "🌧️" },
  71: { label: "Hafif kar",           icon: "🌨️" },
  73: { label: "Orta kar",            icon: "🌨️" },
  75: { label: "Yoğun kar",           icon: "❄️" },
  80: { label: "Sağanak",             icon: "🌦️" },
  81: { label: "Yoğun sağanak",       icon: "🌧️" },
  82: { label: "Şiddetli sağanak",    icon: "⛈️" },
  95: { label: "Gök gürültülü fırtına", icon: "⛈️" },
  99: { label: "Dolu fırtınası",      icon: "⛈️" },
};

const DAYS_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const MONTHS_TR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

function wmo(code: number) { return WMO[code] ?? { label: "Bilinmiyor", icon: "🌤️" }; }
function fmtDate(d: string) {
  const dt = new Date(d + "T12:00:00");
  return `${DAYS_TR[dt.getDay()]} ${dt.getDate()} ${MONTHS_TR[dt.getMonth()]}`;
}
function fmtHour(d: string) {
  return d.slice(11, 16);
}
function windDir(deg: number) {
  const dirs = ["K","KD","D","GD","G","GB","B","KB"];
  return dirs[Math.round(deg / 45) % 8];
}

interface GeoResult { name: string; country: string; admin1?: string; latitude: number; longitude: number; }
interface WeatherData {
  city: string;
  lat: number;
  lon: number;
  current: { temp: number; feels: number; humidity: number; wind: number; windDir: number; precip: number; uv: number; code: number; };
  hourly: { time: string; temp: number; code: number; precip: number; }[];
  daily: { date: string; code: number; maxTemp: number; minTemp: number; rainProb: number; maxWind: number; }[];
}

async function fetchWeather(lat: number, lon: number, city: string): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index` +
    `&hourly=temperature_2m,precipitation_probability,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
    `&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  const d = await res.json();
  const c = d.current;
  const now = new Date().getHours();
  return {
    city,
    lat,
    lon,
    current: {
      temp: Math.round(c.temperature_2m),
      feels: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      wind: Math.round(c.wind_speed_10m),
      windDir: c.wind_direction_10m,
      precip: c.precipitation,
      uv: Math.round(c.uv_index ?? 0),
      code: c.weather_code,
    },
    hourly: d.hourly.time
      .map((t: string, i: number) => ({ time: t, temp: Math.round(d.hourly.temperature_2m[i]), code: d.hourly.weather_code[i], precip: d.hourly.precipitation_probability[i] }))
      .filter((_: any, i: number) => {
        const h = new Date(d.hourly.time[i]).getHours();
        const idx = new Date(d.hourly.time[i]).getDate();
        const today = new Date().getDate();
        return idx === today && h >= now;
      })
      .slice(0, 12),
    daily: d.daily.time.map((t: string, i: number) => ({
      date: t,
      code: d.daily.weather_code[i],
      maxTemp: Math.round(d.daily.temperature_2m_max[i]),
      minTemp: Math.round(d.daily.temperature_2m_min[i]),
      rainProb: d.daily.precipitation_probability_max[i],
      maxWind: Math.round(d.daily.wind_speed_10m_max[i]),
    })),
  };
}

export default function WeatherPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function searchCity(q: string) {
    setQuery(q);
    if (q.length < 2) { setSuggestions([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=tr`);
      const d = await res.json();
      setSuggestions(d.results ?? []);
    }, 300);
  }

  async function selectCity(geo: GeoResult) {
    setQuery(`${geo.name}, ${geo.admin1 ?? geo.country}`);
    setSuggestions([]);
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeather(geo.latitude, geo.longitude, `${geo.name}, ${geo.admin1 ?? geo.country}`);
      setWeather(data);
    } catch {
      setError("Hava durumu alınamadı. Lütfen tekrar deneyin.");
    }
    setLoading(false);
  }

  const cur = weather?.current;
  const curWmo = cur ? wmo(cur.code) : null;

  return (
    <div className="space-y-5">
      {/* Başlık + Arama */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-dm-sans)" }}>
            Hava Durumu
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-light)" }}>
            Şehir adı girerek anlık ve 7 günlük tahmini görün
          </p>
        </div>

        {/* Arama */}
        <div className="relative w-full sm:w-80">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-light)" }} />
          <input
            className="input-field pl-11"
            placeholder="örn. İstanbul, Paris, Tokyo..."
            value={query}
            onChange={(e) => searchCity(e.target.value)}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 rounded-2xl shadow-lg overflow-hidden"
              style={{ background: "white", border: "1.5px solid var(--border)" }}>
              {suggestions.map((g, i) => (
                <button key={i} onClick={() => selectCity(g)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-orange-50 transition-colors"
                  style={{ borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <MapPin size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                  <div>
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{g.name}</span>
                    <span className="text-xs ml-2" style={{ color: "var(--text-light)" }}>{g.admin1 ? `${g.admin1}, ` : ""}{g.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3 animate-pulse">🌤️</div>
          <p style={{ color: "var(--text-light)" }}>Hava durumu alınıyor...</p>
        </div>
      )}

      {error && (
        <div className="card p-6 text-center" style={{ color: "var(--primary)" }}>{error}</div>
      )}

      {weather && !loading && (
        <div className="space-y-4">

          {/* Üst: 2 eşit kolon */}
          <div className="grid grid-cols-2 gap-5 items-stretch">

            {/* Sol: Anlık hava + Saatlik */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1 opacity-90">
                    <MapPin size={14} />
                    <span className="text-sm font-medium">{weather.city}</span>
                  </div>
                  <div className="flex items-end gap-4 mt-2">
                    <div className="text-7xl font-bold leading-none">{cur!.temp}°</div>
                    <div className="mb-2">
                      <div className="text-lg font-semibold opacity-90">{curWmo!.icon} {curWmo!.label}</div>
                      <div className="text-sm opacity-75">Hissedilen: {cur!.feels}°C</div>
                    </div>
                  </div>
                </div>
                <div className="text-8xl opacity-20 absolute right-6 top-4 select-none">{curWmo!.icon}</div>
                <div className="grid grid-cols-4 gap-3 mt-6 pt-5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                  {[
                    { icon: <Droplets size={15} />, label: "Nem",    value: `%${cur!.humidity}` },
                    { icon: <Wind size={15} />,     label: "Rüzgar", value: `${cur!.wind} km/s` },
                    { icon: <Sun size={15} />,      label: "UV",     value: cur!.uv.toString() },
                    { icon: <CloudRain size={15} />,label: "Yağış",  value: `${cur!.precip} mm` },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="opacity-70 flex justify-center mb-1">{s.icon}</div>
                      <div className="font-bold text-sm">{s.value}</div>
                      <div className="text-xs opacity-60 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5 flex-1 flex flex-col">
                <h2 className="text-sm font-bold mb-4" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
                  Bugün Saatlik Tahmin
                </h2>
                <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1">
                  {weather.hourly.map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 px-3 py-4 rounded-2xl flex-shrink-0 flex-1 min-w-[72px]"
                      style={{ background: i === 0 ? "var(--primary)" : "var(--bg)", color: i === 0 ? "white" : "var(--text)" }}>
                      <span className="text-xs font-semibold opacity-80">{fmtHour(h.time)}</span>
                      <span className="text-xl">{wmo(h.code).icon}</span>
                      <span className="text-sm font-bold">{h.temp}°</span>
                      <span className="text-xs opacity-70">💧{h.precip}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ: 7 günlük */}
            <div className="card p-5 h-full">
              <h2 className="text-sm font-bold mb-4" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
                7 Günlük Tahmin
              </h2>
              <div>
                {weather.daily.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 px-2 py-3 rounded-xl transition-colors hover:bg-orange-50"
                    style={{ borderBottom: i < weather.daily.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <span className="text-sm font-semibold w-16 flex-shrink-0" style={{ color: i === 0 ? "var(--primary)" : "var(--text)" }}>
                      {i === 0 ? "Bugün" : fmtDate(d.date)}
                    </span>
                    <span className="text-xl w-7 flex-shrink-0">{wmo(d.code).icon}</span>
                    <span className="text-xs flex-1 truncate" style={{ color: "var(--text-light)" }}>{wmo(d.code).label}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <CloudRain size={11} style={{ color: "var(--info)" }} />
                      <span className="text-xs" style={{ color: "var(--info)" }}>%{d.rainProb}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Thermometer size={11} style={{ color: "var(--primary)" }} />
                      <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{d.maxTemp}°</span>
                      <span className="text-sm" style={{ color: "var(--text-light)" }}>{d.minTemp}°</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Navigation size={11} style={{ color: "var(--text-light)" }} />
                      <span className="text-xs" style={{ color: "var(--text-light)" }}>{d.maxWind}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alt: 4 detay kartı yan yana */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: <Droplets size={20} style={{ color: "var(--info)" }} />, label: "Nem", value: `%${cur!.humidity}`, sub: "Bağıl nem", bg: "#EAF1F7", iconBg: "#D0E6F3" },
              { icon: <Wind size={20} style={{ color: "var(--success)" }} />, label: "Rüzgar", value: `${cur!.wind} km/s`, sub: windDir(cur!.windDir) + " yönünden", bg: "#EAF7EE", iconBg: "#C6EDD5" },
              { icon: <Sun size={20} style={{ color: "#F59E0B" }} />, label: "UV İndeksi", value: `${cur!.uv}`, sub: cur!.uv <= 2 ? "Düşük" : cur!.uv <= 5 ? "Orta" : cur!.uv <= 7 ? "Yüksek" : "Çok yüksek", bg: "#FEF9EC", iconBg: "#FDE9A2" },
              { icon: <CloudRain size={20} style={{ color: "var(--primary)" }} />, label: "Yağış", value: `${cur!.precip} mm`, sub: "Son 1 saatte", bg: "var(--primary-soft)", iconBg: "#EBC8B8" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4 flex gap-3 items-center" style={{ background: s.bg }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.iconBg }}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-lg font-bold leading-none" style={{ color: "var(--text)" }}>{s.value}</div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: "var(--text-light)" }}>{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-light)", opacity: 0.7 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {!weather && !loading && !error && (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text)" }}>Şehir ara</h3>
          <p className="text-sm" style={{ color: "var(--text-light)" }}>
            Gitmek istediğin şehrin adını yazarak anlık ve 7 günlük hava durumunu görüntüle.
          </p>
        </div>
      )}
    </div>
  );
}
