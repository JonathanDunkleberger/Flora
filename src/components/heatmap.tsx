"use client";

import { daysAgo, fmtDate } from "@/lib/utils";

interface HeatmapProps {
  getData: (date: string) => number;
  weeks?: number;
  color?: string;
}

export function Heatmap({ getData, weeks = 16, color = "#6366f1" }: HeatmapProps) {
  const cellSize = 12;
  const gap = 2;
  const labelW = 20;
  const w = weeks * (cellSize + gap) + labelW + 4;
  const h = 7 * (cellSize + gap) + 8;

  const r = parseInt(color.slice(1, 3), 16) || 99;
  const g = parseInt(color.slice(3, 5), 16) || 102;
  const b = parseInt(color.slice(5, 7), 16) || 241;

  const heatColor = (val: number) => {
    if (val === 0) return "rgba(0,0,0,0.035)";
    if (val <= 0.25) return `rgba(${r},${g},${b},0.2)`;
    if (val <= 0.5) return `rgba(${r},${g},${b},0.4)`;
    if (val <= 0.75) return `rgba(${r},${g},${b},0.65)`;
    return `rgba(${r},${g},${b},0.9)`;
  };

  const todayDow = new Date().getDay();
  const cells: { wk: number; dow: number; date: string; val: number }[] = [];

  for (let wk = 0; wk < weeks; wk++) {
    for (let dow = 0; dow < 7; dow++) {
      const daysBack = (weeks - 1 - wk) * 7 + (todayDow - dow);
      if (daysBack < 0) continue;
      const date = daysAgo(daysBack);
      cells.push({ wk, dow, date, val: getData(date) });
    }
  }

  const dayLabels = ["", "M", "", "W", "", "F", ""];

  return (
    <div style={{ overflowX: "auto", paddingBottom: 2 }}>
      <svg width={w} height={h} style={{ display: "block", minWidth: w }}>
        {dayLabels.map((d, i) => (
          <text
            key={i}
            x={1}
            y={i * (cellSize + gap) + cellSize}
            fontSize="8"
            fill="rgba(0,0,0,0.18)"
            fontFamily="inherit"
            dominantBaseline="middle"
          >
            {d}
          </text>
        ))}
        {cells.map((c, i) => (
          <rect
            key={i}
            x={c.wk * (cellSize + gap) + labelW}
            y={c.dow * (cellSize + gap)}
            width={cellSize}
            height={cellSize}
            rx={2.5}
            fill={heatColor(c.val)}
            style={{ transition: "fill 0.15s" }}
          >
            <title>
              {fmtDate(c.date)}: {Math.round(c.val * 100)}%
            </title>
          </rect>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2, marginTop: 2 }}>
        <span style={{ fontSize: 8, color: "rgba(0,0,0,0.18)" }}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: heatColor(v) }} />
        ))}
        <span style={{ fontSize: 8, color: "rgba(0,0,0,0.18)" }}>More</span>
      </div>
    </div>
  );
}
