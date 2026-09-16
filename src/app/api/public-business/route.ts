import { NextResponse } from 'next/server';
import { getRepository } from '@/core/repository';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { profile, hours, offerings, faqs } = await getRepository().getState();
    return NextResponse.json({ profile, hours, offerings, faqs });
  } catch {
    return NextResponse.json({ error: 'Business information is temporarily unavailable.' }, { status: 503 });
  }
}
