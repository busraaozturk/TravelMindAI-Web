"use client";

import { BedDouble, MapPin, Star, Lightbulb, Building2, Ruler, Bus, Map } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HotelRecommendations({ hotels }: { hotels: any[] }) {
  if (!hotels?.length) return null;

  const tierLabel: Record<string, string> = {
    economic: "EKONOMİK",
    midrange: "ORTA SEGMENT · TARZINIZA UYGUN",
    premium: "PREMİUM",
  };

  const tierBadgeStyle: Record<string, React.CSSProperties> = {
    economic: { background: "#FFF4EC", color: "var(--primary)", border: "1px solid var(--border)", fontWeight: 700, fontSize: ".7rem", padding: "3px 10px", borderRadius: "999px", letterSpacing: ".04em" },
    midrange: { background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: ".7rem", padding: "3px 10px", borderRadius: "999px", letterSpacing: ".04em" },
    premium:  { background: "#FFF4EC", color: "var(--primary)", border: "1px solid var(--border)", fontWeight: 700, fontSize: ".7rem", padding: "3px 10px", borderRadius: "999px", letterSpacing: ".04em" },
  };

  const typeBadgeStyle: React.CSSProperties = {
    background: "#fff", color: "var(--text)", border: "1px solid var(--border)",
    fontWeight: 600, fontSize: ".75rem", padding: "3px 10px", borderRadius: "999px",
  };

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "28px",
      marginBottom: "26px",
    }}>
      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "var(--primary-soft)", color: "var(--primary)",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <BedDouble size={17} />
        </div>
        <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>
          Bütçenize Uygun Otel Önerileri
        </span>
      </div>

      {/* Kart grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {hotels.map((hotel, i) => (
          <div key={i}
            style={{
              background: "var(--card)",
              border: hotel.recommended ? "1px solid var(--primary)" : "1px solid var(--border)",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: hotel.recommended ? "0 0 0 2px var(--primary)" : "0 1px 4px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              transition: "transform .2s, box-shadow .2s",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-4px)";
              el.style.boxShadow = hotel.recommended
                ? "0 0 0 2px var(--primary), 0 8px 24px rgba(0,0,0,0.10)"
                : "0 8px 24px rgba(0,0,0,0.10)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = hotel.recommended
                ? "0 0 0 2px var(--primary)"
                : "0 1px 4px rgba(0,0,0,0.04)";
            }}
          >
            {/* Badges */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span style={{
                fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: ".06em", color: "var(--primary)", background: "var(--primary-soft)",
                padding: "4px 10px", borderRadius: "999px", width: "fit-content",
              }}>
                {tierLabel[hotel.tier] ?? hotel.tier}
              </span>
              {hotel.type && (
                <span style={{
                  fontSize: ".72rem", fontWeight: 600, color: "var(--info)",
                  background: "#EAF1F7", padding: "3px 9px",
                  borderRadius: "999px", width: "fit-content",
                }}>
                  {hotel.type}
                </span>
              )}
            </div>

            {/* İsim + konum */}
            <div>
              <h3 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1.05rem", color: "var(--text)", marginBottom: "4px" }}>
                {hotel.name}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--text-light)", fontSize: ".82rem" }}>
                <MapPin size={13} />
                {hotel.location}
              </div>
            </div>

            {/* Fiyat */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1.5rem", color: "var(--text)" }}>
                ₺{hotel.pricePerNight?.toLocaleString("tr-TR")}
              </span>
              <span style={{ color: "var(--text-light)", fontSize: ".82rem" }}>/ gece</span>
            </div>

            {/* Puan */}
            {hotel.rating && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: ".85rem", color: "var(--text-light)" }}>
                <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
                <span style={{ fontWeight: 600, color: "var(--text)" }}>{hotel.rating}</span>
                puan
              </div>
            )}

            {/* Açıklama */}
            {hotel.description && (
              <p style={{ fontSize: ".85rem", color: "var(--text-light)", lineHeight: 1.55 }}>{hotel.description}</p>
            )}

            {/* Neden öneriliyor */}
            {hotel.whyRecommended && (
              <div style={{
                background: "#F0FAF4", borderRadius: "10px", padding: "10px 12px",
                fontSize: ".82rem", color: "#3D7A57", lineHeight: 1.55,
                display: "flex", gap: "6px", alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>💡</span>
                {hotel.whyRecommended}
              </div>
            )}

            {/* Bilgi satırları */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {hotel.distanceToCenter && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: ".78rem", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>
                    <Ruler size={12} style={{ color: "var(--primary)" }} />
                    Merkeze Uzaklık
                  </div>
                  <div style={{ fontSize: ".78rem", color: "var(--text-light)" }}>{hotel.distanceToCenter}</div>
                </div>
              )}
              {hotel.nearestTransport && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: ".78rem", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>
                    <Bus size={12} style={{ color: "var(--primary)" }} />
                    En Yakın Ulaşım
                  </div>
                  <div style={{ fontSize: ".78rem", color: "var(--text-light)" }}>{hotel.nearestTransport}</div>
                </div>
              )}
            </div>
            {hotel.touristAccess && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: ".78rem", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>
                  <Map size={12} style={{ color: "var(--primary)" }} />
                  Turistik Erişim
                </div>
                <div style={{ fontSize: ".78rem", color: "var(--text-light)" }}>{hotel.touristAccess}</div>
              </div>
            )}

            {/* Artılar & Dikkat */}
            {(hotel.pros?.length || hotel.cons?.length) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {hotel.pros?.length > 0 && (
                  <div style={{ background: "#F0FAF4", borderRadius: "10px", padding: "10px 12px" }}>
                    <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#3D7A57", marginBottom: "6px" }}>Artıları</div>
                    {hotel.pros.map((p: string, j: number) => (
                      <div key={j} style={{ fontSize: ".75rem", color: "#3D7A57", display: "flex", gap: "5px", marginBottom: "3px" }}>
                        <span>✓</span>{p}
                      </div>
                    ))}
                  </div>
                )}
                {hotel.cons?.length > 0 && (
                  <div style={{ background: "#FFFBEA", borderRadius: "10px", padding: "10px 12px" }}>
                    <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#92600A", marginBottom: "6px" }}>Dikkat</div>
                    {hotel.cons.map((c: string, j: number) => (
                      <div key={j} style={{ fontSize: ".75rem", color: "#92600A", display: "flex", gap: "5px", marginBottom: "3px" }}>
                        <span>⚠</span>{c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Alt toplam */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px", fontSize: ".8rem", color: "var(--text-light)" }}>
              1 gece için toplam ≈ <strong style={{ color: "var(--text)" }}>₺{hotel.pricePerNight?.toLocaleString("tr-TR")}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
