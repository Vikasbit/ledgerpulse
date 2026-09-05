// lib/csv/validator.ts
// Validates and normalizes a CSV row according to definitions.

import { CSVFieldDefinition, ParsedRowResult, TransactionStatus, PaymentMethod } from "../types";
import { SYSTEM_CSV_FIELDS } from "./definitions";

/**
 * Parses a raw amount string into a number (minor units).
 * Supports currency symbols, commas, whitespace.
 */
export function parseAmount(raw: any): { amount: number; error?: string } {
  if (raw == null) return { amount: 0, error: "Amount is missing" };
  const str = String(raw).replace(/[^0-9.\-]/g, ""); // strip symbols
  const num = parseFloat(str);
  if (isNaN(num)) return { amount: 0, error: `Invalid amount "${raw}"` };
  // Keep as major units; conversion to minor can be done later.
  return { amount: num };
}

/**
 * Parses a date string into a JS Date.
 * Supports ISO, DD/MM/YYYY, MM/DD/YYYY, Unix timestamp (seconds or ms).
 */
export function parseDate(raw: any): { date: Date | null; error?: string } {
  if (raw == null) return { date: null, error: "Date is missing" };
  const s = String(raw).trim();
  // Unix timestamp detection
  if (/^\d{10,13}$/.test(s)) {
    const ms = s.length === 10 ? parseInt(s) * 1000 : parseInt(s);
    const d = new Date(ms);
    if (!isNaN(d.getTime())) return { date: d };
  }
  // Try ISO first
  const iso = new Date(s);
  if (!isNaN(iso.getTime())) return { date: iso };
  // Try common DD/MM/YYYY or MM/DD/YYYY
  const parts = s.split(/[\/\-]/);
  if (parts.length === 3) {
    const [a, b, c] = parts.map(p => parseInt(p, 10));
    // Heuristic: if a > 31 assume year first
    if (a > 31) {
      const d = new Date(a, b - 1, c);
      if (!isNaN(d.getTime())) return { date: d };
    } else {
      // assume DD/MM/YYYY
      const d = new Date(c, b - 1, a);
      if (!isNaN(d.getTime())) return { date: d };
    }
  }
  return { date: null, error: `Unparseable date "${raw}"` };
}

/**
 * Normalizes enum fields like status and payment_method.
 */
function normalizeEnum(value: string, allowed: string[]): string | undefined {
  const low = value.toLowerCase();
  return allowed.find(v => v.toLowerCase() === low);
}

export function validateRow(
  row: Record<string, any>,
  mapping: { csvHeader: string; fieldKey: string }[]
): ParsedRowResult {
  const errors: string[] = [];
  const data: Record<string, any> = {};

  for (const map of mapping) {
    const { csvHeader, fieldKey } = map;
    if (!fieldKey) continue; // unmapped column
    const raw = row[csvHeader];
    const def = SYSTEM_CSV_FIELDS.find(f => f.key === fieldKey);
    if (!def) continue;
    if (def.required && (raw === undefined || raw === null || String(raw).trim() === "")) {
      errors.push(`${fieldKey} is required`);
      continue;
    }
    switch (def.type) {
      case "number": {
        const { amount, error } = parseAmount(raw);
        if (error) errors.push(error);
        else data[fieldKey] = amount;
        break;
      }
      case "date": {
        const { date, error } = parseDate(raw);
        if (error) errors.push(error);
        else data[fieldKey] = date;
        break;
      }
      case "enum": {
        if (fieldKey === "status") {
          const norm = normalizeEnum(String(raw), ["success", "pending", "failed", "refunded"]);
          if (!norm) errors.push(`Invalid status "${raw}"`);
          else data[fieldKey] = norm as TransactionStatus;
        } else if (fieldKey === "payment_method") {
          const norm = normalizeEnum(String(raw), ["upi", "card", "netbanking", "wallet", "emi", "bank_transfer", "other"]);
          if (!norm) errors.push(`Invalid payment method "${raw}"`);
          else data[fieldKey] = norm as PaymentMethod;
        } else {
          data[fieldKey] = raw;
        }
        break;
      }
      default:
        data[fieldKey] = raw;
    }
  }

  return { rowNumber: 0, data, errors: errors.length ? errors : undefined };
}
