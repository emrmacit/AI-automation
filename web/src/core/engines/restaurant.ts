import { DomainEngine } from './base';
import { EngineResponse, SectorMode } from '../types';
import { storage } from '../adapters/storage';

export class RestaurantEngine implements DomainEngine {
  public readonly sector: SectorMode = 'restaurant';

  private readonly menu = [
    { code: 'M1', name: 'Geleneksel Kelle Paça Çorbası', price: 220, category: 'Çorbalar' },
    { code: 'M2', name: 'Özel Terbiyeli İşkembe Çorbası', price: 190, category: 'Çorbalar' },
    { code: 'M3', name: 'Karışık Izgara Tabağı', price: 420, category: 'Ana Yemekler' },
    { code: 'M4', name: 'Fırın Sütlaç', price: 90, category: 'Tatlılar' }
  ];

  public async handleMessage(phone: string, text: string, customerName = 'Değerli Misafirimiz'): Promise<EngineResponse> {
    const lower = text.toLowerCase().trim();

    // 1. Menü Talebi
    if (lower.includes('menü') || lower.includes('menu') || lower.includes('yemek') || lower.includes('çorba') || lower.includes('fiyat')) {
      const list = this.menu.map(m => `🍲 *[${m.code}]* ${m.name} - *${m.price} TL*`).join('\n');
      return {
        replyText: `🍽️ *${storage.profile.name} Nefis Lezzetler Menüsü:*\n\n${list}\n\nSipariş vermek için menü kodunu veya ürün adını yazabilirsiniz. (Örnek: *1 adet M1, 1 adet M4* veya *Paket Servis*)`
      };
    }

    // 2. Paket Servis / Sipariş Algılama
    const matched = this.menu.filter(m => lower.includes(m.code.toLowerCase()) || lower.includes(m.name.toLowerCase().split(' ')[0]));
    if (matched.length > 0) {
      let subtotal = 0;
      const lines = matched.map(m => {
        subtotal += m.price;
        return `• 1x ${m.name} = *${m.price} TL*`;
      });

      const newOrder = storage.addOrder({
        orderNo: 'REST-' + Math.floor(100 + Math.random() * 900),
        customerPhone: phone,
        customerName: customerName.startsWith('Değerli') ? 'Müşteri' : customerName,
        sector: 'restaurant',
        items: matched.map(m => ({
          productId: m.code,
          code: m.code,
          name: m.name,
          quantity: 1,
          unitPrice: m.price,
          totalPrice: m.price
        })),
        subtotal,
        shippingFee: 0,
        totalAmount: subtotal,
        status: 'preparing',
        orderType: 'delivery',
        paymentStatus: 'paid'
      });

      return {
        replyText: `👨‍🍳 *Siparişiniz Mutfağa İletildi!*\n\n${lines.join('\n')}\n*Toplam: ${subtotal} TL*\n\nSipariş Numaranız: *${newOrder.orderNo}*\nSıcak sıcak yaklaşık 25-35 dakika içerisinde kapınızda olacaktır. Afiyet olsun! 🍲`,
        actionTaken: 'order_created',
        meta: newOrder
      };
    }

    // 3. Genel Karşılama
    return {
      replyText: `Merhaba! 🍽️ *${storage.profile.name}* lezzet hattına hoş geldiniz.\n\nSıcak çorba ve ızgara menümüzü görmek için *Menü* yazabilir, paket servis siparişi verebilirsiniz.`
    };
  }

  public async getOverviewMetrics(): Promise<Record<string, any>> {
    const restaurantOrders = storage.orders.filter(o => o.sector === 'restaurant');
    return {
      activeKitchenOrders: restaurantOrders.filter(o => o.status === 'preparing').length,
      todayDelivered: restaurantOrders.filter(o => o.status === 'delivered').length,
      menuItemCount: this.menu.length
    };
  }
}
