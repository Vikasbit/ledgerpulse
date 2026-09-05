// lib/razorpay/server.ts
// Server‑side Razorpay helper functions using the official razorpay npm package.

import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn("Razorpay credentials are not set. Razorpay integration will be unavailable.");
}

/**
 * Initialise Razorpay instance (server side).
 */
function getRazorpayInstance() {
  if (!keyId || !keySecret) return null;
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Create an order for the given amount (in minor currency unit, e.g., paise).
 * @param amount Amount in smallest currency unit (e.g., INR paisa).
 * @param currency Currency code, default "INR".
 * @param receipt Optional receipt identifier.
 * @returns Razorpay order object.
 */
export async function createRazorpayOrder({
  amount,
  currency = "INR",
  receipt,
}: {
  amount: number;
  currency?: string;
  receipt?: string;
}) {
  const instance = getRazorpayInstance();
  if (!instance) throw new Error("Razorpay credentials not configured");

  const options = {
    amount,
    currency,
    receipt: receipt ?? `rcpt_${Date.now()}`,
    payment_capture: 1, // auto‑capture
  } as any;

  return new Promise((resolve, reject) => {
    instance.orders.create(options, (err: any, order: any) => {
      if (err) reject(err);
      else resolve(order);
    });
  });
}

/**
 * Verify Razorpay signature for a payment.
 * @param payload The body received from Razorpay webhook or client callback.
 * @param signature Header "x-razorpay-signature" value.
 * @returns Boolean indicating validity.
 */
export function verifyRazorpaySignature(
  payload: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const expected = crypto
    .createHmac("sha256", keySecret ?? "")
    .update(payload)
    .digest("hex");
  return expected === signature;
}

/**
 * Create a payment link (useful for invoicing).
 */
export async function createPaymentLink({
  amount,
  currency = "INR",
  description,
  customer,
}: {
  amount: number;
  currency?: string;
  description?: string;
  customer?: { name?: string; email?: string; contact?: string };
}) {
  const instance = getRazorpayInstance();
  if (!instance) throw new Error("Razorpay credentials not configured");

  const options = {
    amount,
    currency,
    description: description ?? "Payment",
    customer: customer ?? {},
    notify: { sms: true, email: true },
    reminder_enable: true,
    callback_url: process.env.NEXT_PUBLIC_BASE_URL + "/api/razorpay/verify", // adjust as needed
    callback_method: "post",
  } as any;

  return new Promise((resolve, reject) => {
    instance.paymentLink.create(options, (err: any, link: any) => {
      if (err) reject(err);
      else resolve(link);
    });
  });
}
