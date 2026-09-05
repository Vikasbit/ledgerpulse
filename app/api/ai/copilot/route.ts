// app/api/ai/copilot/route.ts
import { NextResponse } from 'next/server';
import { askFinanceCopilot } from '@/lib/ai/copilot';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const result = await askFinanceCopilot({
      question: body.question,
      history: body.history || [],
      context: body.context || {
        tpvPaise: 0,
        settledPaise: 0,
        unresolvedCount: 0,
        unresolvedPaise: 0,
        highPriorityCount: 0,
        reconciliationRate: 100,
        recentExceptions: [],
      },
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('API Copilot error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process copilot query' },
      { status: 500 }
    );
  }
}
