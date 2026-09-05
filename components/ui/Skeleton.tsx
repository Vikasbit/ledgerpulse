// components/ui/Skeleton.tsx
import React from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
  width?: string; // e.g., "w-32"
  height?: string; // e.g., "h-4"
  rounded?: string; // e.g., "rounded-full"
};

export const Skeleton = ({ className, width = "w-full", height = "h-4", rounded = "rounded" }: SkeletonProps) => (
  <div
    className={cn(
      "bg-gray-200 dark:bg-gray-700 animate-pulse",
      width,
      height,
      rounded,
      className
    )}
  />
);
