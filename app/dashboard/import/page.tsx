"use client";

// app/dashboard/import/page.tsx
import React, { useState, useCallback, useRef, useMemo } from "react";
import { useDemo } from "@/lib/demo/context";
import { useToast } from "@/components/ui/ToastProvider";
import { useReconciliation } from "@/lib/reconciliation/context";
import { parseCSVString } from "@/lib/csv/parser";
import { DemoTransaction } from "@/lib/demo/sampleData";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  History,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Sparkles,
  FileSpreadsheet,
  Layers,
  Building2,
  Receipt,
  RotateCcw,
  Trash2,
  Inbox,
} from "lucide-react";

type Step = "upload" | "preview" | "confirm" | "done";
type TabView = "wizard" | "history";
type ImportMode = "single" | "multi";

export default function ImportPage() {
  const { addTransactions, addImportRecord, imports, isDemo, businesses, clearImports } = useDemo();
  const { resetToDefault } = useReconciliation();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [activeTab, setActiveTab] = useState<TabView>("wizard");
  const [importMode, setImportMode] = useState<ImportMode>("single");
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState<string>("");

  const [parseResult, setParseResult] = useState<ReturnType<
    typeof parseCSVString
  > | null>(null);
  const [importing, setImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Pagination for import history
  const [historyPage, setHistoryPage] = useState(1);
  const historyPerPage = 6;

  const totalHistoryPages = Math.max(1, Math.ceil(imports.length / historyPerPage));
  const paginatedImports = useMemo(() => {
    const start = (historyPage - 1) * historyPerPage;
    return imports.slice(start, start + historyPerPage);
  }, [imports, historyPage, historyPerPage]);

  // Handle file selection
  const handleFile = useCallback(async (f: File) => {
    if (!f.name.endsWith(".csv")) {
      addToast({ title: "Please select a valid .csv file", variant: "error" });
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      addToast({ title: "File exceeds 5MB size limit", variant: "error" });
      return;
    }
    setFile(f);
    const text = await f.text();
    setCsvText(text);
    const result = parseCSVString(text);
    setParseResult(result);
    setStep("preview");
    addToast({ title: `Parsed ${result.summary.totalRows} rows`, variant: "info" });
  }, [addToast]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const handleImport = useCallback(async () => {
    if (!parseResult) return;
    setImporting(true);

    try {
      const validRows = parseResult.rows.filter(
        (r) => !r.errors || r.errors.length === 0
      );

      const totalRows = parseResult.summary.totalRows;
      const validCount = parseResult.summary.validRows;
      const errorCount = parseResult.summary.errorRows;
      const status = errorCount === 0 ? "completed" : validCount > 0 ? "partial" : "failed";

      if (isDemo) {
        const bizId = businesses[0]?.id ?? "demo-biz-001";
        const newTxns: DemoTransaction[] = validRows.map((row, i) => ({
          id: `import-${Date.now()}-${i}`,
          business_id: bizId,
          transaction_id:
            (row.data.transaction_id as string) ?? `IMP${Date.now()}-${i}`,
          customer_name: (row.data.customer_name as string) ?? "Customer",
          amount: Number(row.data.amount ?? 0) * 100, // convert to paise
          currency: (row.data.currency as string) ?? "INR",
          status: (row.data.status as DemoTransaction["status"]) ?? "success",
          payment_method: ((["upi", "card", "netbanking", "wallet"].includes(
            String(row.data.payment_method).toLowerCase()
          )
            ? String(row.data.payment_method).toLowerCase()
            : "upi") as DemoTransaction["payment_method"]),
          transaction_date:
            (row.data.transaction_date as string) ?? new Date().toISOString(),
        }));

        addTransactions(newTxns);
      }

      addImportRecord({
        id: `imp-${Date.now()}`,
        filename: file?.name ?? "transactions.csv",
        imported_at: new Date().toISOString(),
        total_rows: totalRows,
        valid_rows: validCount,
        error_rows: errorCount,
        status,
      });

      addToast({
        title: `${validRows.length} transactions imported successfully!`,
        variant: "success",
      });

      setStep("done");
    } catch (err: any) {
      addToast({
        title: err.message ?? "Import failed",
        variant: "error",
      });
    } finally {
      setImporting(false);
    }
  }, [parseResult, isDemo, businesses, file, addTransactions, addImportRecord, addToast]);

  const reset = () => {
    setStep("upload");
    setFile(null);
    setCsvText("");
    setParseResult(null);
  };

  // Generate sample CSV for download
  const sampleCSV = `transaction_id,customer_name,amount,currency,status,payment_method,transaction_date
TXN8001,Amit Sharma,2500,INR,success,upi,2024-03-15
TXN8002,Priya Patel,8900,INR,success,card,2024-03-15
TXN8003,Rajesh Kumar,1500,INR,failed,netbanking,2024-03-14
TXN8004,Sneha Gupta,4200,INR,pending,wallet,2024-03-14
TXN8005,Vikram Malhotra,12000,INR,success,card,2024-03-13`;

  const downloadSample = () => {
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_ledger_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: "Downloaded sample template", variant: "info" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            CSV Ingestion Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated schema mapping, row validation, and historical import ledger
          </p>
        </div>
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setActiveTab("wizard")}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "wizard"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Upload size={14} />
            <span>Upload Wizard</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "history"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <History size={14} />
            <span>Audit History ({imports.length})</span>
          </button>
        </div>
      </div>

      {/* Import Mode Switcher */}
      <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => setImportMode("single")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            importMode === "single"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileSpreadsheet size={15} />
          <span>Standard Transaction CSV</span>
        </button>
        <button
          onClick={() => setImportMode("multi")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            importMode === "multi"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers size={15} />
          <span>Multi-Ledger Merchant Reconciliation (6 Files)</span>
        </button>
      </div>

      {importMode === "multi" && (
        <div className="bg-white rounded-2xl border border-indigo-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Enterprise Multi-Ledger Ingestion
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Cross-File Forensic Reconciliation
              </h2>
              <p className="text-xs text-slate-500 max-w-xl">
                LedgerPulse correlates 6 distinct accounting datasets: Orders, Gateway Captures, Settlement Batches, Line Items, Refunds, and Bank Statements to detect leakage.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
              6 Datasets Active
            </span>
          </div>

          {/* 6 Files Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { title: "1. Orders DB", file: "orders.csv", count: "100 records", desc: "Merchant checkout & invoices" },
              { title: "2. Gateway Payments", file: "payments.csv", count: "98 captures", desc: "Razorpay / Stripe captured events" },
              { title: "3. Settlement Batches", file: "settlements.csv", count: "12 batches", desc: "Acquiring bank disbursements" },
              { title: "4. Settlement Items", file: "settlement_items.csv", count: "96 lines", desc: "MDR fees, taxes & deductions" },
              { title: "5. Refund Register", file: "refunds.csv", count: "4 reversals", desc: "Customer care return ledger" },
              { title: "6. Bank Statement Feed", file: "bank_entries.csv", count: "11 credits", desc: "HDFC / ICICI / SBI bank feeds" },
            ].map((f, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">{f.title}</span>
                  <div className="font-mono text-[11px] text-indigo-600 font-semibold mt-0.5">{f.file}</div>
                  <p className="text-[11px] text-slate-500 mt-1">{f.desc}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 mt-3 pt-2 border-t border-slate-200">
                  {f.count}
                </span>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs text-slate-500">
              Controlled test cases (Orders 91-100) will be reconciled with full evidence chains.
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetToDefault();
                  addToast({
                    title: "Multi-Ledger Reconciliation Complete",
                    description: "10 Controlled test cases and evidence chains loaded into Exceptions Desk.",
                    variant: "success",
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <Sparkles size={14} />
                <span>Run 6-Ledger Matching Suite</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {importMode === "single" && activeTab === "wizard" && (
        <>
          {/* Progress Steps Header */}
          <div className="flex items-center justify-center space-x-3 py-2">
            {(["upload", "preview", "confirm", "done"] as Step[]).map(
              (s, index) => {
                const currentIdx = stepIndex(step);
                const isPassed = currentIdx > index;
                const isCurrent = currentIdx === index;

                return (
                  <React.Fragment key={s}>
                    {index > 0 && (
                      <div
                        className={`h-0.5 w-12 sm:w-16 rounded-full transition-colors ${
                          isPassed ? "bg-indigo-600" : "bg-slate-200"
                        }`}
                      />
                    )}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                        isPassed
                          ? "bg-emerald-500 text-white shadow-xs"
                          : isCurrent
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {isPassed ? <Check size={14} /> : index + 1}
                    </div>
                  </React.Fragment>
                );
              }
            )}
          </div>

          {/* Step 1: Upload Dropzone */}
          {step === "upload" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
                    : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60"
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4 text-indigo-600 border border-indigo-100">
                  <Upload size={28} />
                </div>
                <p className="text-base font-bold text-slate-800">
                  Drag and drop your transaction CSV here, or{" "}
                  <span className="text-indigo-600 underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  Supports UTF-8 CSV files up to 5MB. Automatic header normalization will be applied.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                  className="hidden"
                />
              </div>

              {/* Sample Template Callout */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl gap-3">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet size={20} className="text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Need a sample file to test?</p>
                    <p className="text-[11px] text-slate-500">Download our pre-configured standard ledger CSV format.</p>
                  </div>
                </div>
                <button
                  onClick={downloadSample}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shadow-2xs"
                >
                  <Download size={13} />
                  <span>Download Template</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Preview & Validation */}
          {step === "preview" && parseResult && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{file?.name}</h2>
                    <p className="text-xs text-slate-400">
                      {parseResult.summary.totalRows} records parsed from CSV
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Remove & Reselect
                </button>
              </div>

              {/* Validation Summary Chips */}
              <div className="grid grid-cols-4 gap-3">
                <SummaryStat
                  label="Total Rows"
                  value={parseResult.summary.totalRows}
                  color="gray"
                />
                <SummaryStat
                  label="Valid"
                  value={parseResult.summary.validRows}
                  color="green"
                />
                <SummaryStat
                  label="Issues"
                  value={parseResult.summary.errorRows}
                  color="red"
                />
                <SummaryStat
                  label="Duplicates"
                  value={parseResult.summary.duplicateRows}
                  color="orange"
                />
              </div>

              {/* Data Preview Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Validation Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parseResult.rows.slice(0, 8).map((row, idx) => {
                      const hasErr = row.errors && row.errors.length > 0;
                      return (
                        <tr
                          key={idx}
                          className={hasErr ? "bg-rose-50/40" : "hover:bg-slate-50/80"}
                        >
                          <td className="p-3 text-slate-400 font-mono">{row.rowNumber}</td>
                          <td className="p-3">
                            {hasErr ? (
                              <span className="inline-flex items-center text-rose-600 font-bold">
                                <XCircle size={13} className="mr-1" /> Invalid
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-emerald-600 font-bold">
                                <CheckCircle2 size={13} className="mr-1" /> Valid
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-slate-800">
                            {String(row.data.customer_name ?? "—")}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900">
                            ₹{Number(row.data.amount ?? 0).toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            <span className="uppercase text-[10px] font-bold tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                              {String(row.data.payment_method ?? "OTHER")}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">
                            {String(row.data.transaction_date ?? "—")}
                          </td>
                          <td className="p-3 text-rose-600 font-medium">
                            {row.errors?.join(", ") || "Clean"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {parseResult.rows.length > 8 && (
                <p className="text-[11px] text-center text-slate-400">
                  Showing first 8 of {parseResult.rows.length} rows preview
                </p>
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={reset}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={14} />
                  <span>Choose Another File</span>
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  disabled={parseResult.summary.validRows === 0}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-xs hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-600/30 disabled:opacity-40"
                >
                  <span>Proceed to Import ({parseResult.summary.validRows})</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && parseResult && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs space-y-6">
              <div className="text-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3 text-indigo-600">
                  <Upload size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Confirm Ingestion
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ready to insert <strong className="text-slate-900">{parseResult.summary.validRows}</strong> verified transactions into your ledger.
                </p>
              </div>

              {parseResult.summary.errorRows > 0 && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-start space-x-3">
                  <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <p className="font-bold">
                      {parseResult.summary.errorRows} row(s) failed validation and will be skipped.
                    </p>
                    <p className="mt-0.5 text-amber-700">
                      Only valid records will be committed to the ledger.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep("preview")}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Back to Preview
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-600/30 disabled:opacity-50"
                >
                  {importing ? "Committing..." : "Commit Import"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === "done" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Ingestion Completed Successfully!
              </h2>
              <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
                Transactions have been parsed, validated, and added to the active ledger.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={reset}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Import Another File
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  View Audit History
                </button>
                <a
                  href="/dashboard/transactions"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-600/30"
                >
                  View in Transactions
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {/* History Audit Tab */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Historical CSV Ingestions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit log of all batch file uploads and reconciliation results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {imports.length > 0 && (
                <button
                  onClick={() => {
                    clearImports();
                    addToast({
                      title: "Audit History Cleared",
                      description: "All historical CSV ingestions have been removed.",
                      variant: "info",
                    });
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-200 shadow-2xs"
                  title="Clear all saved audit imports"
                >
                  <Trash2 size={13} />
                  <span>Clear History</span>
                </button>
              )}
              <button
                onClick={() => {
                  reset();
                  setActiveTab("wizard");
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-xs"
              >
                <Upload size={13} />
                <span>New CSV Import</span>
              </button>
            </div>
          </div>

          {imports.length === 0 ? (
            <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-xs">
                <Inbox size={26} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">No Historical CSV Ingestions</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Audit log is clean. When you upload and commit transaction CSVs, their batch audit history will be tracked here.
                </p>
              </div>
              <button
                onClick={() => {
                  reset();
                  setActiveTab("wizard");
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Upload size={14} />
                <span>Start New Import</span>
              </button>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">File Name</th>
                      <th className="p-3">Import Date</th>
                      <th className="p-3">Total Rows</th>
                      <th className="p-3">Valid Rows</th>
                      <th className="p-3">Errors</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedImports.map((imp) => {
                      return (
                        <tr key={imp.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-slate-800 flex items-center space-x-2">
                            <FileText size={15} className="text-indigo-500 flex-shrink-0" />
                            <span>{imp.filename}</span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">
                            {new Date(imp.imported_at).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-3 text-slate-700 font-mono font-medium">{imp.total_rows}</td>
                          <td className="p-3 text-emerald-600 font-mono font-bold">{imp.valid_rows}</td>
                          <td className="p-3 text-rose-500 font-mono font-bold">{imp.error_rows}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                imp.status === "completed"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                  : imp.status === "partial"
                                  ? "bg-amber-50 text-amber-700 border-amber-200/80"
                                  : "bg-rose-50 text-rose-700 border-rose-200/80"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  imp.status === "completed"
                                    ? "bg-emerald-500"
                                    : imp.status === "partial"
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                              />
                              {imp.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div>
                  Showing {Math.min(imports.length, (historyPage - 1) * historyPerPage + 1)} to{" "}
                  {Math.min(imports.length, historyPage * historyPerPage)} of {imports.length} imports
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                    disabled={historyPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-mono px-2 text-slate-700">
                    {historyPage} / {totalHistoryPages}
                  </span>
                  <button
                    onClick={() => setHistoryPage((p) => Math.min(totalHistoryPages, p + 1))}
                    disabled={historyPage === totalHistoryPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}

function stepIndex(step: Step): number {
  return { upload: 0, preview: 1, confirm: 2, done: 3 }[step];
}

function SummaryStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "gray" | "green" | "red" | "orange";
}) {
  const colors = {
    gray: "bg-slate-50 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    orange: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <div className={`rounded-xl p-3 text-center border ${colors[color]}`}>
      <p className="text-lg font-extrabold font-mono">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider">{label}</p>
    </div>
  );
}
