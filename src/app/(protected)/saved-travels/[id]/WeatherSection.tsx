"use client";

import { CloudRain, Check } from "lucide-react";

const WMO_ICON: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

function weatherIcon(code: number): string {
  return WMO_ICON[code] ?? "🌤️";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "numeric" });
}

interface WeatherData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  weathercode: number[];
}

interface RainyAlternative {
  name: string;
  description: string;
}

interface Props {
  weatherData: WeatherData | null;
  startDate: string;
  durationDays: number;
  destination: string;
  rainyDayAlternatives?: RainyAlternative[];
}

function buildMockWeather(startDate: string, days: number): WeatherData {
  return {
    time: Array.from({ length: days }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d.toISOString().split("T")[0];
    }),
    temperature_2m_max: Array.from({ length: days }, () => 24 + Math.round(Math.random() * 8)),
    temperature_2m_min: Array.from({ length: days }, () => 16 + Math.round(Math.random() * 6)),
    precipitation_probability_max: Array.from({ length: days }, () => Math.round(Math.random() * 20)),
    weathercode: Array.from({ length: days }, () => [0, 1, 2, 1, 0][Math.floor(Math.random() * 5)]),
  };
}

export default function WeatherSection({ weatherData, startDate, durationDays, destination, rainyDayAlternatives }: Props) {
  const data: WeatherData = weatherData ?? buildMockWeather(startDate, Math.min(durationDays, 7));

  const days = Math.min(durationDays, data.time?.length ?? 0);
  const maxTemps = data.temperature_2m_max?.slice(0, days) ?? [];
  const minTemps = data.temperature_2m_min?.slice(0, days) ?? [];
  const rainProbs = data.precipitation_probability_max?.slice(0, days) ?? [];
  const codes = data.weathercode?.slice(0, days) ?? [];
  const times = data.time?.slice(0, days) ?? [];

  const avgMax = maxTemps.length ? Math.round(maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length) : null;
  const avgMin = minTemps.length ? Math.round(minTemps.reduce((a, b) => a + b, 0) / minTemps.length) : null;
  const avgRain = rainProbs.length ? Math.round(rainProbs.reduce((a, b) => a + b, 0) / rainProbs.length) : 0;
  const condition = avgRain < 20 ? "genellikle güneşli" : avgRain < 50 ? "parçalı bulutlu" : "yağışlı";

  const labelStyle: React.CSSProperties = {
    fontSize: ".78rem", fontWeight: 700, color: "var(--text-light)",
    textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "14px",
  };

  return (
    <div className="r-card rain-card" style={{
      background: "var(--info-soft)",
      border: "1px solid #D8E4EF",
      borderRadius: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "24px",
    }}>
      {/* Başlık */}
      <h3 style={{
        display: "flex", alignItems: "center", gap: "10px",
        fontFamily: "var(--font-dm-sans)", fontWeight: 700,
        fontSize: "1.12rem", color: "var(--text)", marginBottom: "16px",
      }}>
        <span className="h-ic" style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "#fff", color: "var(--info)",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <CloudRain size={17} />
        </span>
        Hava Durumu &amp; Yağmurlu Hava Alternatifi
      </h3>

      {/* Body */}
      <div className="rain-card-body" style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0", marginTop: "20px",
      }}>
        {/* Sol: Hava durumu */}
        <div>
          <p style={{
            fontSize: ".78rem", fontWeight: 700, color: "var(--text-light)",
            textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "14px",
          }}>Seyahat Tarihi Hava Tahmini</p>

          {/* wx-stats */}
          <div className="wx-stats" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "18px",
          }}>
            {[
              { icon: "☀️", val: `${avgMax}°C`, lbl: "Maks Sıcaklık" },
              { icon: "🌡️", val: `${avgMin}°C`, lbl: "Min Sıcaklık" },
              { icon: "🌤️", val: `%${avgRain}`, lbl: "Yağış İhtimali" },
            ].map((s) => (
              <div key={s.lbl} className="wx-stat" style={{
                background: "#fff", border: "1px solid #D8E4EF",
                borderRadius: "12px", padding: "14px 16px",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "6px", textAlign: "center",
              }}>
                <div className="wx-stat-icon" style={{ fontSize: "1.7rem", lineHeight: 1 }}>{s.icon}</div>
                <div className="wx-stat-val" style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text)" }}>{s.val}</div>
                <div className="wx-stat-lbl" style={{ fontSize: ".75rem", color: "var(--text-light)", textTransform: "uppercase", letterSpacing: ".04em" }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* wx-summary */}
          <div className="wx-summary" style={{
            fontSize: ".85rem", color: "var(--text-light)", lineHeight: 1.6,
            padding: "12px 14px", background: "#fff",
            border: "1px solid #D8E4EF", borderRadius: "10px",
          }}>
            Seyahat tarihlerinde {destination} şehrinde hava {avgMin}°C–{avgMax}°C arası, {condition}. Yağış ihtimali %{avgRain}.
          </div>

          {/* wx-days */}
          <div className="wx-days" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
            gap: "8px", marginTop: "14px",
          }}>
            {times.map((t, i) => (
              <div key={i} className="wx-day" style={{
                background: "#fff", border: "1px solid #D8E4EF",
                borderRadius: "10px", padding: "10px 8px",
                textAlign: "center", fontSize: ".8rem",
              }}>
                <div className="wx-day-label" style={{ fontWeight: 600, color: "var(--text-light)", marginBottom: "4px", fontSize: ".75rem" }}>
                  {formatDate(t)}
                </div>
                <div className="wx-day-icon" style={{ fontSize: "1.3rem", margin: "2px 0" }}>{weatherIcon(codes[i])}</div>
                <div className="wx-day-temp" style={{ color: "var(--text)", fontWeight: 600 }}>
                  {Math.round(maxTemps[i])}° / {Math.round(minTemps[i])}°
                </div>
                <div className="wx-day-rain" style={{ color: "var(--info)", fontSize: ".72rem", marginTop: "2px" }}>
                  💧%{rainProbs[i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ayraç */}
        <div className="rain-divider" style={{
          width: "1px", background: "#D8E4EF", margin: "0 28px",
        }} />

        {/* Sağ: Yağmurlu alternatifler */}
        <div>
          <p style={{
            fontSize: ".78rem", fontWeight: 700, color: "var(--text-light)",
            textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "14px",
          }}>🌧️ Yağmurlu Gün Planı</p>
          <p style={{ fontSize: ".85rem", color: "var(--text-light)", marginBottom: "14px" }}>
            Hava bozarsa açık hava duraklarını şu kapalı mekanlarla değiştirin:
          </p>
          <div>
            {(rainyDayAlternatives ?? []).map((alt, i, arr) => (
              <div key={i} className="rain-item" style={{
                display: "flex", gap: "12px", alignItems: "flex-start",
                padding: "10px 0",
                borderBottom: i < arr.length - 1 ? "1px solid #D8E4EF" : "none",
                fontSize: ".92rem",
              }}>
                <Check size={16} style={{ flexShrink: 0, marginTop: "3px", color: "var(--info)" }} />
                <div>
                  <b>{alt.name}</b>
                  {alt.description && (
                    <span> — <span style={{ color: "var(--text-light)" }}>{alt.description}</span></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
