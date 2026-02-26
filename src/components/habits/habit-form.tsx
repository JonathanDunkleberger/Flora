"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HABIT_CATEGORIES, HABIT_GROUPS, HABIT_ICONS, PLANT_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface HabitFormProps {
  isPro: boolean;
}

export function HabitForm({ isPro }: HabitFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"build" | "quit">("build");
  const [category, setCategory] = useState("other");
  const [icon, setIcon] = useState("🌱");
  const [plantType, setPlantType] = useState("fern");
  const [habitGroup, setHabitGroup] = useState("none");
  const [targetFrequency, setTargetFrequency] = useState("daily");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          type,
          category,
          icon,
          plant_type: plantType,
          habit_group: habitGroup === "none" ? null : habitGroup,
          target_frequency: targetFrequency,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create habit");
      }

      router.push("/garden");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-2xl">
          {error}
        </div>
      )}

      {/* Habit Type */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setType("build")}
            className={cn("p-3 rounded-2xl border text-sm font-medium transition-all",
              type === "build" ? "bg-bloom-50 border-bloom-300 text-bloom-700" : "bg-white border-slate-200 text-slate-600"
            )}>
            🌱 Build
            <span className="block text-xs text-slate-400 mt-0.5">Start a good habit</span>
          </button>
          <button type="button" onClick={() => setType("quit")}
            className={cn("p-3 rounded-2xl border text-sm font-medium transition-all",
              type === "quit" ? "bg-purple-50 border-purple-300 text-purple-700" : "bg-white border-slate-200 text-slate-600"
            )}>
            🚫 Quit
            <span className="block text-xs text-slate-400 mt-0.5">Break a bad habit</span>
          </button>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Habit Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={type === "build" ? "e.g., Morning meditation" : "e.g., Quit smoking"}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-bloom-300 focus:border-bloom-300"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why is this habit important to you?"
          rows={2}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-bloom-300 resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {HABIT_CATEGORIES.map((cat) => (
            <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
              className={cn("flex items-center gap-2 p-2.5 rounded-xl border text-sm transition-all",
                category === cat.value ? "bg-bloom-50 border-bloom-300 text-bloom-700" : "bg-white border-slate-200 text-slate-600"
              )}>
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Icon */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Icon</label>
        <div className="flex flex-wrap gap-2">
          {HABIT_ICONS.map((ic) => (
            <button key={ic} type="button" onClick={() => setIcon(ic)}
              className={cn("w-10 h-10 rounded-xl border text-lg flex items-center justify-center transition-all",
                icon === ic ? "bg-bloom-50 border-bloom-300 scale-110" : "bg-white border-slate-200"
              )}>
              {ic}
            </button>
          ))}
        </div>
      </div>

      {/* Plant Type */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Plant Type</label>
        <div className="grid grid-cols-2 gap-2">
          {PLANT_TYPES.map((plant) => (
            <button key={plant.value} type="button"
              onClick={() => { if (!plant.pro || isPro) setPlantType(plant.value); }}
              disabled={plant.pro && !isPro}
              className={cn("p-3 rounded-2xl border text-sm transition-all relative",
                plantType === plant.value ? "bg-bloom-50 border-bloom-300 text-bloom-700" : "bg-white border-slate-200 text-slate-600",
                plant.pro && !isPro && "opacity-50 cursor-not-allowed"
              )}>
              <span className="font-medium">{plant.label}</span>
              <span className="block text-xs text-slate-400">{plant.description}</span>
              {plant.pro && !isPro && (
                <Lock className="w-3 h-3 absolute top-2 right-2 text-slate-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Habit Group (Lite Stacks) */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Group (Stack)</label>
        <div className="grid grid-cols-3 gap-2">
          {HABIT_GROUPS.map((grp) => (
            <button key={grp.value} type="button" onClick={() => setHabitGroup(grp.value)}
              className={cn("p-2 rounded-xl border text-xs font-medium transition-all",
                habitGroup === grp.value ? "bg-bloom-50 border-bloom-300 text-bloom-700" : "bg-white border-slate-200 text-slate-600"
              )}>
              {grp.icon} {grp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Frequency</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "daily", label: "Daily" },
            { value: "weekdays", label: "Weekdays" },
            { value: "custom", label: "Custom" },
          ].map((freq) => (
            <button key={freq.value} type="button" onClick={() => setTargetFrequency(freq.value)}
              className={cn("p-2.5 rounded-xl border text-sm font-medium transition-all",
                targetFrequency === freq.value ? "bg-bloom-50 border-bloom-300 text-bloom-700" : "bg-white border-slate-200 text-slate-600"
              )}>
              {freq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full py-3.5 bg-bloom-500 hover:bg-bloom-600 disabled:bg-slate-300 text-white font-semibold rounded-2xl shadow-md shadow-bloom-500/25 transition-colors tap-bounce"
      >
        {loading ? "Planting..." : "🌱 Plant This Habit"}
      </button>
    </form>
  );
}
