// lib/ai/types.ts
/**
 * AI Finance Controller & Reconciliation Investigator Types
 * 
 * Strict typing for financial discrepancy classification, AI-driven root-cause
 * investigation, multi-step evidence chains, and contextual finance copilot.
 */

export type ExceptionClassification =
  | 'fee_discrepancy'
  | 'refund_mismatch'
  | 'missing_bank_credit'
  | 'amount_mismatch'
  | 'duplicate'
  | 'timing_difference'
  | 'delayed_adjustment'
  | 'evidence_gap'
  | 'unexplained';

export type SeverityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ResolutionStatus =
  | 'open'
  | 'investigating'
  | 'investigated'
  | 'under_review'
  | 'resolved'
  | 'dismissed';

export interface EvidenceAssessmentItem {
  stage: 'ORDER' | 'PAYMENT' | 'SETTLEMENT' | 'REFUND' | 'BANK ENTRY';
  identifier: string;
  status: 'verified' | 'discrepant' | 'missing' | 'delayed';
  amountPaise?: number;
  expectedPaise?: number;
  notes: string;
}

export interface RecommendedAction {
  title: string;
  actionType: 'razorpay_collect' | 'bank_inquiry' | 'accounting_adjustment' | 'manual_approval' | 'dispute_fee';
  description: string;
  estimatedRecoveryPaise?: number;
  urgency: 'immediate' | 'next_cycle' | 'routine';
}

export interface AIInvestigation {
  id: string;
  exceptionId: string;
  classification: ExceptionClassification;
  categoryLabel: string;
  severity: SeverityLevel;
  confidenceScore: number; // 0 - 100
  rootCause: string;
  summary: string;
  detailedAnalysis: string;
  evidenceAssessment: EvidenceAssessmentItem[];
  financialImpact: {
    discrepancyPaise: number;
    riskExposurePaise: number;
    currency: string;
  };
  recommendedAction: RecommendedAction;
  needsHumanReview: boolean;
  generatedAt: string;
  modelUsed: string;
  isDemoFallback?: boolean;
}

export interface InvestigationAuditLog {
  id: string;
  exceptionId: string;
  action: string;
  actor: 'AI Controller' | 'User' | 'System';
  timestamp: string;
  notes?: string;
}

export interface CopilotCitation {
  label: string;
  recordType: 'exception' | 'transaction' | 'settlement' | 'bank_entry';
  recordId: string;
  amountPaise?: number;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: CopilotCitation[];
  suggestedActions?: string[];
}

export interface CopilotContextPayload {
  tpvPaise: number;
  settledPaise: number;
  unresolvedCount: number;
  unresolvedPaise: number;
  highPriorityCount: number;
  reconciliationRate: number;
  recentExceptions: Array<{
    id: string;
    classification: string;
    amountPaise: number;
    severity: string;
  }>;
}
