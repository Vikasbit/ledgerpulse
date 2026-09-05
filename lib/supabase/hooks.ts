// lib/supabase/hooks.ts
import { useState, useEffect } from "react";
import getSupabaseClient from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * React hook that returns a Supabase client instance.
 * The client is memoized for the lifetime of the component.
 */
export function useSupabaseClient(): SupabaseClient<any, "public" | "private"> {
  const [client] = useState(() => getSupabaseClient());
  // Optionally you could add auth state listeners here.
  useEffect(() => {
    // keep alive - placeholder for future.
  }, [client]);
  return client;
}
