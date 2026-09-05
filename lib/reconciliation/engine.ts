// lib/reconciliation/engine.ts
/**
 * Deterministic Reconciliation & Exception Engine
 * 
 * Implements 2-way and 3-way matching across:
 * ORDER -> PAYMENT -> SETTLEMENT -> REFUND -> BANK ENTRY
 * 
 * Includes pre-seeded, high-fidelity controlled test cases (Orders 91-100)
 * showcasing the full spectrum of financial controller investigations.
 */

import {
  BankEntryRecord,
  EvidenceChain,
  OrderRecord,
  PaymentRecord,
  ReconciliationException,
  RefundRecord,
  SettlementItemRecord,
  SettlementRecord,
} from './types';
import { classifyException } from '../ai/classifier';
import { getDemoReferenceDate } from '../demo/sampleData';

export interface MultiFileDataset {
  orders: OrderRecord[];
  payments: PaymentRecord[];
  settlements: SettlementRecord[];
  settlementItems: SettlementItemRecord[];
  refunds: RefundRecord[];
  bankEntries: BankEntryRecord[];
}

export interface ReconciliationSummary {
  totalOrders: number;
  totalPayments: number;
  totalSettlements: number;
  matchedCount: number;
  exceptionCount: number;
  totalDiscrepancyPaise: number;
  reconciliationRate: number;
  exceptions: ReconciliationException[];
}

/**
 * Generates the canonical controlled test exceptions (Orders 91 - 100).
 * These are anchored to DEMO_REFERENCE_DATE for repeatable audit simulations.
 */
