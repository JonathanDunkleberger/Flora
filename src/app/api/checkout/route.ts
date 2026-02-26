import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { priceId } = body;

  if (!priceId) {
    return NextResponse.json({ error: "priceId required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, stripe_customer_id")
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Use existing Stripe customer or let Checkout create one
  const sessionParams: Record<string, unknown> = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/garden?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { clerk_id: userId },
  };

  if (profile.stripe_customer_id) {
    sessionParams.customer = profile.stripe_customer_id;
  } else {
    sessionParams.customer_email = profile.email;
  }

  const session = await stripe.checkout.sessions.create(
    sessionParams as Parameters<typeof stripe.checkout.sessions.create>[0]
  );

  return NextResponse.json({ url: session.url });
}
