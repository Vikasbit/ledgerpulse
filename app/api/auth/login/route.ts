// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import getSupabaseClient from "@/lib/supabase/client";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const { email, password } = schema.parse(await request.json());
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Set auth cookie via Supabase helper (handled automatically by nextjs server)
    return NextResponse.json({ success: true, user: data.user });
  } catch (err: any) {
    console.error(err);
    const msg = err instanceof z.ZodError ? ((err as any).issues?.map((e: any) => e.message).join(", ") || err.message) : err.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
