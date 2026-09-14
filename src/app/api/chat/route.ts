import { NextResponse } from 'next/server';
import { messageRouter } from '@/core/router';

export async function POST(req: Request) {
  try {
    const { phone, text, customerName } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Mesaj metni zorunludur' }, { status: 400 });
    }

    const response = await messageRouter.processIncomingMessage(
      phone || '905551112233',
      text,
      customerName || 'Test Müşterisi'
    );

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
