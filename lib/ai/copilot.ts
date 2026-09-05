// lib/ai/copilot.ts
/**
 * Server-Side AI Finance Copilot ("Ask LedgerPulse")
 * 
 * Provides CFO and Finance Controller level conversational intelligence,
 * strictly grounded in canonical metrics and real reconciliation records.
 */

import { CopilotCitation, CopilotContextPayload, CopilotMessage } from './types';
import { COPILOT_SYSTEM_PROMPT } from './prompts';

export interface CopilotQueryRequest {
  question: string;
  history?: CopilotMessage[];
  context: CopilotContextPayload;
}

export interface CopilotQueryResponse {
  answer: string;
  citations: CopilotCitation[];
  suggestedActions: string[];
}

export async function askFinanceCopilot(request: CopilotQueryRequest): Promise<CopilotQueryResponse> {
  const { question, history = [], context } = request;
  const apiKey = process.env.GEMINI_API_KEY;

  // Format citations from provided context
  const citations: CopilotCitation[] = context.recentExceptions.slice(0, 3).map((exc) => ({
    label: `${exc.classification.replace(/_/g, ' ').toUpperCase()} (₹${(exc.amountPaise / 100).toLocaleString('en-IN')})`,
    recordType: 'exception',
    recordId: exc.id,
    amountPaise: exc.amountPaise,
  }));

  // Offline / Demo Fallback response generator
  if (!apiKey || apiKey.trim() === '' || apiKey === 'placeholder_key') {
    return generateDeterministicCopilotResponse(question, context, citations);
  }

  try {
    const formattedContext = `
CURRENT MERCHANT FINANCIAL STATUS:
- Total Payment Volume (TPV): ₹${(context.tpvPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
- Settled Volume: ₹${(context.settledPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
- Overall Reconciliation Rate: ${context.reconciliationRate.toFixed(2)}%
- Total Unresolved Exceptions: ${context.unresolvedCount}
- Total Unresolved Financial Discrepancy: ₹${(context.unresolvedPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
- High-Priority Exceptions: ${context.highPriorityCount}

ACTIVE EXCEPTIONS SUMMARY:
${context.recentExceptions.map((e, idx) => `${idx + 1}. [${e.id}] Category: ${e.classification}, Amount: ₹${(e.amountPaise / 100).toFixed(2)}, Severity: ${e.severity}`).join('\n')}
`.trim();

    const contents = [
      ...history.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      {
        role: 'user',
        parts: [
          {
            text: `FINANCIAL TELEMETRY CONTEXT:\n${formattedContext}\n\nUSER QUESTION:\n${question}`,
          },
        ],
      },
    ];

    const model = 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: COPILOT_SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      console.warn(`Gemini Copilot API returned status ${response.status}. Using deterministic fallback.`);
      return generateDeterministicCopilotResponse(question, context, citations);
    }

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      return generateDeterministicCopilotResponse(question, context, citations);
    }

    return {
      answer: answer.trim(),
      citations,
      suggestedActions: [
        'Review High-Priority Exceptions',
        'Export Exception Audit Report',
        'Trigger Settlement Reconciliation',
      ],
    };
  } catch (err) {
    console.error('Error querying Gemini Copilot:', err);
    return generateDeterministicCopilotResponse(question, context, citations);
  }
}

function generateDeterministicCopilotResponse(
  question: string,
  context: CopilotContextPayload,
  citations: CopilotCitation[]
): CopilotQueryResponse {
  const q = question.toLowerCase();
  const formattedUnresolved = `₹${(context.unresolvedPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  const formattedTPV = `₹${(context.tpvPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  const formattedSettled = `₹${(context.settledPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  if (q.includes('rate') || q.includes('reconciliation') || q.includes('health')) {
    return {
      answer: `Your current reconciliation rate is **${context.reconciliationRate.toFixed(1)}%**. Out of a Total Payment Volume of **${formattedTPV}**, **${formattedSettled}** is fully settled and reconciled. There are currently **${context.unresolvedCount} exceptions** requiring attention, accounting for **${formattedUnresolved}** in pending or mismatched capital.`,
      citations,
      suggestedActions: ['Open Exceptions Desk', 'View Settlement Breakdown'],
    };
  }

  if (q.includes('risk') || q.includes('leak') || q.includes('discrepancy') || q.includes('unresolved')) {
    return {
      answer: `There is currently **${formattedUnresolved}** in unresolved financial exposure across **${context.unresolvedCount} exceptions**. **${context.highPriorityCount} items** are flagged as HIGH priority, including missing bank statement credits and order amount variances. Immediate attention is recommended on UTR verification and underbilled order balance collections.`,
      citations,
      suggestedActions: ['Investigate High Priority Exceptions', 'Collect Underbilled Balances via Razorpay'],
    };
  }

  if (q.includes('missing') || q.includes('bank') || q.includes('utr')) {
    const missing = context.recentExceptions.find((e) => e.classification === 'missing_bank_credit');
    const amt = missing ? `₹${(missing.amountPaise / 100).toLocaleString('en-IN')}` : '₹5,000.00+';
    return {
      answer: `Gateway settlements have been logged where bank statement credits are absent. For example, exception **${missing?.id || 'EXC-93'}** represents a settlement batch of **${amt}** marked settled by the gateway but missing from destination bank account statements. An acquiring bank UTR trace should be filed.`,
      citations,
      suggestedActions: ['File Bank UTR Inquiry', 'Re-sync Bank Statement Feed'],
    };
  }

  // Default response
  return {
    answer: `Based on current ledger telemetry:\n- **Reconciliation Rate**: ${context.reconciliationRate.toFixed(1)}%\n- **Total Processed Volume**: ${formattedTPV}\n- **Settled Capital**: ${formattedSettled}\n- **Unresolved Exceptions**: ${context.unresolvedCount} (${formattedUnresolved} at risk)\n- **High Priority Items**: ${context.highPriorityCount}\n\nThe AI Controller recommends resolving the highest impact exceptions first to secure cash flow.`,
    citations,
    suggestedActions: [
      'Show High Severity Exceptions',
      'How to recover underbilled payments?',
      'Explain missing bank credits',
    ],
  };
}
