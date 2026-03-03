// Client-side Supabase is not used — all data flows through API routes
// with the service-role key (server.ts). This file is kept as a placeholder
// in case direct client-side Supabase access is needed in the future.
//
// All client ↔ server communication goes through fetch() to /api/* routes,
// which use Clerk auth middleware for security.
