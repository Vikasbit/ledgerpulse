// app/api/razorpay/verify-payment/route.ts
import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  payload: z.string().nonempty(),
  signature: z.string().nonempty(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payload, signature } = schema.parse(body);
    const isValid = verifyRazorpaySignature(payload, signature);
    return NextResponse.json({ valid: isValid });
  } catch (err: any) {
    console.error("Verify payment error:", err);
    const message = err instanceof z.ZodError ? ((err as any).issues?.map((e: any) => e.message).join(", ") || err.message) : err.message;
    return NextResponse.json({ error: message ?? "Verification failed" }, { status: 400 });
  }
}
