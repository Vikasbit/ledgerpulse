// components/ui/Tooltip.tsx
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export const Tooltip = ({ content, children, side = "top", className }: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  const positionClass = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  }[side];

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {open && (
        <div
          className={cn(
            "absolute z-10 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1",
            positionClass,
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
