// components/ui/Card.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ title, footer, children, className, ...rest }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-[var(--radius)] shadow-sm border border-gray-200 p-4",
        className
      )}
      {...rest}
    >
      {title && <div className="mb-2 text-lg font-medium">{title}</div>}
      <div>{children}</div>
      {footer && <div className="mt-2 border-t pt-2">{footer}</div>}
    </div>
  );
};
