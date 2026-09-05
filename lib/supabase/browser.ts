// lib/supabase/browser.ts
// Browser-side Supabase client using @supabase/ssr for cookie-based auth.

import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (browserClient) return browserClient;

  browserClient = createBrowserClient(url, anonKey);
  return browserClient;
}
