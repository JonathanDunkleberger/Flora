"use client";

import { useMemo } from "react";
import { daysAgo } from "@/lib/utils";
import type { ThemeColors } from "@/lib/constants";

interface UrgeTrendProps {
  urgeLog: string[];
  color: string;
  th: ThemeColors;
}

export function UrgeTrend({ urgeLog, color, th }: UrgeTrendProps) {
  const weeks = useMemo(() => {
    const result: number[] = [];
    for (let w = 7; w >= 0; w--) {
      const weekStart = daysAgo(w * 7 + 6);
      const weekEnd = daysAgo(w * 7);
      const count = (urgeLog || []).filter((d) => d >= weekStart && d <= weekEnd).length;
      result.push(count);
    }
    return result;
  }, [urgeLog]);

  if (!urgeLog || urgeLog.length === 0) return null;

  const max = Math.max(...weeks, 1);
  const barW = 100 / weeks.length;
  const trend = weeks[weeks.length - 1] <= weeks[0] ? "decreasing" : "stable";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span className="lb" style={{ color: th.label }}>Urge frequency</span>
        {urgeLog.length > 3 && (
          <span style={{ fontSize: 9, color: trend === "decreasing" ? "#4caf50" : th.textMuted, fontWeight: 600 }}>
            {trend === "decreasing" ? "↓ Trending down" : "Tracking"}
          </span>
        )}
      </div>
      <svg viewBox="0 0 100 30" style={{ width: "100%", display: "block" }}>
        {weeks.map((c, i) => (
          <g key={i}>
            <rect
              x={i * barW + barW * 0.15} y={30 - (c / max) * 24}
              width={barW * 0.7} height={Math.max((c / max) * 24, 1)}
              rx={2} fill={c > 0 ? color : th.heatEmpty} opacity={c > 0 ? 0.6 : 1}
            />
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 8, color: th.textFaint }}>8w ago</span>
        <span style={{ fontSize: 8, color: th.textFaint }}>this week</span>
      </div>
    </div>
  );
}
