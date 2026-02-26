import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GardenScene } from "@/components/garden/garden-scene";
import { computeStreak } from "@/lib/streaks";
import { calculateGardenState } from "@/lib/garden";
import { getPlantStage } from "@/lib/utils";
import type { Habit, HabitLog, GardenData, Milestone, HabitWithStats } from "@/types";

export default async function GardenPage() {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = await createServerSupabaseClient();

  // Fetch habits
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("is_archived", false)
    .order("sort_order", { ascending: true });

  const habitIds = (habits || []).map((h: Habit) => h.id);

  // Fetch logs (last 90 days)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const { data: logs } = habitIds.length > 0
    ? await supabase.from("habit_logs").select("*").in("habit_id", habitIds).gte("date", ninetyDaysAgo)
    : { data: [] };

  // Fetch most recent relapse
  const { data: relapses } = await supabase
    .from("relapse_events")
    .select("*")
    .order("occurred_at", { ascending: false })
    .limit(1);

  const lastRelapse = relapses?.[0]?.occurred_at || null;

  // Fetch unseen milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("seen", false)
    .order("created_at", { ascending: false })
    .limit(1);

  // Compute stats per habit
  const habitsWithStats: HabitWithStats[] = (habits || []).map((habit: Habit) => {
    const habitLogs = (logs || []).filter((l: HabitLog) => l.habit_id === habit.id);
    const stats = computeStreak(habitLogs.map((l) => ({ date: l.date, completed: l.completed })));
    return {
      ...habit,
      ...stats,
      plantStage: getPlantStage(stats.currentStreak),
      logs: habitLogs as HabitLog[],
    };
  });

  // Calculate garden state
  const streakScores = habitsWithStats.map((h) => h.currentStreak);
  const gardenState = calculateGardenState(streakScores, lastRelapse);

  const gardenData: GardenData = {
    habits: habitsWithStats,
    gardenHealth: gardenState.healthLevel,
    gardenName: gardenState.healthName,
    totalStreakScore: gardenState.totalStreakScore,
    hasStorm: gardenState.hasStorm,
    groundColor: gardenState.groundColor,
    ambientType: gardenState.ambientType,
    lastRelapse,
    unseenMilestone: (milestones?.[0] as Milestone) || null,
  };

  return <GardenScene data={gardenData} />;
}
