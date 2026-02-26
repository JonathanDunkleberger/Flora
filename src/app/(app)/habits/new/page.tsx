import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HabitForm } from "@/components/habits/habit-form";
import { FREE_HABIT_LIMIT } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function NewHabitPage() {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles").select("subscription_status").eq("id", userId).single();
  const isPro = profile?.subscription_status === "pro";

  if (!isPro) {
    const { count } = await supabase
      .from("habits").select("*", { count: "exact", head: true }).eq("is_archived", false);
    if ((count || 0) >= FREE_HABIT_LIMIT) redirect("/pricing");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Plant a New Habit</h1>
      <HabitForm isPro={isPro} />
    </div>
  );
}
