// components/ui/Badge.tsx
import React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "danger";

type BadgeProps = {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

export const Badge = ({ variant = "default", children, className }: BadgeProps) => {
  const base = "px-2 py-0.5 rounded-full text-xs font-medium";
  const variants: Record<Variant, string> = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };
  return (
    <span className={cn(base, variants[variant], className)}>{children}</span>
  );
};
