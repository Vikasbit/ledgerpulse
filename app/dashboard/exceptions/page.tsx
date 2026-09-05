'use client';

// app/dashboard/exceptions/page.tsx
/**
 * Reconciliation Exceptions Desk
 * 
 * Central controller console to review, triage, and investigate discrepancies
 * across orders, payment gateway captures, settlements, and bank credit feeds.
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useReconciliation } from '@/lib/reconciliation/context';
import { useToast } from '@/components/ui/ToastProvider';
import {
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  ExternalLink,
  Check,
  Loader2,
} from 'lucide-react';

export default function ExceptionsDeskPage() {
  const { exceptions, unresolvedCount, highPriorityCount, totalDiscrepancyPaise, resetToDefault } = useReconciliation();
  const { addToast } = useToast();
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'open' | 'investigated' | 'resolved'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemoCases = () => {
    setIsResetting(true);
    setSeverityFilter('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
    resetToDefault();
    addToast({
      title: 'Demo Cases Reset',
      description: 'All 10 controlled reconciliation exceptions restored to default Open state.',
      variant: 'success',
    });
    setTimeout(() => {
      setIsResetting(false);
    }, 700);
  };


  const filteredExceptions = useMemo(() => {
    return exceptions.filter((e) => {
      if (severityFilter !== 'ALL' && e.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.id.toLowerCase().includes(q) ||
          e.transactionRef.toLowerCase().includes(q) ||
          e.customerName.toLowerCase().includes(q) ||
          e.categoryLabel.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [exceptions, severityFilter, statusFilter, searchQuery]);

  const mediumPriorityCount = exceptions.filter(
    (e) => (e.status === 'open' || e.status === 'investigated') && e.severity === 'MEDIUM'
  ).length;

  const lowPriorityCount = exceptions.filter(
    (e) => (e.status === 'open' || e.status === 'investigated') && e.severity === 'LOW'
  ).length;

  const resolvedCount = exceptions.filter((e) => e.status === 'resolved' || e.status === 'dismissed').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reconciliation Exceptions Desk
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              AI Controller Active
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Deterministic matching anomalies, fee overcharges, and missing bank credits flagged for forensic review.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDemoCases}
            disabled={isResetting}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all shadow-sm active:scale-95"
            title="Restore default controlled test cases and clear filters"
          >
            {isResetting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 text-indigo-600 animate-spin" />
                <span>Restoring Cases...</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset Demo Cases</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 block">Total Unresolved</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{unresolvedCount}</span>
            <span className="text-xs text-slate-600">anomalies</span>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-rose-600 block flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" /> High Severity
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-rose-700">{highPriorityCount}</span>
            <span className="text-xs text-rose-700 font-medium">requires action</span>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-amber-800 block flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Medium Severity
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-amber-800">{mediumPriorityCount}</span>
            <span className="text-xs text-amber-800">review variance</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-600 block">Low / In-Flight</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-700">{lowPriorityCount}</span>
            <span className="text-xs text-slate-600">clearing cycles</span>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-700 block">Capital at Variance</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-bold text-indigo-900">
              ₹{(totalDiscrepancyPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5" /> Severity:
          </span>
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                severityFilter === sev
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exceptions or UTR..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Exceptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Exception ID & Ref</th>
                <th className="py-3.5 px-4">Discrepancy</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">AI Investigation</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredExceptions.map((exc) => {
                const isInvestigated = !!exc.aiInvestigation || exc.status === 'investigated';
                const sevBadge =
                  exc.severity === 'HIGH'
                    ? 'bg-rose-100 text-rose-700 ring-rose-600/20'
                    : exc.severity === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800 ring-amber-600/20'
                    : 'bg-slate-100 text-slate-700 ring-slate-600/20';

                return (
                  <tr key={exc.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-slate-900">{exc.id}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{exc.transactionRef}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{exc.customerName}</div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      ₹{(exc.discrepancyPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 border border-indigo-200/60">
                        {exc.categoryLabel}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset uppercase ${sevBadge}`}>
                        {exc.severity}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {isInvestigated ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Complete ({exc.aiInvestigation?.confidenceScore || 92}%)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="h-4 w-4" />
                          <span>Pending Analysis</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          exc.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : exc.status === 'investigated'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {exc.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Link
                        href={`/dashboard/exceptions/${exc.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold transition-all shadow-sm group-hover:bg-indigo-600"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
