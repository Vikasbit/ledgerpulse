// lib/demo/sampleData.ts
/**
 * Deterministic demo data generator for LedgerPulse.
 * All transactions and metrics are anchored to a stable DEMO_REFERENCE_DATE.
 * Guarantees that the 7-day, 30-day, and 90-day timeframes always have
 * consistent, mathematically sound, non-zero financial data.
 */

export interface DemoBusiness {
  id: string;
  name: string;
  currency: string;
}

export interface DemoTransaction {
  id: string;
  business_id: string;
  transaction_id: string;
  customer_name: string;
  amount: number; // in paise
  currency: string;
  status: "success" | "pending" | "failed" | "refunded";
  payment_method: "upi" | "card" | "netbanking" | "wallet";
  transaction_date: string; // ISO 8601 string
}

export interface DemoImportRecord {
  id: string;
  filename: string;
  imported_at: string;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  status: "completed" | "partial" | "failed";
}

// Stable deterministic demo reference date:
// Normalized to the end of today (23:59:59.999 UTC) so that:
// - Day 0 is today, Day 1 is yesterday, etc.
// - Refreshing within the same day keeps the exact same timestamps.
// - 7d, 30d, 90d filters relative to DEMO_REFERENCE_DATE always contain data.
export function getDemoReferenceDate(): Date {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_DEMO_REFERENCE_DATE) {
    return new Date(process.env.NEXT_PUBLIC_DEMO_REFERENCE_DATE);
  }
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
}

export const DEMO_REFERENCE_DATE = getDemoReferenceDate();

// Deterministic Linear Congruential Generator (PRNG)
let _seed = 12345;
export function resetSeed(seed = 12345) {
  _seed = seed;
}

function pseudoRandom(): number {
  const a = 1664525;
  const c = 1013904223;
  const m = 0x100000000;
  _seed = (a * _seed + c) % m;
  return _seed / m;
}

