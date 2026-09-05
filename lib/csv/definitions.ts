// lib/csv/definitions.ts
// CSV field definitions and aliases for smart column auto‑detection.

import { CSVFieldDefinition } from "../types";

export const SYSTEM_CSV_FIELDS: CSVFieldDefinition[] = [
  {
    key: "transaction_id",
    label: "Transaction ID",
    required: true,
    type: "string",
    description: "Unique reference from original system",
    aliases: ["tx_id", "order_id", "reference", "id", "txn_id"],
  },
  {
    key: "customer_name",
    label: "Customer Name",
    required: false,
    type: "string",
    aliases: ["name", "client_name", "payer_name", "full_name"],
  },
  {
    key: "customer_email",
    label: "Customer Email",
    required: false,
    type: "string",
    aliases: ["email", "email_address", "client_email", "payer_email"],
  },
  {
    key: "customer_phone",
    label: "Customer Phone",
    required: false,
    type: "string",
    aliases: ["phone", "phone_number", "contact", "mobile"],
  },
  {
    key: "amount",
    label: "Amount",
    required: true,
    type: "number",
    description: "Monetary amount, can include currency symbol",
    aliases: ["price", "amt", "value", "total"]
  },
  {
    key: "currency",
    label: "Currency",
    required: true,
    type: "string",
    description: "ISO 4217 currency code, e.g., INR, USD",
    aliases: ["curr", "currency_code"]
  },
  {
    key: "transaction_date",
    label: "Transaction Date",
    required: true,
    type: "date",
    description: "Date of the transaction in any common format",
    aliases: ["date", "datetime", "ts", "timestamp", "created_at"]
  },
  {
    key: "status",
    label: "Status",
    required: true,
    type: "enum",
    description: "Transaction status – success/pending/failed/refunded",
    aliases: ["state", "payment_status"]
  },
  {
    key: "payment_method",
    label: "Payment Method",
    required: false,
    type: "enum",
    description: "Method used – card, upi, netbanking, etc.",
    aliases: ["method", "pay_method", "payment_type"]
  },
  {
    key: "notes",
    label: "Notes",
    required: false,
    type: "string",
    aliases: ["remarks", "description", "note"]
  },
];
