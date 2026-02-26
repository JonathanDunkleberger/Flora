import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { computeStreak } from "@/lib/streaks";
import { StatsCards } from "@/components/stats/stats-cards";
import { HeatMap } from "@/components/stats/heat-map";
import type { Habit, HabitLog } from "@/types";

export default async function StatsPage() {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles").select("subscription_status").eq("id", userId).single();
  const isPro = profile?.subscription_status === "pro";

  const { data: habits } = await supabase
    .from("habits").select("*").eq("is_archived", false).order("sort_order");

  const habitIds = (habits || []).map((h: Habit) => h.id);
  const { data: logs } = habitIds.length > 0
    ? await supabase.from("habit_logs").select("*").in("habit_id", habitIds)
    : { data: [] };

  // Compute aggregate stats
  let totalCurrentStreak = 0;
  let totalLongestStreak = 0;
  let totalCompletedDays = 0;
  let habitsCompletedToday = 0;

  const habitStats = (habits || []).map((h: Habit) => {
    const habitLogs = (logs || []).filter((l: HabitLog) => l.habit_id === h.id);
    const stats = computeStreak(habitLogs.map(l => ({ date: l.date, completed: l.completed })));
    totalCurrentStreak += stats.currentStreak;
    totalLongestStreak = Math.max(totalLongestStreak, stats.longestStreak);
    totalCompletedDays += stats.totalDays;
    if (stats.completedToday) habitsCompletedToday++;
    return { habit: h, stats };
  });

  // Build heat map data (last 365 days)
  const allCompletedDates = new Map<string, number>();
  (logs || []).filter((l: HabitLog) => l.completed).forEach((l: HabitLog) => {
    allCompletedDates.set(l.date, (allCompletedDates.get(l.date) || 0) + 1);
  });

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Your Stats</h1>

      <StatsCards
        totalHabits={habits?.length || 0}
        totalCurrentStreak={totalCurrentStreak}
        totalLongestStreak={totalLongestStreak}
        totalCompletedDays={totalCompletedDays}
        habitsCompletedToday={habitsCompletedToday}
      />

      {isPro && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Activity Heat Map</h2>
          <HeatMap completedDates={Object.fromEntries(allCompletedDates)} totalHabits={habits?.length || 1} />
        </div>
      )}

      {/* Per-habit breakdown */}
      <div className="mt-8 space-y-3">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Habit Breakdown</h2>
        {habitStats.map(({ habit, stats }) => (
          <div key={habit.id} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{habit.icon}</span>
              <span className="text-sm font-semibold text-slate-800">{habit.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-amber-600">{stats.currentStreak}</p>
                <p className="text-[10px] text-slate-400">Current</p>
              </div>
              <div>
                <p className="text-lg font-bold text-bloom-600">{stats.longestStreak}</p>
                <p className="text-[10px] text-slate-400">Best</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">{stats.totalDays}</p>
                <p className="text-[10px] text-slate-400">Total</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
