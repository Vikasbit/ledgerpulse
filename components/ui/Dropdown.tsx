// components/ui/Dropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  onSelect: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export const Dropdown = ({ trigger, items, className }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={cn("relative inline-block", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-1"
      >
        {trigger}
        <ChevronDown size={16} className="opacity-60" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-[var(--radius)] shadow-lg border border-gray-200 z-10">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
