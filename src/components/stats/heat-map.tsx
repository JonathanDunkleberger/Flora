"use client";

import { cn } from "@/lib/utils";

interface HeatMapProps {
  completedDates: Record<string, number>; // date string -> count of habits completed
  totalHabits: number;
}

export function HeatMap({ completedDates, totalHabits }: HeatMapProps) {
  // Generate last 365 days
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const count = completedDates[dateStr] || 0;
    const intensity = totalHabits > 0 ? Math.min(4, Math.ceil((count / totalHabits) * 4)) : 0;
    days.push({ date: dateStr, count, intensity });
  }

  // Group into weeks
  const weeks: typeof days[] = [];
  let currentWeek: typeof days = [];
  const firstDay = new Date();
  firstDay.setDate(firstDay.getDate() - 364);
  const startDayOfWeek = firstDay.getDay();

  // Pad beginning
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push({ date: "", count: 0, intensity: -1 });
  }

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 overflow-x-auto">
      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 ml-4 text-[9px] text-slate-400">
        {weeks.map((week, i) => {
          if (i % 4 === 0 && week[0]?.date) {
            const month = new Date(week[0].date).getMonth();
            return <span key={i} className="w-[11px] text-center">{months[month]}</span>;
          }
          return <span key={i} className="w-[11px]" />;
        })}
      </div>

      {/* Grid */}
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={`${wi}-${di}`}
                className={cn(
                  "w-[11px] h-[11px] rounded-sm",
                  day.intensity === -1 ? "bg-transparent" :
                  day.intensity === 0 ? "heat-0" :
                  day.intensity === 1 ? "heat-1" :
                  day.intensity === 2 ? "heat-2" :
                  day.intensity === 3 ? "heat-3" : "heat-4"
                )}
                title={day.date ? `${day.date}: ${day.count} habits` : ""}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-3 text-[9px] text-slate-400">
        <span>Less</span>
        <div className="w-[11px] h-[11px] rounded-sm heat-0" />
        <div className="w-[11px] h-[11px] rounded-sm heat-1" />
        <div className="w-[11px] h-[11px] rounded-sm heat-2" />
        <div className="w-[11px] h-[11px] rounded-sm heat-3" />
        <div className="w-[11px] h-[11px] rounded-sm heat-4" />
        <span>More</span>
      </div>
    </div>
  );
}
