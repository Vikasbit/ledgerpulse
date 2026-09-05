"use client";

// lib/demo/context.tsx
// Unified Data Context — supports Live Supabase Storage when active and verified,
// with graceful fallback to deterministic Demo Sandbox data.

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { generateDemoData, DemoBusiness, DemoTransaction, DemoImportRecord, DEMO_REFERENCE_DATE } from "./sampleData";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export { DEMO_REFERENCE_DATE };

interface DemoContextValue {
  isDemo: boolean;
  isLiveConnected: boolean;
  referenceDate: Date;
  businesses: DemoBusiness[];
  transactions: DemoTransaction[];
  imports: DemoImportRecord[];
  addTransactions: (txns: DemoTransaction[]) => void;
  addImportRecord: (record: DemoImportRecord) => void;
  refreshLiveData: () => Promise<void>;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const hasEnvCredentials =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const [data] = useState(() => generateDemoData());
  const [extraTxns, setExtraTxns] = useState<DemoTransaction[]>([]);
  const [extraImports, setExtraImports] = useState<DemoImportRecord[]>([]);
  
  // Real Supabase data state
  const [liveBusinesses, setLiveBusinesses] = useState<DemoBusiness[]>([]);
  const [liveTransactions, setLiveTransactions] = useState<DemoTransaction[]>([]);
  const [liveImports, setLiveImports] = useState<DemoImportRecord[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Hydrate local storage for demo/offline overrides
  useEffect(() => {
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

  // Fetch live Supabase data if authenticated and tables are available
  const refreshLiveData = useCallback(async () => {
    if (!hasEnvCredentials) {
      setIsLiveConnected(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setIsLiveConnected(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLiveConnected(false);
        return;
      }

      // Check if businesses table is accessible
      const { data: bData, error: bError } = await supabase
        .from("businesses")
        .select("*")
        .limit(10);

      if (bError) {
        // Table does not exist or permission denied
        setIsLiveConnected(false);
        return;
      }

      // Successfully verified live database connection!
      setIsLiveConnected(true);
      if (bData && bData.length > 0) {
        setLiveBusinesses(bData);
      }

      // Fetch live transactions
      const { data: tData, error: tError } = await supabase
        .from("transactions")
        .select("*")
        .order("transaction_date", { ascending: false });

      if (!tError && tData) {
        setLiveTransactions(tData as any);
      }

      // Fetch live imports
      const { data: iData, error: iError } = await supabase
        .from("imports")
        .select("*")
        .order("created_at", { ascending: false });

      if (!iError && iData) {
        setLiveImports(iData as any);
      }
    } catch (err) {
      console.warn("Live Supabase sync check:", err);
      setIsLiveConnected(false);
    }
  }, [hasEnvCredentials]);

  useEffect(() => {
    refreshLiveData();
  }, [refreshLiveData]);

  const addTransactions = useCallback(async (txns: DemoTransaction[]) => {
    // If live Supabase is connected, persist to Supabase
    if (isLiveConnected) {
      try {
        const supabase = createSupabaseBrowserClient();
        if (supabase) {
          const { error } = await supabase.from("transactions").insert(txns as any);
          if (!error) {
            setLiveTransactions((prev) => [...txns, ...prev]);
            return;
          }
        }
      } catch (e) {
        console.warn("Failed to insert into live Supabase transactions, saving locally", e);
      }
    }

    // Local / Demo persistence fallback
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
  }, [isLiveConnected]);

  const addImportRecord = useCallback(async (rec: DemoImportRecord) => {
    if (isLiveConnected) {
      try {
        const supabase = createSupabaseBrowserClient();
        if (supabase) {
          const { error } = await supabase.from("imports").insert(rec as any);
          if (!error) {
            setLiveImports((prev) => [rec, ...prev]);
            return;
          }
        }
      } catch (e) {
        console.warn("Failed to insert into live Supabase imports, saving locally", e);
      }
    }

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
  }, [isLiveConnected]);

  // If live data exists and connected, display live data; otherwise display deterministic demo data
  const isDemo = !isLiveConnected;
  const activeTransactions = isLiveConnected && liveTransactions.length > 0 
    ? liveTransactions 
    : [...extraTxns, ...data.transactions];
    
  const activeImports = isLiveConnected && liveImports.length > 0
    ? liveImports
    : [...extraImports, ...data.imports];
    
  const activeBusinesses = isLiveConnected && liveBusinesses.length > 0
    ? liveBusinesses
    : data.businesses;

  return (
    <DemoContext.Provider
      value={{
        isDemo,
        isLiveConnected,
        referenceDate: DEMO_REFERENCE_DATE,
        businesses: activeBusinesses,
        transactions: activeTransactions,
        imports: activeImports,
        addTransactions,
        addImportRecord,
        refreshLiveData,
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
