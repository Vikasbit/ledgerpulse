// components/ui/ErrorState.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

type ErrorStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export const ErrorState = ({ title, description, actionLabel, onAction, className }: ErrorStateProps) => (
  <div className={cn("flex flex-col items-center justify-center py-12", className)}>
    <AlertCircle className="text-red-400 mb-4" size={48} />
    <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">{title}</h3>
    {description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-md text-center">{description}</p>}
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-red-500 text-white rounded-[var(--radius)] hover:bg-red-600"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
