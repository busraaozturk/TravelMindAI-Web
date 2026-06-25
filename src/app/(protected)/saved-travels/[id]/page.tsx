import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import PlanDetail from "./PlanDetail";
import PlanHeader from "./PlanHeader";
import HotelRecommendations from "./HotelRecommendations";
import WeatherSection from "./WeatherSection";
import PackingList from "./PackingList";

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
      <Link href="/saved-travels" className="inline-flex items-center gap-1 text-sm mb-2" style={{ color: "var(--text-light)" }}>
        <ChevronLeft size={16} />
        Tüm Planlar
      </Link>

      <PlanHeader plan={plan} />
      {plan.plan_data?.hotelRecommendations?.length > 0 && (
        <HotelRecommendations hotels={plan.plan_data.hotelRecommendations} />
      )}
      <PlanDetail plan={plan} />
      {plan.plan_data?.packingList && (
        <PackingList
          packingList={plan.plan_data.packingList}
          packingTip={plan.plan_data.packingTip}
          destination={plan.destination}
          weatherSummary={plan.plan_data?.days?.[0]?.weather ?? undefined}
        />
      )}
      <WeatherSection
        weatherData={plan.weather_data}
        startDate={plan.start_date}
        durationDays={plan.duration_days}
        destination={plan.destination}
        rainyDayAlternatives={plan.plan_data?.rainyDayAlternatives}
      />
    </div>
  );
}
