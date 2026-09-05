// lib/ai/classifier.ts
/**
 * Deterministic Pre-Classifier & Forensic Rule Engine
 * 
 * Computes exact mathematical variances, evidence discrepancies, and baseline
 * audit assessments across the full reconciliation lifecycle.
 */

import {
  AIInvestigation,
  EvidenceAssessmentItem,
  ExceptionClassification,
  RecommendedAction,
  SeverityLevel,
} from './types';
import { EvidenceChain, ReconciliationException } from '../reconciliation/types';

export interface ClassificationResult {
  classification: ExceptionClassification;
  categoryLabel: string;
  severity: SeverityLevel;
  discrepancyPaise: number;
  confidenceScore: number;
  rootCause: string;
  summary: string;
  detailedAnalysis: string;
  evidenceAssessment: EvidenceAssessmentItem[];
  recommendedAction: RecommendedAction;
  needsHumanReview: boolean;
}

export function classifyException(chain: EvidenceChain, exceptionRef?: string): ClassificationResult {
  const { order, payment, settlement, settlementItem, refund, bankEntry } = chain;
  const assessment: EvidenceAssessmentItem[] = [];

  // 1. Evaluate ORDER
  if (order) {
    assessment.push({
      stage: 'ORDER',
      identifier: order.orderNumber || order.id,
      status: 'verified',
      amountPaise: order.amountPaise,
      notes: `Order created for ₹${(order.amountPaise / 100).toFixed(2)} [${order.status.toUpperCase()}].`,
    });
  } else {
    assessment.push({
      stage: 'ORDER',
      identifier: 'ORD-UNKNOWN',
      status: 'missing',
      notes: 'No matching order record located in the merchant order database.',
    });
  }

  // 2. Evaluate PAYMENT
  if (payment) {
    const isMismatch = order && payment.amountPaise !== order.amountPaise;
    assessment.push({
      stage: 'PAYMENT',
      identifier: payment.gatewayPaymentId || payment.id,
      status: isMismatch ? 'discrepant' : payment.status === 'failed' ? 'discrepant' : 'verified',
      amountPaise: payment.amountPaise,
      expectedPaise: order?.amountPaise,
      notes: `Gateway authorized ₹${(payment.amountPaise / 100).toFixed(2)} via ${payment.paymentMethod.toUpperCase()} [${payment.status}].`,
    });
  } else {
    assessment.push({
      stage: 'PAYMENT',
      identifier: 'PAY-UNKNOWN',
      status: 'missing',
      notes: 'No gateway payment capture event found.',
    });
  }

  // 3. Evaluate SETTLEMENT
  if (settlement && settlementItem) {
    assessment.push({
      stage: 'SETTLEMENT',
      identifier: settlement.settlementUtr || settlement.id,
      status: 'verified',
      amountPaise: settlementItem.amountPaise,
      notes: `Batched in settlement UTR ${settlement.settlementUtr} with net credit ₹${(settlementItem.amountPaise / 100).toFixed(2)} (Fee: ₹${(settlementItem.feePaise / 100).toFixed(2)}).`,
    });
  } else if (settlement && !settlementItem) {
    assessment.push({
      stage: 'SETTLEMENT',
      identifier: settlement.settlementUtr || settlement.id,
      status: 'discrepant',
      notes: `Settlement record exists but transaction line item is missing from batch breakdown.`,
    });
  } else {
    assessment.push({
      stage: 'SETTLEMENT',
      identifier: 'SETTLE-PENDING',
      status: 'missing',
      notes: 'Payment has not been consolidated into any gateway settlement batch.',
    });
  }

  // 4. Evaluate REFUND if applicable
  if (refund) {
    assessment.push({
      stage: 'REFUND',
      identifier: refund.id,
      status: refund.status === 'processed' ? 'verified' : 'discrepant',
      amountPaise: refund.amountPaise,
      notes: `Refund of ₹${(refund.amountPaise / 100).toFixed(2)} logged for reason: ${refund.reason}.`,
    });
  }

  // 5. Evaluate BANK ENTRY
  if (bankEntry) {
    const settleAmt = settlement?.netAmountPaise || settlementItem?.amountPaise || 0;
    const diff = Math.abs(bankEntry.creditPaise - settleAmt);
    assessment.push({
      stage: 'BANK ENTRY',
      identifier: bankEntry.utr,
      status: diff > 100 ? 'discrepant' : 'verified',
      amountPaise: bankEntry.creditPaise,
      expectedPaise: settleAmt,
      notes: `Bank statement credit of ₹${(bankEntry.creditPaise / 100).toFixed(2)} confirmed on ${bankEntry.valueDate}.`,
    });
  } else {
    assessment.push({
      stage: 'BANK ENTRY',
      identifier: 'BANK-UNCREDITED',
      status: settlement ? 'missing' : 'delayed',
      notes: settlement ? 'Gateway marked settled, but UTR was not detected on bank account credit feed.' : 'Awaiting gateway settlement prior to bank posting.',
    });
  }

  // --- RULE ENGINE DISCREPANCY EVALUATION ---

  // Rule 1: Missing Bank Credit
  if (settlement && !bankEntry) {
    const uncreditedPaise = settlementItem ? settlementItem.amountPaise : settlement.netAmountPaise;
    return {
      classification: 'missing_bank_credit',
      categoryLabel: 'Missing Bank Credit',
      severity: uncreditedPaise > 500000 ? 'HIGH' : 'MEDIUM',
      discrepancyPaise: uncreditedPaise,
      confidenceScore: 94,
      rootCause: `Gateway reported settlement batch ${settlement.settlementUtr} as disbursed, but no corresponding credit was recorded in the destination bank account.`,
      summary: `Discrepancy of ₹${(uncreditedPaise / 100).toFixed(2)} between payment gateway settlement report and bank statement feed.`,
      detailedAnalysis: `1. Gateway issued settlement UTR ${settlement.settlementUtr} on ${settlement.settlementDate}.\n2. Automated bank statement parsing confirmed zero matching credit entries for this UTR.\n3. Funds remain in transit or were misrouted at the gateway clearing level.`,
      evidenceAssessment: assessment,
      recommendedAction: {
        title: 'Submit Bank Credit Trace (UTR Inquiry)',
        actionType: 'bank_inquiry',
        description: `Submit an official UTR trace request for ${settlement.settlementUtr} with acquiring bank treasury.`,
        estimatedRecoveryPaise: uncreditedPaise,
        urgency: 'immediate',
      },
      needsHumanReview: true,
    };
  }

  // Rule 2: Amount Mismatch between Order and Payment
  if (order && payment && order.amountPaise !== payment.amountPaise) {
    const diff = Math.abs(order.amountPaise - payment.amountPaise);
    return {
      classification: 'amount_mismatch',
      categoryLabel: 'Order/Payment Amount Mismatch',
      severity: diff > 100000 ? 'HIGH' : 'MEDIUM',
      discrepancyPaise: diff,
      confidenceScore: 98,
      rootCause: `Authorized payment amount (₹${(payment.amountPaise / 100).toFixed(2)}) deviates from merchant order invoice total (₹${(order.amountPaise / 100).toFixed(2)}).`,
      summary: `Financial variance of ₹${(diff / 100).toFixed(2)} detected between order creation and gateway capture.`,
      detailedAnalysis: `Order #${order.orderNumber} specified ₹${(order.amountPaise / 100).toFixed(2)}, but payment ${payment.gatewayPaymentId} captured ₹${(payment.amountPaise / 100).toFixed(2)}. This usually occurs when a customer modifies cart items or partial vouchers fail to deduct.`,
      evidenceAssessment: assessment,
      recommendedAction: {
        title: 'Collect Balance via Razorpay Payment Link',
        actionType: 'razorpay_collect',
        description: `Generate a payment link for ₹${(diff / 100).toFixed(2)} to collect the underbilled delta.`,
        estimatedRecoveryPaise: diff,
        urgency: 'immediate',
      },
      needsHumanReview: false,
    };
  }

  // Rule 3: Fee Variance / Overcharge
  if (settlementItem && payment) {
    const expectedFeeRate = 0.02; // Standard 2%
    const expectedGst = 0.18; // 18% on fee
    const nominalFee = payment.amountPaise * expectedFeeRate;
    const nominalTax = nominalFee * expectedGst;
    const nominalTotalFee = Math.round(nominalFee + nominalTax);
    const feeDiff = settlementItem.feePaise + settlementItem.taxPaise - nominalTotalFee;

    if (feeDiff > 200) { // Discrepancy > ₹2
      return {
        classification: 'fee_discrepancy',
        categoryLabel: 'Gateway Fee Overcharge',
        severity: feeDiff > 50000 ? 'HIGH' : 'LOW',
        discrepancyPaise: feeDiff,
        confidenceScore: 91,
        rootCause: `Gateway deducted ₹${((settlementItem.feePaise + settlementItem.taxPaise) / 100).toFixed(2)} in MDR/GST fees vs contractually expected ₹${(nominalTotalFee / 100).toFixed(2)}.`,
        summary: `Fee variance of ₹${(feeDiff / 100).toFixed(2)} identified against merchant tier fee schedule.`,
        detailedAnalysis: `Contractual rate for ${payment.paymentMethod.toUpperCase()} is 2.00% + 18% GST. Effective rate charged was ${(((settlementItem.feePaise + settlementItem.taxPaise) / payment.amountPaise) * 100).toFixed(2)}%.`,
        evidenceAssessment: assessment,
        recommendedAction: {
          title: 'File Gateway MDR Dispute Claim',
          actionType: 'dispute_fee',
          description: `Submit MDR fee dispute referencing settlement line item and merchant agreement rate card.`,
          estimatedRecoveryPaise: feeDiff,
          urgency: 'next_cycle',
        },
        needsHumanReview: false,
      };
    }
  }

  // Rule 4: Refund Mismatch
  if (refund && payment) {
    if (refund.amountPaise > payment.amountPaise) {
      const excessRefund = refund.amountPaise - payment.amountPaise;
      return {
        classification: 'refund_mismatch',
        categoryLabel: 'Excess Refund Discrepancy',
        severity: 'HIGH',
        discrepancyPaise: excessRefund,
        confidenceScore: 96,
        rootCause: `Refund amount of ₹${(refund.amountPaise / 100).toFixed(2)} exceeds original captured payment amount of ₹${(payment.amountPaise / 100).toFixed(2)}.`,
        summary: `Negative merchant exposure of ₹${(excessRefund / 100).toFixed(2)} from over-credited refund.`,
        detailedAnalysis: `Refund record ${refund.id} authorized more than 100% of the parent payment value. This typically indicates double refund initiation in customer support tooling.`,
        evidenceAssessment: assessment,
        recommendedAction: {
          title: 'Halt Reversal and Request Accounting Adjustment',
          actionType: 'accounting_adjustment',
          description: `Place an immediate freeze on pending gateway payout debit and reverse secondary refund transaction.`,
          estimatedRecoveryPaise: excessRefund,
          urgency: 'immediate',
        },
        needsHumanReview: true,
      };
    }
  }

  // Rule 5: Timing Difference / In-Flight
  if (payment && !settlement) {
    return {
      classification: 'timing_difference',
      categoryLabel: 'In-Flight Settlement Delay',
      severity: 'LOW',
      discrepancyPaise: payment.amountPaise,
      confidenceScore: 88,
      rootCause: `Transaction captured successfully but currently in normal clearing cycle (T+1/T+2).`,
      summary: `Payment ₹${(payment.amountPaise / 100).toFixed(2)} is awaiting regular bank settlement cut-off.`,
      detailedAnalysis: `Payment was processed on ${payment.createdAt}. In accordance with acquiring bank batch timelines, payout credit is anticipated in the next business day settlement.`,
      evidenceAssessment: assessment,
      recommendedAction: {
        title: 'Monitor Automated Settlement Schedule',
        actionType: 'manual_approval',
        description: `No action required at this stage. Automatically re-evaluates at 18:00 IST cutoff.`,
        urgency: 'routine',
      },
      needsHumanReview: false,
    };
  }

  // Rule 6: Evidence Gap
  return {
    classification: 'evidence_gap',
    categoryLabel: 'Missing Reconciliation Record',
    severity: 'MEDIUM',
    discrepancyPaise: (order?.amountPaise || payment?.amountPaise || 0),
    confidenceScore: 75,
    rootCause: 'Reconciliation could not complete due to an absent record in the transaction lineage.',
    summary: 'Partial evidence available; transaction requires ledger linkage.',
    detailedAnalysis: 'One or more required records (order, payment capture, or bank feed) was not detected.',
    evidenceAssessment: assessment,
    recommendedAction: {
      title: 'Import Supplemental Bank/Gateway Feed',
      actionType: 'accounting_adjustment',
      description: 'Upload latest settlement report or bank statement to resolve unmapped linkage.',
      urgency: 'routine',
    },
    needsHumanReview: true,
  };
}

export function createDeterministicInvestigation(
  exceptionId: string,
  chain: EvidenceChain,
  classificationResult?: ClassificationResult
): AIInvestigation {
  const res = classificationResult || classifyException(chain);

  return {
    id: `inv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    exceptionId,
    classification: res.classification,
    categoryLabel: res.categoryLabel,
    severity: res.severity,
    confidenceScore: res.confidenceScore,
    rootCause: res.rootCause,
    summary: res.summary,
    detailedAnalysis: res.detailedAnalysis,
    evidenceAssessment: res.evidenceAssessment,
    financialImpact: {
      discrepancyPaise: res.discrepancyPaise,
      riskExposurePaise: res.discrepancyPaise,
      currency: 'INR',
    },
    recommendedAction: res.recommendedAction,
    needsHumanReview: res.needsHumanReview,
    generatedAt: new Date().toISOString(),
    modelUsed: 'LedgerPulse Controller Rule Engine v2.4',
    isDemoFallback: true,
  };
}
