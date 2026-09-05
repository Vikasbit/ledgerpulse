// app/api/ai/investigate/route.ts
import { NextResponse } from 'next/server';
import { runAIInvestigation } from '@/lib/ai/investigator';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.exception) {
      return NextResponse.json({ error: 'Missing exception payload' }, { status: 400 });
    }

    const investigation = await runAIInvestigation({
      exception: body.exception,
      merchantName: body.merchantName,
      currency: body.currency,
    });

    return NextResponse.json({ success: true, investigation });
  } catch (error: any) {
    console.error('API Investigate error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to complete AI investigation' },
      { status: 500 }
    );
  }
}
