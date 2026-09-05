'use client';

// app/dashboard/exceptions/[id]/page.tsx
/**
 * Exception Investigation & Forensic Audit Detail Page
 * 
 * Deep-dive investigation environment with multi-stage evidence chain,
 * interactive AI controller execution, and audit-grade remediation actions.
 */

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReconciliation } from '@/lib/reconciliation/context';
import { EvidenceChainViewer } from '@/components/reconciliation/EvidenceChain';
import {
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  Building2,
  Clock,
  Loader2,
  Check,
  X,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ExceptionDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { exceptions, getExceptionById, investigateException, updateStatus, addNote, investigatingIds } = useReconciliation();

  const [noteInput, setNoteInput] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [tickerPhase, setTickerPhase] = useState(0);

  const exception = getExceptionById(resolvedParams.id);
  const isInvestigating = investigatingIds.has(resolvedParams.id);

  // Animated investigation ticker phases
  const tickerPhases = [
    'Cross-referencing order, payment, and settlement hashes...',
    'Verifying gateway fee deductions against contractual rate card...',
    'Querying bank statement feed for UTR clearance...',
    'Synthesizing forensic root-cause and recovery workflow...',
  ];

  useEffect(() => {
    let interval: any;
    if (isInvestigating) {
      interval = setInterval(() => {
        setTickerPhase((prev) => (prev + 1) % tickerPhases.length);
      }, 1800);
    } else {
      setTickerPhase(0);
    }
    return () => clearInterval(interval);
  }, [isInvestigating]);

  if (!exception) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Exception Not Found</h2>
        <p className="text-sm text-slate-500">The requested exception ID does not exist in the ledger.</p>
        <Link
          href="/dashboard/exceptions"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exceptions Desk
        </Link>
      </div>
    );
  }

  const investigation = exception.aiInvestigation;

  const handleRunInvestigation = async () => {
    try {
      await investigateException(exception.id);
    } catch (err) {
      console.error('Failed to run AI investigation:', err);
    }
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    addNote(exception.id, noteInput.trim());
    setNoteInput('');
    setShowNoteModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/dashboard/exceptions" className="hover:text-slate-900 transition-colors">Exceptions Desk</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900 font-mono font-semibold">{exception.id}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono font-bold text-lg text-slate-900">{exception.id}</span>
            <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">
              {exception.categoryLabel}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                exception.severity === 'HIGH'
                  ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-600/20'
                  : exception.severity === 'MEDIUM'
                  ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-600/20'
                  : 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20'
              }`}
            >
              {exception.severity} Priority
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                exception.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20'
                  : exception.status === 'investigated'
                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20'
                  : 'bg-amber-100 text-amber-800 ring-1 ring-amber-600/20'
              }`}
            >
              Status: {exception.status}
            </span>
          </div>

          <div className="text-sm text-slate-600 flex items-center gap-4">
            <span>Customer: <strong className="text-slate-900">{exception.customerName}</strong></span>
            <span>Ref: <strong className="text-slate-900 font-mono">{exception.transactionRef}</strong></span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Variance Amount</span>
          <span className="text-3xl font-extrabold text-slate-900">
            ₹{(exception.discrepancyPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Visual Evidence Chain */}
      <EvidenceChainViewer chain={exception.evidenceChain} />

      {/* AI Investigation Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            AI Controller Forensic Investigation
          </h2>

          <button
            onClick={handleRunInvestigation}
            disabled={isInvestigating}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-4 py-2.5 text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isInvestigating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Investigating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {investigation ? 'Re-run AI Investigation' : 'Investigate with AI'}
              </>
            )}
          </button>
        </div>

        {/* Dynamic Investigation Progress Ticker */}
        {isInvestigating && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 flex items-center gap-4 animate-pulse">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Autonomous Controller in Progress
              </h4>
              <p className="text-sm font-medium text-indigo-700 mt-0.5">
                {tickerPhases[tickerPhase]}
              </p>
            </div>
          </div>
        )}

        {/* AI Investigation Results */}
        {investigation ? (
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg overflow-hidden">
            {/* Header pill */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-inset ring-indigo-400/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Forensic Root Cause Identified</h3>
                  <p className="text-xs text-slate-400">
                    Model: {investigation.modelUsed} | Confidence Score: {investigation.confidenceScore}%
                  </p>
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold ring-1 ring-emerald-500/30">
                Audit Verified
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Root Cause Banner */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block mb-1">
                  Root Cause
                </span>
                <p className="text-sm text-indigo-950 font-medium leading-relaxed">
                  {investigation.rootCause}
                </p>
              </div>

              {/* Executive Summary & Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Summary</h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    {investigation.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Detailed Accounting Analysis</h4>
                  <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80 whitespace-pre-wrap">
                    {investigation.detailedAnalysis}
                  </div>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Recommended Remediation: {investigation.recommendedAction.title}
                  </span>
                  <p className="text-xs text-emerald-900">
                    {investigation.recommendedAction.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {investigation.recommendedAction.actionType === 'razorpay_collect' && (
                    <button
                      onClick={() => alert(`Razorpay recovery link of ₹${(exception.discrepancyPaise / 100).toFixed(2)} generated for ${exception.customerName}`)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
                    >
                      <CreditCard className="h-4 w-4" />
                      Collect via Razorpay
                    </button>
                  )}
                  {investigation.recommendedAction.actionType === 'bank_inquiry' && (
                    <button
                      onClick={() => alert(`Acquiring bank trace inquiry filed for UTR: ${exception.evidenceChain.settlement?.settlementUtr || 'N/A'}`)}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
                    >
                      <Building2 className="h-4 w-4" />
                      File UTR Trace
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Sparkles className="h-8 w-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700">No AI Investigation Stored Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Run the AI Finance Controller to perform automated cross-ledger hash matching, verify fee deductions, and detect root causes.
            </p>
            <button
              onClick={handleRunInvestigation}
              disabled={isInvestigating}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Launch Investigation Now
            </button>
          </div>
        )}
      </div>

      {/* Resolution Workflow & Notes Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateStatus(exception.id, 'resolved')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors shadow-sm ${
              exception.status === 'resolved'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700'
            }`}
          >
            <Check className="h-4 w-4" />
            Mark Resolved
          </button>

          <button
            onClick={() => updateStatus(exception.id, 'dismissed')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors shadow-sm ${
              exception.status === 'dismissed'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <X className="h-4 w-4" />
            Dismiss
          </button>

          <button
            onClick={() => setShowNoteModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
          >
            <MessageSquare className="h-4 w-4 text-slate-500" />
            Add Audit Note
          </button>
        </div>

        <Link
          href="/dashboard/exceptions"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Return to Exceptions Desk
        </Link>
      </div>

      {/* Notes List */}
      {exception.notes && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            Forensic Audit Notes
          </h3>
          <div className="text-xs text-slate-700 whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
            {exception.notes}
          </div>
        </div>
      )}

      {/* Audit Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Add Audit Trail Note</h3>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Enter resolution reasoning or bank inquiry reference..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
