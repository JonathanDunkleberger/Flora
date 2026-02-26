"use client";

import { motion } from "framer-motion";
import { X, PartyPopper } from "lucide-react";
import type { Milestone } from "@/types";

export function MilestoneToast({
  milestone,
  onDismiss,
}: {
  milestone: Milestone;
  onDismiss: () => void;
}) {
  async function handleDismiss() {
    try {
      await fetch(`/api/habits/${milestone.habit_id}/log`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestone_id: milestone.id }),
      });
    } catch { /* non-critical */ }
    onDismiss();
  }

  return (
    <motion.div
      className="fixed top-20 left-4 right-4 z-[100] max-w-md mx-auto"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="bg-white rounded-3xl p-5 shadow-2xl border border-amber-200">
        <button onClick={handleDismiss} className="absolute top-3 right-3 text-slate-300">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <PartyPopper className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              {milestone.day_count}-Day Milestone! 🎉
            </h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {milestone.message}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="mt-3 w-full py-2.5 bg-bloom-500 text-white text-sm font-semibold rounded-2xl hover:bg-bloom-600 tap-bounce"
        >
          Keep Growing 💪
        </button>
      </div>
    </motion.div>
  );
}
