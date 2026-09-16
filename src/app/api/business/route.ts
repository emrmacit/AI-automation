import { NextResponse } from 'next/server';
import { getRepository } from '@/core/repository';
import { validateBusinessInput } from '@/core/validation';

export const runtime = 'nodejs';
export async function GET() {
  try { return NextResponse.json(await getRepository().getState()); }
  catch { return NextResponse.json({ error: 'Business data is temporarily unavailable.' }, { status: 503 }); }
}
export async function PUT(request: Request) {
  try {
    const input: unknown = await request.json();
    if (!validateBusinessInput(input)) return NextResponse.json({ error: 'Please review the highlighted business information.' }, { status: 400 });
    return NextResponse.json(await getRepository().saveBusiness(input));
  } catch {
    return NextResponse.json({ error: 'Changes could not be saved. Please try again.' }, { status: 503 });
  }
}
