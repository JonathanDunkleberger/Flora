"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GardenGround } from "./garden-ground";
import { GardenPlant } from "./garden-plant";
import { GardenAmbience } from "./garden-ambience";
import { GardenWeather } from "./garden-weather";
import { CheckinSheet } from "./checkin-sheet";
import { MilestoneToast } from "../milestone-toast";
import { EmptyState } from "../shared/empty-state";
import { getPlantPosition } from "@/lib/garden";
import { isoToScreen } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import type { GardenData } from "@/types";

const TILE_W = 70;
const TILE_H = 40;
const GARDEN_CENTER_X = 180;
const GARDEN_CENTER_Y = 80;

export function GardenScene({ data }: { data: GardenData }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showMilestone, setShowMilestone] = useState(!!data.unseenMilestone);

  const { habits, gardenHealth, gardenName, hasStorm, groundColor, ambientType, totalStreakScore } = data;

  const allDoneToday = habits.length > 0 && habits.every((h) => h.completedToday);

  return (
    <div className="relative min-h-screen pt-14 overflow-hidden">
      {/* Garden status bar */}
      <div className="relative z-10 px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Your Garden</h1>
            <p className="text-xs text-slate-500">
              {gardenName} · {totalStreakScore} total streak days
            </p>
          </div>
          {allDoneToday && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-bloom-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              ✓ All done today!
            </motion.div>
          )}
        </div>
      </div>

      {/* Garden viewport */}
      <div className="relative w-full" style={{ height: "calc(100vh - 200px)", minHeight: "400px" }}>
        {/* Background gradient based on garden health */}
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: hasStorm
              ? "linear-gradient(180deg, #78909C 0%, #B0BEC5 40%, #CFD8DC 100%)"
              : gardenHealth >= 3
              ? "linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 40%, #A5D6A7 100%)"
              : gardenHealth >= 1
              ? "linear-gradient(180deg, #FFF8E1 0%, #F1F8E9 40%, #DCEDC8 100%)"
              : "linear-gradient(180deg, #EFEBE9 0%, #D7CCC8 40%, #BCAAA4 100%)",
          }}
        />

        {/* Storm overlay */}
        {hasStorm && <GardenWeather />}

        {/* Isometric garden SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 360 320"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Ground tiles */}
          <GardenGround
            groundColor={groundColor}
            healthLevel={gardenHealth}
          />

          {/* Plants, rendered back-to-front for proper overlap */}
          {habits.length === 0 ? null : (
            habits
              .map((habit, i) => ({
                habit,
                pos: getPlantPosition(i, habits.length),
              }))
              .sort((a, b) => (a.pos.row + a.pos.col) - (b.pos.row + b.pos.col))
              .map(({ habit, pos }) => {
                const screen = isoToScreen(pos.col, pos.row, TILE_W, TILE_H);
                return (
                  <GardenPlant
                    key={habit.id}
                    habit={habit}
                    x={GARDEN_CENTER_X + screen.x}
                    y={GARDEN_CENTER_Y + screen.y}
                  />
                );
              })
          )}
        </svg>

        {/* Ambient effects (HTML overlay for easier animation) */}
        {!hasStorm && ambientType !== "none" && (
          <GardenAmbience type={ambientType} healthLevel={gardenHealth} />
        )}

        {/* Empty state */}
        {habits.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <EmptyState />
          </div>
        )}
      </div>

      {/* Check-in pull tab */}
      {habits.length > 0 && (
        <motion.button
          onClick={() => setSheetOpen(true)}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-sm border border-bloom-200 rounded-full px-6 py-3 shadow-lg shadow-bloom-500/10 flex items-center gap-2 tap-bounce"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp className="w-4 h-4 text-bloom-600" />
          <span className="text-sm font-semibold text-bloom-700">
            {allDoneToday ? "View Check-in" : "Daily Check-in"}
          </span>
          {!allDoneToday && (
            <span className="bg-bloom-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {habits.filter((h) => !h.completedToday).length}
            </span>
          )}
        </motion.button>
      )}

      {/* Check-in bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <CheckinSheet
            habits={data.habits}
            onClose={() => setSheetOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Milestone toast */}
      {data.unseenMilestone && showMilestone && (
        <MilestoneToast
          milestone={data.unseenMilestone}
          onDismiss={() => setShowMilestone(false)}
        />
      )}
    </div>
  );
}
