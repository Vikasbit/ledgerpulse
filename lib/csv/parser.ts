// lib/csv/parser.ts
// Parses a CSV string using PapaParse, auto‑detects column mappings, validates rows, and returns a summary.

import Papa from "papaparse";
import { autoDetectColumnMappings } from "./mapper";
import { validateRow } from "./validator";
import { CSVValidationSummary, ParsedRowResult } from "../types";

/**
 * Parses a CSV string and returns parsed rows along with a validation summary.
 *
 * @param csvString The raw CSV content.
 * @returns An object containing the array of row results and a summary.
 */
export function parseCSVString(csvString: string): {
  rows: ParsedRowResult[];
  summary: CSVValidationSummary;
} {
  const results: ParsedRowResult[] = [];
  let headerRow: string[] | null = null;
  let columnMappings: { csvHeader: string; fieldKey: string }[] = [];

  // Parse with PapaParse, streaming each record.
  Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: h => h.trim(),
    step: (row, parser) => {
      const { data, meta, errors } = row;
      const rowNumber = meta.cursor ? meta.cursor : results.length + 2; // approximate line number

      // On first row, determine mappings.
      if (!headerRow) {
        headerRow = meta.fields as string[];
        columnMappings = autoDetectColumnMappings(headerRow);
      }

      // Validate and normalize the row.
      const parsed = validateRow(data as Record<string, any>, columnMappings);
      parsed.rowNumber = rowNumber;
      results.push(parsed);
    },
    error: (err: any) => {
      // Fatal parsing errors – push a single error row.
      results.push({ rowNumber: 0, data: {}, errors: [err.message] });
    },
  });

  // Compute summary statistics.
  const totalRows = results.length;
  const errorRows = results.filter(r => r.errors && r.errors.length > 0).length;
  const validRows = totalRows - errorRows;

  // Duplicate detection (simple in‑memory based on transaction_id if present).
  const seen = new Set<string>();
  let duplicateRows = 0;
  results.forEach(r => {
    const txId = r.data["transaction_id"] as string | undefined;
    if (txId) {
      if (seen.has(txId)) {
        duplicateRows++;
        r.errors = (r.errors ?? []).concat(["Duplicate transaction_id"]);
      } else {
        seen.add(txId);
      }
    }
  });

  const summary: CSVValidationSummary = {
    totalRows,
    validRows,
    errorRows,
    duplicateRows,
    sampleErrors: results.filter(r => r.errors && r.errors.length > 0).slice(0, 5),
  };

  return { rows: results, summary };
}
