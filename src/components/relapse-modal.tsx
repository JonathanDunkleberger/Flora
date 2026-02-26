"use client";

import { Creature } from "@/components/creature";
import { RefreshCw } from "lucide-react";
import { fmtDuration } from "@/lib/utils";
import type { ThemeColors } from "@/lib/constants";

interface RelapseModalProps {
  habit: { name: string; color: string; id: string };
  cleanDays: number;
  onConfirm: () => void;
  onClose: () => void;
  th: ThemeColors;
}

export function RelapseModal({ habit, cleanDays, onConfirm, onClose, th }: RelapseModalProps) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
      animation: "fi .2s ease", padding: 20,
    }}>
      <div style={{
        background: th.modalBg, borderRadius: 22, padding: "28px 24px", maxWidth: 340, width: "100%",
        textAlign: "center", animation: "su .35s cubic-bezier(.16,1,.3,1)",
        border: `1px solid ${th.cardBorder}`,
      }}>
        <Creature stage={Math.min(4, Math.floor(cleanDays / 5))} color={habit.color} happy={false} size={64} />
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 500, color: th.text, margin: "12px 0 6px" }}>
          Reset {habit.name}?
        </h2>
        <p style={{ fontSize: 13, color: th.textSub, lineHeight: 1.6, marginBottom: 4 }}>
          {cleanDays > 0 ? (
            <>
              You were clean for <span style={{ color: habit.color, fontWeight: 700 }}>{fmtDuration(cleanDays)}</span>.
              {" "}That&apos;s {cleanDays} day{cleanDays !== 1 ? "s" : ""} your body was healing. Every single one counted.
            </>
          ) : (
            "Starting fresh. That takes courage."
          )}
        </p>
        <p style={{ fontSize: 11, color: th.textMuted, marginBottom: 18 }}>
          Your creature keeps its growth. Only the counter resets.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: 12, borderRadius: 12, border: `1px solid ${th.cardBorder}`,
              background: "transparent", color: th.textSub, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Never mind
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: 12, borderRadius: 12, border: "none",
              background: habit.color, color: "white", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Reset counter
          </button>
        </div>
      </div>
    </div>
  );
}
