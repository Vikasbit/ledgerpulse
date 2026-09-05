"use client";

// app/providers.tsx
// Client-side providers wrapper — wraps the app in Auth, Demo, and Toast contexts.

import { AuthProvider } from "@/lib/auth/context";
import { DemoProvider } from "@/lib/demo/context";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DemoProvider>
        <ToastProvider>{children}</ToastProvider>
      </DemoProvider>
    </AuthProvider>
  );
}
