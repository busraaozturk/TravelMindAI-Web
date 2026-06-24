import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, MapPin, Clock, Wallet, Users, ChevronRight, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: plans } = await supabase
    .from("travel_plans")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const userName = user?.user_metadata?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Gezgin";

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div className="rounded-2xl p-8 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f3460 0%, #16213e 60%, #1a1a2e 100%)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M44.7,-76.4C58.8,-69.2,71.8,-59.5,79.4,-46.5C87,-33.6,89.2,-17.3,87.8,-1.4C86.4,14.6,81.4,29.1,73.5,42.1C65.6,55.1,54.8,66.5,41.7,74.1C28.6,81.6,13.3,85.2,-1.2,87C-15.7,88.8,-31.3,88.7,-43.8,82.3C-56.2,75.8,-65.4,63,-73.7,49.4C-82,35.8,-89.3,21.4,-90.7,6.3C-92.1,-8.8,-87.5,-24.5,-79.5,-37.9C-71.5,-51.3,-60.1,-62.3,-46.5,-69.9C-32.9,-77.5,-16.4,-81.5,-0.7,-80.4C15,-79.4,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <Sparkles size={20} className="opacity-60 mb-3" />
        <h1 className="text-3xl font-bold mb-2">Merhaba, {userName}! 👋</h1>
        <p className="text-blue-200 text-lg mb-6 max-w-xl">
          Yapay zeka ile kişiselleştirilmiş seyahat planın dakikalar içinde hazır.
          Hedefini söyle, gerisini biz halledelim.
        </p>
        <Link href="/plan" className="btn-primary inline-flex text-base py-3 px-6">
          <Plus size={20} />
          Yeni Seyahat Planla
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Toplam Plan", value: plans?.length ?? 0, icon: "🗺️" },
          { label: "Gün Tahmin", value: "16 güne kadar", icon: "📅" },
          { label: "Para Birimi", value: "29 döviz", icon: "💱" },
          { label: "Hava Verisi", value: "Anlık", icon: "🌤️" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-bold" style={{ color: "var(--text)" }}>{s.value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Son Seyahatler</h2>
          <Link href="/saved-travels" className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--primary)" }}>
            Tümünü gör <ChevronRight size={16} />
          </Link>
        </div>

        {!plans || plans.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Henüz seyahat planın yok</h3>
            <p className="text-slate-500 mb-6">İlk planını oluşturmak için sadece birkaç dakikan yeterli.</p>
            <Link href="/plan" className="btn-primary">
              <Plus size={16} />
              İlk Planımı Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Link key={plan.id} href={`/saved-travels/${plan.id}`} className="card p-5 hover:shadow-lg transition-shadow block">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: "var(--primary)" }} />
                    <span className="font-semibold">{plan.destination}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Clock size={13} />{plan.duration_days} gün</span>
                  <span className="flex items-center gap-1"><Wallet size={13} />{plan.budget?.toLocaleString("tr-TR")} {plan.currency}</span>
                  <span className="flex items-center gap-1"><Users size={13} />{plan.travelers} kişi</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: "🌤️", title: "Anlık Hava Durumu", desc: "Open-Meteo API ile destinasyonunuza özel 16 günlük hava tahmini. Yağmurlu günlerde alternatif rota." },
          { icon: "💰", title: "Akıllı Bütçe", desc: "Toplam bütçeniz konaklama, yemek, aktivite ve ulaşıma otomatik dağıtılır." },
          { icon: "🗺️", title: "Saatlik Rota", desc: "Sabahtan akşama saatlik aktivite planı. Her aktivite için neden önerildiğini açıklar." },
        ].map((f) => (
          <div key={f.title} className="card p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold mb-2" style={{ color: "var(--text)" }}>{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
