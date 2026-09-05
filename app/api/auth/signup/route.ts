// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import getSupabaseClient from "@/lib/supabase/client";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().optional(),
  business_name: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name, business_name } = schema.parse(body);
    const supabase = getSupabaseClient();
    const { data: user, error: signError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });
    if (signError) throw signError;
    // Create business linked to user
    const { data: business, error: bizErr } = await supabase.from("businesses").insert({
      owner_id: user?.user?.id,
      name: business_name,
    }).select();
    if (bizErr) throw bizErr;
    return NextResponse.json({ success: true, user: user.user, business: business?.[0] });
  } catch (err: any) {
    console.error(err);
    const message = err instanceof z.ZodError ? ((err as any).issues?.map((e: any) => e.message).join(", ") || err.message) : err.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
