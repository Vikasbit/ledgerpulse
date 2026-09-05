// components/ui/Alert.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Variant = "info" | "success" | "warning" | "error";

type AlertProps = {
  variant?: Variant;
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
};

const variantStyles: Record<Variant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  error: "bg-red-50 border-red-200 text-red-800",
};

export const Alert = ({ variant = "info", title, description, onClose, className }: AlertProps) => (
  <div className={cn("border-l-4 p-4 rounded-[var(--radius)]", variantStyles[variant], className)}>
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm mt-1">{description}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      )}
    </div>
  </div>
);
