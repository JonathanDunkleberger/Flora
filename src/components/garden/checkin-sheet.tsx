"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X, Check, Flame, AlertTriangle } from "lucide-react";
import { cn, PLANT_STAGE_NAMES, getPlantStage } from "@/lib/utils";
import type { HabitWithStats } from "@/types";

interface CheckinSheetProps {
  habits: HabitWithStats[];
  onClose: () => void;
}

export function CheckinSheet({ habits, onClose }: CheckinSheetProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>(
    Object.fromEntries(habits.map((h) => [h.id, h.completedToday]))
  );
  const [relapseConfirm, setRelapseConfirm] = useState<string | null>(null);
  const [relapseNote, setRelapseNote] = useState("");

  // Group habits
  const groups = new Map<string, HabitWithStats[]>();
  habits.forEach((h) => {
    const group = h.habit_group || "ungrouped";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(h);
  });

  async function toggleHabit(habitId: string) {
    const newState = !checkedState[habitId];
    setCheckedState((prev) => ({ ...prev, [habitId]: newState }));

    try {
      await fetch(`/api/habits/${habitId}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          completed: newState,
        }),
      });
      startTransition(() => router.refresh());
    } catch {
      setCheckedState((prev) => ({ ...prev, [habitId]: !newState }));
    }
  }

  async function handleRelapse(habitId: string) {
    try {
      await fetch(`/api/habits/${habitId}/relapse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: relapseNote || null }),
      });
      setRelapseConfirm(null);
      setRelapseNote("");
      startTransition(() => router.refresh());
    } catch {
      // Handle error silently
    }
  }

  const GROUP_LABELS: Record<string, string> = {
    morning: "🌅 Morning",
    afternoon: "☀️ Afternoon",
    evening: "🌙 Evening",
    fitness: "🏋️ Fitness",
    wellness: "🧠 Wellness",
    ungrouped: "📌 Habits",
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 sheet-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-800">Daily Check-in</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Habit list */}
        <div className="overflow-y-auto px-5 py-4 space-y-5" style={{ maxHeight: "65vh" }}>
          {Array.from(groups.entries()).map(([group, groupHabits]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                {GROUP_LABELS[group] || group}
              </h3>
              <div className="space-y-2">
                {groupHabits.map((habit) => {
                  const isChecked = checkedState[habit.id];
                  const isQuit = habit.type === "quit";

                  return (
                    <div key={habit.id} className="relative">
                      <motion.div
                        layout
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border transition-all",
                          isChecked
                            ? "bg-bloom-50 border-bloom-200"
                            : "bg-white border-slate-100"
                        )}
                      >
                        {/* Check button */}
                        <button
                          onClick={() => toggleHabit(habit.id)}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all tap-bounce shrink-0",
                            isChecked
                              ? "bg-bloom-500 shadow-sm"
                              : "bg-slate-100 hover:bg-bloom-100"
                          )}
                        >
                          {isChecked ? (
                            <Check className="w-5 h-5 text-white" strokeWidth={3} />
                          ) : (
                            <span className="text-base">{habit.icon}</span>
                          )}
                        </button>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-semibold truncate",
                              isChecked ? "text-bloom-700" : "text-slate-800"
                            )}>
                              {habit.name}
                            </span>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                              isQuit ? "bg-purple-100 text-purple-700" : "bg-bloom-100 text-bloom-700"
                            )}>
                              {isQuit ? "QUIT" : "BUILD"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Flame className="w-3 h-3 text-amber-500" />
                            <span className="text-xs text-slate-500">
                              {habit.currentStreak} day streak
                            </span>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className="text-[10px] text-slate-400">
                              {PLANT_STAGE_NAMES[getPlantStage(habit.currentStreak)]}
                            </span>
                          </div>
                        </div>

                        {/* Relapse button for quit habits */}
                        {isQuit && isChecked && (
                          <button
                            onClick={() => setRelapseConfirm(habit.id)}
                            className="text-[10px] text-slate-400 hover:text-rose-500 px-2 py-1 rounded-lg transition-colors"
                          >
                            Relapse
                          </button>
                        )}
                      </motion.div>

                      {/* Relapse confirmation */}
                      {relapseConfirm === habit.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2 bg-rose-50 border border-rose-200 rounded-2xl p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                            <span className="text-sm font-medium text-rose-700">
                              Log a relapse?
                            </span>
                          </div>
                          <p className="text-xs text-rose-600/80 mb-3">
                            Your plant will wilt back one stage, and your garden will experience a brief storm. Growth isn&apos;t linear — tomorrow is a fresh start.
                          </p>
                          <input
                            type="text"
                            placeholder="Optional note (what triggered it?)"
                            value={relapseNote}
                            onChange={(e) => setRelapseNote(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 bg-white mb-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRelapse(habit.id)}
                              className="flex-1 py-2 bg-rose-500 text-white text-sm font-medium rounded-xl"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => { setRelapseConfirm(null); setRelapseNote(""); }}
                              className="flex-1 py-2 bg-white text-slate-600 text-sm font-medium rounded-xl border border-slate-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
