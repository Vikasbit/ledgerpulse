// components/ui/Progress.tsx
import React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "danger";

type ProgressProps = {
  value: number; // 0 - 100
  max?: number;
  variant?: Variant;
  className?: string;
  height?: string; // e.g., "h-2"
};

export const Progress = ({ value, max = 100, variant = "default", className, height = "h-2" }: ProgressProps) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const bg = {
    default: "bg-gray-200",
    success: "bg-green-200",
    warning: "bg-yellow-200",
    danger: "bg-red-200",
  }[variant];
  const fg = {
    default: "bg-[var(--accent-primary)]",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  }[variant];

  return (
    <div className={cn("w-full rounded-[var(--radius)] overflow-hidden", bg, height, className)}>
      <div
        className={cn(fg, "h-full transition-all duration-300")}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
