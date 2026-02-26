"use client";

import { motion } from "framer-motion";
import type { HabitWithStats } from "@/types";

interface GardenPlantProps {
  habit: HabitWithStats;
  x: number;
  y: number;
}

// Color palettes per plant type
const PALETTES: Record<string, { stem: string; leaf: string; flower: string }> = {
  fern: { stem: "#2E7D32", leaf: "#4CAF50", flower: "#81C784" },
  sunflower: { stem: "#388E3C", leaf: "#66BB6A", flower: "#FFC107" },
  cherry_blossom: { stem: "#5D4037", leaf: "#81C784", flower: "#F48FB1" },
  oak: { stem: "#5D4037", leaf: "#388E3C", flower: "#66BB6A" },
  cactus: { stem: "#2E7D32", leaf: "#4CAF50", flower: "#FF7043" },
  bamboo: { stem: "#558B2F", leaf: "#8BC34A", flower: "#CDDC39" },
};

export function GardenPlant({ habit, x, y }: GardenPlantProps) {
  const stage = habit.plantStage;
  const p = PALETTES[habit.plant_type] || PALETTES.fern;
  const isWilted = !habit.completedToday && habit.currentStreak === 0 && habit.totalDays > 0;

  // Scale plant based on stage
  const scale = 0.4 + stage * 0.12;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {/* Tap target (invisible, larger) */}
      <circle cx={x} cy={y - 15} r="20" fill="transparent" className="cursor-pointer" />

      {/* Shadow */}
      <ellipse cx={x} cy={y + 2} rx={8 * scale} ry={3 * scale} fill="rgba(0,0,0,0.1)" />

      {/* Stage 0: empty plot marker */}
      {stage === 0 && (
        <g opacity={0.5}>
          <ellipse cx={x} cy={y} rx="8" ry="4" fill="#A1887F" />
          <text x={x} y={y + 2} textAnchor="middle" fontSize="8" fill="#795548">·</text>
        </g>
      )}

      {/* Stage 1: Seed */}
      {stage >= 1 && (
        <g opacity={isWilted ? 0.5 : 1}>
          <ellipse cx={x} cy={y} rx="6" ry="3" fill="#8D6E63" />
          <circle cx={x} cy={y - 2} r={2 * scale} fill={p.leaf}>
            <animate attributeName="r" values={`${2*scale};${2.3*scale};${2*scale}`} dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Stage 2: Sprout */}
      {stage >= 2 && (
        <g opacity={isWilted ? 0.5 : 1}>
          <line x1={x} y1={y} x2={x} y2={y - 12 * scale} stroke={p.stem} strokeWidth={1.5 * scale} strokeLinecap="round" />
          <ellipse cx={x - 4 * scale} cy={y - 10 * scale} rx={4 * scale} ry={2 * scale} fill={p.leaf} transform={`rotate(-20 ${x - 4 * scale} ${y - 10 * scale})`}>
            <animate attributeName="rx" values={`${4*scale};${4.4*scale};${4*scale}`} dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx={x + 4 * scale} cy={y - 8 * scale} rx={3.5 * scale} ry={2 * scale} fill={p.leaf} transform={`rotate(15 ${x + 4 * scale} ${y - 8 * scale})`} />
        </g>
      )}

      {/* Stage 3-4: Small to medium plant */}
      {stage >= 3 && (
        <g opacity={isWilted ? 0.5 : 1}>
          <line x1={x} y1={y - 12 * scale} x2={x} y2={y - 22 * scale} stroke={p.stem} strokeWidth={2 * scale} strokeLinecap="round" />
          <ellipse cx={x - 6 * scale} cy={y - 18 * scale} rx={5 * scale} ry={3 * scale} fill={p.leaf} transform={`rotate(-15 ${x - 6 * scale} ${y - 18 * scale})`} />
          <ellipse cx={x + 5 * scale} cy={y - 20 * scale} rx={5 * scale} ry={2.5 * scale} fill={p.leaf} transform={`rotate(10 ${x + 5 * scale} ${y - 20 * scale})`} />
          {stage >= 4 && (
            <>
              <ellipse cx={x} cy={y - 24 * scale} rx={6 * scale} ry={4 * scale} fill={p.leaf}>
                <animate attributeName="ry" values={`${4*scale};${4.4*scale};${4*scale}`} dur="2.5s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx={x - 5 * scale} cy={y - 22 * scale} rx={4 * scale} ry={3 * scale} fill={p.leaf} opacity="0.8" />
            </>
          )}
        </g>
      )}

      {/* Stage 5-6: Large plant / tree */}
      {stage >= 5 && (
        <g opacity={isWilted ? 0.5 : 1}>
          <rect x={x - 1.5 * scale} y={y - 26 * scale} width={3 * scale} height={8 * scale} rx={1} fill={p.stem} opacity="0.8" />
          <ellipse cx={x} cy={y - 32 * scale} rx={10 * scale} ry={8 * scale} fill={p.leaf}>
            <animate attributeName="rx" values={`${10*scale};${10.5*scale};${10*scale}`} dur="4s" repeatCount="indefinite" />
          </ellipse>
          {stage >= 6 && (
            <>
              <ellipse cx={x - 6 * scale} cy={y - 30 * scale} rx={7 * scale} ry={5 * scale} fill={p.leaf} opacity="0.8" />
              <ellipse cx={x + 6 * scale} cy={y - 34 * scale} rx={7 * scale} ry={5 * scale} fill={p.leaf} opacity="0.8" />
            </>
          )}
        </g>
      )}

      {/* Stage 7: Flowers */}
      {stage >= 7 && (
        <g opacity={isWilted ? 0.5 : 1}>
          {[
            { dx: -4, dy: -36 },
            { dx: 5, dy: -34 },
            { dx: 0, dy: -38 },
            { dx: -7, dy: -30 },
            { dx: 7, dy: -32 },
          ].map((pos, i) => (
            <circle
              key={i}
              cx={x + pos.dx * scale}
              cy={y + pos.dy * scale}
              r={2.5 * scale}
              fill={p.flower}
              opacity="0.9"
            >
              <animate attributeName="r" values={`${2.5*scale};${3*scale};${2.5*scale}`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}

      {/* Habit icon label (below plant) */}
      <text x={x} y={y + 12} textAnchor="middle" fontSize="10" className="select-none">
        {habit.icon}
      </text>

      {/* Streak badge */}
      {habit.currentStreak > 0 && (
        <g>
          <rect x={x + 8} y={y - 8} width={16} height={10} rx={5} fill="#FFC107" />
          <text x={x + 16} y={y - 1} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#5D4037">
            {habit.currentStreak}
          </text>
        </g>
      )}
    </motion.g>
  );
}
