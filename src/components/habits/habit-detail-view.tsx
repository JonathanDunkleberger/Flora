"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Flame, Calendar, TrendingUp, Trash2, Archive, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { computeStreak } from "@/lib/streaks";
import { getPlantStage, PLANT_STAGE_NAMES, cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { Habit, HabitLog, RelapseEvent } from "@/types";

interface HabitDetailViewProps {
  habit: Habit;
  logs: HabitLog[];
  relapses: RelapseEvent[];
  isPro: boolean;
}

export function HabitDetailView({ habit, logs, relapses, isPro }: HabitDetailViewProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [showDelete, setShowDelete] = useState(false);

  const stats = computeStreak(logs.map((l) => ({ date: l.date, completed: l.completed })));
  const plantStage = getPlantStage(stats.currentStreak);

  // Build a simple heat map data (last 90 days)
  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.date)
  );

  async function handleArchive() {
    await fetch(`/api/habits/${habit.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_archived: true }),
    });
    startTransition(() => { router.push("/habits"); router.refresh(); });
  }

  async function handleDelete() {
    await fetch(`/api/habits/${habit.id}`, { method: "DELETE" });
    startTransition(() => { router.push("/habits"); router.refresh(); });
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/habits" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{habit.icon}</span>
            <h1 className="text-xl font-bold text-slate-800">{habit.name}</h1>
          </div>
          {habit.description && (
            <p className="text-sm text-slate-500 mt-0.5">{habit.description}</p>
          )}
        </div>
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded-full",
          habit.type === "quit" ? "bg-purple-100 text-purple-700" : "bg-bloom-100 text-bloom-700"
        )}>
          {habit.type === "quit" ? "QUIT" : "BUILD"}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-slate-400 font-medium">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.currentStreak} <span className="text-sm font-normal text-slate-400">days</span></p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-bloom-500" />
            <span className="text-xs text-slate-400 font-medium">Longest Streak</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.longestStreak} <span className="text-sm font-normal text-slate-400">days</span></p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-slate-400 font-medium">Total Days</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.totalDays}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">🌱</span>
            <span className="text-xs text-slate-400 font-medium">Plant Stage</span>
          </div>
          <p className="text-lg font-bold text-slate-800">{PLANT_STAGE_NAMES[plantStage]}</p>
        </div>
      </div>

      {/* Mini heat map (last 30 days) */}
      {isPro && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Last 30 Days</h3>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (29 - i));
              const dateStr = date.toISOString().split("T")[0];
              const isCompleted = completedDates.has(dateStr);
              return (
                <div
                  key={dateStr}
                  className={cn(
                    "w-6 h-6 rounded-md",
                    isCompleted ? "bg-bloom-400" : "bg-slate-100"
                  )}
                  title={`${dateStr}: ${isCompleted ? "Done" : "Missed"}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Relapse History (quit habits) */}
      {habit.type === "quit" && relapses.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Relapse History</h3>
          <div className="space-y-2">
            {relapses.slice(0, 10).map((r: RelapseEvent) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-xs text-slate-500">
                    {format(parseISO(r.occurred_at), "MMM d, yyyy")}
                  </p>
                  {r.note && <p className="text-xs text-slate-400 mt-0.5">{r.note}</p>}
                </div>
                <span className="text-xs text-slate-400">{r.previous_streak} day streak lost</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <button onClick={handleArchive}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 font-medium rounded-2xl hover:bg-slate-200 transition-colors">
          <Archive className="w-4 h-4" /> Archive Habit
        </button>

        {!showDelete ? (
          <button onClick={() => setShowDelete(true)}
            className="w-full flex items-center justify-center gap-2 py-3 text-rose-500 font-medium rounded-2xl hover:bg-rose-50 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete Habit
          </button>
        ) : (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-rose-700">Delete this habit permanently?</span>
            </div>
            <p className="text-xs text-rose-600/80 mb-3">This will remove all logs, streaks, and milestones. This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} className="flex-1 py-2 bg-rose-500 text-white text-sm font-medium rounded-xl">
                Delete Forever
              </button>
              <button onClick={() => setShowDelete(false)} className="flex-1 py-2 bg-white text-slate-600 text-sm font-medium rounded-xl border border-slate-200">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
