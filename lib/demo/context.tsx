"use client";

// lib/demo/context.tsx
// Demo mode context — provides deterministic sample data when Supabase is not configured.

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { generateDemoData, DemoBusiness, DemoTransaction, DemoImportRecord, DEMO_REFERENCE_DATE } from "./sampleData";

export { DEMO_REFERENCE_DATE };

interface DemoContextValue {
  isDemo: boolean;
  referenceDate: Date;
  businesses: DemoBusiness[];
  transactions: DemoTransaction[];
  imports: DemoImportRecord[];
  addTransactions: (txns: DemoTransaction[]) => void;
  addImportRecord: (record: DemoImportRecord) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const isDemo =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const [data] = useState(() => generateDemoData());
  const [extraTxns, setExtraTxns] = useState<DemoTransaction[]>([]);
  const [extraImports, setExtraImports] = useState<DemoImportRecord[]>([]);

  // Hydrate from localStorage after mount to avoid hydration mismatch
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTxns = localStorage.getItem("ledgerpulse_demo_extra_txns");
        if (savedTxns) setExtraTxns(JSON.parse(savedTxns));
        const savedImports = localStorage.getItem("ledgerpulse_demo_extra_imports");
        if (savedImports) setExtraImports(JSON.parse(savedImports));
      } catch (err) {
        console.warn("Could not hydrate demo local storage", err);
      }
    }
  }, []);

  const addTransactions = useCallback((txns: DemoTransaction[]) => {
    setExtraTxns((prev) => {
      const updated = [...prev, ...txns];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("ledgerpulse_demo_extra_txns", JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed to persist extra demo txns", e);
        }
      }
      return updated;
    });
  }, []);

  const addImportRecord = useCallback((rec: DemoImportRecord) => {
    setExtraImports((prev) => {
      const updated = [rec, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("ledgerpulse_demo_extra_imports", JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed to persist extra demo imports", e);
        }
      }
      return updated;
    });
  }, []);

  const allTransactions = [...extraTxns, ...data.transactions];
  const allImports = [...extraImports, ...data.imports];

  return (
    <DemoContext.Provider
      value={{
        isDemo,
        referenceDate: DEMO_REFERENCE_DATE,
        businesses: data.businesses,
        transactions: allTransactions,
        imports: allImports,
        addTransactions,
        addImportRecord,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
