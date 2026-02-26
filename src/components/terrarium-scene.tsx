"use client";

import { Creature } from "@/components/creature";
import { seed, getStage } from "@/lib/utils";
import type { HabitWithStats } from "@/types";

interface TerrariumSceneProps {
  habits: HabitWithStats[];
  completions: Record<string, boolean>;
  todayStr: string;
}

export function TerrariumScene({ habits, completions, todayStr }: TerrariumSceneProps) {
  if (habits.length === 0) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: 16,
        overflow: "hidden",
        aspectRatio: "16/9",
        background: "linear-gradient(180deg, #e4ede0 0%, #d6dfc8 30%, #cac5a8 75%, #b8a88a 100%)",
      }}
    >
      {/* Glass shine */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Ground details */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 480 270"
        style={{ position: "absolute", bottom: 0 }}
      >
        {Array.from({ length: 25 }).map((_, i) => {
          const r = seed(i * 73 + 11);
          const x = r() * 480;
          const h2 = 6 + r() * 14;
          const sw = (r() - 0.5) * 5;
          return (
            <line
              key={`grass-${i}`}
              x1={x}
              y1={240}
              x2={x + sw}
              y2={240 - h2}
              stroke={`hsl(${100 + r() * 30},${35 + r() * 20}%,${50 + r() * 15}%)`}
              strokeWidth={1 + r() * 1.2}
              strokeLinecap="round"
              opacity={0.25 + r() * 0.2}
            />
          );
        })}
        {Array.from({ length: 6 }).map((_, i) => {
          const r = seed(i * 137 + 42);
          return (
            <ellipse
              key={`pebble-${i}`}
              cx={50 + r() * (480 - 100)}
              cy={245 + r() * 12}
              rx={3 + r() * 5}
              ry={2 + r() * 3}
              fill={`hsl(30,${10 + r() * 15}%,${60 + r() * 20}%)`}
              opacity={0.35}
            />
          );
        })}
      </svg>

      {/* Creatures */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
          padding: "0 24px",
        }}
      >
        {habits.map((h, i) => {
          const stage = getStage(h.totalDays);
          const isHappy = !!completions[`${h.id}:${todayStr}`];
          const r = seed(h.id.charCodeAt(0) * 100 + i);
          return (
            <div
              key={h.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: `bob ${2 + r() * 2}s ease-in-out infinite`,
              }}
            >
              <Creature stage={stage} color={h.color} size={36 + stage * 7} happy={isHappy} />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.3)",
                  marginTop: 1,
                  maxWidth: 56,
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {h.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
