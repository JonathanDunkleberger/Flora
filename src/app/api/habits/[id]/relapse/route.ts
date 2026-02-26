import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { intensity, note } = body;

  const supabase = await createServerSupabaseClient();

  // Verify habit belongs to user
  const { data: habit } = await supabase.from("habits").select("id").eq("id", id).eq("user_id", userId).single();
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("relapse_events")
    .insert({
      habit_id: id,
      intensity: intensity ?? 5,
      note: note ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
