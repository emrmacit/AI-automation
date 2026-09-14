import { NextResponse } from 'next/server';
import { messageRouter } from '@/core/router';

// Green API veya Meta WhatsApp Cloud API Webhook Uç Noktası
export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Green API webhook formatı çözümleme
    let senderPhone = '';
    let incomingText = '';
    let senderName = '';

    if (payload.typeWebhook === 'incomingMessageReceived') {
      const messageData = payload.messageData;
      senderPhone = payload.senderData?.sender || '';
      senderName = payload.senderData?.senderName || 'WhatsApp Müşterisi';

      if (messageData?.typeMessage === 'textMessage') {
        incomingText = messageData.textMessageData?.textMessage || '';
      } else if (messageData?.typeMessage === 'extendedTextMessage') {
        incomingText = messageData.extendedTextMessageData?.text || '';
      }
    } else if (payload.entry) {
      // Meta Cloud API formatı fallback
      const change = payload.entry[0]?.changes[0]?.value;
      const message = change?.messages?.[0];
      senderPhone = message?.from || '';
      incomingText = message?.text?.body || '';
      senderName = change?.contacts?.[0]?.profile?.name || 'Müşteri';
    }

    if (!incomingText || !senderPhone) {
      return NextResponse.json({ status: 'ignored_or_non_text' });
    }

    // Telefon numarasını temizle (90...)
    const cleanPhone = senderPhone.replace(/\D/g, '');

    // Router üzerinden otonom yanıt üret
    const result = await messageRouter.processIncomingMessage(cleanPhone, incomingText, senderName);

    // Green API kuruluysa yanıt gönder
    const apiUrl = process.env.GREEN_API_URL;
    const idInstance = process.env.GREEN_ID_INSTANCE;
    const apiTokenInstance = process.env.GREEN_API_TOKEN;

    if (apiUrl && idInstance && apiTokenInstance && result.replyText) {
      const greenChatId = cleanPhone.includes('@') ? cleanPhone : `${cleanPhone}@c.us`;
      await fetch(`${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: greenChatId,
          message: result.replyText
        })
      });
    }

    return NextResponse.json({ status: 'success', result });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'healthy', service: 'OmniAuto WhatsApp Webhook' });
}
