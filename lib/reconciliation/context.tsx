'use client';

// lib/reconciliation/context.tsx
/**
 * Reconciliation Context & State Manager
 * 
 * Provides global state for financial exceptions, AI investigation cycles,
 * resolution status transitions, and Copilot drawer integration.
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ReconciliationException } from './types';
import { generateControlledExceptions } from './engine';
import { AIInvestigation, ResolutionStatus } from '../ai/types';
import { createDeterministicInvestigation } from '../ai/classifier';

interface ReconciliationContextType {
  exceptions: ReconciliationException[];
  unresolvedCount: number;
  highPriorityCount: number;
  totalDiscrepancyPaise: number;
  loading: boolean;
  investigatingIds: Set<string>;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  getExceptionById: (id: string) => ReconciliationException | undefined;
  investigateException: (id: string) => Promise<AIInvestigation>;
  updateStatus: (id: string, status: ResolutionStatus) => void;
  addNote: (id: string, note: string) => void;
  resetToDefault: () => void;
}

const ReconciliationContext = createContext<ReconciliationContextType | undefined>(undefined);

const STORAGE_KEY = 'ledgerpulse_reconciliation_exceptions_v2';

export function ReconciliationProvider({ children }: { children: React.ReactNode }) {
  const [exceptions, setExceptions] = useState<ReconciliationException[]>([]);
  const [loading, setLoading] = useState(true);
  const [investigatingIds, setInvestigatingIds] = useState<Set<string>>(new Set());
  const [copilotOpen, setCopilotOpen] = useState(false);

  // Initialize from localStorage or generate defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExceptions(parsed);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read stored exceptions from localStorage:', e);
    }

    // Default to controlled test cases
    const initial = generateControlledExceptions();
    setExceptions(initial);
    setLoading(false);
  }, []);

  // Sync to localStorage
  const saveExceptions = (newExceptions: ReconciliationException[]) => {
    setExceptions(newExceptions);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newExceptions));
    } catch (e) {
      console.error('Failed to save exceptions to localStorage:', e);
    }
  };

  const unresolvedCount = useMemo(() => {
    return exceptions.filter((e) => e.status === 'open' || e.status === 'investigated' || e.status === 'under_review').length;
  }, [exceptions]);

  const highPriorityCount = useMemo(() => {
    return exceptions.filter(
      (e) => (e.status === 'open' || e.status === 'investigated') && e.severity === 'HIGH'
    ).length;
  }, [exceptions]);

  const totalDiscrepancyPaise = useMemo(() => {
    return exceptions
      .filter((e) => e.status !== 'resolved' && e.status !== 'dismissed')
      .reduce((sum, e) => sum + e.discrepancyPaise, 0);
  }, [exceptions]);

  const getExceptionById = (id: string) => {
    return exceptions.find((e) => e.id === id);
  };

  const investigateException = async (id: string): Promise<AIInvestigation> => {
    const exc = getExceptionById(id);
    if (!exc) throw new Error('Exception not found');

    setInvestigatingIds((prev) => new Set(prev).add(id));

    try {
      const response = await fetch('/api/ai/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exception: exc,
          merchantName: 'LedgerPulse Merchant',
          currency: 'INR',
        }),
      });

      let investigation: AIInvestigation;

      if (response.ok) {
        const data = await response.json();
        investigation = data.investigation;
      } else {
        investigation = createDeterministicInvestigation(exc.id, exc.evidenceChain);
      }

      // Update exception state with investigation
      const updated = exceptions.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === 'open' ? ('investigated' as ResolutionStatus) : item.status,
            aiInvestigation: investigation,
          };
        }
        return item;
      });

      saveExceptions(updated);
      return investigation;
    } catch (err) {
      console.error('Investigate API error, falling back locally:', err);
      const fallback = createDeterministicInvestigation(exc.id, exc.evidenceChain);
      const updated = exceptions.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === 'open' ? ('investigated' as ResolutionStatus) : item.status,
            aiInvestigation: fallback,
          };
        }
        return item;
      });
      saveExceptions(updated);
      return fallback;
    } finally {
      setInvestigatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const updateStatus = (id: string, status: ResolutionStatus) => {
    const updated = exceptions.map((e) => (e.id === id ? { ...e, status } : e));
    saveExceptions(updated);
  };

  const addNote = (id: string, note: string) => {
    const updated = exceptions.map((e) => {
      if (e.id === id) {
        const existing = e.notes ? `${e.notes}\n\n` : '';
        return {
          ...e,
          notes: `${existing}[${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}] ${note}`,
        };
      }
      return e;
    });
    saveExceptions(updated);
  };

  const resetToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    const defaults = generateControlledExceptions();
    const fresh = JSON.parse(JSON.stringify(defaults));
    setExceptions(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {
      console.error('Failed to save exceptions to localStorage:', e);
    }
  };


  return (
    <ReconciliationContext.Provider
      value={{
        exceptions,
        unresolvedCount,
        highPriorityCount,
        totalDiscrepancyPaise,
        loading,
        investigatingIds,
        copilotOpen,
        setCopilotOpen,
        getExceptionById,
        investigateException,
        updateStatus,
        addNote,
        resetToDefault,
      }}
    >
      {children}
    </ReconciliationContext.Provider>
  );
}

export function useReconciliation() {
  const context = useContext(ReconciliationContext);
  if (!context) {
    throw new Error('useReconciliation must be used within a ReconciliationProvider');
  }
  return context;
}
