"use client";

// app/dashboard/transactions/page.tsx
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useDemo } from "@/lib/demo/context";
import { Modal } from "@/components/ui/Modal";
import { RazorpayCheckout } from "@/components/razorpay/RazorpayCheckout";
import { useToast } from "@/components/ui/ToastProvider";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  Copy,
  Check,
  CreditCard,
  RotateCcw,
  Sparkles,
  Bot,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";


const PAGE_SIZE = 12;

export default function TransactionsPage() {
  const { transactions, addTransactions, businesses } = useDemo();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collect Payment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payCustomer, setPayCustomer] = useState("");
  const [payAmount, setPayAmount] = useState(1000);
  const [payReceipt, setPayReceipt] = useState("Service Invoice");

  const filtered = useMemo(() => {
    let list = [...transactions];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.customer_name.toLowerCase().includes(q) ||
          t.transaction_id.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((t) => t.status === statusFilter);
    }

    // Method filter
    if (methodFilter !== "all") {
      list = list.filter((t) => t.payment_method === methodFilter);
    }

    // Sort by date descending
    list.sort(
      (a, b) =>
        new Date(b.transaction_date).getTime() -
        new Date(a.transaction_date).getTime()
    );

    return list;
  }, [transactions, search, statusFilter, methodFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatAmount = (paise: number) =>
    `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast({ title: `Copied ${id}`, variant: "info" });
  };

  const handleExportCSV = () => {
    const headers = [
      "Transaction ID",
      "Customer",
      "Amount",
      "Status",
      "Method",
      "Date",
    ];
    const rows = filtered.map((t) => [
      t.transaction_id,
      t.customer_name,
      (t.amount / 100).toString(),
      t.status,
      t.payment_method,
      t.transaction_date,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ledger_transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: "CSV export started", variant: "success" });
  };

  const handlePaymentSuccess = (orderId: string) => {
    const newTxn = {
      id: `manual-txn-${Date.now()}`,
      business_id: businesses[0]?.id ?? "demo-biz-001",
      transaction_id: `RZP${Date.now().toString().slice(-6)}`,
      customer_name: payCustomer.trim() || "Walk-in Customer",
      amount: payAmount * 100,
      currency: "INR",
      status: "success" as const,
      payment_method: "upi" as const,
      transaction_date: new Date().toISOString(),
    };
    addTransactions([newTxn]);
    setIsModalOpen(false);
    addToast({
      title: `₹${payAmount} collected successfully!`,
      description: `Order ID: ${orderId}`,
      variant: "success",
    });
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMethodFilter("all");
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Transaction Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete verifiable log of {transactions.length.toLocaleString()} transactions across all payment channels
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 transition-all shadow-xs"
          >
            <Download size={15} className="mr-1.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-600/30 active:scale-[0.98]"
          >
            <Plus size={16} className="mr-1.5" />
            <span>Collect Payment</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="flex items-center flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 transition-all focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by customer name or transaction ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="ml-2 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none flex-1"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Status Dropdowns */}
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="all">All Methods</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet</option>
            </select>

            {(search || statusFilter !== "all" || methodFilter !== "all") && (
              <button
                onClick={resetFilters}
                className="p-2.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                title="Reset filters"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pill Badges */}
        <div className="flex items-center space-x-1.5 pt-1 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-medium mr-1">Status:</span>
          {["all", "success", "pending", "failed", "refunded"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-full font-semibold capitalize transition-all ${
                statusFilter === s
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 bg-slate-50/75">
                <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-right px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Channel
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Timestamp
                </th>
                <th className="text-right px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  AI Forensic
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((txn) => {
                const initial = txn.customer_name ? txn.customer_name.charAt(0) : "C";
                const isCopied = copiedId === txn.transaction_id;
                const isException = txn.status === "failed" || txn.status === "refunded";

                return (
                  <tr
                    key={txn.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* ID + Copy button */}
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-700">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-slate-800">{txn.transaction_id}</span>
                        <button
                          onClick={() => handleCopy(txn.transaction_id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all"
                          title="Copy Transaction ID"
                        >
                          {isCopied ? (
                            <Check size={12} className="text-emerald-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
                          {initial}
                        </div>
                        <span>{txn.customer_name}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                      {formatAmount(txn.amount)}
                    </td>

                    {/* Status with Glow Dot */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          txn.status === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                            : txn.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200/80"
                            : txn.status === "failed"
                            ? "bg-rose-50 text-rose-700 border-rose-200/80"
                            : "bg-orange-50 text-orange-700 border-orange-200/80"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            txn.status === "success"
                              ? "bg-emerald-500"
                              : txn.status === "pending"
                              ? "bg-amber-500"
                              : txn.status === "failed"
                              ? "bg-rose-500"
                              : "bg-orange-500"
                          }`}
                        />
                        {txn.status}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                        {txn.payment_method}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs hidden lg:table-cell">
                      {formatDate(txn.transaction_date)}
                    </td>

                    {/* AI Forensic Column */}
                    <td className="px-5 py-3.5 text-right">
                      {isException ? (
                        <Link
                          href="/dashboard/exceptions"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200/80 transition-colors shadow-2xs"
                        >
                          <AlertTriangle size={12} />
                          <span>Investigate</span>
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                          <Check size={12} /> Reconciled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}


              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                    <div className="max-w-xs mx-auto text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Search size={20} />
                      </div>
                      <p className="font-semibold text-slate-700 text-sm">No transactions match your search</p>
                      <p className="text-xs text-slate-400 mt-1">Try resetting the status filter or searching with different keywords.</p>
                      <button
                        onClick={resetFilters}
                        className="mt-4 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/70 border-t border-slate-200/70 text-xs text-slate-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(filtered.length, page * PAGE_SIZE)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {filtered.length.toLocaleString()}
            </span>{" "}
            transactions
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono px-2 text-slate-700">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Collect Payment Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Collect Verified Razorpay Payment"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Customer Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Chandra"
              value={payCustomer}
              onChange={(e) => setPayCustomer(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Quick Presets
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPayAmount(amt)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    payAmount === amt
                      ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Amount (₹ INR)
            </label>
            <input
              type="number"
              min="1"
              value={payAmount}
              onChange={(e) => setPayAmount(Math.max(1, Number(e.target.value)))}
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Invoice Note / Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Consultation Services"
              value={payReceipt}
              onChange={(e) => setPayReceipt(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
            <RazorpayCheckout
              amount={payAmount * 100}
              currency="INR"
              receipt={payReceipt}
              onSuccess={handlePaymentSuccess}
              onError={(err) => addToast({ title: err, variant: "error" })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
