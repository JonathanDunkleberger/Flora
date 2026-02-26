"use client";

import { useMemo } from "react";
import { Check, Sparkles, Orbit, Waves, Rocket } from "lucide-react";
import { seed, daysAgo } from "@/lib/utils";
import { getSynergyName } from "@/lib/constants";
import type { ThemeColors } from "@/lib/constants";
import type { HabitWithStats } from "@/types";

interface ConstellationProps {
  habits: HabitWithStats[];
  isDone: (id: string, date: string) => boolean;
  getStreak: (id: string) => number;
  getTotal: (id: string) => number;
  th: ThemeColors;
}

interface Synergy {
  a: number;
  b: number;
  strength: number;
  coCount: number;
  name: string | null;
  label: string;
}

export function Constellation({ habits, isDone, getStreak, getTotal, th }: ConstellationProps) {
  const sr = seed;

  const synergies = useMemo<Synergy[]>(() => {
    const result: Synergy[] = [];
    if (habits.length < 2) return result;
    const last30 = Array.from({ length: 30 }, (_, i) => daysAgo(i));
    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const a = habits[i], b = habits[j];
        let coCount = 0;
        last30.forEach((d) => { if (isDone(a.id, d) && isDone(b.id, d)) coCount++; });
        if (coCount >= 3) {
          const name = getSynergyName(a.name, b.name);
          result.push({
            a: i, b: j, strength: Math.min(coCount / 20, 1), coCount, name,
            label: name || `${a.name.slice(0, 6)}×${b.name.slice(0, 6)}`,
          });
        }
      }
    }
    return result;
  }, [habits, isDone]);

  const cx = 200, cy = 175, radius = 110;
  const positions = habits.map((_, i) => {
    const angle = (i / Math.max(habits.length, 1)) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });

  return (
    <div style={{ animation: "fadeUp .28s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 19, fontWeight: 500, color: th.text }}>Habit Constellation</h2>
        <p style={{ fontSize: 11, color: th.textSub, marginTop: 2 }}>Habits done on the same days form glowing connections</p>
      </div>

      {habits.length < 2 ? (
        <div className="cd" style={{ padding: "40px 20px", textAlign: "center", background: th.card }}>
          <Sparkles size={24} style={{ color: th.textFaint, marginBottom: 8 }} />
          <p style={{ fontSize: 13, color: th.textMuted }}>Add 2+ habits to see your constellation form</p>
        </div>
      ) : (
        <div className="cd" style={{ overflow: "hidden", background: th.card }}>
          <svg viewBox="0 0 400 350" style={{ width: "100%", display: "block" }}>
            <defs>
              <filter id="cgl"><feGaussianBlur stdDeviation="2.5" /></filter>
              <radialGradient id="cbg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.04" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="400" height="350" fill="url(#cbg)" />
            {/* Stars */}
            {Array.from({ length: 40 }).map((_, i) => {
              const r = sr(i * 31 + 7);
              return <circle key={i} cx={r() * 400} cy={r() * 350} r={0.3 + r() * 0.7} fill={th.text} opacity={0.06 + r() * 0.08} />;
            })}
            {/* Synergy lines */}
            {synergies.map((syn, i) => {
              const from = positions[syn.a], to = positions[syn.b];
              if (!from || !to) return null;
              const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
              return (
                <g key={`syn${i}`}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="#8B5CF6" strokeWidth={2 + syn.strength * 3} opacity={syn.strength * 0.15} filter="url(#cgl)" />
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="#8B5CF6" strokeWidth={0.8 + syn.strength * 1.2} opacity={syn.strength * 0.5} strokeLinecap="round">
                    <animate attributeName="opacity" values={`${syn.strength * 0.3};${syn.strength * 0.6};${syn.strength * 0.3}`} dur={`${3 + i}s`} repeatCount="indefinite" />
                  </line>
                  {syn.strength >= 0.3 && (
                    <text x={mx} y={my - 7} textAnchor="middle" fontSize="7" fill="#8B5CF6" opacity={syn.strength * 0.7} fontWeight="600">{syn.label}</text>
                  )}
                  <circle r="1.5" fill="#8B5CF6" opacity={syn.strength * 0.6}>
                    <animateMotion dur={`${5 + i * 2}s`} repeatCount="indefinite" path={`M${from.x},${from.y} L${to.x},${to.y}`} />
                  </circle>
                </g>
              );
            })}
            {/* Habit nodes */}
            {habits.map((h, i) => {
              const pos = positions[i];
              if (!pos) return null;
              const streak = getStreak(h.id);
              const nodeR = 7 + Math.min(streak, 30) * 0.3;
              return (
                <g key={i}>
                  <circle cx={pos.x} cy={pos.y} r={nodeR + 6} fill={h.color} opacity="0.06" />
                  <circle cx={pos.x} cy={pos.y} r={nodeR + 2} fill="none" stroke={h.color} strokeWidth="0.5" opacity="0.25" />
                  <circle cx={pos.x} cy={pos.y} r={nodeR} fill={h.color} opacity="0.85" />
                  <circle cx={pos.x - nodeR * 0.3} cy={pos.y - nodeR * 0.3} r={nodeR * 0.2} fill="white" opacity="0.25" />
                  <text x={pos.x} y={pos.y + nodeR + 13} textAnchor="middle" fontSize="9" fill={th.text} opacity="0.6" fontWeight="600">{h.name}</text>
                  <text x={pos.x} y={pos.y + nodeR + 23} textAnchor="middle" fontSize="7" fill={th.text} opacity="0.25">{streak}d</text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Synergy list */}
      {synergies.length > 0 && (
        <div className="cd" style={{ padding: 14, marginTop: 10, background: th.card }}>
          <div className="lb" style={{ marginBottom: 8 }}>Active Synergies</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[...synergies].sort((a, b) => b.strength - a.strength).map((syn, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: th.hoverBg }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B5CF6", opacity: syn.strength }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: th.text }}>{syn.label}</div>
                  <div style={{ fontSize: 10, color: th.textSub }}>{habits[syn.a]?.name} + {habits[syn.b]?.name}</div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#8B5CF6", opacity: 0.7 }}>{syn.coCount}d together</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unlock progress */}
      <div className="cd" style={{ padding: 14, marginTop: 10, background: th.card }}>
        <div className="lb" style={{ marginBottom: 8 }}>Constellation Unlocks</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { n: 1, reward: "Faint orbital ring", Icon: Orbit },
            { n: 3, reward: "Planet rainbow shimmer", Icon: Sparkles },
            { n: 5, reward: "Northern lights", Icon: Waves },
            { n: 8, reward: "Comet visitors", Icon: Rocket },
          ].map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: synergies.length >= u.n ? 1 : 0.35 }}>
              <u.Icon size={16} color={synergies.length >= u.n ? "#8B5CF6" : th.textMuted} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: synergies.length >= u.n ? "#8B5CF6" : th.textMuted }}>{u.n} synergies</div>
                <div style={{ fontSize: 10, color: th.textSub }}>{u.reward}</div>
              </div>
              {synergies.length >= u.n && <Check size={14} color="#8B5CF6" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