export function generateControlledExceptions(): ReconciliationException[] {
  const refDate = getDemoReferenceDate();
  const dateStr = (offsetDays: number) => {
    const d = new Date(refDate.getTime() - offsetDays * 86400000);
    return d.toISOString();
  };

  const exceptions: ReconciliationException[] = [
    // 1. Order 91: Fee Discrepancy
    {
      id: 'EXC-91',
      businessId: 'biz_demo_01',
      orderId: 'ord_91',
      paymentId: 'pay_91',
      transactionRef: 'TXN-91-FEE-DISC',
      customerName: 'Aarav Singhal',
      classification: 'fee_discrepancy',
      categoryLabel: 'Gateway Fee Discrepancy',
      discrepancyPaise: 42500, // ₹425.00 excess fee
      severity: 'LOW',
      status: 'open',
      detectedAt: dateStr(1),
      tags: ['fee-variance', 'gateway-audit', 'mdr-dispute'],
      evidenceChain: {
        order: {
          id: 'ord_91',
          orderNumber: 'ORD-10091',
          businessId: 'biz_demo_01',
          customerName: 'Aarav Singhal',
          customerEmail: 'aarav.singhal@enterprise.com',
          amountPaise: 1500000, // ₹15,000.00
          currency: 'INR',
          status: 'paid',
          createdAt: dateStr(2),
        },
        payment: {
          id: 'pay_91',
          orderId: 'ord_91',
          paymentMethod: 'card',
          amountPaise: 1500000,
          feePaise: 72500, // Charged ₹725.00 vs expected ₹300.00 (2%)
          taxPaise: 13050,
          status: 'captured',
          gatewayPaymentId: 'pay_rzp_91001',
          createdAt: dateStr(2),
        },
        settlement: {
          id: 'set_91',
          settlementUtr: 'UTR-HDFC-910283',
          grossAmountPaise: 1500000,
          feeAmountPaise: 72500,
          taxAmountPaise: 13050,
          netAmountPaise: 1414450,
          settlementDate: dateStr(1),
          status: 'settled',
        },
        settlementItem: {
          id: 'si_91',
          settlementId: 'set_91',
          paymentId: 'pay_91',
          amountPaise: 1500000,
          feePaise: 72500,
          taxPaise: 13050,
          type: 'payment',
        },
        bankEntry: {
          id: 'bnk_91',
          utr: 'UTR-HDFC-910283',
          creditPaise: 1414450,
          description: 'HDFC PAYMENT GATEWAY SETTLEMENT UTR-HDFC-910283',
          valueDate: dateStr(1),
          bankAccount: 'HDFC Bank - 0021093849',
        },
      },
    },

    // 2. Order 92: Amount Mismatch
    {
      id: 'EXC-92',
      businessId: 'biz_demo_01',
      orderId: 'ord_92',
      paymentId: 'pay_92',
      transactionRef: 'TXN-92-AMT-MISMATCH',
      customerName: 'Meenakshi Sundaram',
      classification: 'amount_mismatch',
      categoryLabel: 'Order / Payment Amount Variance',
      discrepancyPaise: 70000, // ₹700.00 underbilled
      severity: 'MEDIUM',
      status: 'open',
      detectedAt: dateStr(2),
      tags: ['cart-divergence', 'underbilled', 'razorpay-collect'],
      evidenceChain: {
        order: {
          id: 'ord_92',
          orderNumber: 'ORD-10092',
          businessId: 'biz_demo_01',
          customerName: 'Meenakshi Sundaram',
          customerEmail: 'meenakshi.s@techcorp.in',
          amountPaise: 520000, // ₹5,200.00
          currency: 'INR',
          status: 'paid',
          createdAt: dateStr(2),
        },
        payment: {
          id: 'pay_92',
          orderId: 'ord_92',
          paymentMethod: 'upi',
          amountPaise: 450000, // Only captured ₹4,500.00
          feePaise: 0,
          taxPaise: 0,
          status: 'captured',
          gatewayPaymentId: 'pay_upi_92002',
          createdAt: dateStr(2),
        },
        settlement: {
          id: 'set_92',
          settlementUtr: 'UTR-ICICI-920192',
          grossAmountPaise: 450000,
          feeAmountPaise: 0,
          taxAmountPaise: 0,
          netAmountPaise: 450000,
          settlementDate: dateStr(1),
          status: 'settled',
        },
        settlementItem: {
          id: 'si_92',
          settlementId: 'set_92',
          paymentId: 'pay_92',
          amountPaise: 450000,
          feePaise: 0,
          taxPaise: 0,
          type: 'payment',
        },
        bankEntry: {
          id: 'bnk_92',
          utr: 'UTR-ICICI-920192',
          creditPaise: 450000,
          description: 'UPI AUTOPAY SETTLEMENT UTR-ICICI-920192',
          valueDate: dateStr(1),
          bankAccount: 'ICICI Bank - 4409182390',
        },
      },
    },

    // 3. Order 93: Missing Bank Credit
    {
      id: 'EXC-93',
      businessId: 'biz_demo_01',
      orderId: 'ord_93',
      paymentId: 'pay_93',
      transactionRef: 'TXN-93-MISSING-BANK',
      customerName: 'Raghavan Pillai',
      classification: 'missing_bank_credit',
      categoryLabel: 'Missing Bank Statement Credit',
      discrepancyPaise: 1245000, // ₹12,450.00 missing in bank!
      severity: 'HIGH',
      status: 'open',
      detectedAt: dateStr(1),
      tags: ['missing-funds', 'utr-trace', 'treasury-alert'],
      evidenceChain: {
        order: {
          id: 'ord_93',
          orderNumber: 'ORD-10093',
          businessId: 'biz_demo_01',
          customerName: 'Raghavan Pillai',
          customerEmail: 'raghavan.p@consulting.com',
          amountPaise: 1270000,
          currency: 'INR',
          status: 'paid',
          createdAt: dateStr(3),
        },
        payment: {
          id: 'pay_93',
          orderId: 'ord_93',
          paymentMethod: 'netbanking',
          amountPaise: 1270000,
          feePaise: 21186,
          taxPaise: 3814,
          status: 'captured',
          gatewayPaymentId: 'pay_nb_93003',
          createdAt: dateStr(3),
        },
        settlement: {
          id: 'set_93',
          settlementUtr: 'UTR-SBIN-992384',
          grossAmountPaise: 1270000,
          feeAmountPaise: 21186,
          taxAmountPaise: 3814,
          netAmountPaise: 1245000,
          settlementDate: dateStr(2),
          status: 'processed',
        },
        settlementItem: {
          id: 'si_93',
          settlementId: 'set_93',
          paymentId: 'pay_93',
          amountPaise: 1245000,
          feePaise: 21186,
          taxPaise: 3814,
          type: 'payment',
        },
        // bankEntry is MISSING!
      },
    },

    // 4. Order 94: Excess Refund
    {
      id: 'EXC-94',
      businessId: 'biz_demo_01',
      orderId: 'ord_94',
      paymentId: 'pay_94',
      transactionRef: 'TXN-94-REFUND-MISMATCH',
      customerName: 'Ananya Deshmukh',
      classification: 'refund_mismatch',
      categoryLabel: 'Excess Refund Discrepancy',
      discrepancyPaise: 60000, // ₹600.00 over-refunded
      severity: 'HIGH',
      status: 'open',
      detectedAt: dateStr(3),
      tags: ['support-leak', 'double-refund', 'recovery-needed'],
      evidenceChain: {
        order: {
          id: 'ord_94',
          orderNumber: 'ORD-10094',
          businessId: 'biz_demo_01',
          customerName: 'Ananya Deshmukh',
          customerEmail: 'ananya.d@designstudio.org',
          amountPaise: 280000, // ₹2,800.00
          currency: 'INR',
          status: 'paid',
          createdAt: dateStr(4),
        },
        payment: {
          id: 'pay_94',
          orderId: 'ord_94',
          paymentMethod: 'card',
          amountPaise: 280000,
          feePaise: 4746,
          taxPaise: 854,
          status: 'refunded',
          gatewayPaymentId: 'pay_cd_94004',
          createdAt: dateStr(4),
        },
        refund: {
          id: 'ref_94',
          paymentId: 'pay_94',
          amountPaise: 340000, // Over-refunded ₹3,400.00!
          reason: 'Customer initiated duplicate cancellation request',
          status: 'processed',
          createdAt: dateStr(3),
        },
      },
    },

    // 5. Order 95: Timing Difference (In-flight)
    {
      id: 'EXC-95',
      businessId: 'biz_demo_01',
      orderId: 'ord_95',
      paymentId: 'pay_95',
      transactionRef: 'TXN-95-INFLIGHT-CUTOFF',
      customerName: 'Harshvardhan Kapoor',
      classification: 'timing_difference',
      categoryLabel: 'In-Flight Batch Timing',
      discrepancyPaise: 840000, // ₹8,400.00
      severity: 'LOW',
      status: 'open',
      detectedAt: dateStr(0),
      tags: ['in-flight', 'batch-clearing', 'routine-t1'],
      evidenceChain: {
        order: {
          id: 'ord_95',
          orderNumber: 'ORD-10095',
          businessId: 'biz_demo_01',
          customerName: 'Harshvardhan Kapoor',
          customerEmail: 'harsh.k@logistics.in',
          amountPaise: 840000,
          currency: 'INR',
          status: 'paid',
          createdAt: dateStr(0),
        },
        payment: {
          id: 'pay_95',
          orderId: 'ord_95',
          paymentMethod: 'upi',
          amountPaise: 840000,
          feePaise: 0,
          taxPaise: 0,
          status: 'captured',
          gatewayPaymentId: 'pay_upi_95005',
          createdAt: dateStr(0),
        },
        // Settlement is in flight
      },
    },

    // 6. Order 96: Delayed Adjustment (Chargeback Reserve)
    {
      id: 'EXC-96',
      businessId: 'biz_demo_01',
      orderId: 'ord_96',
      paymentId: 'pay_96',
      transactionRef: 'TXN-96-DISPUTE-HOLD',
      customerName: 'Geeta Krishnamurthy',
      classification: 'delayed_adjustment',
      categoryLabel: 'Dispute Reserve Hold',
      discrepancyPaise: 1850000, // ₹18,500.00
      severity: 'HIGH',
      status: 'open',
      detectedAt: dateStr(4),
      tags: ['chargeback-hold', 'reserve-deduction', 'dispute-defense'],
      evidenceChain: {
        order: {
          id: 'ord_96',
          orderNumber: 'ORD-10096',
          businessId: 'biz_demo_01',
          customerName: 'Geeta Krishnamurthy',
          customerEmail: 'geeta.k@ventures.in',
          amountPaise: 1850000,
          currency: 'INR',
          status: 'paid',
          createdAt: dateStr(7),
        },
        payment: {
          id: 'pay_96',
          orderId: 'ord_96',
          paymentMethod: 'card',
          amountPaise: 1850000,
          feePaise: 31356,
          taxPaise: 5644,
          status: 'captured',
          gatewayPaymentId: 'pay_cd_96006',
          createdAt: dateStr(7),
        },
        settlementItem: {
          id: 'si_96',
          settlementId: 'set_adj_96',
          paymentId: 'pay_96',
          amountPaise: 0, // Held 100% in dispute reserve
          feePaise: 31356,
          taxPaise: 5644,
          type: 'adjustment',
        },
      },
    },

    // 7. Order 97: Duplicate Payment Capture
    {
      id: 'EXC-97',
      businessId: 'biz_demo_01',
      orderId: 'ord_97',
      paymentId: 'pay_97_dup',
      transactionRef: 'TXN-97-DUPLICATE-CAPTURE',
      customerName: 'Tarun Mathur',
      classification: 'duplicate',
      categoryLabel: 'Duplicate Payment Capture',
      discrepancyPaise: 650000, // ₹6,500.00 redundant capture
      severity: 'HIGH',
      status: 'open',
      detectedAt: dateStr(2),
      tags: ['double-charge', 'customer-refund-urgent', 'redundancy'],
      evidenceChain: {
        order: {
          id: 'ord_97',
          orderNumber: 'ORD-10097',
          businessId: 'biz_demo_01',
          customerName: 'Tarun Mathur',
          customerEmail: 'tarun.m@finsec.com',
          amountPaise: 650000,
          currency: 'INR',
          status: 'paid',
          createdAt: dateStr(2),
        },
        payment: {
          id: 'pay_97_dup',
          orderId: 'ord_97',
          paymentMethod: 'upi',
          amountPaise: 650000,
          feePaise: 0,
          taxPaise: 0,
          status: 'captured',
          gatewayPaymentId: 'pay_upi_97_secondary',
          createdAt: dateStr(2),
        },
      },
    },

    // 8. Order 98: Evidence Gap / Missing Order
    {
      id: 'EXC-98',
      businessId: 'biz_demo_01',
      paymentId: 'pay_98_orphan',
      transactionRef: 'TXN-98-ORPHAN-SETTLEMENT',
      customerName: 'Unmapped Customer',
      classification: 'evidence_gap',
      categoryLabel: 'Orphan Gateway Settlement',
      discrepancyPaise: 920000, // ₹9,200.00
      severity: 'MEDIUM',
      status: 'open',
      detectedAt: dateStr(3),
      tags: ['orphan-capture', 'unmapped-order', 'audit-linkage'],
      evidenceChain: {
        // Order is missing
        payment: {
          id: 'pay_98_orphan',
          paymentMethod: 'card',
          amountPaise: 920000,
          feePaise: 15593,
          taxPaise: 2807,
          status: 'captured',
          gatewayPaymentId: 'pay_cd_98008',
          createdAt: dateStr(3),
        },
        settlement: {
          id: 'set_98',
          settlementUtr: 'UTR-AXIS-982019',
          grossAmountPaise: 920000,
          feeAmountPaise: 15593,
          taxAmountPaise: 2807,
          netAmountPaise: 901600,
          settlementDate: dateStr(2),
          status: 'settled',
        },
        settlementItem: {
          id: 'si_98',
          settlementId: 'set_98',
          paymentId: 'pay_98_orphan',
          amountPaise: 920000,
          feePaise: 15593,
          taxPaise: 2807,
          type: 'payment',
        },
        bankEntry: {
          id: 'bnk_98',
          utr: 'UTR-AXIS-982019',
          creditPaise: 901600,
          description: 'AXIS BANK CARD SETTLEMENT UTR-AXIS-982019',
          valueDate: dateStr(2),
          bankAccount: 'Axis Bank - 9918234812',
        },
      },
    },

    // 9. Order 99: Bank Settlement Amount Variance
    {
      id: 'EXC-99',
      businessId: 'biz_demo_01',
      orderId: 'ord_99',
      paymentId: 'pay_99',
      transactionRef: 'TXN-99-BANK-VARIANCE',
      customerName: 'Devika Chawla',
      classification: 'amount_mismatch',
      categoryLabel: 'Bank Credit Amount Variance',
      discrepancyPaise: 130000, // ₹1,300.00 short-credited by bank
      severity: 'HIGH',
      status: 'open',
      detectedAt: dateStr(1),
      tags: ['short-credit', 'bank-discrepancy', 'wire-deduction'],
      evidenceChain: {
        order: {
          id: 'ord_99',
          orderNumber: 'ORD-10099',
          businessId: 'biz_demo_01',
          customerName: 'Devika Chawla',
          customerEmail: 'devika.c@mediahub.co',
          amountPaise: 4950000,
          currency: 'INR',
          status: 'paid',
          createdAt: dateStr(2),
        },
        payment: {
          id: 'pay_99',
          orderId: 'ord_99',
          paymentMethod: 'netbanking',
          amountPaise: 4950000,
          feePaise: 0,
          taxPaise: 0,
          status: 'captured',
          gatewayPaymentId: 'pay_nb_99009',
          createdAt: dateStr(2),
        },
        settlement: {
          id: 'set_99',
          settlementUtr: 'UTR-KOTAK-991028',
          grossAmountPaise: 4950000,
          feeAmountPaise: 0,
          taxAmountPaise: 0,
          netAmountPaise: 4950000,
          settlementDate: dateStr(1),
          status: 'settled',
        },
        settlementItem: {
          id: 'si_99',
          settlementId: 'set_99',
          paymentId: 'pay_99',
          amountPaise: 4950000,
          feePaise: 0,
          taxPaise: 0,
          type: 'payment',
        },
        bankEntry: {
          id: 'bnk_99',
          utr: 'UTR-KOTAK-991028',
          creditPaise: 4820000, // Bank credited ₹48,200 instead of ₹49,500!
          description: 'KOTAK MAHINDRA SETTLEMENT UTR-KOTAK-991028',
          valueDate: dateStr(1),
          bankAccount: 'Kotak Bank - 1928374650',
        },
      },
    },

    // 10. Order 100: Split Settlement Reconciliation
    {
      id: 'EXC-100',
      businessId: 'biz_demo_01',
      orderId: 'ord_100',
      paymentId: 'pay_100',
      transactionRef: 'TXN-100-SPLIT-BATCH',
      customerName: 'Nitin Bharadwaj',
      classification: 'timing_difference',
      categoryLabel: 'Split Settlement Tranche Pending',
      discrepancyPaise: 350000, // ₹3,500.00 tranche 2 in clearing
      severity: 'LOW',
      status: 'open',
      detectedAt: dateStr(1),
      tags: ['split-settlement', 'tranche-reconciliation', 'multi-batch'],
      evidenceChain: {
        order: {
          id: 'ord_100',
          orderNumber: 'ORD-10100',
          businessId: 'biz_demo_01',
          customerName: 'Nitin Bharadwaj',
          customerEmail: 'nitin.b@capitalcorp.in',
          amountPaise: 700000, // ₹7,000.00
          currency: 'INR',
          status: 'paid',
          createdAt: dateStr(2),
        },
        payment: {
          id: 'pay_100',
          orderId: 'ord_100',
          paymentMethod: 'upi',
          amountPaise: 700000,
          feePaise: 0,
          taxPaise: 0,
          status: 'captured',
          gatewayPaymentId: 'pay_upi_100010',
          createdAt: dateStr(2),
        },
        settlement: {
          id: 'set_100_a',
          settlementUtr: 'UTR-HDFC-100A',
          grossAmountPaise: 350000, // Only 50% in tranche A
          feeAmountPaise: 0,
          taxAmountPaise: 0,
          netAmountPaise: 350000,
          settlementDate: dateStr(1),
          status: 'settled',
        },
        settlementItem: {
          id: 'si_100_a',
          settlementId: 'set_100_a',
          paymentId: 'pay_100',
          amountPaise: 350000,
          feePaise: 0,
          taxPaise: 0,
          type: 'payment',
        },
        bankEntry: {
          id: 'bnk_100_a',
          utr: 'UTR-HDFC-100A',
          creditPaise: 350000,
          description: 'HDFC SETTLEMENT TRANCHE A UTR-HDFC-100A',
          valueDate: dateStr(1),
          bankAccount: 'HDFC Bank - 0021093849',
        },
      },
    },
  ];

  return exceptions;
}

