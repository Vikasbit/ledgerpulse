"use client";

// components/ui/ToastProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ToastVariant = "default" | "success" | "error" | "info";

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms
};

type ToastContextType = {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, ...toast }]);
    const duration = toast.duration ?? 4000;
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed inset-0 flex items-start justify-end p-4 pointer-events-none">
        <div className="flex flex-col space-y-2 max-w-sm w-full">
          {toasts.map(t => (
            <div
              key={t.id}
              className={cn(
                "relative rounded-[var(--radius)] shadow-lg p-4 bg-white dark:bg-gray-800 border-l-4",
                t.variant === "success" && "border-green-500",
                t.variant === "error" && "border-red-500",
                (t.variant === "info" || t.variant === "default") && "border-blue-500"
              )}
            >
              <button
                onClick={() => removeToast(t.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t.title}</p>
              {t.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};
