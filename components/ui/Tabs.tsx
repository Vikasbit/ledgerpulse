// components/ui/Tabs.tsx
import React from "react";
import { cn } from "@/lib/utils";

type Tab = {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultKey?: string;
  className?: string;
};

export const Tabs = ({ tabs, defaultKey, className }: TabsProps) => {
  const [active, setActive] = React.useState<string>(defaultKey ?? tabs[0].key);
  const current = tabs.find(t => t.key === active);
  return (
    <div className={cn("w-full", className)}>
      <nav className="flex space-x-4 border-b border-gray-200 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "pb-2 text-sm font-medium",
              active === tab.key
                ? "border-b-2 border-[var(--accent-primary)] text-[var(--accent-primary)]"
                : "text-gray-600 hover:text-gray-800"
            )}
          >
            {tab.title}
          </button>
        ))}
      </nav>
      <div>{current?.content}</div>
    </div>
  );
};
