// lib/metrics.ts
/**
 * LedgerPulse Canonical Financial Metrics Specification
 * 
 * Every dashboard and analytics component must derive numbers from this
 * canonical implementation to prevent semantic drift and formula divergence.
 * 
 * DEFINITIONS:
 * 1. Total Payment Volume (TPV): Gross rupee value of all transactions submitted, regardless of final outcome.
 * 2. Settled Volume: Rupee volume of successfully verified settlements (status === "success").
 * 3. Processed Transactions: Total count of all transaction attempts in the selected window.
 * 4. Successful Transactions: Count of transactions fully captured and reconciled into the ledger.
 * 5. Pending Transactions: Count of transactions awaiting asynchronous webhook / bank confirmation.
 * 6. Failed Transactions: Count of declined, timed-out, or network-failed transactions.
 * 7. Refunded Transactions: Count of transactions where settled funds were returned to the customer.
 * 8. Reconciliation Rate (%): Proportion of total processed transactions successfully settled into the ledger:
 *      (Successful Transactions / Total Processed Transactions) * 100
 * 9. Avg. Settled Ticket: Average rupee value per successfully settled transaction:
 *      Settled Volume / Successful Transactions
 * 10. Unresolved Exceptions: Count of failed transactions requiring manual or automated exception review (failedCount).
 */

import { DemoTransaction } from "./demo/sampleData";

export interface MethodBreakdown {
  method: "upi" | "card" | "netbanking" | "wallet";
  label: string;
  count: number;
  volume: number; // in paise (settled)
  percentage: number;
}

export interface FinancialMetrics {
  // Volume Metrics (in paise)
  totalVolume: number; // Gross Total Payment Volume (TPV) across all statuses
  settledVolume: number; // Settled Volume (status === "success")
  
  // Count Metrics
  totalCount: number;
  successfulCount: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
  unresolvedExceptions: number; // Canonical count of failed exceptions requiring review
  
  // Ratio Metrics
  reconciliationRate: number; // % (0 - 100)
  avgSettledTicket: number; // in paise per successful transaction
  
  // Breakdowns
  methodBreakdown: MethodBreakdown[];
  statusCounts: {
    success: number;
    pending: number;
    failed: number;
    refunded: number;
  };
}

export const METHOD_LABELS: Record<DemoTransaction["payment_method"], string> = {
  upi: "UPI (Google Pay, PhonePe, Paytm)",
  card: "Credit & Debit Cards (Visa, MC, RuPay)",
  netbanking: "Net Banking (HDFC, ICICI, SBI)",
  wallet: "Prepaid Wallets & Cashcards",
};

export const ALL_PAYMENT_METHODS: DemoTransaction["payment_method"][] = [
  "upi",
  "card",
  "netbanking",
  "wallet",
];

/**
 * Calculates canonical financial metrics for any slice of transactions.
 */
export function calculateFinancialMetrics(
  transactions: DemoTransaction[],
  options?: {
    referenceDate?: Date;
    days?: number;
  }
): FinancialMetrics {
  let inRange = transactions;

  if (options?.days && options.days > 0) {
    const refTime = options.referenceDate ? new Date(options.referenceDate).getTime() : Date.now();
    const cutoff = refTime - options.days * 86400000;
    inRange = transactions.filter((t) => new Date(t.transaction_date).getTime() >= cutoff);
  }

  let totalVolume = 0;
  let settledVolume = 0;
  let successfulCount = 0;
  let pendingCount = 0;
  let failedCount = 0;
  let refundedCount = 0;

  const methodCounts: Record<DemoTransaction["payment_method"], { count: number; volume: number }> = {
    upi: { count: 0, volume: 0 },
    card: { count: 0, volume: 0 },
    netbanking: { count: 0, volume: 0 },
    wallet: { count: 0, volume: 0 },
  };

  for (let i = 0; i < inRange.length; i++) {
    const txn = inRange[i];
    totalVolume += txn.amount;

    if (txn.status === "success") {
      successfulCount++;
      settledVolume += txn.amount;
      if (txn.payment_method in methodCounts) {
        methodCounts[txn.payment_method].volume += txn.amount;
      }
    } else if (txn.status === "pending") {
      pendingCount++;
    } else if (txn.status === "failed") {
      failedCount++;
    } else if (txn.status === "refunded") {
      refundedCount++;
    }

    if (txn.payment_method in methodCounts) {
      methodCounts[txn.payment_method].count++;
    }
  }

  const totalCount = inRange.length;
  const reconciliationRate = totalCount > 0 ? (successfulCount / totalCount) * 100 : 0;
  const avgSettledTicket = successfulCount > 0 ? settledVolume / successfulCount : 0;

  const methodBreakdown: MethodBreakdown[] = ALL_PAYMENT_METHODS.map((method) => {
    const info = methodCounts[method] || { count: 0, volume: 0 };
    const percentage = totalCount > 0 ? (info.count / totalCount) * 100 : 0;
    return {
      method,
      label: METHOD_LABELS[method],
      count: info.count,
      volume: info.volume,
      percentage,
    };
  });

  return {
    totalVolume,
    settledVolume,
    totalCount,
    successfulCount,
    pendingCount,
    failedCount,
    refundedCount,
    unresolvedExceptions: failedCount,
    reconciliationRate,
    avgSettledTicket,
    methodBreakdown,
    statusCounts: {
      success: successfulCount,
      pending: pendingCount,
      failed: failedCount,
      refunded: refundedCount,
    },
  };
}

/**
 * Format paise into Indian Rupee string without decimals.
 */
export function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
