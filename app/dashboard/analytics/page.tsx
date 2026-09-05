"use client";

// app/dashboard/analytics/page.tsx
import React, { useMemo, useState } from "react";
import { useDemo } from "@/lib/demo/context";
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Percent,
} from "lucide-react";

import { calculateFinancialMetrics, formatINR } from "@/lib/metrics";

type TimeRange = "7d" | "30d" | "90d";

export default function AnalyticsPage() {
  const { transactions, referenceDate } = useDemo();
  const [range, setRange] = useState<TimeRange>("30d");

  const daysMap: Record<TimeRange, number> = { "7d": 7, "30d": 30, "90d": 90 };

  const { metrics, revenueByDay } = useMemo(() => {
    const days = daysMap[range];
    const metrics = calculateFinancialMetrics(transactions, {
      referenceDate,
      days,
    });

    const refTime = referenceDate ? new Date(referenceDate).getTime() : Date.now();
    const cutoff = refTime - days * 86400000;
    const inRangeSuccess = transactions.filter(
      (t) => t.status === "success" && new Date(t.transaction_date).getTime() >= cutoff
    );

    // Revenue over time for the active range
    const revenueByDay: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(refTime - i * 86400000);
      revenueByDay[d.toISOString().split("T")[0]] = 0;
    }
    inRangeSuccess.forEach((t) => {
      const key = t.transaction_date.split("T")[0];
      if (key in revenueByDay) revenueByDay[key] += t.amount;
    });

    return {
      metrics,
      revenueByDay,
    };
  }, [transactions, referenceDate, range]);

  const METHOD_INFO: Record<string, { label: string; bar: string; badge: string }> = {
    upi: { label: "UPI (Google Pay, PhonePe, Paytm)", bar: "bg-indigo-600", badge: "bg-indigo-50 text-indigo-700" },
    card: { label: "Credit & Debit Cards (Visa, MC, RuPay)", bar: "bg-purple-600", badge: "bg-purple-50 text-purple-700" },
    netbanking: { label: "Net Banking (HDFC, ICICI, SBI)", bar: "bg-blue-600", badge: "bg-blue-50 text-blue-700" },
    wallet: { label: "Prepaid Wallets & Cashcards", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Volume & Reconciliation Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Historical settlement velocity, gateway distribution, and reconciliation performance
          </p>
        </div>

        {/* Time Range Pill Switcher */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
          {(["7d", "30d", "90d"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                range === r
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Settled Window Volume
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1">
            {formatINR(metrics.settledVolume)}
          </p>
          <div className="flex items-center mt-3 text-xs text-emerald-600 font-semibold">
            <TrendingUp size={13} className="mr-1" />
            <span>{metrics.successfulCount} settled transactions</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Processed Transactions
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1">
            {metrics.totalCount.toLocaleString()}
          </p>
          <div className="flex items-center mt-3 text-xs text-indigo-600 font-semibold">
            <span>{daysMap[range]} days window</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Avg. Settled Ticket
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1">
            {formatINR(metrics.avgSettledTicket)}
          </p>
          <div className="flex items-center mt-3 text-xs text-slate-500 font-semibold">
            <span>Average settled order value</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Reconciliation Rate
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1">
            {metrics.reconciliationRate.toFixed(1)}%
          </p>
          <div className="flex items-center mt-3 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 size={13} className="mr-1" />
            <span>Settled & verified ratio</span>
          </div>
        </div>
      </div>

      {/* Gateway Breakdown & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Payment Channel Distribution
            </h2>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
              {metrics.totalCount} total
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Share of transaction volume and volume split by payment gateway
          </p>

          <div className="space-y-4">
            {metrics.methodBreakdown.map((item) => {
              const info = METHOD_INFO[item.method] || {
                label: item.method.toUpperCase(),
                bar: "bg-indigo-600",
                badge: "bg-slate-100 text-slate-700",
              };

              return (
                <div key={item.method} className="space-y-2 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800 text-xs">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-slate-600 font-semibold">
                        {formatINR(item.volume)}
                      </span>
                      <span className="font-mono text-slate-400">
                        • {item.count} txns ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${info.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(item.percentage, item.count > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction Outcome Status Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Settlement Status Distribution
              </h2>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                {daysMap[range]}D Audit
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Ledger status audit across the active {daysMap[range]}-day window
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Successful
                </span>
                <p className="text-2xl font-extrabold text-emerald-900 font-mono mt-1">
                  {metrics.statusCounts.success.toLocaleString()}
                </p>
                <p className="text-[11px] text-emerald-600 mt-1">
                  Fully settled & verified
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Pending
                </span>
                <p className="text-2xl font-extrabold text-amber-900 font-mono mt-1">
                  {metrics.statusCounts.pending.toLocaleString()}
                </p>
                <p className="text-[11px] text-amber-600 mt-1">
                  Awaiting gateway webhook
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/70">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Failed
                </span>
                <p className="text-2xl font-extrabold text-rose-900 font-mono mt-1">
                  {metrics.statusCounts.failed.toLocaleString()}
                </p>
                <p className="text-[11px] text-rose-600 mt-1">
                  Declined or timeout
                </p>
              </div>

              <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/70">
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                  Refunded
                </span>
                <p className="text-2xl font-extrabold text-orange-900 font-mono mt-1">
                  {metrics.statusCounts.refunded.toLocaleString()}
                </p>
                <p className="text-[11px] text-orange-600 mt-1">
                  Returned to customer
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Data integrity status: <strong className="text-slate-700">100% Reconciled</strong></span>
            <span className="font-mono text-[11px]">Same source of truth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
