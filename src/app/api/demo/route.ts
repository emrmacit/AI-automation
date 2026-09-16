import { NextResponse } from 'next/server';
import { answerDemoMessage } from '@/core/assistant';
import { getRepository } from '@/core/repository';
import { safeText } from '@/core/validation';

export const runtime = 'nodejs';
const attempts = new Map<string, { count: number; resetsAt: number }>();

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const now = Date.now();
  const record = attempts.get(forwarded);
  if (record && record.resetsAt > now && record.count >= 30) return NextResponse.json({ error: 'Demo limit reached. Please try again in a few minutes.' }, { status: 429 });
  attempts.set(forwarded, !record || record.resetsAt <= now ? { count: 1, resetsAt: now + 10 * 60_000 } : { ...record, count: record.count + 1 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const message = safeText(body.message, 500);
    if (!message) return NextResponse.json({ error: 'Write a message first.' }, { status: 400 });
    const repository = getRepository();
    const state = await repository.getState();
    return NextResponse.json(await answerDemoMessage(repository, state, message, safeText(body.customerName, 80), safeText(body.contact, 80)));
  } catch {
    return NextResponse.json({ error: 'The demo is temporarily unavailable.' }, { status: 503 });
  }
}
