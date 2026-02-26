"use client";

import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import type { ThemeColors } from "@/lib/constants";

interface ReasonEditorProps {
  value?: string;
  onSave: (reason: string) => void;
  color: string;
  th: ThemeColors;
}

export function ReasonEditor({ value, onSave, color, th }: ReasonEditorProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || "");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  if (!editing && !value) {
    return (
      <button
        onClick={() => setEditing(true)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 12,
          border: `1.5px dashed ${th.cardBorder}`,
          background: "none", color: th.textMuted, fontSize: 12, cursor: "pointer",
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
        }}
      >
        <Heart size={12} />Add your reason for quitting
      </button>
    );
  }

  if (!editing) {
    return (
      <div
        onClick={() => { setEditing(true); setText(value || ""); }}
        style={{
          padding: "10px 14px", borderRadius: 12, background: `${color}08`,
          border: `1px solid ${color}15`, cursor: "pointer", fontSize: 12,
          color: th.textSub, lineHeight: 1.6, display: "flex", gap: 8, alignItems: "flex-start",
        }}
      >
        <Heart size={13} style={{ color, flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontStyle: "italic" }}>{value}</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <input
        ref={ref} className="inp" value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Why are you doing this?" style={{ fontSize: 12, background: th.inputBg, borderColor: th.inputBorder, color: th.text }}
        onKeyDown={(e) => { if (e.key === "Enter") { onSave(text.trim()); setEditing(false); } }}
      />
      <button
        onClick={() => { onSave(text.trim()); setEditing(false); }}
        className="btn-s"
        style={{ background: color, color: "white", whiteSpace: "nowrap" }}
      >
        Save
      </button>
    </div>
  );
}
