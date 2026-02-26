"use client";

import { useEffect } from "react";
import { getIcon } from "@/lib/utils";

interface ToastProps {
  message: string;
  iconName: string;
  color: string;
  onDone: () => void;
}

export function Toast({ message, iconName, color, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  const Icon = getIcon(iconName);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        background: "white",
        borderRadius: 14,
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.08)",
        animation: "toastIn 0.4s cubic-bezier(0.16,1,0.3,1)",
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      <Icon size={16} color={color} />
      {message}
    </div>
  );
}
