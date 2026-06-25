"use client";

import { useState } from "react";
import { Umbrella, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import LocalTips from "./LocalTips";
import HiddenGems from "./HiddenGems";
import Viewpoints from "./Viewpoints";
import LocalSpots from "./LocalSpots";
import HotelRecommendations from "./HotelRecommendations";
import BudgetBreakdown from "./BudgetBreakdown";

const ACTIVITY_COLORS: Record<string, string> = {
  culture: "#6B8CAE",
  food: "#E8B27D",
  nature: "#5E9C76",
  shopping: "#C96C4A",
  transport: "#CBB8A6",
  accommodation: "#B05A3A",
};

const ACTIVITY_ICONS: Record<string, string> = {
  culture: "🏛️",
  food: "🍽️",
  nature: "🌿",
  shopping: "🛍️",
  transport: "🚌",
  accommodation: "🏨",
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlanDetail({ plan }: { plan: any }) {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  const planData = plan.plan_data;
  if (!planData) return <div className="card p-8 text-center text-slate-500">Plan verisi bulunamadı.</div>;

  const days = planData.days ?? [];
  const currentDay = days[activeDay];
  const budgetBreakdown = planData.budgetBreakdown ?? {};


  return (
    <div className="space-y-6">
      {/* Day tabs */}
      <div className="card p-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {days.map((day: any, i: number) => (
            <button key={i} onClick={() => setActiveDay(i)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={i === activeDay
                ? { background: "var(--primary)", color: "white" }
                : { color: "var(--text-light)" }}>
              <span className="mr-1">{day.isRainy ? "🌧️" : "☀️"}</span>
              Gün {day.day}
              {day.date && <span className="hidden sm:inline text-xs opacity-75 ml-1">
                {new Date(day.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
              </span>}
            </button>
          ))}
        </div>
      </div>

      {/* Current day */}
      {currentDay && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>
                {currentDay.isRainy ? "🌧️" : "☀️"} Gün {currentDay.day} — {currentDay.weather}
              </h2>
            </div>

            {currentDay.isRainy && currentDay.planB && (
              <div className="rounded-xl p-4 text-sm" style={{ background: "var(--secondary-soft)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2 font-semibold mb-1" style={{ color: "var(--info)" }}>
                  <Umbrella size={15} />
                  Plan B — Yağmurlu Gün Alternatifi
                </div>
                <p style={{ color: "var(--text-light)" }}>{currentDay.planB}</p>
              </div>
            )}

            <div className="space-y-3">
              {(currentDay.activities ?? []).map((activity: any, i: number) => (
                <div key={i} className="card overflow-hidden">
                  <button className="w-full text-left p-4 flex items-start gap-4"
                    onClick={() => setExpandedActivity(expandedActivity === i ? null : i)}>
                    <div className="text-2xl flex-shrink-0 mt-0.5">{ACTIVITY_ICONS[activity.type] ?? "📌"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-semibold text-slate-400 mr-2">{activity.time}</span>
                          <span className="font-semibold text-sm sm:text-base">{activity.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {activity.estimatedCost > 0 && (
                            <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
                              ₺{activity.estimatedCost?.toLocaleString("tr-TR")}
                            </span>
                          )}
                          {expandedActivity === i ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400">{activity.duration}</span>
                        <span className="tag text-xs" style={{
                          background: `${ACTIVITY_COLORS[activity.type] ?? "#e2e8f0"}18`,
                          color: ACTIVITY_COLORS[activity.type] ?? "#64748b"
                        }}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  </button>
                  {expandedActivity === i && (
                    <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-2 fade-in-up">
                      <p className="text-sm text-slate-600">{activity.description}</p>
                      {activity.why && (
                        <div className="rounded-lg p-3 text-sm" style={{ background: "var(--secondary-soft)" }}>
                          <div className="flex items-start gap-2">
                            <Lightbulb size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--secondary)" }} />
                            <span style={{ color: "var(--text-light)" }}>{activity.why}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Budget breakdown */}
            {Object.keys(budgetBreakdown).length > 0 && (
              <BudgetBreakdown
                budgetBreakdown={budgetBreakdown}
                totalBudget={plan.budget}
                currency={plan.currency}
                travelers={plan.travelers}
                durationDays={plan.duration_days}
              />
            )}

            {/* Yerel Tavsiyeler */}
            {planData.localTips?.length > 0 && (
              <LocalTips tips={planData.localTips} />
            )}

            {/* Gizli Kalmış Mekanlar */}
            {planData.hiddenGems?.length > 0 && (
              <HiddenGems gems={planData.hiddenGems} />
            )}

            {/* Manzara Noktaları */}
            {planData.viewpoints?.length > 0 && (
              <Viewpoints viewpoints={planData.viewpoints} />
            )}

            {/* Yerel Halkın Tercih Ettiği Noktalar */}
            {planData.localSpots?.length > 0 && (
              <LocalSpots spots={planData.localSpots} />
            )}
          </div>
        </div>
      )}


    </div>
  );
}
