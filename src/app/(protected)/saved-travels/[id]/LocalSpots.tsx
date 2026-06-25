"use client";

import { Users } from "lucide-react";

interface Spot {
  name: string;
  description: string;
}

export default function LocalSpots({ spots }: { spots: Spot[] }) {
  if (!spots?.length) return null;

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
          <Users size={17} />
        </div>
        <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>
          Yerel Halkın Tercih Ettiği Noktalar
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {spots.map((spot, i) => (
          <div key={i} style={{
            display: "flex", gap: "12px", alignItems: "flex-start",
            padding: "12px 4px",
            borderBottom: i < spots.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "#F0FAF4", color: "#5E9C76",
              display: "grid", placeItems: "center", flexShrink: 0, marginTop: "1px",
            }}>
              <Users size={13} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: ".92rem", color: "var(--text)", marginBottom: "3px" }}>
                {spot.name}
              </div>
              <div style={{ fontSize: ".82rem", color: "var(--info)", lineHeight: 1.5 }}>
                {spot.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
