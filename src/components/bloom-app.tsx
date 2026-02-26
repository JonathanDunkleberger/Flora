"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, X, Flame, ChevronLeft, ChevronRight, Coins, Sparkles, Home, BarChart3, Trophy } from "lucide-react";
import { Creature } from "@/components/creature";
import { TerrariumScene } from "@/components/terrarium-scene";
import { Heatmap } from "@/components/heatmap";
import { AddHabitModal } from "@/components/add-habit-modal";
import { Toast } from "@/components/toast";
import { getStage, getIcon, today, daysAgo } from "@/lib/utils";
import { MILESTONES, STAGE_LABELS, STAGE_THRESHOLDS } from "@/lib/constants";
import type { HabitWithStats, EarnedMilestones } from "@/types";

interface BloomAppProps {
  initialHabits: HabitWithStats[];
  initialCoins: number;
  initialEarned: EarnedMilestones;
}

export function BloomApp({ initialHabits, initialCoins, initialEarned }: BloomAppProps) {
  const router = useRouter();
  const [habits, setHabits] = useState<HabitWithStats[]>(initialHabits);
  const [coins, setCoins] = useState(initialCoins);
  const [earned, setEarned] = useState<EarnedMilestones>(initialEarned);
  const [view, setView] = useState<"home" | "habits" | "stats">("home");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ message: string; iconName: string; color: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const todayStr = today();

  // Build completions map from habits logs
  const completions: Record<string, boolean> = {};
  habits.forEach((h) => {
    h.logs.forEach((l) => {
      completions[`${h.id}:${l.log_date}`] = true;
    });
  });

  const isComplete = (hId: string, date: string) => !!completions[`${hId}:${date}`];

  const getStreak = useCallback(
    (hId: string) => {
      let s = 0;
      let d = 0;
      while (isComplete(hId, daysAgo(d))) {
        s++;
        d++;
      }
      return s;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [completions]
  );

  const getTotal = useCallback(
    (hId: string) => {
      const h = habits.find((x) => x.id === hId);
      return h?.logs.length ?? 0;
    },
    [habits]
  );

  const isHappy = useCallback(
    (hId: string) => isComplete(hId, todayStr),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [completions, todayStr]
  );

  const totalToday = habits.filter((h) => isHappy(h.id)).length;
  const overallStreak = habits.length > 0
    ? (() => {
        let s = 0;
        let d = 0;
        while (habits.every((h) => isComplete(h.id, daysAgo(d)))) {
          s++;
          d++;
        }
        return s;
      })()
    : 0;

  const checkMilestones = (habitId: string, streak: number) => {
    let nc = 0;
    const ne = { ...earned };
    for (const m of MILESTONES) {
      const key = `${habitId}:${m.days}`;
      if (streak >= m.days && !ne[key]) {
        ne[key] = true;
        nc += m.coins;
        setToast({ message: `${m.label} +${m.coins}`, iconName: m.iconName, color: "#f59e0b" });
      }
    }
    if (nc > 0) {
      setCoins((p) => p + nc);
      setEarned(ne);
      // Persist coins to server
      fetch("/api/coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coins: coins + nc, earned: ne }),
      }).catch(() => {});
    }
  };

  const toggleCompletion = async (hId: string) => {
    const wasComplete = isHappy(hId);

    // Optimistic update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== hId) return h;
        if (wasComplete) {
          return {
            ...h,
            completedToday: false,
            totalDays: h.totalDays - 1,
            logs: h.logs.filter((l) => l.log_date !== todayStr),
          };
        } else {
          return {
            ...h,
            completedToday: true,
            totalDays: h.totalDays + 1,
            logs: [...h.logs, { id: "temp", habit_id: hId, log_date: todayStr, value: 1, created_at: new Date().toISOString() }],
          };
        }
      })
    );

    try {
      const res = await fetch(`/api/habits/${hId}/log`, { method: "POST" });
      const data = await res.json();
      if (!wasComplete && data.action === "logged") {
        // Check milestones
        const streak = getStreak(hId) + 1; // +1 because state just updated
        setTimeout(() => checkMilestones(hId, streak), 100);
      }
    } catch {
      // Revert on error
      router.refresh();
    }
  };

  const addHabit = async (name: string, color: string, iconName: string) => {
    setShowAdd(false);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color, icon_name: iconName, category: "general" }),
      });
      if (res.ok) {
        const newHabit = await res.json();
        setHabits((prev) => [
          ...prev,
          {
            ...newHabit,
            currentStreak: 0,
            totalDays: 0,
            completedToday: false,
            stage: 0,
            logs: [],
          },
        ]);
      }
    } catch {
      router.refresh();
    }
  };

  const removeHabit = async (id: string) => {
    setHabits((p) => p.filter((h) => h.id !== id));
    if (detailId === id) setDetailId(null);
    try {
      await fetch(`/api/habits/${id}`, { method: "DELETE" });
    } catch {
      router.refresh();
    }
  };

  const detailHabit = habits.find((h) => h.id === detailId);
  const fs = mounted
    ? { opacity: 1, transform: "translateY(0)", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)" }
    : { opacity: 0, transform: "translateY(8px)" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif", color: "#1a1a2e" }}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 14px", paddingBottom: 96 }}>
        {/* Header */}
        <div style={{ ...fs, padding: "14px 2px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 500, letterSpacing: "-0.5px" }}>
            bloom<span style={{ color: "#6366f1" }}>.</span>
          </h1>
          <div className="coins-badge">
            <Coins size={12} />
            {coins}
          </div>
        </div>

        {/* Nav */}
        {!detailId && (
          <div style={{ ...fs, display: "flex", gap: 2, padding: "2px 0 12px" }}>
            <button className={`tab-btn ${view === "home" ? "active" : ""}`} onClick={() => setView("home")}>
              <Home size={13} />Home
            </button>
            <button className={`tab-btn ${view === "habits" ? "active" : ""}`} onClick={() => setView("habits")}>
              <BarChart3 size={13} />Habits
            </button>
            <button className={`tab-btn ${view === "stats" ? "active" : ""}`} onClick={() => setView("stats")}>
              <Trophy size={13} />Rewards
            </button>
          </div>
        )}

        {/* ─── DETAIL ─── */}
        {detailId && detailHabit && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <button
              onClick={() => setDetailId(null)}
              style={{
                display: "flex", alignItems: "center", gap: 3, background: "none", border: "none",
                cursor: "pointer", padding: "6px 0 14px", fontSize: 12, fontWeight: 600,
                color: "rgba(0,0,0,0.3)", fontFamily: "inherit",
              }}
            >
              <ChevronLeft size={15} />Back
            </button>

            <div className="card" style={{ padding: 22, textAlign: "center", marginBottom: 10 }}>
              <div style={{ display: "inline-block" }}>
                <Creature stage={getStage(getTotal(detailHabit.id))} color={detailHabit.color} size={88} happy={isHappy(detailHabit.id)} />
              </div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 19, fontWeight: 500, marginTop: 6 }}>{detailHabit.name}</h2>
              <p style={{ fontSize: 11, color: "rgba(0,0,0,0.3)", marginTop: 2 }}>
                {STAGE_LABELS[getStage(getTotal(detailHabit.id))]} creature
              </p>

              {/* Evolution progress */}
              {getStage(getTotal(detailHabit.id)) < 4 &&
                (() => {
                  const st = getStage(getTotal(detailHabit.id));
                  const tot = getTotal(detailHabit.id);
                  const nx = STAGE_THRESHOLDS[st + 1];
                  const pv = STAGE_THRESHOLDS[st];
                  const pct = Math.min(((tot - pv) / (nx - pv)) * 100, 100);
                  return (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(0,0,0,0.25)", marginBottom: 3 }}>
                        <span>{tot} days</span>
                        <span>{nx} to evolve</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: "rgba(0,0,0,0.04)", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 3,
                            width: `${pct}%`,
                            background: `linear-gradient(90deg,${detailHabit.color}88,${detailHabit.color})`,
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}

              {/* Stats */}
              <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 18 }}>
                {[
                  { l: "Streak", v: `${getStreak(detailHabit.id)}d` },
                  { l: "Total", v: getTotal(detailHabit.id) },
                  { l: "Stage", v: STAGE_LABELS[getStage(getTotal(detailHabit.id))] },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Fraunces',serif" }}>{s.v}</div>
                    <div className="label" style={{ marginTop: 1 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity heatmap */}
            <div className="card" style={{ padding: "14px 10px", marginBottom: 10 }}>
              <div className="label" style={{ padding: "0 4px 8px" }}>Activity</div>
              <Heatmap getData={(d) => (isComplete(detailHabit.id, d) ? 1 : 0)} color={detailHabit.color} weeks={20} />
            </div>

            {/* Milestones */}
            <div className="card" style={{ padding: 14, marginBottom: 10 }}>
              <div className="label" style={{ marginBottom: 8 }}>Milestones</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MILESTONES.map((m) => {
                  const e = !!earned[`${detailHabit.id}:${m.days}`];
                  const Ic = getIcon(m.iconName);
                  return (
                    <div
                      key={m.days}
                      style={{
                        display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 9,
                        fontSize: 11, fontWeight: 600,
                        background: e ? "rgba(245,158,11,0.05)" : "rgba(0,0,0,0.015)",
                        color: e ? "#d97706" : "rgba(0,0,0,0.12)",
                        border: `1px solid ${e ? "rgba(245,158,11,0.1)" : "rgba(0,0,0,0.03)"}`,
                      }}
                    >
                      <Ic size={12} />
                      {m.label}
                      <span style={{ opacity: 0.5 }}>+{m.coins}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeHabit(detailHabit.id)}
              style={{
                width: "100%", padding: 12, borderRadius: 11,
                border: "1px solid rgba(239,68,68,0.12)", background: "rgba(239,68,68,0.02)",
                color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Remove habit
            </button>
          </div>
        )}

        {/* ─── HOME ─── */}
        {view === "home" && !detailId && (
          <div style={fs}>
            {/* Terrarium */}
            <div className="card" style={{ overflow: "hidden", marginBottom: 10 }}>
              {habits.length === 0 ? (
                <div style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div
                    style={{
                      width: 56, height: 56, borderRadius: "50%", background: "rgba(99,102,241,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
                    }}
                  >
                    <Sparkles size={22} color="#6366f1" />
                  </div>
                  <p style={{ fontFamily: "'Fraunces',serif", fontSize: 17, marginBottom: 3 }}>your terrarium awaits</p>
                  <p style={{ fontSize: 12, color: "rgba(0,0,0,0.3)" }}>add a habit and watch your creature hatch</p>
                </div>
              ) : (
                <div>
                  <div style={{ padding: "12px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="label">Terrarium</span>
                    <span style={{ fontSize: 10, color: "rgba(0,0,0,0.15)" }}>
                      {habits.length} creature{habits.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div style={{ padding: "6px 10px 4px" }}>
                    <TerrariumScene habits={habits} completions={completions} todayStr={todayStr} />
                  </div>
                </div>
              )}
            </div>

            {/* Today's habits */}
            {habits.length > 0 && (
              <div className="card" style={{ padding: "10px 4px" }}>
                <div style={{ padding: "4px 14px 6px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="label">Today</span>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 700,
                      color: totalToday === habits.length ? "#10b981" : "rgba(0,0,0,0.15)",
                    }}
                  >
                    {totalToday === habits.length && habits.length > 0 ? "All done" : `${totalToday} / ${habits.length}`}
                  </span>
                </div>
                {habits.map((h) => {
                  const done = isHappy(h.id);
                  const streak = getStreak(h.id);
                  const Icon = getIcon(h.icon_name);
                  return (
                    <div key={h.id} className="habit-row">
                      <div
                        className={`check-circle ${done ? "done" : ""}`}
                        style={{ background: done ? h.color : "transparent" }}
                        onClick={(e) => { e.stopPropagation(); toggleCompletion(h.id); }}
                      >
                        <Check size={13} color="white" strokeWidth={3} />
                      </div>
                      <div
                        style={{
                          width: 26, height: 26, borderRadius: 7, background: `${h.color}0d`,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}
                        onClick={() => setDetailId(h.id)}
                      >
                        <Icon size={14} color={h.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }} onClick={() => setDetailId(h.id)}>
                        <div
                          style={{
                            fontSize: 13.5, fontWeight: 500,
                            textDecoration: done ? "line-through" : "none",
                            color: done ? "rgba(0,0,0,0.2)" : "#1a1a2e",
                            transition: "all 0.15s",
                          }}
                        >
                          {h.name}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }} onClick={() => setDetailId(h.id)}>
                        <div style={{ width: 22 }}>
                          <Creature stage={getStage(getTotal(h.id))} color={h.color} size={22} happy={done} />
                        </div>
                        {streak > 0 && (
                          <span
                            className="streak-pill"
                            style={{
                              background: streak >= 7 ? "rgba(245,158,11,0.07)" : "rgba(0,0,0,0.025)",
                              color: streak >= 7 ? "#d97706" : "rgba(0,0,0,0.2)",
                            }}
                          >
                            <Flame size={9} />{streak}d
                          </span>
                        )}
                      </div>
                      <button className="delete-btn" onClick={(e) => { e.stopPropagation(); removeHabit(h.id); }}>
                        <X size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* All activity heatmap */}
            {habits.length > 0 && (
              <div className="card" style={{ padding: "12px 10px", marginTop: 10 }}>
                <div className="label" style={{ padding: "0 4px 8px" }}>All activity</div>
                <Heatmap
                  getData={(d) => {
                    if (habits.length === 0) return 0;
                    return habits.filter((h) => isComplete(h.id, d)).length / habits.length;
                  }}
                  color="#6366f1"
                />
              </div>
            )}
          </div>
        )}

        {/* ─── HABITS ─── */}
        {view === "habits" && !detailId && (
          <div style={fs}>
            {habits.length === 0 ? (
              <div className="card" style={{ padding: "44px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: "rgba(0,0,0,0.25)" }}>No habits yet. Tap + to start growing.</p>
              </div>
            ) : (
              habits.map((h) => {
                const stage = getStage(getTotal(h.id));
                const streak = getStreak(h.id);
                const total = getTotal(h.id);
                return (
                  <div key={h.id} className="card" style={{ padding: 14, marginBottom: 8, cursor: "pointer" }} onClick={() => setDetailId(h.id)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <Creature stage={stage} color={h.color} size={40} happy={isHappy(h.id)} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{h.name}</span>
                          <ChevronRight size={15} color="rgba(0,0,0,0.12)" />
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(0,0,0,0.25)", marginTop: 1, display: "flex", gap: 8 }}>
                          <span>{STAGE_LABELS[stage]}</span>
                          <span>{total} days</span>
                          {streak > 0 && <span style={{ color: "#d97706" }}>{streak}d streak</span>}
                        </div>
                      </div>
                    </div>
                    <Heatmap getData={(d) => (isComplete(h.id, d) ? 1 : 0)} color={h.color} weeks={12} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── REWARDS ─── */}
        {view === "stats" && !detailId && (
          <div style={fs}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 10 }}>
              {[
                { l: "Coins", v: coins, Icon: Coins, c: "#f59e0b" },
                { l: "Streak", v: `${overallStreak}d`, Icon: Flame, c: "#ef4444" },
                { l: "Creatures", v: habits.length, Icon: Sparkles, c: "#6366f1" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: "14px 8px", textAlign: "center" }}>
                  <s.Icon size={16} color={s.c} style={{ margin: "0 auto 5px", display: "block" }} />
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces',serif" }}>{s.v}</div>
                  <div className="label" style={{ marginTop: 1 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div className="label" style={{ marginBottom: 10 }}>All milestones</div>
              {habits.length === 0 ? (
                <p style={{ fontSize: 12, color: "rgba(0,0,0,0.2)", textAlign: "center", padding: 16 }}>
                  Add habits to start earning
                </p>
              ) : (
                habits.map((h) => {
                  const er = MILESTONES.filter((m) => !!earned[`${h.id}:${m.days}`]);
                  const Icon = getIcon(h.icon_name);
                  return (
                    <div key={h.id} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                        <div
                          style={{
                            width: 18, height: 18, borderRadius: 5, background: `${h.color}0d`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <Icon size={10} color={h.color} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{h.name}</span>
                        <span style={{ fontSize: 10, color: "rgba(0,0,0,0.15)" }}>
                          {er.length}/{MILESTONES.length}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {MILESTONES.map((m) => {
                          const ie = !!earned[`${h.id}:${m.days}`];
                          const MIcon = getIcon(m.iconName);
                          return (
                            <div
                              key={m.days}
                              title={`${m.label} (${m.days}d)`}
                              style={{
                                width: 26, height: 26, borderRadius: 7,
                                background: ie ? "rgba(245,158,11,0.08)" : "rgba(0,0,0,0.015)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                border: `1px solid ${ie ? "rgba(245,158,11,0.12)" : "rgba(0,0,0,0.03)"}`,
                              }}
                            >
                              <MIcon size={11} color={ie ? "#d97706" : "rgba(0,0,0,0.08)"} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      {!detailId && (
        <div style={{ position: "fixed", bottom: 22, right: 22, zIndex: 50 }}>
          <button className="fab" onClick={() => setShowAdd(true)}>
            <Plus size={20} />
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <AddHabitModal
          existingHabits={habits}
          onAdd={addHabit}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
