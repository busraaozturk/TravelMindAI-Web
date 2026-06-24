import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MapPin, Clock, Wallet, Users, Plus, Calendar } from "lucide-react";

export default async function SavedTravelsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: plans } = await supabase
    .from("travel_plans")
    .select("id, destination, title, start_date, end_date, duration_days, budget, currency, travelers, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Kayıtlı Seyahatler</h1>
          <p className="text-slate-500 mt-1">{plans?.length ?? 0} plan oluşturuldu</p>
        </div>
        <Link href="/plan" className="btn-primary">
          <Plus size={18} />
          Yeni Plan
        </Link>
      </div>

      {!plans || plans.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Henüz plan yok</h2>
          <p className="text-slate-500 mb-6">Yapay zeka ile kişiselleştirilmiş seyahat planları oluştur.</p>
          <Link href="/plan" className="btn-primary">
            <Plus size={16} />
            İlk Planımı Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/saved-travels/${plan.id}`}
              className="card p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 block">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} style={{ color: "var(--primary)" }} />
                    <span className="font-bold text-lg">{plan.destination}</span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1">{plan.title}</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" />
                  {new Date(plan.start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  {plan.duration_days} gün
                </span>
                <span className="flex items-center gap-1.5">
                  <Wallet size={13} className="text-slate-400" />
                  {plan.budget?.toLocaleString("tr-TR")} {plan.currency}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={13} className="text-slate-400" />
                  {plan.travelers} kişi
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                {new Date(plan.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </Link>
          ))}

          {/* New plan card */}
          <Link href="/plan"
            className="card p-5 flex flex-col items-center justify-center gap-3 min-h-[160px] transition-colors"
            style={{ border: "2px dashed var(--border)", color: "var(--text-light)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-light)"; }}>
            <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
              <Plus size={22} />
            </div>
            <span className="font-semibold">Yeni Plan Oluştur</span>
          </Link>
        </div>
      )}
    </div>
  );
}
