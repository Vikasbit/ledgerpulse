// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import getSupabaseClient from "@/lib/supabase/client";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Remove any cookies (Supabase handles via headers)
    const response = NextResponse.json({ success: true });
    // Clear auth cookie (Supabase uses `sb:token` cookie)
    response.cookies.delete("sb:token");
    return response;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
