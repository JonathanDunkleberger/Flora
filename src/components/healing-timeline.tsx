"use client";

import { Check } from "lucide-react";
import { HEAL, getHealKey } from "@/lib/constants";
import type { ThemeColors } from "@/lib/constants";

interface HealingTimelineProps {
  habit: { name: string; color: string };
  cleanDays: number;
  th: ThemeColors;
}

export function HealingTimeline({ habit, cleanDays, th }: HealingTimelineProps) {
  const key = getHealKey(habit.name);
  const timeline = HEAL[key] || HEAL.default;

  return (
    <div style={{ padding: "2px 0" }}>
      <div style={{ position: "relative", paddingLeft: 20 }}>
        <div style={{
          position: "absolute", left: 6, top: 4, bottom: 4, width: 1.5,
          background: th.progressBg, borderRadius: 1,
        }} />
        {timeline.map((step, i) => {
          const reached = cleanDays >= step.d;
          const isNext = !reached && (i === 0 || cleanDays >= timeline[i - 1].d);
          const daysUntil = Math.max(0, Math.ceil(step.d - cleanDays));
          return (
            <div key={i} style={{
              position: "relative", paddingBottom: i < timeline.length - 1 ? 14 : 0,
              opacity: reached ? 1 : isNext ? 0.7 : 0.3, transition: "opacity 0.3s",
            }}>
              <div style={{
                position: "absolute", left: -14.5, top: 4, width: 9, height: 9, borderRadius: "50%",
                background: reached ? habit.color : isNext ? `${habit.color}40` : th.progressBg,
                border: isNext ? `2px solid ${habit.color}` : "none",
                boxShadow: reached ? `0 0 8px ${habit.color}40` : "none",
                transition: "all 0.3s",
              }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: reached ? th.text : th.textSub }}>
                {step.t}
                {reached && <Check size={9} color={habit.color} style={{ marginLeft: 6, verticalAlign: "middle" }} />}
                {isNext && daysUntil > 0 && (
                  <span style={{ marginLeft: 6, fontSize: 9, color: th.textMuted, fontWeight: 500 }}>
                    {daysUntil === 1 ? "tomorrow" : `in ${daysUntil}d`}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: th.textSub, marginTop: 2, lineHeight: 1.5 }}>{step.desc}</div>
              <div style={{ fontSize: 9, color: th.textMuted, marginTop: 2 }}>
                {step.d < 1 ? `${Math.round(step.d * 24)}h` : step.d >= 365 ? `${Math.round(step.d / 365)} year` : `Day ${step.d}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
