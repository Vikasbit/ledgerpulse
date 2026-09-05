"use client";

// components/dashboard/Sidebar.tsx
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Zap,
  Menu,
  X,
  ExternalLink,
  HelpCircle,
  Building,
} from "lucide-react";
import { useDemo } from "@/lib/demo/context";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/import", label: "Import CSV", icon: FileSpreadsheet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isDemo, businesses } = useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 px-5 py-5 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <span className="text-base font-bold text-white tracking-tight block">
            LedgerPulse
          </span>
          <span className="text-[10px] text-slate-400 font-mono block">
            v1.0 • Finance OS
          </span>
        </div>
      </div>

      {/* Organization Pill */}
      <div className="px-3 pt-4 pb-2">
        <div className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-6 h-6 rounded-md bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Building size={12} className="text-indigo-400" />
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-white truncate">
                {businesses[0]?.name || "Acme Corp"}
              </p>
              <p className="text-[10px] text-slate-400 font-mono leading-none">
                Primary Store
              </p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
            INR
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                active
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/70"
              )}
            >
              <Icon
                size={17}
                className={cn(
                  "transition-transform group-hover:scale-105",
                  active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Demo Sandbox Alert Card */}
      {isDemo && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-b from-indigo-950/50 to-slate-800/60 border border-indigo-500/20 flex-shrink-0">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="truncate">Demo data — 500 deterministic transactions</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Connect Supabase to switch to live storage.
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <Link
          href="/"
          className="flex items-center space-x-1 hover:text-slate-200 transition-colors"
        >
          <span>Landing Page</span>
          <ExternalLink size={11} />
        </Link>
        <span className="text-slate-400">•</span>
        <span className="font-mono text-[10px]">Buildathon MVP</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-50 p-2 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800"
        aria-label="Open Sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col transform transition-transform duration-200 ease-out shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Close Sidebar"
        >
          <X size={18} />
        </button>
        {navContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 flex-shrink-0 border-r border-slate-800/80 shadow-xs">
        {navContent}
      </aside>
    </>
  );
}
