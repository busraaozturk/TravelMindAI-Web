"use client";

import { BarChart2 } from "lucide-react";

const CATEGORIES = [
  { key: "accommodation", label: "Konaklama", color: "#C96C4A" },
  { key: "food",          label: "Yemek",     color: "#E8B27D" },
  { key: "transport",     label: "Ulaşım",    color: "#6B8CAE" },
  { key: "activities",    label: "Aktiviteler", color: "#5E9C76" },
  { key: "emergency",     label: "Acil Durum Payı", color: "#CBB8A6" },
];

interface BudgetBreakdownProps {
  budgetBreakdown: Record<string, { amount: number; percentage: number }>;
  totalBudget: number;
  currency: string;
  travelers: number;
  durationDays: number;
}

export default function BudgetBreakdown({ budgetBreakdown, totalBudget, currency, travelers, durationDays }: BudgetBreakdownProps) {
  const perPersonPerDay = travelers > 0 && durationDays > 0
    ? Math.round(totalBudget / travelers / durationDays)
    : null;

  const symbol = currency === "TRY" || currency === "TL" ? "₺" : currency;

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "24px",
    }}>
      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "var(--primary-soft)", color: "var(--primary)",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <BarChart2 size={17} />
        </div>
        <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>
          Bütçe Dağılımı
        </span>
      </div>

      {/* Toplam */}
      <div style={{ marginBottom: "4px" }}>
        <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "2rem", color: "var(--text)" }}>
          {symbol}{totalBudget.toLocaleString("tr-TR")}
        </span>
        <span style={{ fontSize: ".85rem", color: "var(--text-light)", marginLeft: "8px" }}>toplam</span>
      </div>

      {perPersonPerDay && (
        <div style={{ fontSize: ".82rem", color: "var(--text-light)", marginBottom: "24px" }}>
          ≈ {symbol}{perPersonPerDay.toLocaleString("tr-TR")} / kişi / gün
        </div>
      )}

      {/* Kategoriler */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {CATEGORIES.map(({ key, label, color }) => {
          const item = budgetBreakdown?.[key];
          if (!item) return null;
          const pct = Math.min(item.percentage, 100);
          return (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: ".9rem", fontWeight: 600, color: "var(--text)" }}>{label}</span>
                <span style={{ fontSize: ".8rem", color: "var(--text-light)" }}>
                  {symbol}{item.amount.toLocaleString("tr-TR")} · %{item.percentage}
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: "7px", borderRadius: "999px", background: "var(--border)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: "999px",
                  background: color,
                  transition: "width .6s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
