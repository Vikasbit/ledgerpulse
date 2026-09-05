// lib/reconciliation/types.ts
/**
 * Deterministic Reconciliation Engine & Evidence Chain Types
 * 
 * Standard models for merchant ledger components across:
 * ORDER -> PAYMENT -> SETTLEMENT -> REFUND -> BANK ENTRY
 */

import { AIInvestigation, ExceptionClassification, ResolutionStatus, SeverityLevel } from '../ai/types';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  businessId: string;
  customerName: string;
  customerEmail?: string;
  amountPaise: number;
  currency: string;
  status: 'created' | 'paid' | 'cancelled';
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId?: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  amountPaise: number;
  feePaise: number;
  taxPaise: number;
  status: 'captured' | 'failed' | 'authorized' | 'refunded';
  gatewayPaymentId: string;
  createdAt: string;
}

export interface SettlementRecord {
  id: string;
  settlementUtr: string;
  grossAmountPaise: number;
  feeAmountPaise: number;
  taxAmountPaise: number;
  netAmountPaise: number;
  settlementDate: string;
  status: 'processed' | 'settled' | 'pending';
}

export interface SettlementItemRecord {
  id: string;
  settlementId: string;
  paymentId: string;
  amountPaise: number;
  feePaise: number;
  taxPaise: number;
  type: 'payment' | 'refund' | 'adjustment';
}

export interface RefundRecord {
  id: string;
  paymentId: string;
  amountPaise: number;
  reason: string;
  status: 'processed' | 'pending' | 'failed';
  createdAt: string;
}

export interface BankEntryRecord {
  id: string;
  utr: string;
  creditPaise: number;
  description: string;
  valueDate: string;
  bankAccount: string;
}

export interface EvidenceChain {
  order?: OrderRecord;
  payment?: PaymentRecord;
  settlement?: SettlementRecord;
  settlementItem?: SettlementItemRecord;
  refund?: RefundRecord;
  bankEntry?: BankEntryRecord;
}

export interface ReconciliationException {
  id: string;
  businessId: string;
  orderId?: string;
  paymentId?: string;
  transactionRef: string;
  customerName: string;
  classification: ExceptionClassification;
  categoryLabel: string;
  discrepancyPaise: number;
  severity: SeverityLevel;
  status: ResolutionStatus;
  detectedAt: string;
  evidenceChain: EvidenceChain;
  aiInvestigation?: AIInvestigation;
  notes?: string;
  tags: string[];
}
