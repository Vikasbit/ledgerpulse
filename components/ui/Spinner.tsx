// components/ui/Spinner.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type SpinnerProps = {
  className?: string;
  size?: number | "sm" | "md" | "lg";
};

export const Spinner = ({ className, size = 24 }: SpinnerProps) => {
  const pixelSize = typeof size === "number" ? size : size === "sm" ? 16 : size === "lg" ? 32 : 24;
  return (
    <Loader2
      className={cn("animate-spin text-gray-600 dark:text-gray-300", className)}
      size={pixelSize}
    />
  );
};
