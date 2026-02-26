import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BloomApp } from "@/components/bloom-app";
import { today, daysAgo, getStage } from "@/lib/utils";
import type { Habit, HabitLog, HabitWithStats, EarnedMilestones } from "@/types";

export default async function GardenPage() {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = await createServerSupabaseClient();

  // Fetch habits
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("sort_order", { ascending: true });

  const habitIds = (habits || []).map((h: Habit) => h.id);

  // Fetch logs (last 365 days for heatmaps)
  const yearAgo = daysAgo(365);
  const { data: logs } = habitIds.length > 0
    ? await supabase.from("habit_logs").select("*").in("habit_id", habitIds).gte("log_date", yearAgo)
    : { data: [] };

  // Fetch profile for coins + streak_freezes
  // Try with streak_freezes first; fall back to coins-only if column doesn't exist yet
  let profile: { coins: number; streak_freezes?: Record<string, number> } | null = null;
  {
    const { data, error } = await supabase
      .from("profiles")
      .select("coins, streak_freezes")
      .eq("clerk_id", userId)
      .single();
    if (!error) {
      profile = data;
    } else {
      // streak_freezes column may not exist yet – fetch coins only
      const { data: fallback } = await supabase
        .from("profiles")
        .select("coins")
        .eq("clerk_id", userId)
        .single();
      profile = fallback ? { ...fallback, streak_freezes: {} } : null;
    }
  }

  // Fetch earned milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .in("habit_id", habitIds.length > 0 ? habitIds : ["__none__"]);

  // Build earned map
  const earned: EarnedMilestones = {};
  (milestones || []).forEach((m: { habit_id: string; value: number }) => {
    earned[`${m.habit_id}:${m.value}`] = true;
  });

  const todayStr = today();

  // Compute stats per habit
  const habitsWithStats: HabitWithStats[] = (habits || []).map((habit: Habit) => {
    const habitLogs = (logs || []).filter((l: HabitLog) => l.habit_id === habit.id);
    const completedToday = habitLogs.some((l: HabitLog) => l.log_date === todayStr);

    // Compute streak
    let currentStreak = 0;
    let d = 0;
    const logDates = new Set(habitLogs.map((l: HabitLog) => l.log_date));
    while (logDates.has(daysAgo(d))) {
      currentStreak++;
      d++;
    }

    const totalDays = habitLogs.length;

    return {
      ...habit,
      currentStreak,
      totalDays,
      completedToday,
      stage: getStage(totalDays),
      logs: habitLogs as HabitLog[],
    };
  });

  return (
    <BloomApp
      initialHabits={habitsWithStats}
      initialCoins={profile?.coins ?? 0}
      initialEarned={earned}
      initialStreakFreezes={(profile?.streak_freezes as Record<string, number>) ?? {}}
    />
  );
}
