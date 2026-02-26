import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlantStage(streakDays: number): number {
  if (streakDays === 0) return 0;
  if (streakDays <= 2) return 1;
  if (streakDays <= 6) return 2;
  if (streakDays <= 13) return 3;
  if (streakDays <= 29) return 4;
  if (streakDays <= 59) return 5;
  if (streakDays <= 89) return 6;
  return 7;
}

export const PLANT_STAGE_NAMES = [
  "Empty Plot", "Seed", "Sprout", "Seedling",
  "Growing", "Thriving", "Mature", "Blooming",
];

export const MILESTONE_DAYS = [3, 7, 14, 30, 60, 90, 180, 365];

// Isometric coordinate conversion
export function isoToScreen(col: number, row: number, tileW: number, tileH: number) {
  return {
    x: (col - row) * (tileW / 2),
    y: (col + row) * (tileH / 2),
  };
}
