'use client';

// components/dashboard/AIFinanceBrief.tsx
/**
 * Daily AI Financial Controller Brief
 * 
 * Embeds an executive intelligence briefing directly on the main dashboard,
 * summarizing active cash leaks, missing bank credits, and top forensic actions.
 */

import React from 'react';
import Link from 'next/link';
import { useReconciliation } from '@/lib/reconciliation/context';
import { Sparkles, ShieldAlert, ArrowRight, Bot, AlertTriangle } from 'lucide-react';

export function AIFinanceBrief() {
  const { unresolvedCount, highPriorityCount, totalDiscrepancyPaise, setCopilotOpen } = useReconciliation();

  const formattedDiscrepancy = `₹${(totalDiscrepancyPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-xl">
      {/* Background glow accents */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/25 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-400/30">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              AI FINANCE CONTROLLER BRIEF
            </span>
            {highPriorityCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/25 px-2.5 py-0.5 text-xs font-medium text-rose-300 ring-1 ring-inset ring-rose-400/30">
                <ShieldAlert className="h-3 w-3" />
                {highPriorityCount} High Risk
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {unresolvedCount > 0
              ? `${unresolvedCount} Reconciliation Exceptions Require Controller Action`
              : 'All Payment Lifecycles Fully Balanced'}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {unresolvedCount > 0 ? (
              <>
                Autonomous reconciliation detected <strong className="text-white font-semibold">{formattedDiscrepancy}</strong> in active variances across gateway settlements, bank credit postings, and refund items. The AI Controller recommends prioritizing UTR trace inquiries and underbilled balance recovery.
              </>
            ) : (
              'Every captured order matches 1:1 with gateway captures, settlement disbursements, and verified bank ledger credits with zero leakage.'
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Capital at Risk</span>
              <span className="text-base font-bold text-indigo-300">{formattedDiscrepancy}</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Open Exceptions</span>
              <span className="text-base font-bold text-white">{unresolvedCount} Active</span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl bg-white/5 p-3 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">AI Investigation</span>
              <span className="text-base font-bold text-emerald-400">Continuous 24/7</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
          <Link
            href="/dashboard/exceptions"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <AlertTriangle className="h-4 w-4" />
            Exceptions Desk
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>

          <button
            onClick={() => setCopilotOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Bot className="h-4 w-4 text-indigo-400" />
            Ask Finance Copilot
          </button>
        </div>
      </div>
    </div>
  );
}
