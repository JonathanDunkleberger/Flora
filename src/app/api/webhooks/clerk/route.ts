import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
  };
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: ClerkWebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      const email = email_addresses?.[0]?.email_address ?? "";
      const display_name = [first_name, last_name].filter(Boolean).join(" ") || null;

      await supabase.from("profiles").upsert(
        {
          clerk_id: id,
          email,
          display_name,
          avatar_url: image_url ?? null,
        },
        { onConflict: "clerk_id" }
      );
      break;
    }
    case "user.deleted": {
      const { id } = event.data;
      await supabase.from("profiles").delete().eq("clerk_id", id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
