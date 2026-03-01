import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/verify-subscription
 *
 * Webhook-independent subscription verification.
 * Checks Stripe directly for any active subscription tied to this user,
 * and updates the profiles.tier accordingly.
 *
 * This is the FALLBACK for when Stripe webhooks don't reach the server
 * (e.g., local development, misconfigured webhook URL, webhook failures).
 *
 * Flow:
 * 1. Look up user's stripe_customer_id in profiles
 * 2. If no customer ID, check Stripe for recent checkout sessions with clerk_id metadata
 * 3. Query Stripe for active subscriptions for that customer
 * 4. If active subscription found → set tier = 'pro' + store IDs
 * 5. If no active subscription → leave tier as-is (don't downgrade — webhook handles that)
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    return NextResponse.json({ isPro: false, reason: "Stripe not configured" });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(STRIPE_SECRET);

  const supabase = await createServerSupabaseClient();

  // Get current profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, stripe_customer_id, stripe_subscription_id")
    .eq("clerk_id", userId)
    .single();

  if (!profile) {
    return NextResponse.json({ isPro: false, reason: "No profile found" });
  }

  // If already pro in DB, just confirm
  if (profile.tier === "pro") {
    return NextResponse.json({ isPro: true, reason: "Already pro in database" });
  }

  let customerId = profile.stripe_customer_id;

  // If we don't have a customer ID, search recent checkout sessions for this clerk_id
  if (!customerId) {
    try {
      const sessions = await stripe.checkout.sessions.list({
        limit: 10,
      });

      for (const session of sessions.data) {
        if (
          session.metadata?.clerk_id === userId &&
          session.status === "complete" &&
          session.customer
        ) {
          customerId = session.customer as string;

          // Save the customer ID for future lookups
          await supabase
            .from("profiles")
            .update({ stripe_customer_id: customerId })
            .eq("clerk_id", userId);

          break;
        }
      }
    } catch (e) {
      console.error("Error searching checkout sessions:", e);
    }
  }

  if (!customerId) {
    return NextResponse.json({
      isPro: false,
      reason: "No Stripe customer found for this user",
    });
  }

  // Check Stripe for active subscriptions
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const sub = subscriptions.data[0];

      // Update DB — this is what the webhook SHOULD have done
      await supabase
        .from("profiles")
        .update({
          tier: "pro",
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
        })
        .eq("clerk_id", userId);

      return NextResponse.json({
        isPro: true,
        reason: "Verified active subscription via Stripe API — database updated",
      });
    }

    // Also check trialing subscriptions
    const trialingSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: "trialing",
      limit: 1,
    });

    if (trialingSubs.data.length > 0) {
      const sub = trialingSubs.data[0];

      await supabase
        .from("profiles")
        .update({
          tier: "pro",
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
        })
        .eq("clerk_id", userId);

      return NextResponse.json({
        isPro: true,
        reason: "Verified trialing subscription via Stripe API — database updated",
      });
    }

    return NextResponse.json({
      isPro: false,
      reason: "No active subscription found in Stripe",
    });
  } catch (e) {
    console.error("Error checking Stripe subscriptions:", e);
    return NextResponse.json({
      isPro: false,
      reason: "Error checking Stripe",
    });
  }
}
