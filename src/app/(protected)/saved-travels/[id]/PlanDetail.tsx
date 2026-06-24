"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Umbrella, Sun, Hotel, Package, MapPin, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

const ACTIVITY_COLORS: Record<string, string> = {
  culture: "#6366f1",
  food: "#f59e0b",
  nature: "#10b981",
  shopping: "#ec4899",
  transport: "#64748b",
  accommodation: "#0f3460",
};

const ACTIVITY_ICONS: Record<string, string> = {
  culture: "🏛️",
  food: "🍽️",
  nature: "🌿",
  shopping: "🛍️",
  transport: "🚌",
  accommodation: "🏨",
};

const BUDGET_COLORS = ["#C96C4A", "#E8B27D", "#6B8CAE", "#5E9C76", "#CBB8A6", "#B05A3A"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlanDetail({ plan }: { plan: any }) {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  const planData = plan.plan_data;
  if (!planData) return <div className="card p-8 text-center text-slate-500">Plan verisi bulunamadı.</div>;

  const days = planData.days ?? [];
  const currentDay = days[activeDay];
  const budgetBreakdown = planData.budgetBreakdown ?? {};

  const budgetChartData = Object.entries(budgetBreakdown).map(([key, val]: [string, any]) => ({
    name: { accommodation: "Konaklama", food: "Yemek", activities: "Aktiviteler", transport: "Ulaşım", shopping: "Alışveriş", emergency: "Acil" }[key] ?? key,
    value: val.amount,
    percentage: val.percentage,
  }));

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
            {/* Budget chart */}
            {budgetChartData.length > 0 && (
              <div className="card p-5">
                <h3 className="font-bold mb-3" style={{ color: "var(--text)" }}>💰 Bütçe Dağılımı</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={budgetChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {budgetChartData.map((_, index) => (
                        <Cell key={index} fill={BUDGET_COLORS[index % BUDGET_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₺${Number(value).toLocaleString("tr-TR")}`, ""]} />
                    <Legend formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {budgetChartData.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: BUDGET_COLORS[i % BUDGET_COLORS.length] }} />
                        {item.name}
                      </span>
                      <span className="font-semibold">%{item.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotel recommendations */}
            {planData.hotelRecommendations?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <Hotel size={16} />
                  Otel Önerileri
                </h3>
                <div className="space-y-3">
                  {planData.hotelRecommendations.map((hotel: any, i: number) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-3">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm">{hotel.name}</span>
                        <span className="tag text-xs" style={{
                          background: hotel.tier === "premium" ? "#fef3c7" : hotel.tier === "midrange" ? "#dbeafe" : "#dcfce7",
                          color: hotel.tier === "premium" ? "#92400e" : hotel.tier === "midrange" ? "#1e40af" : "#166534",
                        }}>
                          {hotel.tier === "premium" ? "Premium" : hotel.tier === "midrange" ? "Orta" : "Ekonomik"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{hotel.location}</div>
                      <div className="text-xs text-slate-400 mt-1">{hotel.description}</div>
                      <div className="text-sm font-semibold mt-2" style={{ color: "var(--primary)" }}>
                        ₺{hotel.pricePerNight?.toLocaleString("tr-TR")} / gece
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Packing list */}
      {planData.packingList && (
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Package size={20} />
            Bavul Listesi
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { key: "clothing", label: "👗 Kıyafet" },
              { key: "accessories", label: "🎒 Aksesuar" },
              { key: "tech", label: "💻 Teknoloji" },
              { key: "health", label: "💊 Sağlık" },
              { key: "documents", label: "📄 Belgeler" },
            ].map(({ key, label }) => (
              planData.packingList[key]?.length > 0 && (
                <div key={key}>
                  <div className="text-sm font-semibold mb-2 text-slate-700">{label}</div>
                  <ul className="space-y-1">
                    {planData.packingList[key].map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Hidden gems + tips */}
      <div className="grid md:grid-cols-2 gap-6">
        {planData.hiddenGems?.length > 0 && (
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
              <MapPin size={20} />
              Gizli Cennetler
            </h3>
            <div className="space-y-3">
              {planData.hiddenGems.map((gem: any, i: number) => (
                <div key={i} className="border-l-4 pl-4 py-1" style={{ borderColor: "var(--accent)" }}>
                  <div className="font-semibold text-sm">{gem.name}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{gem.description}</div>
                  {gem.tip && <div className="text-xs text-amber-600 mt-1 flex items-center gap-1"><Lightbulb size={11} />İpucu: {gem.tip}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {planData.localTips?.length > 0 && (
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
              <Sun size={20} />
              Yerel Tavsiyeler
            </h3>
            <ul className="space-y-2">
              {planData.localTips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ background: "var(--primary)" }}>{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
