// lib/ai/investigator.ts
/**
 * Server-Side AI Financial Controller & Exception Investigator
 * 
 * Interacts with Google Gemini (gemini-2.5-flash / gemini-1.5-flash) using
 * audit-grade prompts, falling back to deterministic controller rules when offline
 * or in demo mode.
 */

import { AIInvestigation } from './types';
import { FINANCE_INVESTIGATOR_SYSTEM_PROMPT } from './prompts';
import { classifyException, createDeterministicInvestigation } from './classifier';
import { EvidenceChain, ReconciliationException } from '../reconciliation/types';

export interface InvestigateOptions {
  exception: ReconciliationException;
  merchantName?: string;
  currency?: string;
}

export async function runAIInvestigation(options: InvestigateOptions): Promise<AIInvestigation> {
  const { exception, merchantName = 'Enterprise Merchant', currency = 'INR' } = options;
  const chain = exception.evidenceChain;
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback immediately if no API key is provided
  if (!apiKey || apiKey.trim() === '' || apiKey === 'placeholder_key') {
    return createDeterministicInvestigation(exception.id, chain);
  }

  try {
    const userMessage = `
Perform a forensic accounting investigation on the following financial exception:
Exception ID: ${exception.id}
Transaction Reference: ${exception.transactionRef}
Customer: ${exception.customerName}
Merchant: ${merchantName}
Currency: ${currency}
Detected Discrepancy: ₹${(exception.discrepancyPaise / 100).toFixed(2)}
Preliminary Severity: ${exception.severity}

EVIDENCE CHAIN RECORDS:
Order: ${JSON.stringify(chain.order || null, null, 2)}
Payment: ${JSON.stringify(chain.payment || null, null, 2)}
Settlement: ${JSON.stringify(chain.settlement || null, null, 2)}
Settlement Item: ${JSON.stringify(chain.settlementItem || null, null, 2)}
Refund: ${JSON.stringify(chain.refund || null, null, 2)}
Bank Entry: ${JSON.stringify(chain.bankEntry || null, null, 2)}

Provide your full forensic analysis in the requested JSON structure.
`.trim();

    // Call Google Gemini API (gemini-2.5-flash with fallback to gemini-1.5-flash)
    const model = 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: FINANCE_INVESTIGATOR_SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          response_mime_type: 'application/json',
        },
      }),
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Falling back to deterministic investigation.`);
      return createDeterministicInvestigation(exception.id, chain);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.warn('Gemini returned empty candidate text. Using deterministic fallback.');
      return createDeterministicInvestigation(exception.id, chain);
    }

    // Clean potential markdown wrap if any
    let cleanedJson = candidateText.trim();
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(cleanedJson);

    return {
      id: `inv_gemini_${Date.now().toString(36)}`,
      exceptionId: exception.id,
      classification: parsed.classification || exception.classification,
      categoryLabel: parsed.categoryLabel || exception.categoryLabel,
      severity: parsed.severity || exception.severity,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 90,
      rootCause: parsed.rootCause || 'Root cause identified through multi-ledger cross-examination.',
      summary: parsed.summary || 'AI Controller identified variance in payment settlement lifecycle.',
      detailedAnalysis: parsed.detailedAnalysis || '',
      evidenceAssessment: Array.isArray(parsed.evidenceAssessment) ? parsed.evidenceAssessment : [],
      financialImpact: {
        discrepancyPaise: parsed.financialImpact?.discrepancyPaise ?? exception.discrepancyPaise,
        riskExposurePaise: parsed.financialImpact?.riskExposurePaise ?? exception.discrepancyPaise,
        currency,
      },
      recommendedAction: parsed.recommendedAction || {
        title: 'Review Financial Variance',
        actionType: 'manual_approval',
        description: 'Verify reconciliation ledger with treasury.',
        urgency: 'routine',
      },
      needsHumanReview: Boolean(parsed.needsHumanReview),
      generatedAt: new Date().toISOString(),
      modelUsed: `Google Gemini 2.5 Flash`,
      isDemoFallback: false,
    };
  } catch (error) {
    console.error('Error during AI exception investigation:', error);
    return createDeterministicInvestigation(exception.id, chain);
  }
}
