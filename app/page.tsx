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
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-300/30 via-purple-300/20 to-pink-200/20 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-[600px] right-[-100px] w-[600px] h-[600px] bg-gradient-to-br from-cyan-200/25 to-indigo-200/20 blur-[140px] -z-10 pointer-events-none rounded-full" />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/75 border-b border-slate-200/70 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-2 ring-white">
              <Zap size={18} className="text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                LedgerPulse
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/80">
                MVP
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100/60 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-sm hover:shadow active:scale-[0.98]"
            >
              <span>Launch App</span>
              <ArrowRight size={15} className="ml-1.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center max-w-5xl mx-auto">
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 mb-8 text-xs font-semibold text-indigo-700 bg-indigo-50/80 border border-indigo-200/70 rounded-full shadow-sm">
          <Sparkles size={13} className="text-indigo-600" />
          <span>Intelligent Financial Ledger & Reconciliation Engine</span>
          <span className="text-indigo-300">•</span>
          <span className="text-indigo-600 font-bold">Razorpay Integrated</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08] max-w-4xl">
          Unified payments & ledger,{" "}
          <span className="gradient-text">effortlessly automated.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
          Import bulk CSV transactions with auto-header mapping, visualize revenue trends in real time, and process verified Razorpay payments in one unified command center.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore Live Dashboard</span>
            <ArrowRight size={18} className="ml-2" />
          </Link>
          <Link
            href="/dashboard/import"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50/80 hover:text-slate-900 transition-all shadow-sm"
          >
            <FileSpreadsheet size={18} className="mr-2 text-indigo-600" />
            <span>Test CSV Import</span>
          </Link>
        </div>

        {/* Social Proof Metric Chips */}
        <div className="mt-14 pt-10 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 w-full">
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">₹48.2M+</p>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Volume Analyzed</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">&lt; 150ms</p>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Validation Speed</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">99.8%</p>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Reconciliation Rate</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Zero</p>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Setup Required</p>
          </div>
        </div>

        {/* Interactive Dashboard Preview Mockup Card */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/60 to-slate-100/30 border border-slate-200/80 shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
          <div className="rounded-xl overflow-hidden bg-white border border-slate-200/70 text-left">
            {/* Window bar */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-mono text-slate-400">ledgerpulse.app/dashboard</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Sandbox Active</span>
              </div>
            </div>

            {/* Mock Dashboard Content preview */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/40">
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Gross Processed</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹3,42,850</p>
                <div className="flex items-center mt-2 text-xs font-semibold text-emerald-600">
                  <TrendingUp size={13} className="mr-1" />
                  <span>+18.4% vs last period</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Verified Transactions</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">524</p>
                <div className="flex items-center mt-2 text-xs font-semibold text-indigo-600">
                  <CheckCircle2 size={13} className="mr-1" />
                  <span>96.2% success rate</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Payment Gateways</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">Razorpay + CSV</p>
                <div className="flex items-center mt-2 text-xs font-semibold text-slate-500">
                  <span>Instant webhook verify</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for absolute ledger accuracy
            </h3>
            <p className="mt-3 text-slate-500 text-base">
              A high-performance pipeline connecting banking exports, modern payment gateways, and real-time reconciliation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Upload className="text-indigo-600" size={22} />}
              tag="Import"
              title="Intelligent CSV Ingestion"
              description="Drop any transaction CSV. Our auto-detection heuristic resolves amount, customer, payment methods, and timestamps without manual column mapping."
            />
            <FeatureCard
              icon={<BarChart3 className="text-purple-600" size={22} />}
              tag="Analytics"
              title="Real-time Financial Trends"
              description="Dynamic 7, 30, and 90-day volume distributions, payment method breakdowns, and failure rate alerts updated the moment data is ingested."
            />
            <FeatureCard
              icon={<CreditCard className="text-pink-600" size={22} />}
              tag="Checkout"
              title="Native Razorpay Checkout"
              description="Collect instant payments directly through verified Razorpay modal checkout. Cryptographically validated via HMAC SHA-256."
            />
            <FeatureCard
              icon={<Shield className="text-emerald-600" size={22} />}
              tag="Security"
              title="Row Level Security (RLS)"
              description="Every business entity has dedicated tenant isolation in PostgreSQL with Supabase RLS policies and audit logs."
            />
            <FeatureCard
              icon={<Layers className="text-amber-600" size={22} />}
              tag="Storage"
              title="Import History Audit"
              description="Maintain a historical trail of every CSV batch, with exact success rates, skipped rows, and exportable error reports."
            />
            <FeatureCard
              icon={<Zap className="text-cyan-600" size={22} />}
              tag="Demo Mode"
              title="Deterministic Sandbox"
              description="Try every feature with zero setup required. Explore realistic multi-day payment trends with 500 pre-loaded deterministic transactions."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 bg-slate-50 border-t border-slate-200/70 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">LedgerPulse</span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} LedgerPulse. Built with Next.js, Supabase, and Razorpay.
          </p>
          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
            <Link href="/dashboard/transactions" className="hover:text-indigo-600">Transactions</Link>
            <Link href="/dashboard/import" className="hover:text-indigo-600">Import</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  tag,
  title,
  description,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full">
          {tag}
        </span>
      </div>
      <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
        {title}
      </h4>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
