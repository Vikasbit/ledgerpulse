import Link from "next/link";
import {
  ArrowRight,
  Upload,
  BarChart3,
  CreditCard,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ArrowUpRight,
  FileSpreadsheet,
  MoreHorizontal,
  ChevronRight,
  LayoutDashboard,
  Receipt,
  AlertTriangle,
  Users,
  Share2,
  ExternalLink,
  Info,
  TrendingUp,
} from "lucide-react";
import { LedgerPulseLogo } from "@/components/ui/LedgerPulseLogo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFD] text-slate-900 selection:bg-[#D4F82D] selection:text-black relative overflow-x-hidden">
      {/* Soft atmospheric ambient glow orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-tr from-slate-200/50 via-purple-100/30 to-amber-100/30 blur-[140px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-[750px] -left-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/30 to-purple-100/20 blur-[150px] -z-10 pointer-events-none rounded-full" />

      {/* Floating Dark Capsule Navigation Bar — Directly matching Reference Design */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 w-full max-w-6xl mx-auto">
        <nav className="bg-[#0B0F17]/95 backdrop-blur-xl border border-white/10 rounded-full px-5 sm:px-7 py-3 flex items-center justify-between shadow-2xl shadow-black/25 transition-all">
          {/* Brand Logo with modern neon pulse wave emblem */}
          <LedgerPulseLogo variant="dark" size="sm" href="/" />

          {/* Centered Navigation Links */}
          <div className="hidden md:flex items-center space-x-7 text-sm font-medium text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/dashboard/transactions" className="hover:text-white transition-colors">
              Reconciliation
            </Link>
            <Link href="/dashboard/analytics" className="hover:text-white transition-colors">
              Analytics
            </Link>
            <Link href="/dashboard/exceptions" className="hover:text-white transition-colors">
              Exceptions
            </Link>
            <Link href="/dashboard/import" className="hover:text-white transition-colors">
              Import CSV
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full border border-white/20 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4.5 sm:px-5 py-2 text-xs sm:text-sm font-extrabold text-black bg-[#D4F82D] hover:bg-[#C4E820] rounded-full shadow-lg shadow-[#D4F82D]/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-14 sm:pt-20 pb-16 text-center max-w-6xl mx-auto w-full">
        {/* Hero Title — Exactly formatted as the reference image */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Revolutionizing finance for <br className="hidden sm:inline" />
          a better tomorrow. Today.
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed font-normal mx-auto">
          Fintech services leverage technology to enhance financial processes, offering innovative solutions for banking, multi-ledger reconciliation, and autonomous exception investigation.
        </p>

        {/* Dual Hero CTA Buttons — Dark pill + White outline pill */}
        <div className="mt-8 sm:mt-10 flex flex-row items-center justify-center gap-3.5 w-full">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-7 sm:px-9 py-3.5 text-xs sm:text-sm font-bold text-white bg-slate-950 rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/15 hover:scale-105 active:scale-95"
          >
            <span>Get Started</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-all shadow-xs"
          >
            <span>Learn more</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* CENTERPIECE DEVICE SHOWCASE WITH FLOATING ORBITING 3D GLASS CARDS */}
        {/* ========================================================================= */}
        <div className="mt-14 sm:mt-20 w-full max-w-5xl mx-auto relative">
          
          {/* Floating Orbiting Card 1: Top-Left Pill "+$347.23" */}
          <div className="hidden sm:flex absolute -top-5 left-8 lg:left-14 z-30 items-center space-x-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-slate-100 animate-float-slow">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold">
              ✓
            </div>
            <span className="font-extrabold text-xs text-slate-900 tracking-tight">+$347.23</span>
          </div>

          {/* Floating Orbiting Card 2: Mid-Left Payment & Transfer Card */}
          <div className="hidden sm:block absolute top-20 -left-6 md:-left-10 lg:-left-12 z-30 animate-float-reverse">
            {/* Top PayPal Pill */}
            <div className="mb-2.5 inline-flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-100">
              <div className="w-5 h-5 rounded-full bg-[#003087] text-white flex items-center justify-center text-[10px] font-black italic">
                P
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-900 block leading-tight">Paypal</span>
                <span className="text-[9px] text-slate-400 block leading-tight">Money transfer</span>
              </div>
            </div>

            {/* Jhon Barrel Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-100 w-52 text-left transition-transform hover:scale-105">
              <div className="flex items-center space-x-2.5">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-200 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Jhon Barrel"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Jhon Barrel</h4>
                  <p className="text-[10px] text-slate-400">Personal account</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#D4F82D] text-black flex items-center justify-center text-[10px] font-bold">
                    ↗
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Transfer</span>
                </div>
                <span className="text-xs font-extrabold text-[#1A1F71] italic tracking-wider">
                  VISA
                </span>
              </div>
            </div>
          </div>

          {/* Floating Orbiting Card 3: Top-Right Amazon Badge */}
          <div className="hidden sm:flex absolute -top-4 right-32 lg:right-40 z-30 w-11 h-11 rounded-full bg-gradient-to-br from-[#FF9900] to-[#E88B00] shadow-xl items-center justify-center text-white font-black text-lg border-2 border-white animate-float-slow">
            <span className="transform -translate-y-0.5">a</span>
          </div>

          {/* Floating Orbiting Card 4: Right "Average spend in half a year" */}
          <div className="hidden sm:block absolute top-12 -right-6 md:-right-10 lg:-right-12 z-30 animate-float-slow">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 w-52 sm:w-56 text-left transition-transform hover:scale-105">
              <span className="text-[11px] font-bold text-slate-500 block mb-3 leading-tight">
                Average spend in half a year
              </span>

              {/* Purple/Violet Rounded Bar Chart */}
              <div className="flex items-end justify-between h-24 pt-2 px-1">
                {[
                  { month: "Jul", height: "45%" },
                  { month: "Aug", height: "70%" },
                  { month: "Sep", height: "30%" },
                  { month: "Oct", height: "95%" },
                  { month: "Nov", height: "80%" },
                  { month: "Dec", height: "65%" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-1.5 flex-1">
                    <div className="w-2.5 sm:w-3 bg-slate-100 rounded-full h-20 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-purple-700 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ height: item.height }}
                      />
                    </div>
                    <span className="text-[9px] font-medium text-slate-400">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Orbiting Card 5: Bottom-Right Spotify Badge */}
          <div className="hidden sm:flex absolute bottom-20 -right-3 md:-right-6 z-30 w-10 h-10 rounded-full bg-[#1DB954] shadow-xl items-center justify-center text-black font-bold border-2 border-white animate-float-reverse">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.215.352-.676.463-1.028.248-2.82-1.722-6.37-2.112-10.55-1.157-.402.092-.801-.16-.893-.562-.092-.403.16-.801.562-.893 4.575-1.045 8.498-.602 11.66 1.336.353.215.464.676.249 1.028zm1.468-3.262c-.27.44-.848.58-1.288.31-3.227-1.983-8.148-2.556-11.966-1.397-.497.15-1.026-.135-1.176-.632-.15-.496.135-1.025.632-1.175 4.364-1.325 9.794-.687 13.488 1.583.44.27.58.847.31 1.287zm.126-3.41c-3.87-2.298-10.254-2.51-13.97-1.381-.594.18-1.222-.16-1.403-.755-.18-.593.16-1.222.754-1.402 4.267-1.296 11.31-1.05 15.766 1.596.533.316.707 1.004.391 1.537-.316.532-1.004.706-1.538.39z" />
            </svg>
          </div>

          {/* Floating Orbiting Card 6: Bottom-Right "Share spendings" Card */}
          <div className="hidden sm:flex absolute bottom-5 right-6 md:right-12 z-30 items-center justify-between space-x-3 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-100 animate-float-slow">
            <div className="flex items-center space-x-2.5">
              {/* Stack of user avatars */}
              <div className="flex -space-x-2">
                <img
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                  alt="User 1"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="User 2"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                  alt="User 3"
                />
              </div>
              <span className="text-xs font-bold text-slate-800">Share spendings</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#D4F82D] text-black flex items-center justify-center shadow-xs">
              <Share2 size={13} />
            </div>
          </div>

          {/* Device Chassis (Dark rounded tablet bezel with webcam dot) */}
          <div className="bg-slate-950 rounded-t-[32px] sm:rounded-t-[44px] p-2 sm:p-3 pb-0 shadow-2xl border-t-8 border-x-8 border-slate-900">
            {/* Top Webcam / Sensor dot */}
            <div className="w-2 h-2 rounded-full bg-slate-800 mx-auto mb-2" />

            {/* Dashboard Mockup Canvas inside Device */}
            <div className="bg-[#F8F9FD] rounded-t-[20px] sm:rounded-t-[28px] p-4 sm:p-6 border border-slate-200/90 shadow-inner overflow-hidden min-h-[460px] text-left">
              <div className="grid grid-cols-12 gap-5">
                
                {/* Device Mini-Sidebar (Col 3) */}
                <div className="hidden md:flex md:col-span-3 flex-col justify-between pr-3 border-r border-slate-200/60">
                  <div className="space-y-4">
                    {/* Brand in Screen */}
                    <div className="px-2">
                      <LedgerPulseLogo variant="light" size="sm" />
                    </div>

                    {/* Nav Items */}
                    <div className="space-y-1 pt-2">
                      {/* Active Dashboard Tab — Electric Lime Pill */}
                      <div className="bg-[#D4F82D] text-black font-extrabold px-3 py-2 rounded-xl flex items-center space-x-2 text-xs shadow-xs">
                        <LayoutDashboard size={14} />
                        <span>Dashboard</span>
                      </div>
                      <div className="text-slate-500 hover:text-slate-900 font-medium px-3 py-2 rounded-xl flex items-center space-x-2 text-xs transition-colors">
                        <Receipt size={14} />
                        <span>Transactions</span>
                      </div>
                      <div className="text-slate-500 hover:text-slate-900 font-medium px-3 py-2 rounded-xl flex items-center space-x-2 text-xs transition-colors">
                        <AlertTriangle size={14} />
                        <span>Exceptions</span>
                      </div>
                      <div className="text-slate-500 hover:text-slate-900 font-medium px-3 py-2 rounded-xl flex items-center space-x-2 text-xs transition-colors">
                        <Users size={14} />
                        <span>Recipients</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-100 text-[10px] text-slate-500 font-mono">
                    Telemetry: 99.8% match rate
                  </div>
                </div>

                {/* Device Main Dashboard Area (Col 9) */}
                <div className="col-span-12 md:col-span-9 space-y-4">
                  {/* Top Bar inside Screen */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
                        Welcome back, William <span className="ml-1.5">👋</span>
                      </h2>
                    </div>

                    {/* User profile pill */}
                    <div className="flex items-center space-x-2 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
                      <img
                        className="w-6 h-6 rounded-full object-cover"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                        alt="William Grace"
                      />
                      <div className="text-left leading-none pr-1">
                        <span className="text-[11px] font-bold text-slate-800 block">William Grace</span>
                        <span className="text-[8px] text-slate-400 uppercase font-extrabold">ADMIN</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Metric Cards matching reference image */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Card 1: Available balance */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-semibold text-slate-600">Available balance</span>
                        <div className="flex items-center space-x-1">
                          <ExternalLink size={11} />
                          <Info size={11} />
                        </div>
                      </div>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                          $12,480.50
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          +2.2% ↑
                        </span>
                      </div>
                      {/* Green sparkline */}
                      <svg className="w-full h-7 mt-2" viewBox="0 0 100 25">
                        <path
                          d="M 0 20 Q 25 5, 50 15 T 100 8"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Card 2: This month volume */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-semibold text-slate-600">This month volume</span>
                        <div className="flex items-center space-x-1">
                          <ExternalLink size={11} />
                          <Info size={11} />
                        </div>
                      </div>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                          $48,320.00
                        </span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          -0.2% ↘
                        </span>
                      </div>
                      {/* Pink/Rose sparkline */}
                      <svg className="w-full h-7 mt-2" viewBox="0 0 100 25">
                        <path
                          d="M 0 10 Q 30 22, 60 12 T 100 20"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Card 3: Fees paid */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-semibold text-slate-600">Fees paid</span>
                        <div className="flex items-center space-x-1">
                          <ExternalLink size={11} />
                        </div>
                      </div>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                          $320.40
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          +4.7% ↗
                        </span>
                      </div>
                      {/* Orange sparkline */}
                      <svg className="w-full h-7 mt-2" viewBox="0 0 100 25">
                        <path
                          d="M 0 18 Q 30 8, 60 16 T 100 10"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Payment volume over time Chart */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-800">Payment volume over time</span>
                      <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500">
                        <span className="px-2 py-0.5 rounded hover:bg-slate-100 cursor-pointer">7D</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-900 cursor-pointer">30D</span>
                      </div>
                    </div>

                    {/* Soft Lilac / Purple rounded columns */}
                    <div className="relative h-28 flex items-end justify-between px-2 pt-6">
                      {/* Floating tooltip 1 */}
                      <div className="absolute top-1 left-[24%] bg-slate-900 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow-lg z-10">
                        Friday, Jun 12 • $2,340.00
                      </div>
                      {/* Floating tooltip 2 */}
                      <div className="absolute top-3 right-[24%] bg-slate-900 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow-lg z-10">
                        Friday, Jun 19 • $816.49
                      </div>

                      {[40, 65, 30, 85, 45, 95, 60, 40, 75, 55, 90, 70, 85, 50, 65].map((val, i) => (
                        <div key={i} className="flex-1 h-full flex items-end justify-center px-0.5">
                          <div
                            className="w-full max-w-[12px] bg-gradient-to-t from-purple-200 to-purple-500 rounded-full hover:from-purple-300 hover:to-purple-600 transition-all shadow-xs"
                            style={{ height: `${val}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="mt-28 max-w-5xl mx-auto text-left w-full">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-[#D4F82D] px-3 py-1 rounded-full shadow-xs">
              Enterprise Grade
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-3 tracking-tight">
              Engineered for High-Volume Digital Commerce
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950">Universal CSV Ingestion</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Smart wizard auto-maps payment IDs, amounts, and dates from bank and gateway exports with built-in validation rules and clean audit trails.
              </p>
            </div>

            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#D4F82D]/30 flex items-center justify-center text-slate-900 mb-4">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950">Autonomous Reconciliation</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Instant 2-way & multi-ledger matching between processed orders and settled cash. Pinpoints discrepancies and fee leakage automatically.
              </p>
            </div>

            <div className="bg-white/95 rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
                <CreditCard size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950">Razorpay Payment Engine</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Collect payments on demand with verified server-side HMAC-SHA256 signature verification and automated double-entry ledger recording.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern High-End Footer with the New Wave Logo */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <LedgerPulseLogo variant="light" size="sm" href="/" />
          
          <span className="text-slate-500 font-medium">
            LedgerPulse © 2026 — Smart Financial Telemetry & AI Investigation
          </span>

          <div className="flex items-center space-x-6 font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Overview</Link>
            <Link href="/dashboard/transactions" className="hover:text-slate-900 transition-colors">Transactions</Link>
            <Link href="/dashboard/analytics" className="hover:text-slate-900 transition-colors">Analytics</Link>
            <Link href="/dashboard/import" className="hover:text-slate-900 transition-colors">Import Wizard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
