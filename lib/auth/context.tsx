"use client";

// lib/auth/context.tsx
// Auth context for managing user session state on the client side.

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  setDemoMode: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isDemo: false,
  setDemoMode: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const supabase = createSupabaseBrowserClient();
  const isDemo = !supabase || demoActive;

  const setDemoMode = () => {
    try {
      localStorage.setItem("ledgerpulse_demo_mode", "true");
    } catch {}
    setDemoActive(true);
    setUser({ id: "demo-user", email: "demo@ledgerpulse.app", full_name: "Demo Controller" });
    setLoading(false);
  };

  useEffect(() => {
    try {
      if (localStorage.getItem("ledgerpulse_demo_mode") === "true") {
        setDemoActive(true);
        setUser({ id: "demo-user", email: "demo@ledgerpulse.app", full_name: "Demo Controller" });
        setLoading(false);
        return;
      }
    } catch {}

    if (!supabase) {
      // In demo mode, create a fake user
      setUser({ id: "demo-user", email: "demo@ledgerpulse.app", full_name: "Demo Controller" });
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getUser().then(({ data }: any) => {
      const u = data?.user;
      if (u) {
        setUser({
          id: u.id,
          email: u.email ?? "",
          full_name: u.user_metadata?.full_name,
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          full_name: session.user.user_metadata?.full_name,
        });
      } else {
        if (!demoActive) {
          setUser(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, demoActive]);

  const signOut = async () => {
    try {
      localStorage.removeItem("ledgerpulse_demo_mode");
    } catch {}
    setDemoActive(false);
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, setDemoMode, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}
