"use client";

import { Lightbulb, Bus, Shield, Globe, Zap } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  bus:    <Bus    size={15} />,
  shield: <Shield size={15} />,
  globe:  <Globe  size={15} />,
  zap:    <Zap    size={15} />,
  tip:    <Lightbulb size={15} />,
};

interface Tip {
  category?: string;
  icon?: string;
  text: string;
}

export default function LocalTips({ tips }: { tips: (Tip | string)[] }) {
  if (!tips?.length) return null;

  const normalized: Tip[] = tips.map((t, i) =>
    typeof t === "string"
      ? { category: `İpucu ${i + 1}`, icon: "tip", text: t }
      : t
  );

  return (
    <div className="r-card" style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "24px",
    }}>
      <h3 style={{
        display: "flex", alignItems: "center", gap: "10px",
        fontFamily: "var(--font-dm-sans)", fontWeight: 700,
        fontSize: "1.1rem", color: "var(--text)", marginBottom: "16px",
      }}>
        <span className="h-ic" style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "var(--primary-soft)", color: "var(--primary)",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Lightbulb size={17} />
        </span>
        Yerel Tavsiyeler
      </h3>

      <div className="tip-grid" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {normalized.map((tip, i) => (
          <div key={i} className="tip" style={{
            display: "flex", gap: "13px", alignItems: "flex-start",
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: "13px", padding: "14px 16px",
          }}>
            <span className="t-ic" style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "var(--primary-soft)", color: "var(--primary)",
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              {ICON_MAP[tip.icon ?? "tip"] ?? <Lightbulb size={15} />}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <b style={{ fontSize: ".88rem", color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
                {tip.category}
              </b>
              <span style={{ fontSize: ".82rem", color: "var(--text-light)", lineHeight: 1.6 }}>
                {tip.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