/**
 * Reconciles an imported multi-file dataset and outputs deterministic summary and exceptions.
 */
export function reconcileMultiFileDataset(dataset: MultiFileDataset): ReconciliationSummary {
  const { orders, payments, settlements, settlementItems, refunds, bankEntries } = dataset;
  const exceptions: ReconciliationException[] = [];

  const paymentByOrderId = new Map<string, PaymentRecord>();
  const paymentById = new Map<string, PaymentRecord>();
  for (const p of payments) {
    paymentById.set(p.id, p);
    if (p.orderId) paymentByOrderId.set(p.orderId, p);
  }

  const settlementItemsByPaymentId = new Map<string, SettlementItemRecord[]>();
  for (const si of settlementItems) {
    const arr = settlementItemsByPaymentId.get(si.paymentId) || [];
    arr.push(si);
    settlementItemsByPaymentId.set(si.paymentId, arr);
  }

  const settlementById = new Map<string, SettlementRecord>();
  for (const s of settlements) {
    settlementById.set(s.id, s);
  }

  const bankEntryByUtr = new Map<string, BankEntryRecord>();
  for (const b of bankEntries) {
    bankEntryByUtr.set(b.utr, b);
  }

  const refundByPaymentId = new Map<string, RefundRecord>();
  for (const r of refunds) {
    refundByPaymentId.set(r.paymentId, r);
  }

  let matchedCount = 0;
  let totalDiscrepancyPaise = 0;

  for (const order of orders) {
    const payment = paymentByOrderId.get(order.id);
    const sItems = payment ? settlementItemsByPaymentId.get(payment.id) : undefined;
    const sItem = sItems?.[0];
    const settlement = sItem ? settlementById.get(sItem.settlementId) : undefined;
    const refund = payment ? refundByPaymentId.get(payment.id) : undefined;
    const bankEntry = settlement ? bankEntryByUtr.get(settlement.settlementUtr) : undefined;

    const chain: EvidenceChain = {
      order,
      payment,
      settlement,
      settlementItem: sItem,
      refund,
      bankEntry,
    };

    const classification = classifyException(chain);

    // Is it fully reconciled?
    const isFullyReconciled =
      payment &&
      payment.status === 'captured' &&
      payment.amountPaise === order.amountPaise &&
      settlement &&
      bankEntry &&
      Math.abs(bankEntry.creditPaise - settlement.netAmountPaise) <= 100 &&
      classification.classification === 'timing_difference';

    if (isFullyReconciled) {
      matchedCount++;
    } else {
      totalDiscrepancyPaise += classification.discrepancyPaise;
      exceptions.push({
        id: `EXC-IMP-${order.id}`,
        businessId: order.businessId,
        orderId: order.id,
        paymentId: payment?.id,
        transactionRef: `TXN-${order.orderNumber}`,
        customerName: order.customerName,
        classification: classification.classification,
        categoryLabel: classification.categoryLabel,
        discrepancyPaise: classification.discrepancyPaise,
        severity: classification.severity,
        status: 'open',
        detectedAt: new Date().toISOString(),
        tags: [classification.classification.replace(/_/g, '-')],
        evidenceChain: chain,
      });
    }
  }

  const total = Math.max(orders.length, 1);
  const reconciliationRate = (matchedCount / total) * 100;

  return {
    totalOrders: orders.length,
    totalPayments: payments.length,
    totalSettlements: settlements.length,
    matchedCount,
    exceptionCount: exceptions.length,
    totalDiscrepancyPaise,
    reconciliationRate,
    exceptions,
  };
}
