"use client";

import { ExternalLink } from "lucide-react";

export function SettingsClient() {
  async function handleManageSubscription() {
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Handle error silently
    }
  }

  return (
    <button
      onClick={handleManageSubscription}
      className="flex items-center gap-1 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-200"
    >
      Manage <ExternalLink className="w-3 h-3" />
    </button>
  );
}
