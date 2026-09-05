// components/ui/EmptyState.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Smile } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export const EmptyState = ({ title, description, actionLabel, onAction, className }: EmptyStateProps) => (
  <div className={cn("flex flex-col items-center justify-center py-12", className)}>
    <Smile className="text-gray-400 mb-4" size={48} />
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    {description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-md text-center">{description}</p>}
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-[var(--radius)] hover:bg-[var(--accent-primary)]/90"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
