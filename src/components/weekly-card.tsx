"use client";

import { Share2 } from "lucide-react";
import { seed, daysAgo } from "@/lib/utils";
import type { ThemeColors, SeasonKey } from "@/lib/constants";
import type { HabitWithStats } from "@/types";

interface WeeklyCardProps {
  habits: HabitWithStats[];
  isDone: (id: string, date: string) => boolean;
  getStreak: (id: string) => number;
  getTotal: (id: string) => number;
  getStage: (id: string) => number;
  todayPct: number;
  coins: number;
  season: SeasonKey;
  th: ThemeColors;
  onClose: () => void;
}

export function WeeklyCard({ habits, isDone, getStreak, getTotal, getStage, todayPct, coins, season, th, onClose }: WeeklyCardProps) {
  const sr = seed;
  const weekDays = Array.from({ length: 7 }, (_, i) => daysAgo(6 - i));
  const weekPcts = weekDays.map((d) => habits.length ? habits.filter((h) => isDone(h.id, d)).length / habits.length : 0);
  const avgPct = weekPcts.reduce((a, b) => a + b, 0) / 7;
  const perfectDays = weekPcts.filter((p) => p >= 1).length;
  const topHabit = habits.length
    ? habits.reduce<{ h: HabitWithStats | null; s: number }>((best, h) => {
        const s = getStreak(h.id);
        return s > (best.s || 0) ? { h, s } : best;
      }, { h: null, s: 0 }).h
    : null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, animation: "fi .2s ease", padding: 16,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 340, animation: "su .35s cubic-bezier(.16,1,.3,1)" }}>
        {/* The shareable card */}
        <div style={{
          background: "linear-gradient(135deg,#0f1628 0%,#1a1040 50%,#0f1628 100%)", borderRadius: 22, padding: 24,
          position: "relative", overflow: "hidden", border: "1px solid rgba(139,92,246,0.15)",
        }}>
          {/* Background stars */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {Array.from({ length: 30 }).map((_, i) => {
              const r = sr(i * 41 + 13);
              return <circle key={i} cx={`${r() * 100}%`} cy={`${r() * 100}%`} r={0.5 + r() * 1} fill="white" opacity={0.1 + r() * 0.15} />;
            })}
          </svg>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "white", fontWeight: 500 }}>
                tend<span style={{ color: "#4caf50" }}>.</span>{" "}
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>this week</span>
              </h3>
            </div>

            {/* Week bar chart */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16, alignItems: "flex-end", height: 60 }}>
              {weekPcts.map((pct, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{
                    width: 28, height: Math.max(4, pct * 50), borderRadius: 6,
                    background: pct >= 1 ? "linear-gradient(180deg,#66FFAA,#4caf50)" : pct > 0 ? `rgba(76,175,80,${0.3 + pct * 0.5})` : "rgba(255,255,255,0.06)",
                    transition: "height .3s",
                  }} />
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                    {new Date(weekDays[i] + "T12:00:00").toLocaleDateString("en-US", { weekday: "narrow" })}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 16 }}>
              {[
                { v: `${Math.round(avgPct * 100)}%`, l: "Avg completion" },
                { v: perfectDays, l: "Perfect days" },
                { v: habits.length, l: "Habits tracked" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Fraunces',serif", color: i === 0 && avgPct >= 0.7 ? "#66FFAA" : "white" }}>{s.v}</div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Top habit */}
            {topHabit && (
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: topHabit.color }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "white" }}>{topHabit.name}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>longest streak this week</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: topHabit.color }}>{getStreak(topHabit.id)}d</div>
              </div>
            )}

            <div style={{ textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.15)", marginTop: 8 }}>tend. — quit bad habits. grow new ones</div>
          </div>
        </div>

        {/* Actions below card */}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", borderRadius: 12, border: `1px solid ${th.cardBorder}`,
            background: th.card, color: th.text, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Close</button>
          <button onClick={() => { /* screenshot hint */ }} style={{
            flex: 1, padding: "10px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg,#8B5CF6,#6d3fc0)", color: "white", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <Share2 size={12} />Share
          </button>
        </div>
      </div>
    </div>
  );
}
