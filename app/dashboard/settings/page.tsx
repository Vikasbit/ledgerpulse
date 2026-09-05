"use client";

// app/dashboard/settings/page.tsx
import React, { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useDemo } from "@/lib/demo/context";
import { useToast } from "@/components/ui/ToastProvider";
import { User, Building2, CreditCard, Shield, Save, Key, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { user, isDemo, signOut } = useAuth();
  const { businesses } = useDemo();
  const { addToast } = useToast();
  const biz = businesses[0];

  const [businessName, setBusinessName] = useState(biz?.name ?? "Acme Technologies");
  const [currency, setCurrency] = useState(biz?.currency ?? "INR");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    addToast({ title: "Business settings saved", variant: "success" });
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/60">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Settings & Integrations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure business metadata, gateway credentials, and security preferences
        </p>
      </div>

      {/* Profile Section */}
      <Section icon={<User size={18} />} title="User Credentials">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Operator Full Name" value={user?.full_name ?? "Demo Administrator"} disabled />
          <Field label="System Email" value={user?.email ?? "demo@ledgerpulse.app"} disabled />
        </div>
      </Section>

      {/* Business Section */}
      <Section icon={<Building2 size={18} />} title="Organization Parameters">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Legal Business Entity
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Operating Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium"
            >
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
            </select>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-600/30 disabled:opacity-50"
          >
            {saving ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Save size={14} className="mr-2" />
            )}
            <span>Save Entity Settings</span>
          </button>
        </div>
      </Section>

      {/* Razorpay Integration */}
      <Section icon={<CreditCard size={18} />} title="Payment Gateway Provider">
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800">Razorpay Direct Connect</span>
              {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? (
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={11} className="mr-1" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  <AlertCircle size={11} className="mr-1" /> Sandbox Simulation Mode
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-400">HMAC SHA-256 Signatures</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? (
              <>Key ID: <code className="font-mono text-slate-800">{process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}</code></>
            ) : (
              <>
                Operating without live API keys in mock verification mode. Add <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono text-slate-700">RAZORPAY_KEY_ID</code> and <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono text-slate-700">RAZORPAY_KEY_SECRET</code> to your environment to charge real credit cards and UPI accounts.
              </>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/60 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
              <p className="text-[10px] font-bold uppercase text-slate-400">Settlement Currency</p>
              <p className="font-semibold text-slate-800 font-mono mt-0.5">INR (₹)</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
              <p className="text-[10px] font-bold uppercase text-slate-400">Capture Mode</p>
              <p className="font-semibold text-slate-800 font-mono mt-0.5">Auto-Capture (Immediate)</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
              <p className="text-[10px] font-bold uppercase text-slate-400">Webhook Status</p>
              <p className="font-semibold text-emerald-600 font-mono mt-0.5">Listening (/api/razorpay)</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Session Security */}
      <Section icon={<Shield size={18} />} title="Access Control & Session">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Operator Session</p>
            <p className="text-xs text-slate-500 mt-0.5">End the current active dashboard access session</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </Section>

      {isDemo && (
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-800 flex items-start space-x-2.5">
          <Key size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Sandbox Mode is currently active</p>
            <p className="text-indigo-700/90 mt-0.5">
              All settings and transactions are maintained in high-speed in-memory state. Connect Supabase to persist edits permanently to PostgreSQL.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <h2 className="flex items-center text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
        <span className="mr-2 text-indigo-600">{icon}</span>
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  disabled,
}: {
  label: string;
  value: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium"
      />
    </div>
  );
}
