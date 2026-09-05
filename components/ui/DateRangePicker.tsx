// components/ui/DateRangePicker.tsx
import React, { useState } from "react";
import { cn } from "@/lib/utils";

type DateRange = { start: string; end: string };

type DateRangePickerProps = {
  label?: string;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
};

export const DateRangePicker = ({ label, value, onChange, className }: DateRangePickerProps) => {
  const [start, setStart] = useState(value?.start ?? "");
  const [end, setEnd] = useState(value?.end ?? "");

  const triggerChange = (s: string, e: string) => {
    if (onChange) onChange({ start: s, end: e });
  };

  const handleStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setStart(v);
    triggerChange(v, end);
  };
  const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setEnd(v);
    triggerChange(start, v);
  };

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex space-x-2">
        <input
          type="date"
          value={start}
          onChange={handleStart}
          className="rounded-[var(--radius)] border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        />
        <span className="self-center text-gray-500">→</span>
        <input
          type="date"
          value={end}
          onChange={handleEnd}
          className="rounded-[var(--radius)] border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        />
      </div>
    </div>
  );
};
