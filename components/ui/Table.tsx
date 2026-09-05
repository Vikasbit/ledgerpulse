// components/ui/Table.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type Column<T> = {
  header: string | React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
  onRowClick?: (row: T) => void;
};

export function Table<T extends object>({ columns, data, className, onRowClick }: TableProps<T>) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = React.useState(true);

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortKey, sortAsc]);

  const handleHeaderClick = (col: Column<T>) => {
    if (!col.sortable) return;
    const key = typeof col.accessor === "string" ? col.accessor : null;
    if (key) {
      if (sortKey === key) {
        setSortAsc(!sortAsc);
      } else {
        setSortKey(key);
        setSortAsc(true);
      }
    }
  };

  return (
    <div className={cn("overflow-x-auto rounded-[var(--radius)] border", className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase",
                  col.sortable && "cursor-pointer"
                )}
                onClick={() => handleHeaderClick(col)}
              >
                <div className="flex items-center">
                  {col.header}
                  {col.sortable && sortKey === (typeof col.accessor === "string" ? col.accessor : undefined) && (
                    <ChevronDown
                      size={12}
                      className={cn("ml-1 transition-transform", sortAsc ? "rotate-0" : "-rotate-180")}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
          {sortedData.map((row, i) => (
            <tr
              key={i}
              className={cn(
                onRowClick && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                i % 2 === 0 ? "bg-gray-50" : "bg-white"
              )}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, j) => (
                <td key={j} className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor as keyof T] as unknown as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
