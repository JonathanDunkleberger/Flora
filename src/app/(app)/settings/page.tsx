import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Crown, ExternalLink } from "lucide-react";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles").select("subscription_status, subscription_period_end").eq("id", userId).single();

  const isPro = profile?.subscription_status === "pro";

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>

      {/* Subscription Status */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Crown className={`w-5 h-5 ${isPro ? "text-amber-500" : "text-slate-300"}`} />
              <h2 className="font-semibold text-slate-800">
                {isPro ? "Bloom Pro" : "Free Plan"}
              </h2>
            </div>
            {isPro && profile?.subscription_period_end && (
              <p className="text-xs text-slate-400 mt-1">
                Renews {new Date(profile.subscription_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
          {isPro ? (
            <SettingsClient />
          ) : (
            <Link href="/pricing"
              className="text-sm font-medium text-bloom-600 bg-bloom-50 px-3 py-1.5 rounded-xl hover:bg-bloom-100">
              Upgrade
            </Link>
          )}
        </div>
        {!isPro && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              🌱 Free: 3 habits, fern plant only, 30-day history
            </p>
            <p className="text-xs text-bloom-600 mt-1">
              ✨ Pro: Unlimited habits, all plants, heat maps, full history
            </p>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Account</h2>
        <p className="text-sm text-slate-500">
          Manage your account settings, profile, and security through Clerk.
        </p>
        <Link href="/settings" className="mt-3 inline-flex items-center gap-1 text-sm text-bloom-600 hover:text-bloom-700">
          Manage Profile <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
