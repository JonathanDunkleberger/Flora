"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { PRESETS, PRESET_CATEGORIES, HABIT_COLORS } from "@/lib/constants";
import { getIcon } from "@/lib/utils";
import type { Habit } from "@/types";

interface AddHabitModalProps {
  existingHabits: Habit[];
  onAdd: (name: string, color: string, iconName: string) => void;
  onClose: () => void;
}

export function AddHabitModal({ existingHabits, onAdd, onClose }: AddHabitModalProps) {
  const [customName, setCustomName] = useState("");
  const [customColor, setCustomColor] = useState("#6366f1");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 120);
  }, []);

  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 19, fontWeight: 500 }}>Add a habit</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "flex", color: "rgba(0,0,0,0.2)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Preset categories */}
        {PRESET_CATEGORIES.map((group) => {
          const items = PRESETS.filter(
            (p) => p.cat === group.cat && !existingHabits.find((h) => h.name === p.name)
          );
          if (items.length === 0) return null;
          return (
            <div key={group.cat} style={{ marginBottom: 14 }}>
              <div className="label" style={{ marginBottom: 6 }}>{group.label}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {items.map((p) => {
                  const Icon = getIcon(p.iconName);
                  return (
                    <button
                      key={p.name}
                      className="preset-btn"
                      onClick={() => onAdd(p.name, p.color, p.iconName)}
                    >
                      <Icon size={14} color={p.color} />
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Custom */}
        <div style={{ marginTop: 6 }}>
          <div className="label" style={{ marginBottom: 6 }}>Custom</div>
          <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
            {HABIT_COLORS.map((c) => (
              <div
                key={c}
                className={`color-dot ${customColor === c ? "selected" : ""}`}
                style={{ background: c }}
                onClick={() => setCustomColor(c)}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            <input
              ref={inputRef}
              className="input"
              placeholder="Habit name..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customName.trim()) {
                  onAdd(customName.trim(), customColor, "Target");
                }
              }}
            />
            <button
              onClick={() => {
                if (customName.trim()) onAdd(customName.trim(), customColor, "Target");
              }}
              style={{
                padding: "0 18px",
                borderRadius: 11,
                background: customName.trim() ? "#1a1a2e" : "rgba(0,0,0,0.03)",
                color: customName.trim() ? "white" : "rgba(0,0,0,0.15)",
                border: "none",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: customName.trim() ? "pointer" : "default",
                transition: "all 0.12s",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
