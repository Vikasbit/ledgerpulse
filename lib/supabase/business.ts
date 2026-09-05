// lib/supabase/business.ts
import getSupabaseClient from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Retrieves the business record associated with the currently authenticated user.
 * Throws if no user or no business found.
 */
export async function getCurrentBusiness(): Promise<any> {
  const supabase: SupabaseClient<any, "public" | "private"> = getSupabaseClient();
  const { data: { user } , error: authErr } = await supabase.auth.getUser();
  if (authErr) throw authErr;
  if (!user) throw new Error("Unauthenticated");
  const { data: business, error: bizErr } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();
  if (bizErr) throw bizErr;
  return business;
}
