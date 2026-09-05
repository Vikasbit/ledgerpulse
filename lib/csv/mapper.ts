// lib/csv/mapper.ts
// Implements fuzzy column detection based on SYSTEM_CSV_FIELDS definitions.

import { SYSTEM_CSV_FIELDS } from "./definitions";
import { ColumnMapping } from "../types";

/**
 * Normalizes a header string for fuzzy comparison:
 * - lowercases
 * - removes non‑alphanumeric characters
 * - replaces spaces/dashes/underscores with a single underscore
 */
function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Auto‑detects column mappings for a given CSV header row.
 * Returns an array of ColumnMapping objects linking CSV header to internal field key.
 */
export function autoDetectColumnMappings(headers: string[]): ColumnMapping[] {
  const normalizedHeaders = headers.map(normalizeHeader);

  const mappings: ColumnMapping[] = [];

  normalizedHeaders.forEach((norm, idx) => {
    const originalHeader = headers[idx];
    // Try exact match to a definition key first
    const direct = SYSTEM_CSV_FIELDS.find(f => normalizeHeader(f.key) === norm);
    if (direct) {
      mappings.push({ csvHeader: originalHeader, fieldKey: direct.key });
      return;
    }
    // Try matching aliases
    for (const def of SYSTEM_CSV_FIELDS) {
      if (def.aliases && def.aliases.some(a => normalizeHeader(a) === norm)) {
        mappings.push({ csvHeader: originalHeader, fieldKey: def.key });
        return;
      }
    }
    // No match – leave unmapped (fieldKey empty string)
    mappings.push({ csvHeader: originalHeader, fieldKey: "" });
  });

  return mappings;
}

/**
 * Allows user to manually override a mapping for a specific column.
 */
export function setManualMapping(
  current: ColumnMapping[],
  csvHeader: string,
  fieldKey: string
): ColumnMapping[] {
  return current.map(m =>
    m.csvHeader === csvHeader ? { csvHeader, fieldKey } : m
  );
}
