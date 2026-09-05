"use client";

// components/dashboard/TopBar.tsx
import React, { useState } from "react";
import { Search, Bell, User, LogOut, CheckCircle2, Clock, Sparkles, X } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useDemo } from "@/lib/demo/context";

export function TopBar() {
  const { user, isDemo, signOut } = useAuth();
  const { businesses } = useDemo();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: "n1",
      title: "March Sales Batch reconciled",
      time: "10 mins ago",
      icon: <CheckCircle2 size={14} className="text-emerald-500" />,
    },
    {
      id: "n2",
      title: "New payment of ₹2,500 received via UPI",
      time: "1 hour ago",
      icon: <CheckCircle2 size={14} className="text-indigo-500" />,
    },
    {
      id: "n3",
      title: "Daily sync completed successfully",
      time: "4 hours ago",
      icon: <Clock size={14} className="text-slate-400" />,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 transition-all">
      {/* Search Input with Keyboard Badge */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="flex items-center w-full bg-slate-50/90 border border-slate-200/80 rounded-xl px-3.5 py-2 text-sm transition-all focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10">
          <Search size={16} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search transactions, customers, IDs..."
            className="ml-2.5 bg-transparent text-slate-800 placeholder-slate-400 outline-none flex-1 text-xs sm:text-sm"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Environment Status Badge */}
        {isDemo ? (
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sandbox Mode</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Production</span>
          </div>
        )}

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100/80 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications
                </span>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50/80 transition-colors flex items-start space-x-3">
                    <div className="mt-0.5">{n.icon}</div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-800">{n.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center space-x-2 pl-3 border-l border-slate-200/80">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "D"}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              {user?.full_name || "Demo User"}
            </p>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              {businesses[0]?.name || "Acme Corp"}
            </p>
          </div>
          <button
            onClick={signOut}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
