"use client";

// app/dashboard/page.tsx
// Executive Reconciliation Dashboard — Inspired by Enterprise Fintech Reference Design

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
  Bot,
  Filter,
  Check,
  Clock,
  MoreVertical,
  ChevronRight,
  Wallet,
  Building2,
  CircleDollarSign,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { RazorpayCheckout } from "@/components/razorpay/RazorpayCheckout";
import { useToast } from "@/components/ui/ToastProvider";
import { calculateFinancialMetrics, formatINR } from "@/lib/metrics";
import { AIFinanceBrief } from "@/components/dashboard/AIFinanceBrief";

export default function DashboardOverview() {

  const { transactions, isDemo, businesses, addTransactions, referenceDate } = useDemo();
  const { addToast } = useToast();

  const [isCollectOpen, setIsCollectOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(1000);
  const [payCustomer, setPayCustomer] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "settlements" | "discrepancies">("overview");

  const stats = useMemo(() => {
    // Canonical all-time metrics
    const metrics = calculateFinancialMetrics(transactions);

    // Latest successful settlements
    const recentSettlements = transactions
      .filter((t) => t.status === "success")
      .slice(0, 5);

    // Channel breakdown calculations
    const channelTotals: Record<string, number> = { upi: 0, netbanking: 0, card: 0, wallet: 0 };
    transactions.forEach((t) => {
      if (t.status === "success") {
        const method = (t.payment_method?.toLowerCase() || "upi") as keyof typeof channelTotals;
        if (method in channelTotals) {
          channelTotals[method] += t.amount;
        } else {
          channelTotals.upi += t.amount;
        }
      }
    });

    return {
      metrics,
      recentSettlements,
      channelTotals,
    };
  }, [transactions]);

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
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Header Section - Matching Reference Image 2 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reconciliation
            </h1>
            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
              <ShieldCheck size={15} />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multi-channel settlement reconciliation & automated payment matching
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer">
            <Calendar size={14} className="text-slate-400" />
            <span>14 Mar – 20 Mar 2024</span>
          </div>

          {/* Account Filter Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer">
            <Filter size={14} className="text-slate-400" />
            <span>All accounts</span>
          </div>

          {/* Collect Payment CTA */}
          <button
            onClick={() => setIsCollectOpen(true)}
            className="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-600/30 hover:shadow active:scale-[0.98]"
          >
            <Plus size={16} className="mr-1.5" />
            <span>Collect</span>
          </button>

          {/* Export Action */}
          <Link
            href="/dashboard/import"
            className="p-2 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs"
            title="Import / Export Center"
          >
            <Download size={16} />
          </Link>
        </div>
      </div>

      {/* Quick Navigation Tab Bar - From Image 2 */}
      <div className="flex items-center space-x-6 border-b border-slate-200/70 text-xs sm:text-sm font-semibold text-slate-500 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "overview"
              ? "border-teal-600 text-teal-700 font-bold"
              : "border-transparent hover:text-slate-800"
          }`}
        >
          Overview
        </button>
        <Link
          href="/dashboard/transactions"
          className="pb-3 border-b-2 border-transparent hover:text-slate-800 hover:border-slate-300 transition-all"
        >
          Transactions
        </Link>
        <Link
          href="/dashboard/transactions?status=success"
          className="pb-3 border-b-2 border-transparent hover:text-slate-800 hover:border-slate-300 transition-all"
        >
          Settlements
        </Link>
        <Link
          href="/dashboard/exceptions"
          className="pb-3 border-b-2 border-transparent hover:text-slate-800 hover:border-slate-300 transition-all flex items-center space-x-1.5"
        >
          <span>Exceptions</span>
          <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 text-[10px] flex items-center justify-center font-bold">
            {stats.metrics.failedCount}
          </span>
        </Link>
        <Link
          href="/dashboard/analytics"
          className="pb-3 border-b-2 border-transparent hover:text-slate-800 hover:border-slate-300 transition-all"
        >
          Reports
        </Link>
        <Link
          href="/dashboard/settings"
          className="pb-3 border-b-2 border-transparent hover:text-slate-800 hover:border-slate-300 transition-all"
        >
          Rules
        </Link>
      </div>

      {/* AI Financial Controller Executive Brief */}
      <AIFinanceBrief />

      {/* Top 5 KPI Stats Grid with SVG Micro-Sparklines - Directly from Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Reconciliation Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Reconciliation status</span>
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check size={12} strokeWidth={3} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {stats.metrics.reconciliationRate.toFixed(1)}%
            </p>
            <span className="text-[11px] text-slate-400 font-medium">Fully reconciled</span>
          </div>
          {/* Sparkline curve */}
          <div className="mt-4 pt-1">
            <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0,20 Q25,22 45,15 T75,8 T100,5" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Settlements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total settlements</span>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {stats.metrics.totalCount.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1 mt-0.5">
              <span>↑ 18.6%</span>
              <span className="text-slate-400 font-normal">vs last week</span>
            </span>
          </div>
          <div className="mt-4 pt-1">
            <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0,18 Q20,10 50,14 T80,8 T100,3" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Total Settled */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total settled</span>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono tracking-tight">
              {formatINR(stats.metrics.settledVolume)}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1 mt-0.5">
              <span>↑ 22.4%</span>
              <span className="text-slate-400 font-normal">vs last period</span>
            </span>
          </div>
          <div className="mt-4 pt-1">
            <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0,22 Q30,18 60,10 T85,6 T100,2" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Total Discrepancies */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total discrepancies</span>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {stats.metrics.failedCount}
            </p>
            <span className="text-[11px] text-amber-600 font-semibold flex items-center space-x-1 mt-0.5">
              <span>↓ 100%</span>
              <span className="text-slate-400 font-normal">flagged exceptions</span>
            </span>
          </div>
          <div className="mt-4 pt-1">
            <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0,8 Q35,12 60,20 T100,24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: Automation Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Automation rate</span>
              <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Bot size={13} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
              98.7%
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1 mt-0.5">
              <span>↑ 5.4%</span>
              <span className="text-slate-400 font-normal">auto-matched</span>
            </span>
          </div>
          <div className="mt-4 pt-1">
            <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0,15 Q30,12 65,7 T100,4" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* Middle 3-Column Section - Breakdown Donut, Stepper, and Reconciliation Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Column 1: Currency / Channel Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Channel breakdown
            </h2>
            <span className="text-xs text-slate-400 font-medium">Settled</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
            {/* Donut Chart */}
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="5.5" />
                {/* UPI Slice (69.2%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#0d9488" strokeWidth="5.5" strokeDasharray="69 100" strokeDashoffset="0" />
                {/* NetBanking (18.0%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#6366f1" strokeWidth="5.5" strokeDasharray="18 100" strokeDashoffset="-69" />
                {/* Card (9.4%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="5.5" strokeDasharray="9.4 100" strokeDashoffset="-87" />
                {/* Wallet (3.4%) */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ec4899" strokeWidth="5.5" strokeDasharray="3.4 100" strokeDashoffset="-96.4" />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total settled</span>
                <span className="text-sm font-black text-slate-900 tracking-tight">₹26.6L</span>
              </div>
            </div>

            {/* Tabular Aligned Legend from Image 2 */}
            <div className="space-y-2.5 w-full text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  <span className="font-semibold text-slate-700">UPI Payments</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-slate-900">₹18.4L</span>
                  <span className="text-slate-400 ml-1.5 text-[11px]">69.2%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="font-semibold text-slate-700">Net Banking</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-slate-900">₹4.8L</span>
                  <span className="text-slate-400 ml-1.5 text-[11px]">18.0%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-700">Credit Cards</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-slate-900">₹2.5L</span>
                  <span className="text-slate-400 ml-1.5 text-[11px]">9.4%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span className="font-semibold text-slate-700">Wallets</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-slate-900">₹0.9L</span>
                  <span className="text-slate-400 ml-1.5 text-[11px]">3.4%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <Link
              href="/dashboard/analytics"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors inline-flex items-center"
            >
              <span>View full breakdown</span>
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Column 2: Settlement Timeline Stepper (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Settlement timeline
            </h2>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
              Live Pipeline
            </span>
          </div>

          {/* 5-Step Connected Timeline from Image 2 */}
          <div className="my-auto py-2">
            <div className="relative flex items-center justify-between w-full">
              {/* Horizontal Connecting Line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-teal-600 -translate-y-1/2 -z-0" />

              {/* Stage 1: Initiated */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Initiated</span>
                <span className="text-[10px] text-slate-400">10:15</span>
              </div>

              {/* Stage 2: Processing */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Processing</span>
                <span className="text-[10px] text-slate-400">10:17</span>
              </div>

              {/* Stage 3: Settlement */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Settlement</span>
                <span className="text-[10px] text-slate-400">10:24</span>
              </div>

              {/* Stage 4: Reconciling */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Reconciling</span>
                <span className="text-[10px] text-slate-400">10:25</span>
              </div>

              {/* Stage 5: Completed */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-2">Completed</span>
                <span className="text-[10px] text-slate-400">10:27</span>
              </div>
            </div>

            {/* Success Banner Pill from Image 2 */}
            <div className="mt-8 p-3 bg-teal-50/80 border border-teal-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-xs font-semibold text-teal-900">
                  All batch settlements reconciled successfully
                </span>
              </div>
              <button
                onClick={() => addToast({ title: "Settlement engine operating with zero queue backlog", variant: "info" })}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-2xs"
              >
                View details
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Synchronized with Razorpay Gateway & Bank Feeds
            </span>
          </div>
        </div>

        {/* Column 3: Reconciliation Overview Circular Gauge (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Reconciliation overview
            </h2>
          </div>

          {/* Radial Ring Gauge */}
          <div className="relative flex flex-col items-center justify-center my-3">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4.5"
                  strokeDasharray="70.4 100"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-slate-900 font-mono">
                  {stats.metrics.reconciliationRate.toFixed(1)}%
                </span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  Matched
                </span>
              </div>
            </div>
          </div>

          {/* Color Breakdown List */}
          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Matched</span>
              </div>
              <span className="font-bold text-slate-900 font-mono">
                {stats.metrics.successfulCount} ({stats.metrics.reconciliationRate.toFixed(1)}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="text-slate-600">Pending</span>
              </div>
              <span className="font-bold text-slate-900 font-mono">
                {stats.metrics.pendingCount} ({(stats.metrics.pendingCount / stats.metrics.totalCount * 100).toFixed(1)}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-600">Exceptions</span>
              </div>
              <span className="font-bold text-slate-900 font-mono">
                {stats.metrics.failedCount} ({(stats.metrics.failedCount / stats.metrics.totalCount * 100).toFixed(1)}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-slate-600">Refunded</span>
              </div>
              <span className="font-bold text-slate-900 font-mono">
                {stats.metrics.refundedCount} ({(stats.metrics.refundedCount / stats.metrics.totalCount * 100).toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <Link
              href="/dashboard/transactions"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors inline-flex items-center"
            >
              <span>View reconciliation report</span>
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom 2-Column Section - Recent Settlements Table & Accounts Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Column 1 (Wide): High-Density Recent Settlements Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Recent settlements
            </h2>
            <Link
              href="/dashboard/transactions"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors inline-flex items-center"
            >
              <span>View all settlements</span>
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-1">Settlement ID</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Channel</th>
                  <th className="pb-3 text-right">Settlement Amount</th>
                  <th className="pb-3 text-right">Matched Amount</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Match Rate</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentSettlements.map((item, idx) => {
                  const channel = (item.payment_method?.toUpperCase() || "UPI");
                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 pl-1 font-mono font-bold text-slate-900 flex items-center space-x-1.5">
                        <Download size={12} className="text-slate-400 rotate-180" />
                        <span>STL-2024-03-20-{String(idx + 1).padStart(3, "0")}</span>
                      </td>
                      <td className="py-3 text-slate-500 font-medium whitespace-nowrap">
                        {new Date(item.transaction_date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3">
                        <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700">
                          {channel}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-slate-900">
                        ₹{(item.amount / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-right font-mono text-slate-600">
                        ₹{(item.amount / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <Check size={10} strokeWidth={3} />
                          <span>Matched</span>
                        </span>
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-slate-700">
                        100%
                      </td>
                      <td className="py-3 text-right text-slate-400 hover:text-slate-600 cursor-pointer">
                        <MoreVertical size={14} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 2 (Narrow): Accounts / Channel Balances (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Accounts balance
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Available</span>
            </div>

            <div className="space-y-3">
              {/* Account 1: UPI Auto-Pay */}
              <div className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">UPI Instant Rail</span>
                    <span className="text-[10px] text-slate-400 block">Direct Settlement</span>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 font-mono block">₹18,34,500.00</span>
                    <span className="text-[10px] text-emerald-600 block">Available balance</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>

              {/* Account 2: Cards */}
              <div className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                    CC
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Card Networks</span>
                    <span className="text-[10px] text-slate-400 block">Visa / Mastercard / Rupay</span>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 font-mono block">₹4,85,200.00</span>
                    <span className="text-[10px] text-emerald-600 block">Available balance</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>

              {/* Account 3: Net Banking */}
              <div className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    NB
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Net Banking</span>
                    <span className="text-[10px] text-slate-400 block">50+ Core Banks</span>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 font-mono block">₹2,50,000.00</span>
                    <span className="text-[10px] text-emerald-600 block">Available balance</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>

              {/* Account 4: Razorpay Payouts */}
              <div className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center font-bold text-xs">
                    RZP
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Razorpay Direct</span>
                    <span className="text-[10px] text-slate-400 block">Payout Vault</span>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 font-mono block">₹90,280.00</span>
                    <span className="text-[10px] text-emerald-600 block">Available balance</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <Link
              href="/dashboard/transactions"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors inline-flex items-center"
            >
              <span>View all accounts</span>
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>

      </div>

      {/* Collect Payment Modal (Preserved Razorpay Modal) */}
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
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
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
