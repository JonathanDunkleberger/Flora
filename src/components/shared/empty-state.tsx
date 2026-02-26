import Link from "next/link";
import { Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-8 px-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-bloom-100 max-w-xs mx-auto">
      <div className="text-5xl mb-3">🌱</div>
      <h2 className="text-lg font-bold text-slate-800">Your garden awaits</h2>
      <p className="text-sm text-slate-500 mt-1 mb-4">Plant your first habit and watch it grow.</p>
      <Link href="/habits/new"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-bloom-500 text-white font-semibold rounded-2xl shadow-md shadow-bloom-500/25 tap-bounce">
        <Plus className="w-4 h-4" /> Plant Your First Seed
      </Link>
    </div>
  );
}
