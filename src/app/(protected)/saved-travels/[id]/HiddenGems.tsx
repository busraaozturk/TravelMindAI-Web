"use client";

import { MapPin, Lightbulb } from "lucide-react";

interface Gem {
  name: string;
  description: string;
  tip?: string;
}

export default function HiddenGems({ gems }: { gems: Gem[] }) {
  if (!gems?.length) return null;

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "24px",
    }}>
      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "var(--primary-soft)", color: "var(--primary)",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <MapPin size={17} />
        </div>
        <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>
          Gizli Kalmış Mekanlar
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {gems.map((gem, i) => (
          <div key={i} style={{
            display: "flex", gap: "12px", alignItems: "flex-start",
            padding: "12px 4px",
            borderBottom: i < gems.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "var(--primary-soft)", color: "var(--primary)",
              display: "grid", placeItems: "center", flexShrink: 0, marginTop: "1px",
            }}>
              <MapPin size={13} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: ".92rem", color: "var(--text)", marginBottom: "3px" }}>
                {gem.name}
              </div>
              <div style={{ fontSize: ".82rem", color: "var(--info)", lineHeight: 1.5 }}>
                {gem.description}
              </div>
              {gem.tip && (
                <div style={{ fontSize: ".78rem", color: "var(--primary)", marginTop: "5px", display: "flex", alignItems: "flex-start", gap: "4px" }}>
                  <Lightbulb size={13} style={{ flexShrink: 0, marginTop: "1px" }} />
                  <span><b>İpucu:</b> {gem.tip}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
