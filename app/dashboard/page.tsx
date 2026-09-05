"use client";

// app/dashboard/page.tsx
import React, { useMemo, useState } from "react";
import { useDemo } from "@/lib/demo/context";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { RazorpayCheckout } from "@/components/razorpay/RazorpayCheckout";
import { useToast } from "@/components/ui/ToastProvider";

import { calculateFinancialMetrics, formatINR } from "@/lib/metrics";

export default function DashboardOverview() {
  const { transactions, isDemo, businesses, addTransactions, referenceDate } = useDemo();
  const { addToast } = useToast();

  const [isCollectOpen, setIsCollectOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(1000);
  const [payCustomer, setPayCustomer] = useState("");
  const [activeHoverBar, setActiveHoverBar] = useState<string | null>(null);

  const stats = useMemo(() => {
    // Canonical all-time metrics
    const metrics = calculateFinancialMetrics(transactions);

    // Recent Inflow: Latest 5 settled (successful) transactions from the SAME dataset
    const recentInflowTxns = transactions
      .filter((t) => t.status === "success")
      .slice(0, 5);

    // 7-Day Revenue Velocity anchored to referenceDate
    const refTime = referenceDate ? new Date(referenceDate).getTime() : Date.now();
    const dailyRevenue: Record<string, { amount: number; count: number; dateStr: string; label: string }> = {};

    // Generate chronological 7 days: 6 days ago -> today (day 0)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(refTime - i * 86400000);
      const key = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" });
      dailyRevenue[key] = { amount: 0, count: 0, dateStr: key, label: dayLabel };
    }

    // Aggregate matching successful transactions
    transactions
      .filter((t) => t.status === "success")
      .forEach((t) => {
        const key = t.transaction_date.split("T")[0];
        if (key in dailyRevenue) {
          dailyRevenue[key].amount += t.amount;
          dailyRevenue[key].count += 1;
        }
      });

    // Weekly volume is the EXACT sum of the 7-day velocity bars
    const weeklyVolume = Object.values(dailyRevenue).reduce((acc, d) => acc + d.amount, 0);

    return {
      metrics,
      recentInflowTxns,
      dailyRevenue,
      weeklyVolume,
    };
  }, [transactions, referenceDate]);

  const formatAmount = (paise: number) =>
    `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const handlePaymentSuccess = (orderId: string) => {
    const newTxn = {
      id: `manual-${Date.now()}`,
      business_id: businesses[0]?.id ?? "demo-biz-001",
      transaction_id: `RZP${Date.now().toString().slice(-6)}`,
      customer_name: payCustomer.trim() || "Express Customer",
      amount: payAmount * 100,
      currency: "INR",
      status: "success" as const,
      payment_method: "upi" as const,
      transaction_date: new Date().toISOString(),
    };
    addTransactions([newTxn]);
    setIsCollectOpen(false);
    addToast({
      title: `₹${payAmount} collected successfully!`,
      description: `Order ID: ${orderId}`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header with Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Dashboard
            </h1>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full">
              Live Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time financial telemetry, reconciliation status, and settlement volume insights
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsCollectOpen(true)}
            className="inline-flex items-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-600/30 hover:shadow active:scale-[0.98]"
          >
            <Plus size={16} className="mr-1.5" />
            <span>Collect Payment</span>
          </button>
          <Link
            href="/dashboard/import"
            className="inline-flex items-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 transition-all shadow-xs"
          >
            <span>Import CSV</span>
            <ArrowUpRight size={15} className="ml-1.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Settled Volume"
          value={formatINR(stats.metrics.settledVolume)}
          trend={`${stats.metrics.successfulCount} settled of ${stats.metrics.totalCount} total`}
          trendUp={true}
          icon="₹"
          badge="Settled"
          color="indigo"
        />
        <StatCard
          label="Processed Transactions"
          value={stats.metrics.totalCount.toLocaleString()}
          trend={`${stats.metrics.pendingCount} pending settlement`}
          icon={<CreditCard size={18} />}
          badge="Total Volume"
          color="blue"
        />
        <StatCard
          label="Reconciliation Rate"
          value={`${stats.metrics.reconciliationRate.toFixed(1)}%`}
          trend={`${stats.metrics.successfulCount} successfully settled`}
          trendUp={true}
          icon={<CheckCircle2 size={18} />}
          badge="Optimal"
          color="emerald"
        />
        <StatCard
          label="Unresolved Exceptions"
          value={stats.metrics.unresolvedExceptions.toLocaleString()}
          trend={`${stats.metrics.unresolvedExceptions} failed transactions require review`}
          trendUp={stats.metrics.unresolvedExceptions === 0}
          icon={<XCircle size={18} />}
          badge="Audit Alert"
          color="rose"
        />
      </div>

      {/* Main Visuals Grid: 7-Day Settled Volume + Live Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  7-Day Settled Volume
                </h2>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-full font-mono">
                  Weekly: {formatINR(stats.weeklyVolume)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Hover over bars to inspect daily settlement volume and transaction density
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs text-slate-500 bg-slate-50 p-1 rounded-lg border border-slate-200/60">
              <span className="px-2 py-0.5 font-semibold text-indigo-600 bg-white rounded shadow-2xs">
                7 Days
              </span>
              <Link href="/dashboard/analytics" className="px-2 py-0.5 hover:text-slate-900">
                Full Analytics →
              </Link>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="flex items-end space-x-3 sm:space-x-4 h-52">
              {Object.entries(stats.dailyRevenue).map(([date, data]) => {
                const maxVal = Math.max(
                  ...Object.values(stats.dailyRevenue).map((d) => d.amount),
                  1
                );
                const height = Math.max((data.amount / maxVal) * 100, 10);
                const isHovered = activeHoverBar === date;

                return (
                  <div
                    key={date}
                    onMouseEnter={() => setActiveHoverBar(date)}
                    onMouseLeave={() => setActiveHoverBar(null)}
                    className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer relative"
                  >
                    {/* Interactive Tooltip Popover */}
                    {isHovered && (
                      <div className="absolute -top-16 z-20 px-3 py-2 bg-slate-900 text-white rounded-xl shadow-2xl text-center pointer-events-none animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap border border-slate-700/60">
                        <p className="text-[11px] text-slate-300 font-medium">
                          {data.dateStr} ({data.count} txns)
                        </p>
                        <p className="text-xs font-bold text-emerald-400 font-mono">
                          {formatAmount(data.amount)}
                        </p>
                      </div>
                    )}

                    <div className="w-full h-40 flex items-end justify-center">
                      <div
                        className={`w-full max-w-[48px] rounded-t-xl transition-all duration-200 ${
                          isHovered
                            ? "bg-gradient-to-t from-indigo-600 via-indigo-500 to-pink-500 shadow-lg shadow-indigo-500/40 scale-x-105"
                            : "bg-gradient-to-t from-indigo-600/90 to-purple-400 hover:from-indigo-600 hover:to-purple-500"
                        }`}
                        style={{ height: `${height}%`, minHeight: "16px" }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-medium mt-2 transition-colors ${
                        isHovered ? "text-indigo-600 font-bold" : "text-slate-400"
                      }`}
                    >
                      {data.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
              <span>Settled Volume ({Object.values(stats.dailyRevenue).reduce((a, b) => a + b.count, 0)} transactions)</span>
            </div>
            <span className="font-mono text-[11px]">Updated in real-time</span>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Recent Inflow
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest settled transactions
                </p>
              </div>
              <Link
                href="/dashboard/transactions"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                <span>View all</span>
                <ArrowRight size={12} className="ml-1" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {stats.recentInflowTxns.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  No recent activity found.
                </div>
              ) : (
                stats.recentInflowTxns.map((txn) => {
                  const initial = txn.customer_name ? txn.customer_name.charAt(0) : "C";
                  const dateFormatted = new Date(txn.transaction_date).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div
                      key={txn.id}
                      className="p-2.5 rounded-xl hover:bg-slate-50/90 border border-slate-100 hover:border-slate-200/60 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200/70 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 leading-tight truncate">
                            {txn.customer_name}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-400">
                            <span className="font-mono">{dateFormatted}</span>
                            <span>•</span>
                            <span className="uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded text-[9px]">
                              {txn.payment_method}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-xs font-bold text-slate-900 font-mono">
                          {formatAmount(txn.amount)}
                        </p>
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                          Settled
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              href="/dashboard/transactions"
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Explore all {stats.metrics.totalCount.toLocaleString()} transactions →
            </Link>
          </div>
        </div>
      </div>

      {/* Collect Payment Modal */}
      <Modal
        open={isCollectOpen}
        onClose={() => setIsCollectOpen(false)}
        title="Collect Razorpay Payment"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Chandra"
              value={payCustomer}
              onChange={(e) => setPayCustomer(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Preset Amounts
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPayAmount(amt)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    payAmount === amt
                      ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Custom Amount (₹ INR)
            </label>
            <input
              type="number"
              min="1"
              value={payAmount}
              onChange={(e) => setPayAmount(Math.max(1, Number(e.target.value)))}
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 font-mono font-bold"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col items-center">
            <RazorpayCheckout
              amount={payAmount * 100}
              currency="INR"
              receipt={`INV-${Date.now().toString().slice(-4)}`}
              onSuccess={handlePaymentSuccess}
              onError={(err) => addToast({ title: err, variant: "error" })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  trendUp,
  icon,
  badge,
  color,
}: {
  label: string;
  value: string;
  trend: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  badge: string;
  color: "indigo" | "blue" | "emerald" | "rose";
}) {
  const colorStyles = {
    indigo: {
      bg: "bg-indigo-50/80 text-indigo-600 border-indigo-200/60",
      accent: "text-indigo-600",
    },
    blue: {
      bg: "bg-blue-50/80 text-blue-600 border-blue-200/60",
      accent: "text-blue-600",
    },
    emerald: {
      bg: "bg-emerald-50/80 text-emerald-600 border-emerald-200/60",
      accent: "text-emerald-600",
    },
    rose: {
      bg: "bg-rose-50/80 text-rose-600 border-rose-200/60",
      accent: "text-rose-600",
    },
  };

  const style = colorStyles[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-sm ${style.bg} group-hover:scale-105 transition-transform`}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
        {value}
      </p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center space-x-1.5 text-xs">
          {trendUp !== undefined ? (
            trendUp ? (
              <TrendingUp size={13} className="text-emerald-500" />
            ) : (
              <TrendingDown size={13} className="text-rose-500" />
            )
          ) : null}
          <span className="text-[11px] font-medium text-slate-500">{trend}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60">
          {badge}
        </span>
      </div>
    </div>
  );
}
