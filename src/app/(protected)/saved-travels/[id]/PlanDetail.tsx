"use client";

import { useState } from "react";
import { Umbrella, MapPin, Coins, Clock, Footprints, Bus, Car, CalendarDays, Utensils, Star } from "lucide-react";
import LocalTips from "./LocalTips";
import HiddenGems from "./HiddenGems";
import Viewpoints from "./Viewpoints";
import LocalSpots from "./LocalSpots";
import BudgetBreakdown from "./BudgetBreakdown";

const TYPE_LABELS: Record<string, string> = {
  culture:       "TARİH",
  food:          "YEMEK",
  nature:        "DOĞA",
  shopping:      "ALIŞVERİŞ",
  transport:     "ULAŞIM",
  accommodation: "KONAKLAMA",
};

const TYPE_COLORS: Record<string, string> = {
  culture:       "#6B8CAE",
  food:          "#C96C4A",
  nature:        "#5E9C76",
  shopping:      "#E8B27D",
  transport:     "#CBB8A6",
  accommodation: "#B05A3A",
};

const DAY_THEMES: Record<number, { label: string; emoji: string }> = {
  1: { label: "Tarih Rotası",       emoji: "🧭" },
  2: { label: "Keşif & Lezzet",     emoji: "🍽️" },
  3: { label: "Doğa & Manzara",     emoji: "🌿" },
  4: { label: "Kültür & Sanat",     emoji: "🎨" },
  5: { label: "Gizli Köşeler",      emoji: "🗝️" },
  6: { label: "Alışveriş & Eğlence",emoji: "🛍️" },
  7: { label: "Son Gün & Veda",     emoji: "🌅" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlanDetail({ plan }: { plan: any }) {
  const [activeDay, setActiveDay] = useState(0);

  const planData = plan.plan_data;
  if (!planData) return (
    <div className="card p-10 text-center" style={{ color: "var(--text-light)" }}>
      Plan verisi bulunamadı.
    </div>
  );

  const days = planData.days ?? [];
  const currentDay = days[activeDay];
  const budgetBreakdown = planData.budgetBreakdown ?? {};
  const theme = DAY_THEMES[currentDay?.day] ?? { label: currentDay?.weather ?? "", emoji: "☀️" };

  return (
    <div className="space-y-5">

      {/* ── Gün seçici kart ── */}
      <div className="card px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={15} style={{ color: "var(--primary)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-dm-sans)" }}>
            Günlük Rota
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {days.map((day: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className="px-4 py-1.5 text-sm font-semibold transition-all"
              style={i === activeDay
                ? { background: "var(--primary)", color: "white", borderRadius: "999px", border: "2px solid var(--primary)" }
                : { background: "transparent", color: "var(--text-light)", borderRadius: "999px", border: "2px solid var(--border)" }
              }
            >
              {i + 1}. Gün
            </button>
          ))}
        </div>
      </div>

      {currentDay && (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Sol: Aktiviteler ── */}
          <div className="lg:col-span-2 space-y-3">

            {/* Gün başlığı */}
            <div className="mb-1">
              <h2 className="text-base font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-dm-sans)" }}>
                {currentDay.day}. Gün — {theme.label} {theme.emoji}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>
                Karma ağırlıklı · coğrafi yakınlığa göre optimize edilmiş rota
              </p>
            </div>

            {/* Yağmurlu uyarı */}
            {currentDay.isRainy && currentDay.planB && (
              <div className="rounded-2xl p-4" style={{ background: "var(--secondary-soft)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2 text-sm font-semibold mb-1" style={{ color: "var(--info)" }}>
                  <Umbrella size={14} /> Plan B — Yağmurlu Gün Alternatifi
                </div>
                <p className="text-sm" style={{ color: "var(--text-light)" }}>{currentDay.planB}</p>
              </div>
            )}

            {/* Aktivite listesi */}
            {(currentDay.activities ?? []).map((act: any, i: number) => {
              const color = TYPE_COLORS[act.type] ?? "#CBD5E0";
              const label = TYPE_LABELS[act.type] ?? (act.type ?? "").toUpperCase();
              const t = act.transitToNext;
              const walking = t?.walking ?? { time: "10–20 dk", distance: "~1 km" };
              const transit = t?.transit ?? { time: "~10 dk" };
              const taxi    = t?.taxi    ?? { time: "~5 dk", cost: null };
              const isLast  = i === (currentDay.activities?.length ?? 0) - 1;

              return (
                <div key={i}>
                  {/* Aktivite kartı */}
                  <div className="card overflow-hidden" style={{ borderRadius: "14px" }}>
                    <div className="p-4 space-y-2.5">

                      {/* Saat + İsim + Kategori */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <span className="text-sm font-bold leading-6 flex-shrink-0" style={{ color: "var(--primary)" }}>
                            {act.time}
                          </span>
                          <span className="text-sm font-bold leading-6" style={{ color: "var(--text)" }}>
                            {act.name}
                          </span>
                        </div>
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 leading-none"
                          style={{ border: `1.5px solid ${color}`, color, background: `${color}10` }}
                        >
                          {label}
                        </span>
                      </div>

                      {/* Açıklama */}
                      {act.description && (
                        <p className="text-sm" style={{ color: "var(--text-light)", lineHeight: 1.5 }}>
                          {act.description}
                        </p>
                      )}

                      {/* Neden önerildi */}
                      {act.why && (
                        <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--primary-soft)" }}>
                          <div className="flex items-start gap-1.5">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                            <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>
                              <span className="font-bold" style={{ color: "var(--primary)" }}>Neden önerildi: </span>
                              {act.why}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Etiketler */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {act.estimatedCost > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ border: "1.5px solid var(--border)", color: "var(--text)", background: "white" }}>
                            <Coins size={10} style={{ color: "var(--primary)" }} />
                            ₺{act.estimatedCost.toLocaleString("tr-TR")}
                          </span>
                        )}
                        {act.cuisine && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ border: "1.5px solid var(--border)", color: "var(--text)", background: "white" }}>
                            <Utensils size={10} style={{ color: "var(--primary)" }} />
                            {act.cuisine}
                          </span>
                        )}
                        {act.duration && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ border: "1.5px solid var(--border)", color: "var(--text)", background: "white" }}>
                            <Clock size={10} style={{ color: "var(--primary)" }} />
                            {act.duration}
                          </span>
                        )}
                        {act.rating && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ border: "1.5px solid var(--border)", color: "var(--text)", background: "white" }}>
                            <Star size={10} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                            {act.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SONRAKİ DURAĞA */}
                  {!isLast && (
                    <div className="mx-3 my-3 px-4 py-2 rounded-xl flex items-center gap-3 text-xs flex-wrap"
                      style={{ border: "1.5px dashed var(--border)", background: "var(--bg)" }}>
                      <span className="font-bold tracking-wide uppercase" style={{ color: "var(--text-light)", fontSize: 10 }}>
                        Sonraki Durağa
                      </span>
                      <span className="flex items-center gap-1" style={{ color: "var(--text-light)" }}>
                        <Footprints size={11} />
                        {walking.time} · {walking.distance}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg"
                        style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                        <Bus size={11} />
                        {transit.time}
                      </span>
                      <span className="flex items-center gap-1" style={{ color: "var(--text-light)" }}>
                        <Car size={11} />
                        {taxi.time}{taxi.cost ? ` · ₺${taxi.cost.toLocaleString("tr-TR")}` : ""}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Sağ: Sidebar ── */}
          <div className="space-y-4">
            {Object.keys(budgetBreakdown).length > 0 && (
              <BudgetBreakdown
                budgetBreakdown={budgetBreakdown}
                totalBudget={plan.budget}
                currency={plan.currency}
                travelers={plan.travelers}
                durationDays={plan.duration_days}
              />
            )}
            {planData.localTips?.length > 0 && <LocalTips tips={planData.localTips} />}
            {planData.hiddenGems?.length > 0 && <HiddenGems gems={planData.hiddenGems} />}
            {planData.viewpoints?.length > 0 && <Viewpoints viewpoints={planData.viewpoints} />}
            {planData.localSpots?.length > 0 && <LocalSpots spots={planData.localSpots} />}
          </div>
        </div>
      )}
    </div>
  );
}
