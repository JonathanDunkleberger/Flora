import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { FREE_HABIT_LIMIT } from "@/lib/constants";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("habits").select("*").eq("is_archived", false).order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase.from("profiles").select("subscription_status").eq("id", userId).single();
  const isPro = profile?.subscription_status === "pro";

  if (!isPro) {
    const { count } = await supabase.from("habits").select("*", { count: "exact", head: true }).eq("is_archived", false);
    if ((count || 0) >= FREE_HABIT_LIMIT)
      return NextResponse.json({ error: "Free plan limited to 3 habits. Upgrade to Bloom Pro!" }, { status: 403 });
  }

  const body = await request.json();
  if (!isPro && body.plant_type !== "fern") body.plant_type = "fern";

  const { data, error } = await supabase.from("habits").insert({
    user_id: userId,
    name: body.name,
    description: body.description || null,
    type: body.type,
    category: body.category,
    icon: body.icon || "🌱",
    plant_type: body.plant_type || "fern",
    habit_group: body.habit_group || null,
    target_frequency: body.target_frequency || "daily",
    custom_days: body.custom_days || [],
    quit_date: body.type === "quit" ? new Date().toISOString() : null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
