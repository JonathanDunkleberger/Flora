"use client";

import { Flame } from "lucide-react";
import { cn, getPlantStage, PLANT_STAGE_NAMES } from "@/lib/utils";
import type { HabitWithStats } from "@/types";

interface HabitCardProps {
  habit: HabitWithStats;
  onToggle?: (habitId: string) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const stage = getPlantStage(habit.currentStreak);

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border transition-all",
        habit.completedToday ? "bg-bloom-50 border-bloom-200" : "bg-white border-slate-100"
      )}
    >
      <button
        onClick={() => onToggle?.(habit.id)}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all tap-bounce shrink-0",
          habit.completedToday ? "bg-bloom-500 shadow-sm" : "bg-slate-100 hover:bg-bloom-100"
        )}
      >
        {habit.completedToday ? (
          <span className="text-white text-lg">✓</span>
        ) : (
          <span className="text-base">{habit.icon}</span>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-semibold truncate",
            habit.completedToday ? "text-bloom-700" : "text-slate-800"
          )}>
            {habit.name}
          </span>
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
            habit.type === "quit" ? "bg-purple-100 text-purple-700" : "bg-bloom-100 text-bloom-700"
          )}>
            {habit.type === "quit" ? "QUIT" : "BUILD"}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <Flame className="w-3 h-3 text-amber-500" />
          <span className="text-xs text-slate-500">{habit.currentStreak} days</span>
          <span className="text-[10px] text-slate-400">{PLANT_STAGE_NAMES[stage]}</span>
        </div>
      </div>
    </div>
  );
}