function randomInt(min: number, max: number): number {
  return Math.floor(pseudoRandom() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

const CUSTOMER_NAMES = [
  "Amit Sharma", "Priya Patel", "Rajesh Kumar", "Sneha Gupta", "Vikram Malhotra",
  "Neha Verma", "Arjun Reddy", "Kavita Nair", "Suresh Iyer", "Deepa Menon",
  "Rohit Joshi", "Anjali Das", "Manish Tiwari", "Pooja Saxena", "Karan Singhania",
  "Meera Kapoor", "Anil Chauhan", "Ritu Agarwal", "Sanjay Mishra", "Divya Rao",
  "Aakash Mehta", "Sunita Rao", "Gaurav Bansal", "Shweta Kulkarni", "Prateek Jain",
];

export function generateDemoData(referenceDate: Date = DEMO_REFERENCE_DATE): {
  businesses: DemoBusiness[];
  transactions: DemoTransaction[];
  imports: DemoImportRecord[];
} {
  resetSeed(12345);

  const businesses: DemoBusiness[] = [
    { id: "demo-biz-001", name: "Acme Technologies", currency: "INR" },
    { id: "demo-biz-002", name: "Beta Retail Solutions", currency: "INR" },
  ];

  const paymentMethods: ("upi" | "card" | "netbanking" | "wallet")[] = [
    "upi", "upi", "upi", "card", "card", "netbanking", "wallet",
  ];

  // Weighted ~70% success, ~10% pending, ~10% failed, ~10% refunded
  const statuses: DemoTransaction["status"][] = [
    "success", "success", "success", "success", "success", "success", "success",
    "pending",
    "failed",
    "refunded",
  ];

  const refTime = referenceDate.getTime();
  const rawTransactions: DemoTransaction[] = [];
  let txnIndex = 1000;

  // 1. Last 7 Days (Days 0 to 6): Exactly 10 transactions per day = 70 transactions
  // Guarantees every single day in the 7-day velocity chart has non-zero revenue & counts
  for (let day = 0; day <= 6; day++) {
    for (let j = 0; j < 10; j++) {
      txnIndex++;
      const biz = businesses[0];
      // Business hours between 09:00 and 21:00
      const hour = 9 + Math.floor((j / 10) * 12);
      const minute = (j * 6 + randomInt(0, 5)) % 60;
      const second = randomInt(0, 59);

      const txnDate = new Date(refTime - (day * 86400000) - ((23 - hour) * 3600000) - ((59 - minute) * 60000) - (second * 1000));
      // Realistic ticket sizes: ₹250 to ₹12,500 (in paise)
      const amount = randomInt(250, 12500) * 100;

      rawTransactions.push({
        id: `demo-txn-${String(rawTransactions.length + 1).padStart(4, "0")}`,
        business_id: biz.id,
        transaction_id: `TXN${txnIndex}`,
        customer_name: randomChoice(CUSTOMER_NAMES),
        amount,
        currency: biz.currency,
        status: randomChoice(statuses),
        payment_method: randomChoice(paymentMethods),
        transaction_date: txnDate.toISOString(),
      });
    }
  }

  // 2. Days 7 to 29 (Rest of the last 30 days): 180 transactions (~7-8 per day)
  for (let i = 0; i < 180; i++) {
    txnIndex++;
    const biz = randomChoice(businesses);
    const day = randomInt(7, 29);
    const hour = randomInt(8, 22);
    const minute = randomInt(0, 59);
    const second = randomInt(0, 59);

    const txnDate = new Date(refTime - (day * 86400000) - ((23 - hour) * 3600000) - ((59 - minute) * 60000) - (second * 1000));
    const amount = randomInt(150, 15000) * 100;

    rawTransactions.push({
      id: `demo-txn-${String(rawTransactions.length + 1).padStart(4, "0")}`,
      business_id: biz.id,
      transaction_id: `TXN${txnIndex}`,
      customer_name: randomChoice(CUSTOMER_NAMES),
      amount,
      currency: biz.currency,
      status: randomChoice(statuses),
      payment_method: randomChoice(paymentMethods),
      transaction_date: txnDate.toISOString(),
    });
  }

  // 3. Days 30 to 89 (Rest of the last 90 days): 200 transactions (~3-4 per day)
  for (let i = 0; i < 200; i++) {
    txnIndex++;
    const biz = randomChoice(businesses);
    const day = randomInt(30, 89);
    const hour = randomInt(8, 22);
    const minute = randomInt(0, 59);
    const second = randomInt(0, 59);

    const txnDate = new Date(refTime - (day * 86400000) - ((23 - hour) * 3600000) - ((59 - minute) * 60000) - (second * 1000));
    const amount = randomInt(100, 18000) * 100;

    rawTransactions.push({
      id: `demo-txn-${String(rawTransactions.length + 1).padStart(4, "0")}`,
      business_id: biz.id,
      transaction_id: `TXN${txnIndex}`,
      customer_name: randomChoice(CUSTOMER_NAMES),
      amount,
      currency: biz.currency,
      status: randomChoice(statuses),
      payment_method: randomChoice(paymentMethods),
      transaction_date: txnDate.toISOString(),
    });
  }

  // 4. Days 90 to 120 (Older historical baseline): exactly 50 transactions
  // Total transactions = 70 + 180 + 200 + 50 = 500 transactions exactly
  for (let i = 0; i < 50; i++) {
    txnIndex++;
    const biz = randomChoice(businesses);
    const day = randomInt(90, 120);
    const hour = randomInt(8, 22);
    const minute = randomInt(0, 59);
    const second = randomInt(0, 59);

    const txnDate = new Date(refTime - (day * 86400000) - ((23 - hour) * 3600000) - ((59 - minute) * 60000) - (second * 1000));
    const amount = randomInt(100, 10000) * 100;

    rawTransactions.push({
      id: `demo-txn-${String(rawTransactions.length + 1).padStart(4, "0")}`,
      business_id: biz.id,
      transaction_id: `TXN${txnIndex}`,
      customer_name: randomChoice(CUSTOMER_NAMES),
      amount,
      currency: biz.currency,
      status: randomChoice(statuses),
      payment_method: randomChoice(paymentMethods),
      transaction_date: txnDate.toISOString(),
    });
  }

  // Sort descending by date so transactions[0] is the newest transaction
  const transactions = rawTransactions.sort(
    (a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
  );

  // Historical imports initialized clean
  const imports: DemoImportRecord[] = [];

  return { businesses, transactions, imports };
}
