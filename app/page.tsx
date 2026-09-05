import Link from "next/link";
import {
  ArrowRight,
  Upload,
  BarChart3,
  CreditCard,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ArrowUpRight,
  FileSpreadsheet,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen mesh-pastel-bg text-slate-900 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Soft atmospheric ambient glow orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-tr from-purple-200/40 via-violet-200/30 to-pink-200/30 blur-[150px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-[650px] -left-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/30 to-pink-100/30 blur-[160px] -z-10 pointer-events-none rounded-full" />

      {/* Top Navigation Bar - Inspired by Image 1 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-purple-100/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-2 ring-white transition-transform group-hover:scale-105">
              <Zap size={20} className="text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                LedgerPulse
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-purple-100/70 text-purple-700 border border-purple-200/60">
                Finance OS
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link href="/" className="text-purple-600 font-semibold transition-colors">
              Home
            </Link>
            <Link href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="/dashboard/transactions" className="hover:text-slate-900 transition-colors">
              Reconciliation
            </Link>
            <Link href="/dashboard/analytics" className="hover:text-slate-900 transition-colors">
              Analytics
            </Link>
            <Link href="/dashboard/import" className="hover:text-slate-900 transition-colors">
              Import CSV
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100/80 px-4 py-2 rounded-xl transition-all border border-purple-200/60"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4.5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-900/15 hover:shadow-lg active:scale-[0.98]"
            >
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-20 text-center max-w-6xl mx-auto">
        {/* Floating Pill Tag - FINANCIAL INTELLIGENCE */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-7 text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-50/90 border border-purple-200/80 rounded-full shadow-xs backdrop-blur-md">
          <Sparkles size={13} className="text-purple-600" />
          <span>Financial Intelligence</span>
        </div>

        {/* Hero Title - Inspired by Image 1 */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08] max-w-4xl">
          Smarter Ledger, <br className="hidden sm:inline" />
          <span className="text-slate-900">Smarter Financial Future</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          All-in-one SaaS reconciliation dashboard to manage income, bulk CSV transactions, and settlement performance with real-time insights and growth analytics.
        </p>

        {/* Dual Hero CTA Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl hover:from-purple-500 hover:to-indigo-500 transition-all shadow-xl shadow-purple-500/25 hover:shadow-purple-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Get Started</span>
            <ArrowRight size={16} className="ml-2" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm sm:text-base font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-2xl hover:bg-slate-50 transition-all shadow-xs"
          >
            <span>Explore Demo</span>
          </Link>
        </div>

        {/* Hero Dashboard Preview Card - Directly Matching Reference Image 1 */}
        <div className="mt-14 w-full max-w-5xl rounded-[32px] neo-glass-panel p-5 sm:p-7 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            
            {/* Card 1: Total Income */}
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Income
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <MoreHorizontal size={14} />
                  </div>
                </div>

                <div className="mt-7 flex items-baseline space-x-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    ₹26,59,980
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    ↑ 35%
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100/80">
                <span className="text-xs text-slate-400 font-medium">
                  Increased from last month • 352 Settled Orders
                </span>
              </div>
            </div>

            {/* Card 2: Transaction View (The Semi-Circular Gauge Arc from Image 1) */}
            <div className="bg-white/95 rounded-2xl p-6 border border-purple-200/60 shadow-md shadow-purple-500/5 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Transaction View
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  ₹38,96,075
                </span>
              </div>

              {/* 180-degree Semi-Circular Arc Gauge */}
              <div className="relative flex flex-col items-center justify-center mt-4">
                <svg className="w-52 h-28" viewBox="0 0 200 110">
                  {/* Background Arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  {/* Purple segment: Settled */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 100 20"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  {/* Emerald segment: Reconciled */}
                  <path
                    d="M 100 20 A 80 80 0 0 1 155 45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="18"
                  />
                  {/* Amber segment: Growth */}
                  <path
                    d="M 155 45 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Center text inside the Arc */}
                <div className="absolute top-10 flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    70.4%
                  </span>
                  <span className="mt-0.5 inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    ↑ 20% Growth
                  </span>
                </div>
              </div>

              {/* Legend Dots */}
              <div className="flex items-center justify-center space-x-4 text-[11px] font-medium text-slate-500 mt-2">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Settled</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Reconciled</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Pending</span>
                </span>
              </div>
            </div>

            {/* Card 3: Performance (Donut & Tooltip from Image 1) */}
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Performance
                </span>
                <span className="text-xs text-slate-400 font-medium">Channels</span>
              </div>

              {/* Sliced Donut Chart with Floating Pill */}
              <div className="relative flex items-center justify-center my-3">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                  {/* Slices */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#7c3aed" strokeWidth="6" strokeDasharray="42 100" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="6" strokeDasharray="26 100" strokeDashoffset="-42" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" strokeWidth="6" strokeDasharray="18 100" strokeDashoffset="-68" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#c084fc" strokeWidth="6" strokeDasharray="14 100" strokeDashoffset="-86" />
                </svg>

                {/* Floating Highlight Card from Image 1 */}
                <div className="absolute top-2 right-0 bg-white rounded-xl shadow-lg border border-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-800">
                  <span className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>UPI</span>
                    <span className="text-emerald-600 ml-1">↑ 24%</span>
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] font-medium text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>UPI (42%)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Cards (26%)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Netbank (18%)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-300" />
                  <span>Wallet (14%)</span>
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="mt-24 max-w-5xl mx-auto text-left w-full">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Enterprise Grade
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Designed for High-Volume Digital Commerce
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Universal CSV Ingestion</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Smart 4-step wizard auto-maps payment IDs, amounts, and dates from bank and gateway exports with built-in validation rules.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Automated Reconciliation</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Instant 2-way matching between processed orders and settled cash. Detects discrepancies and revenue leakages automatically.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <CreditCard size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Razorpay Payment Engine</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Collect payments on demand with verified server-side HMAC-SHA256 signature verification and automated ledger recording.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white/70 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-slate-700">LedgerPulse © 2026 — Smart Financial Telemetry</span>
          <div className="flex items-center space-x-6 font-medium">
            <Link href="/dashboard" className="hover:text-purple-600 transition-colors">Overview</Link>
            <Link href="/dashboard/transactions" className="hover:text-purple-600 transition-colors">Transactions</Link>
            <Link href="/dashboard/analytics" className="hover:text-purple-600 transition-colors">Analytics</Link>
            <Link href="/dashboard/import" className="hover:text-purple-600 transition-colors">Import Wizard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
