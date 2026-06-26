import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import PlanCard from "./PlanCard";

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
            <PlanCard key={plan.id} plan={plan} />
          ))}

          {/* New plan card */}
          <Link href="/plan"
            className="card p-5 flex flex-col items-center justify-center gap-3 min-h-[160px] transition-colors hover-plan-card"
            style={{ border: "2px dashed var(--border)", color: "var(--text-light)" }}>
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
