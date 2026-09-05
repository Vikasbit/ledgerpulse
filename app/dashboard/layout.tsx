"use client";

// app/dashboard/layout.tsx
import React from "react";
import { useAuth } from "@/lib/auth/context";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isDemo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !isDemo) {
      router.push("/login");
    }
  }, [user, loading, isDemo, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-[#6C5CE7]/30 border-t-[#6C5CE7] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !isDemo) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
