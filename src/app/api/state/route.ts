import { NextResponse } from 'next/server';
import { storage } from '@/core/adapters/storage';
import { messageRouter } from '@/core/router';
import { SectorMode } from '@/core/types';

export async function GET() {
  const currentSector = storage.profile.activeSector;
  const metrics = await messageRouter.getSectorMetrics(currentSector);

  return NextResponse.json({
    profile: storage.profile,
    appointments: storage.appointments,
    products: storage.products,
    orders: storage.orders,
    messages: storage.messages.slice(-30),
    metrics
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'set_sector') {
      const sector = body.sector as SectorMode;
      storage.setSector(sector);
      return NextResponse.json({ success: true, profile: storage.profile });
    }

    if (action === 'add_stock') {
      const { productId, quantity } = body;
      const updated = storage.addStock(productId, Number(quantity));
      return NextResponse.json({ success: true, product: updated });
    }

    if (action === 'update_appointment') {
      const { id, status } = body;
      storage.updateAppointmentStatus(id, status);
      return NextResponse.json({ success: true });
    }

    if (action === 'update_order') {
      const { id, status } = body;
      storage.updateOrderStatus(id, status);
      return NextResponse.json({ success: true });
    }

    if (action === 'toggle_handoff') {
      storage.profile.humanHandoff = !storage.profile.humanHandoff;
      return NextResponse.json({ success: true, humanHandoff: storage.profile.humanHandoff });
    }

    if (action === 'send_agent_message') {
      const { phone, text } = body;
      const msg = storage.addMessage({
        phone: phone || '905551112233',
        sender: 'agent',
        text,
        sector: storage.profile.activeSector
      });
      return NextResponse.json({ success: true, message: msg });
    }

    return NextResponse.json({ error: 'Bilinmeyen eylem' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
