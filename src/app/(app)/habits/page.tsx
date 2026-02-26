import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Flame, ChevronRight } from "lucide-react";
import { computeStreak } from "@/lib/streaks";
import { getPlantStage, PLANT_STAGE_NAMES, cn } from "@/lib/utils";
import type { Habit, HabitLog } from "@/types";

export default async function HabitsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: habits } = await supabase
    .from("habits").select("*").eq("is_archived", false).order("sort_order");

  const habitIds = (habits || []).map((h: Habit) => h.id);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
  const { data: logs } = habitIds.length > 0
    ? await supabase.from("habit_logs").select("*").in("habit_id", habitIds).gte("date", ninetyDaysAgo)
    : { data: [] };

  interface HabitWithComputed extends Habit {
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    completedToday: boolean;
  }

  const groups = new Map<string, HabitWithComputed[]>();
  (habits || []).forEach((h: Habit) => {
    const g = h.habit_group || "ungrouped";
    if (!groups.has(g)) groups.set(g, []);
    const habitLogs = (logs || []).filter((l: HabitLog) => l.habit_id === h.id);
    const stats = computeStreak(habitLogs.map(l => ({ date: l.date, completed: l.completed })));
    groups.get(g)!.push({ ...h, ...stats });
  });

  const GROUP_LABELS: Record<string, string> = {
    morning: "🌅 Morning", afternoon: "☀️ Afternoon", evening: "🌙 Evening",
    fitness: "🏋️ Fitness", wellness: "🧠 Wellness", ungrouped: "📌 Habits",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Your Habits</h1>
        <Link href="/habits/new"
          className="flex items-center gap-1 text-sm font-medium text-bloom-600 hover:text-bloom-700 bg-bloom-50 px-3 py-1.5 rounded-xl">
          <Plus className="w-4 h-4" /> New
        </Link>
      </div>

      {!habits || habits.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl">🌱</span>
          <h2 className="text-lg font-bold text-slate-800 mt-4">No habits yet</h2>
          <p className="text-sm text-slate-500 mt-1 mb-4">Plant your first seed</p>
          <Link href="/habits/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-bloom-500 text-white font-semibold rounded-2xl shadow-md tap-bounce">
            <Plus className="w-4 h-4" /> Plant a Habit
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(groups.entries()).map(([group, groupHabits]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                {GROUP_LABELS[group] || group}
              </h3>
              <div className="space-y-2">
                {groupHabits.map((h) => (
                  <Link key={h.id} href={`/habits/${h.id}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 hover:border-bloom-200 transition-all">
                    <span className="text-xl">{h.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800 truncate">{h.name}</span>
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                          h.type === "quit" ? "bg-purple-100 text-purple-700" : "bg-bloom-100 text-bloom-700"
                        )}>{h.type === "quit" ? "QUIT" : "BUILD"}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-slate-500">{h.currentStreak} days</span>
                        <span className="text-[10px] text-slate-400">
                          {PLANT_STAGE_NAMES[getPlantStage(h.currentStreak)]}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
