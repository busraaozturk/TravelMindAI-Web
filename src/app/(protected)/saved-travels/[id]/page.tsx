import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Users, Wallet, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import PlanDetail from "./PlanDetail";

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: plan } = await supabase
    .from("travel_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!plan) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/saved-travels" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ChevronLeft size={16} />
          Tüm Planlar
        </Link>
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={20} style={{ color: "var(--accent)" }} />
                <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>{plan.destination}</h1>
              </div>
              <p className="text-slate-500">{plan.plan_data?.summary}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <Calendar size={15} className="text-slate-400" />
              {new Date(plan.start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })} —{" "}
              {new Date(plan.end_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-2"><Clock size={15} className="text-slate-400" />{plan.duration_days} gün</span>
            <span className="flex items-center gap-2"><Wallet size={15} className="text-slate-400" />{plan.budget?.toLocaleString("tr-TR")} {plan.currency}</span>
            <span className="flex items-center gap-2"><Users size={15} className="text-slate-400" />{plan.travelers} kişi</span>
          </div>
        </div>
      </div>

      <PlanDetail plan={plan} />
    </div>
  );
}
