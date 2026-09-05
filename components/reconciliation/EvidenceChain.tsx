'use client';

// components/reconciliation/EvidenceChain.tsx
/**
 * Visual Evidence Chain Progression Component
 * 
 * Renders the multi-ledger transaction lineage:
 * ORDER -> PAYMENT -> SETTLEMENT -> REFUND -> BANK ENTRY
 * Clearly signaling present vs missing records, variance flags, and identifiers.
 */

import React from 'react';
import { EvidenceChain } from '@/lib/reconciliation/types';
import { ShoppingBag, CreditCard, Layers, RotateCcw, Building2, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

interface EvidenceChainProps {
  chain: EvidenceChain;
}

export function EvidenceChainViewer({ chain }: EvidenceChainProps) {
  const { order, payment, settlement, settlementItem, refund, bankEntry } = chain;

  const steps = [
    {
      stage: 'ORDER',
      icon: ShoppingBag,
      exists: !!order,
      title: order ? order.orderNumber : 'Order Record',
      sub: order ? `₹${(order.amountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'Missing in Order DB',
      status: order ? (order.status === 'paid' ? 'verified' : 'pending') : 'missing',
      date: order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : undefined,
    },
    {
      stage: 'PAYMENT',
      icon: CreditCard,
      exists: !!payment,
      title: payment ? (payment.gatewayPaymentId || payment.id) : 'Gateway Capture',
      sub: payment ? `₹${(payment.amountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${payment.paymentMethod.toUpperCase()})` : 'No Gateway Capture',
      status: payment
        ? (payment.status === 'captured' ? (order && payment.amountPaise !== order.amountPaise ? 'discrepant' : 'verified') : 'discrepant')
        : 'missing',
      date: payment?.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : undefined,
    },
    {
      stage: 'SETTLEMENT',
      icon: Layers,
      exists: !!settlement,
      title: settlement ? settlement.settlementUtr : 'Settlement Batch',
      sub: settlement
        ? `₹${(settlement.netAmountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Fee: ₹${(settlement.feeAmountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })})`
        : 'Awaiting Settlement Batch',
      status: settlement ? (settlementItem ? 'verified' : 'discrepant') : 'missing',
      date: settlement?.settlementDate ? new Date(settlement.settlementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : undefined,
    },
    ...(refund ? [{
      stage: 'REFUND',
      icon: RotateCcw,
      exists: true,
      title: refund.id,
      sub: `₹${(refund.amountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })} [${refund.reason.slice(0, 24)}...]`,
      status: payment && refund.amountPaise > payment.amountPaise ? 'discrepant' : 'verified',
      date: refund.createdAt ? new Date(refund.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : undefined,
    }] : []),
    {
      stage: 'BANK ENTRY',
      icon: Building2,
      exists: !!bankEntry,
      title: bankEntry ? bankEntry.utr : 'Bank Credit Feed',
      sub: bankEntry
        ? `₹${(bankEntry.creditPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${bankEntry.bankAccount.split(' - ')[0]})`
        : settlement ? 'Missing in Bank Statement' : 'Awaiting Settlement',
      status: bankEntry
        ? (settlement && Math.abs(bankEntry.creditPaise - settlement.netAmountPaise) > 100 ? 'discrepant' : 'verified')
        : (settlement ? 'missing' : 'pending'),
      date: bankEntry?.valueDate ? new Date(bankEntry.valueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : undefined,
    },
  ];

  return (
    <div className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Reconciliation Evidence Chain
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-ledger lineage tracing funds from order creation to bank account credit.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Confirmed
          </span>
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Discrepancy
          </span>
          <span className="inline-flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-500" /> Missing Record
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isVerified = step.status === 'verified';
          const isDiscrepant = step.status === 'discrepant';
          const isMissing = step.status === 'missing';

          const cardBorder = isVerified
            ? 'border-emerald-200 bg-emerald-50/40'
            : isDiscrepant
            ? 'border-amber-300 bg-amber-50/50 shadow-amber-100/50 shadow-sm'
            : isMissing
            ? 'border-rose-200 bg-rose-50/40'
            : 'border-slate-200 bg-slate-50/50 opacity-80';

          const badgeClass = isVerified
            ? 'bg-emerald-100 text-emerald-700'
            : isDiscrepant
            ? 'bg-amber-100 text-amber-800 font-semibold'
            : isMissing
            ? 'bg-rose-100 text-rose-700 font-semibold'
            : 'bg-slate-100 text-slate-600';

          return (
            <div key={idx} className="relative group">
              <div className={`p-4 rounded-xl border ${cardBorder} transition-all duration-200 hover:shadow-md flex flex-col justify-between h-full`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-slate-700" />
                      {step.stage}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${badgeClass}`}>
                      {step.status}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-900 truncate font-mono mt-1" title={step.title}>
                    {step.title}
                  </div>
                  <div className="text-xs font-medium text-slate-700 mt-1">
                    {step.sub}
                  </div>
                </div>

                {step.date && (
                  <div className="text-[10px] text-slate-600 mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span>Logged</span>
                    <span>{step.date}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
