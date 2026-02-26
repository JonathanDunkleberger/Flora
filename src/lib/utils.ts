import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Brain, Dumbbell, BookOpen, Droplets, Moon, Footprints, Utensils,
  Palette, Target, Smartphone, Wine, Cigarette, Coffee, Eye, Clock,
  Heart, Zap, Star, Flame, TrendingUp, Trophy, Sparkles,
  Download, RefreshCw, Share2, Award, Users, Wind, DollarSign,
  MessageCircle, AlertTriangle, Shield,
  type LucideIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ICON_MAP: Record<string, LucideIcon> = {
  Brain, Dumbbell, BookOpen, Droplets, Moon, Footprints, Utensils,
  Palette, Target, Smartphone, Wine, Cigarette, Coffee, Eye, Clock,
  Heart, Zap, Star, Flame, TrendingUp, Trophy, Sparkles,
  Download, RefreshCw, Share2, Award, Users, Wind, DollarSign,
  MessageCircle, AlertTriangle, Shield,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] || Target;
}

export function getStage(totalDays: number): number {
  if (totalDays >= 25) return 4;
  if (totalDays >= 12) return 3;
  if (totalDays >= 5) return 2;
  if (totalDays >= 1) return 1;
  return 0;
}

export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function fmtDate(s: string): string {
  return new Date(s + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Seeded pseudo-random for deterministic positions
export function seed(s: number): () => number {
  let h = s;
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

// Lighten a hex color
export function lightenColor(hex: string, amt: number): string {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return hex;
  const r = Math.min(255, parseInt(match[1], 16) + amt);
  const g = Math.min(255, parseInt(match[2], 16) + amt);
  const b = Math.min(255, parseInt(match[3], 16) + amt);
  return `rgb(${r},${g},${b})`;
}

export function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + "T12:00:00");
  const d2 = new Date(b + "T12:00:00");
  return Math.max(0, Math.floor((d2.getTime() - d1.getTime()) / 86400000));
}

export function fmtDuration(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    const r = days % 7;
    return r > 0 ? `${w}w ${r}d` : `${w} week${w > 1 ? "s" : ""}`;
  }
  const m = Math.floor(days / 30);
  const r = days % 30;
  return r > 0 ? `${m}mo ${r}d` : `${m} month${m > 1 ? "s" : ""}`;
}

export function fmtMoney(n: number): string {
  return n >= 100 ? `$${Math.floor(n)}` : `$${n.toFixed(2)}`;
}
