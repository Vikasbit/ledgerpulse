"use client";

// app/login/page.tsx
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { LedgerPulseLogo } from "@/components/ui/LedgerPulseLogo";

export default function LoginPage() {
  const router = useRouter();
  const { isDemo, setDemoMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isDemo) {
      setDemoMode();
      router.push("/dashboard");
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setDemoMode();
        router.push("/dashboard");
        return;
      }
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setDemoMode();
    router.push("/dashboard");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-tr from-indigo-300/30 to-purple-300/20 blur-[130px] -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="flex items-center justify-center mb-8">
          <LedgerPulseLogo variant="light" size="lg" href="/" />
        </div>

        {/* Auth Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-xs text-slate-500 mb-6">
            Sign in to access your transaction telemetry and reconciliation engine
          </p>

          {isDemo && (
            <div className="mb-5 p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between text-xs">
              <span className="text-indigo-800 font-medium">Demo Mode active</span>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="font-bold text-indigo-600 hover:text-indigo-700 underline"
              >
                Instant Enter →
              </button>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@company.com"
                required={!isDemo}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required={!isDemo}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} className="ml-1.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Bypass Button */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <Sparkles size={14} className="mr-1.5 text-indigo-600" />
              <span>Explore Demo Dashboard without Login</span>
            </button>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-indigo-600 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
