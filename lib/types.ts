export type TransactionStatus = 'success' | 'pending' | 'failed' | 'refunded';

export type PaymentMethod =
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'emi'
  | 'bank_transfer'
  | 'other';

/**
 * Represents a financial transaction imported via CSV or created via Razorpay.
 */
export interface Transaction {
  id: string; // UUID or generated identifier
  businessId: string; // reference to business profile
  importId?: string; // optional link to CSV import batch
  transactionId: string; // original transaction reference from CSV
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  amount: number; // amount in minor currency units (e.g., paise)
  currency: string; // ISO 4217, e.g., 'INR'
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  transactionDate: Date;
  notes?: string;
  metadata?: Record<string, any>;
  razorpayPaymentId?: string; // if payment made via Razorpay
}

/**
 * Business profile configuration.
 */
export interface Business {
  id: string;
  name: string;
  industry?: string;
  currency: string; // default currency for the business
  createdAt: Date;
  updatedAt: Date;
}

/**
 * CSV import batch metadata.
 */
export interface ImportBatch {
  id: string;
  businessId: string;
  filename: string;
  totalRows: number;
  validRows: number;
  errorRows: number;
  duplicateRows: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Mapping definition for CSV columns.
 */
export interface CSVFieldDefinition {
  key: string; // internal field key e.g., 'transaction_id'
  label: string; // human readable label
  required: boolean;
  type: 'string' | 'number' | 'date' | 'enum';
  description?: string;
  aliases?: string[]; // possible header aliases
}

/**
 * Column mapping result after fuzzy detection.
 */
export interface ColumnMapping {
  csvHeader: string;
  fieldKey: string; // maps to a key in CSVFieldDefinition
}

/**
 * Result of a parsed CSV row.
 */
export interface ParsedRowResult {
  rowNumber: number;
  data: Record<string, any>;
  errors?: string[];
}

/**
 * Summary of CSV validation after preview.
 */
export interface CSVValidationSummary {
  totalRows: number;
  validRows: number;
  errorRows: number;
  duplicateRows: number;
  sampleErrors?: ParsedRowResult[]; // up to N sample erroneous rows
}
