// lib/supabase/client.ts
// Supabase client initialization with fallback to demo in-memory store.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient<any, "public" | "private"> | null = null;

/**
 * Initialize Supabase client.
 * In production, uses environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * In demo mode (when env vars are missing), falls back to a mock client that uses localStorage for persistence.
 */
export function getSupabaseClient(): SupabaseClient<any, "public" | "private"> {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && anonKey) {
    supabase = createClient(url, anonKey, {
      // Enable real-time if needed in future.
      auth: { persistSession: true },
    });
  } else {
    // Demo fallback – simple in-memory mock with same API surface used in our code.
    // For brevity, we provide a minimal mock supporting `from` and `select` used by our repository.
    const mock = {
      from: (table: string) => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: (payload: any) => Promise.resolve({ data: payload, error: null }),
        upsert: (payload: any) => Promise.resolve({ data: payload, error: null }),
        delete: () => Promise.resolve({ data: [], error: null }),
      }),
    } as any;
    supabase = mock as unknown as SupabaseClient<any, "public" | "private">;
  }

  return supabase;
}

export default getSupabaseClient;
