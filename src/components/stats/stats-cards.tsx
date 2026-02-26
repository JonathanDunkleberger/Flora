import { Flame, TrendingUp, Calendar, CheckCircle2, Flower2 } from "lucide-react";

interface StatsCardsProps {
  totalHabits: number;
  totalCurrentStreak: number;
  totalLongestStreak: number;
  totalCompletedDays: number;
  habitsCompletedToday: number;
}

export function StatsCards({
  totalHabits,
  totalCurrentStreak,
  totalLongestStreak,
  totalCompletedDays,
  habitsCompletedToday,
}: StatsCardsProps) {
  const cards = [
    { icon: Flower2, label: "Active Habits", value: totalHabits, color: "text-bloom-500" },
    { icon: Flame, label: "Total Streak Score", value: totalCurrentStreak, color: "text-amber-500" },
    { icon: TrendingUp, label: "Best Single Streak", value: `${totalLongestStreak}d`, color: "text-bloom-600" },
    { icon: Calendar, label: "Total Completed Days", value: totalCompletedDays, color: "text-blue-500" },
    { icon: CheckCircle2, label: "Done Today", value: `${habitsCompletedToday}/${totalHabits}`, color: "text-emerald-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <div key={i} className={`bg-white rounded-2xl border border-slate-100 p-4 ${i === cards.length - 1 ? "col-span-2" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <card.icon className={`w-4 h-4 ${card.color}`} />
            <span className="text-xs text-slate-400 font-medium">{card.label}</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
