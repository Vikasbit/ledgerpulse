// app/api/razorpay/create-order/route.ts
import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  amount: z.number().int().positive().finite(),
  currency: z.string().optional().default("INR"),
  receipt: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const order = await createRazorpayOrder({
      amount: parsed.amount,
      currency: parsed.currency,
      receipt: parsed.receipt,
    });
    return NextResponse.json(order);
  } catch (err: any) {
    console.error("Create order error:", err);
    const message = err instanceof z.ZodError ? ((err as any).issues?.map((e: any) => e.message).join(", ") || err.message) : err.message;
    return NextResponse.json({ error: message ?? "Failed to create order" }, { status: 400 });
  }
}
