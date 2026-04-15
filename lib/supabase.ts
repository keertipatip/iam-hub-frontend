import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client.
// Uses createBrowserClient so sessions are stored in cookies, which the
// middleware can then read server-side to keep the auth state in sync.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)
