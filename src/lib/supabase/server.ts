import { createClient } from "@supabase/supabase-js";

// Use service-role key for all server-side operations.
// Auth is already handled by Clerk middleware — RLS is not needed server-side.
// All queries MUST explicitly filter by user_id / clerk_id for security.
export async function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
