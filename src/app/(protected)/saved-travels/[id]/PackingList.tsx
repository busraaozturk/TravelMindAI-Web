"use client";

import { useState, useMemo } from "react";
import { Package } from "lucide-react";

interface PackingListData {
  clothing?: string[];
  accessories?: string[];
  tech?: string[];
  health?: string[];
}

interface Props {
  packingList: PackingListData;
  packingTip?: string;
  destination: string;
  weatherSummary?: string;
}

const CATEGORIES = [
  { key: "clothing",    label: "Yanına Al: Kıyafet" },
  { key: "accessories", label: "Aksesuarlar" },
  { key: "tech",        label: "Teknolojik Ekipman" },
  { key: "health",      label: "Sağlık & Güvenlik" },
];

export default function PackingList({ packingList, packingTip, destination, weatherSummary }: Props) {
  const allItems = useMemo(() => {
    const items: { cat: string; idx: number; label: string; id: string }[] = [];
    CATEGORIES.forEach(({ key, label }) => {
      const list = packingList[key as keyof PackingListData] ?? [];
      list.forEach((item, idx) => {
        items.push({ cat: key, idx, label: item, id: `${key}-${idx}` });
      });
    });
    return items;
  }, [packingList]);

  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function checkAll() {
    setChecked(new Set(allItems.map(i => i.id)));
  }

  function resetAll() {
    setChecked(new Set());
  }

  const total = allItems.length;
  const done = checked.size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const subtitle = `${destination} – Seyahat Hazırlık Rehberi`;

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "24px",
    }}>
      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "var(--primary-soft)", color: "var(--primary)",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Package size={17} />
        </div>
        <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>
          Seyahat Hazırlık Kartı
        </span>
      </div>

      {/* Alt başlık */}
      <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: ".98rem", color: "var(--text)", marginBottom: "12px" }}>
        📦 {subtitle}
      </div>

      {/* Hava durumu özeti */}
      {weatherSummary && (
        <div style={{
          background: "var(--info-soft)", border: "1px solid #D8E4EF",
          borderRadius: "10px", padding: "10px 14px",
          fontSize: ".83rem", color: "var(--text)", lineHeight: 1.6, marginBottom: "16px",
        }}>
          <b>Hava Durumu:</b> {weatherSummary}
        </div>
      )}

      {/* Progress */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: ".82rem", color: "var(--text-light)" }}>
            {done} / {total} eşya hazır
          </span>
          <span style={{ fontSize: ".82rem", color: "var(--text-light)" }}>%{pct}</span>
        </div>
        <div style={{ height: "6px", background: "var(--border)", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "var(--primary)", borderRadius: "999px",
            transition: "width .3s ease",
          }} />
        </div>
      </div>

      {/* Kategoriler 2 kolon */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px", marginBottom: "20px" }}>
        {CATEGORIES.map(({ key, label }) => {
          const items = packingList[key as keyof PackingListData] ?? [];
          if (!items.length) return null;
          return (
            <div key={key}>
              <div style={{
                fontFamily: "var(--font-dm-sans)", fontWeight: 700,
                fontSize: ".85rem", color: "var(--primary)",
                marginBottom: "10px",
              }}>
                {label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {items.map((item, idx) => {
                  const id = `${key}-${idx}`;
                  const isChecked = checked.has(id);
                  return (
                    <label key={id} style={{
                      display: "flex", gap: "8px", alignItems: "flex-start", cursor: "pointer",
                    }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(id)}
                        style={{
                          marginTop: "2px", flexShrink: 0,
                          accentColor: "var(--primary)",
                          width: "15px", height: "15px", cursor: "pointer",
                        }}
                      />
                      <span style={{
                        fontSize: ".85rem",
                        color: isChecked ? "var(--text-light)" : "var(--text)",
                        textDecoration: isChecked ? "line-through" : "none",
                        lineHeight: 1.5,
                        transition: "color .2s",
                      }}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Butonlar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: packingTip ? "16px" : "0" }}>
        <button
          onClick={checkAll}
          style={{
            background: "var(--primary-soft)", color: "var(--primary)",
            border: "1px solid var(--border)", borderRadius: "999px",
            padding: "8px 18px", fontSize: ".83rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-dm-sans)",
          }}
        >
          Tümünü işaretle
        </button>
        <button
          onClick={resetAll}
          style={{
            background: "var(--card)", color: "var(--text)",
            border: "1px solid var(--border)", borderRadius: "999px",
            padding: "8px 18px", fontSize: ".83rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-dm-sans)",
          }}
        >
          Listeyi sıfırla
        </button>
      </div>

      {/* Özel tavsiye */}
      {packingTip && (
        <div style={{
          background: "var(--primary-soft)", border: "1px solid var(--border)",
          borderRadius: "10px", padding: "12px 16px",
          fontSize: ".83rem", color: "var(--text)", lineHeight: 1.6,
        }}>
          <b>Özel Tavsiye:</b> <span style={{ color: "var(--primary)" }}>{packingTip}</span>
        </div>
      )}
    </div>
  );
}
