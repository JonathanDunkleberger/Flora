import { format, subDays, parseISO, differenceInDays } from "date-fns";

export interface LogEntry {
  date: string;
  completed: boolean;
}

export function computeStreak(logs: LogEntry[]): {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  completedToday: boolean;
} {
  if (!logs || logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalDays: 0, completedToday: false };
  }

  const completed = new Set(
    logs.filter((l) => l.completed).map((l) => format(parseISO(l.date), "yyyy-MM-dd"))
  );

  const totalDays = completed.size;
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const completedToday = completed.has(today);

  // Current streak
  let currentStreak = 0;
  const start = completedToday ? today : yesterday;
  if (completed.has(start)) {
    let check = start;
    while (completed.has(check)) {
      currentStreak++;
      check = format(subDays(parseISO(check), 1), "yyyy-MM-dd");
    }
  }

  // Longest streak
  const sorted = Array.from(completed).sort();
  let longest = 0;
  let temp = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (differenceInDays(parseISO(sorted[i]), parseISO(sorted[i - 1])) === 1) {
      temp++;
    } else {
      longest = Math.max(longest, temp);
      temp = 1;
    }
  }
  longest = Math.max(longest, temp);
  if (sorted.length === 0) longest = 0;

  return { currentStreak, longestStreak: longest, totalDays, completedToday };
}
