"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flower2, List, BarChart3, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/garden", icon: Flower2, label: "Garden" },
  { href: "/habits", icon: List, label: "Habits" },
  { href: "/habits/new", icon: Plus, label: "Add", isAdd: true },
  { href: "/stats", icon: BarChart3, label: "Stats" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white/90 backdrop-blur-md border-t border-bloom-100 safe-area-bottom">
      <div className="max-w-2xl mx-auto px-2 h-16 flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label, isAdd }) => {
          const isActive = pathname === href || (href !== "/garden" && pathname.startsWith(href));

          if (isAdd) {
            return (
              <Link key={href} href={href}
                className="flex items-center justify-center w-12 h-12 bg-bloom-500 hover:bg-bloom-600 rounded-full shadow-lg shadow-bloom-500/30 -mt-4 transition-colors tap-bounce">
                <Icon className="w-6 h-6 text-white" />
              </Link>
            );
          }

          return (
            <Link key={href} href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors tap-bounce",
                isActive ? "text-bloom-600" : "text-slate-400 hover:text-slate-600"
              )}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
