'use client';

// components/ai/CopilotDrawer.tsx
/**
 * Sliding AI Finance Copilot Drawer ("Ask LedgerPulse")
 * 
 * Provides interactive financial controller intelligence grounded in
 * active reconciliation metrics and exceptions.
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useReconciliation } from '@/lib/reconciliation/context';
import { CopilotMessage } from '@/lib/ai/types';
import { Bot, X, Send, Sparkles, AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react';

export function CopilotDrawer() {
  const { copilotOpen, setCopilotOpen, exceptions, unresolvedCount, highPriorityCount, totalDiscrepancyPaise } = useReconciliation();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: 'Hello. I am your LedgerPulse AI Finance Copilot. I continuously monitor your payment gateway disbursements, settlement batches, and bank credit feeds. How can I assist with your reconciliation ledger today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'What is our current reconciliation rate?',
        'How much cash is at risk across exceptions?',
        'Show me missing bank statement credits',
        'Which exceptions need immediate attention?',
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (copilotOpen) {
      scrollToBottom();
    }
  }, [messages, copilotOpen]);

  if (!copilotOpen) return null;

  const handleSend = async (questionText?: string) => {
    const text = questionText || input;
    if (!text.trim() || loading) return;

    const userMsg: CopilotMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      // Build context payload
      const context = {
        tpvPaise: 48500000, // Derived or demo baseline
        settledPaise: 44250000,
        unresolvedCount,
        unresolvedPaise: totalDiscrepancyPaise,
        highPriorityCount,
        reconciliationRate: 94.2,
        recentExceptions: exceptions.slice(0, 5).map((e) => ({
          id: e.id,
          classification: e.classification,
          amountPaise: e.discrepancyPaise,
          severity: e.severity,
        })),
      };

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text.trim(),
          history: messages,
          context,
        }),
      });

      if (!res.ok) {
        throw new Error('Copilot response error');
      }

      const data = await res.json();

      const assistantMsg: CopilotMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations,
        suggestedActions: data.suggestedActions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Copilot request failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ast_err_${Date.now()}`,
          role: 'assistant',
          content: 'I encountered an issue querying the controller intelligence engine. Please retry or check the Exceptions Desk directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  LedgerPulse Copilot
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                    Online
                  </span>
                </h3>
                <p className="text-xs text-slate-400">AI Finance Controller Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setCopilotOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>At Risk: <strong className="text-slate-900 font-semibold">₹{(totalDiscrepancyPaise / 100).toLocaleString('en-IN')}</strong></span>
            <span>Exceptions: <strong className="text-slate-900 font-semibold">{unresolvedCount}</strong></span>
            <span>High Risk: <strong className="text-rose-600 font-semibold">{highPriorityCount}</strong></span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* Citations */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Referenced Records:</span>
                      {m.citations.map((c, idx) => (
                        <Link
                          key={idx}
                          href={`/dashboard/exceptions/${c.recordId}`}
                          onClick={() => setCopilotOpen(false)}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-indigo-700 font-medium transition-colors"
                        >
                          <span className="truncate">{c.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>

                {/* Suggested Prompts */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                    {m.suggestedActions.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(prompt)}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg px-2.5 py-1 text-left transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3 text-indigo-500" />
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic p-3 bg-slate-50 rounded-xl border border-slate-200 max-w-[70%]">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                LedgerPulse Controller analyzing financial telemetry...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about rate, cash leaks, or UTRs..."
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-sm transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
