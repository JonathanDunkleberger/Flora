import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { HabitDetailView } from "@/components/habits/habit-detail-view";
import type { Habit, HabitLog } from "@/types";

export default async function HabitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = await createServerSupabaseClient();

  const { data: habit } = await supabase.from("habits").select("*").eq("id", id).single<Habit>();
  if (!habit) notFound();

  const { data: profile } = await supabase
    .from("profiles").select("subscription_status").eq("id", userId).single();
  const isPro = profile?.subscription_status === "pro";

  const { data: logs } = await supabase
    .from("habit_logs").select("*").eq("habit_id", id).order("date", { ascending: true });

  const { data: relapses } = await supabase
    .from("relapse_events").select("*").eq("habit_id", id).order("occurred_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20">
      <HabitDetailView
        habit={habit}
        logs={(logs || []) as HabitLog[]}
        relapses={relapses || []}
        isPro={isPro}
      />
    </div>
  );
}
