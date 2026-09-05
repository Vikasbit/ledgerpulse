// components/ui/Select.tsx
import React from "react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type SelectProps = {
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value">;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, value, onChange, placeholder, error, className, ...rest }, ref) => {
    return (
      <div className={cn("flex flex-col space-y-1", className)}>
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <select
          ref={ref}
          className={cn(
            "rounded-[var(--radius)] border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]",
            error && "border-red-500"
          )}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
