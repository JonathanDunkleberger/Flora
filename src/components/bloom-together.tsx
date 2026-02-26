"use client";

import { useState } from "react";
import { Copy, Users, Share2, Sparkles, ArrowRight } from "lucide-react";
import type { ThemeColors } from "@/lib/constants";
import type { HabitWithStats } from "@/types";

interface BloomTogetherProps {
  habits: HabitWithStats[];
  getStage: (id: string) => number;
  isHappy: (id: string) => boolean;
  getStreak: (id: string) => number;
  getTotal: (id: string) => number;
  bloomCode: string;
  friends: { name: string; streak: number; lastActive: string }[];
  onInvite: () => void;
  th: ThemeColors;
}

export function BloomTogether({ habits, getStage, isHappy, getStreak, getTotal, bloomCode, friends, onInvite, th }: BloomTogetherProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(bloomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", margin: "0 auto 12px",
          background: "linear-gradient(135deg,#4caf50,#66FFAA)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Users size={24} color="white" />
        </div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, color: th.text, fontWeight: 500, marginBottom: 4 }}>Bloom Together</h2>
        <p style={{ fontSize: 12, color: th.textSub, lineHeight: 1.5 }}>Share your planet code with friends to connect your gardens</p>
      </div>

      {/* Planet Code Card */}
      <div style={{
        background: th.card, borderRadius: 16, padding: 20, border: `1px solid ${th.cardBorder}`,
        textAlign: "center", marginBottom: 16,
      }}>
        <div style={{ fontSize: 10, color: th.textSub, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Your Planet Code</div>
        <div style={{
          background: th.bg, borderRadius: 12, padding: "12px 16px", fontSize: 20, fontWeight: 700,
          letterSpacing: "3px", color: th.text, fontFamily: "monospace", marginBottom: 12,
        }}>{bloomCode}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={copyCode} style={{
            flex: 1, padding: "10px", borderRadius: 12, border: `1px solid ${th.cardBorder}`, background: th.bg,
            color: th.text, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <Copy size={12} />{copied ? "Copied!" : "Copy"}
          </button>
          <button onClick={onInvite} style={{
            flex: 1, padding: "10px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg,#4caf50,#2e7d32)", color: "white", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <Share2 size={12} />Invite
          </button>
        </div>
      </div>

      {/* Friends List */}
      {friends.length > 0 && (
        <div style={{
          background: th.card, borderRadius: 16, padding: 16, border: `1px solid ${th.cardBorder}`, marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: th.text, marginBottom: 12 }}>Friends ({friends.length})</div>
          {friends.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
              borderTop: i ? `1px solid ${th.cardBorder}` : "none",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: `linear-gradient(135deg,${["#4caf50", "#8B5CF6", "#FF9100"][i % 3]},${["#66FFAA", "#C084FC", "#FFB74D"][i % 3]})`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              }}>🌱</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: th.text }}>{f.name}</div>
                <div style={{ fontSize: 10, color: th.textSub }}>{f.lastActive}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4caf50" }}>🔥 {f.streak}d</div>
            </div>
          ))}
        </div>
      )}

      {/* How It Works */}
      <div style={{ background: th.card, borderRadius: 16, padding: 16, border: `1px solid ${th.cardBorder}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: th.text, marginBottom: 12 }}>How it works</div>
        {[
          { n: "1", t: "Share your planet code", d: "Give friends your unique code" },
          { n: "2", t: "They add your code", d: "Connect your gardens together" },
          { n: "3", t: "Grow together", d: "See each other's streaks & progress" },
          { n: "4", t: "Bloom together", d: "Unlock shared garden features" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 3 ? 10 : 0, alignItems: "flex-start" }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", fontSize: 10, fontWeight: 700, flexShrink: 0,
              background: `rgba(76,175,80,${0.1 + i * 0.05})`, color: "#4caf50",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: th.text }}>{s.t}</div>
              <div style={{ fontSize: 10, color: th.textSub }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
