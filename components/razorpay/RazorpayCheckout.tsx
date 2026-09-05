// components/razorpay/RazorpayCheckout.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";

interface CheckoutProps {
  amount: number; // amount in paise
  currency?: string;
  receipt?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

export const RazorpayCheckout: React.FC<CheckoutProps> = ({
  amount,
  currency = "INR",
  receipt,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { addToast } = useToast();

  // Load Razorpay script only once
  useEffect(() => {
    if (scriptLoaded) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      const msg = "Failed to load Razorpay checkout script";
      console.error(msg);
      onError?.(msg);
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [scriptLoaded, onError]);

  const handlePay = async () => {
    if (!scriptLoaded) {
      onError?.("Razorpay script not loaded");
      return;
    }
    setLoading(true);
    try {
      // 1. Create order on server
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, receipt }),
      });
      const orderData = await createRes.json();
      if (!createRes.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. Open Razorpay checkout UI
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "", // blank in demo mode
        amount,
        currency,
        name: "Your Business",
        description: receipt ?? "Payment",
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. Verify payment on server
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payload: JSON.stringify(response), signature: response.razorpay_signature }),
          });
          const verifyJson = await verifyRes.json();
          if (verifyJson.valid) {
            onSuccess?.(orderData.id);
            addToast({ title: "Payment successful", variant: "success" });
          } else {
            const errMsg = "Payment verification failed";
            onError?.(errMsg);
            addToast({ title: errMsg, variant: "error" });
          }
        },
        prefill: {},
        theme: { color: "#6C5CE7" },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        const err = resp.error?.description || "Payment failed";
        onError?.(err);
        addToast({ title: err, variant: "error" });
      });
      rzp.open();
    } catch (e: any) {
      const msg = e.message ?? "Unexpected error";
      console.error(msg);
      onError?.(msg);
      addToast({ title: msg, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center justify-center", loading && "opacity-50")}>
      <Button onClick={handlePay} disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Pay Now"}
      </Button>
      {!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && (
        <span className="ml-2 text-sm text-gray-500">Test mode – no Razorpay credentials</span>
      )}
    </div>
  );
};
