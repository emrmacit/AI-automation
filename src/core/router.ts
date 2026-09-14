import { AppointmentEngine } from './engines/appointment';
import { RetailStockEngine } from './engines/retail';
import { RestaurantEngine } from './engines/restaurant';
import { DomainEngine } from './engines/base';
import { EngineResponse, SectorMode } from './types';
import { storage } from './adapters/storage';

export class MessageRouter {
  private static instance: MessageRouter;
  private engines: Map<SectorMode, DomainEngine>;

  private constructor() {
    this.engines = new Map();
    this.engines.set('appointment', new AppointmentEngine());
    this.engines.set('retail_stock', new RetailStockEngine());
    this.engines.set('restaurant', new RestaurantEngine());
  }

  public static getInstance(): MessageRouter {
    if (!MessageRouter.instance) {
      MessageRouter.instance = new MessageRouter();
    }
    return MessageRouter.instance;
  }

  public async processIncomingMessage(phone: string, text: string, customerName?: string): Promise<EngineResponse> {
    const cleanPhone = phone.replace(/\D/g, '');
    const currentSector = storage.profile.activeSector;

    // 1. Gelen mesajı kaydet
    storage.addMessage({
      phone: cleanPhone,
      sender: 'customer',
      text,
      sector: currentSector
    });

    // 2. İnsan Temsilci Devri (Handoff) Kontrolü
    const lower = text.toLowerCase();
    if (storage.profile.humanHandoff) {
      return {
        replyText: '',
        actionTaken: 'handoff_triggered',
        meta: { message: 'Temsilci aktif, bot susturuldu.' }
      };
    }

    if (lower.includes('yetkili') || lower.includes('temsilci') || lower.includes('insan') || lower.includes('müşteri temsilcisi')) {
      storage.profile.humanHandoff = true;
      const handoffReply = `Görüşmeniz işletme yetkilimize aktarılmıştır. Yetkilimiz en kısa sürede buradan size bizzat yazacaktır. Lütfen bekleyiniz. 🙏`;
      storage.addMessage({
        phone: cleanPhone,
        sender: 'bot',
        text: handoffReply,
        sector: currentSector
      });
      return {
        replyText: handoffReply,
        actionTaken: 'handoff_triggered'
      };
    }

    // 3. Aktif Sektör Motorunu Seç ve Çalıştır
    const engine = this.engines.get(currentSector) || this.engines.get('appointment')!;
    const response = await engine.handleMessage(cleanPhone, text, customerName);

    // 4. Bot Cevabını Kaydet
    if (response.replyText) {
      storage.addMessage({
        phone: cleanPhone,
        sender: 'bot',
        text: response.replyText,
        sector: currentSector
      });
    }

    return response;
  }

  public async getSectorMetrics(sector: SectorMode) {
    const engine = this.engines.get(sector);
    return engine ? await engine.getOverviewMetrics() : {};
  }
}

export const messageRouter = MessageRouter.getInstance();
