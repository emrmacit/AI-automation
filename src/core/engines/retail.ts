import { DomainEngine } from './base';
import { EngineResponse, SectorMode, Product } from '../types';
import { storage } from '../adapters/storage';

export class RetailStockEngine implements DomainEngine {
  public readonly sector: SectorMode = 'retail_stock';

  public async handleMessage(phone: string, text: string, customerName = 'Değerli Müşterimiz'): Promise<EngineResponse> {
    const lower = text.toLowerCase().trim();

    // 1. Dükkan Sahibi / Admin Stok Güncelleme Komutu (Örn: "stok: PR1 +10" veya "stok ekle PR2 5")
    const stockAddMatch = text.match(/stok[:\s]+([a-zA-Z0-9]+)\s*\+?(\d+)/i);
    if (stockAddMatch) {
      const code = stockAddMatch[1].toUpperCase();
      const qty = parseInt(stockAddMatch[2], 10);
      const product = storage.products.find(p => p.code === code);
      if (product) {
        storage.addStock(product.id, qty);
        return {
          replyText: `📦 *Mal Kabul / Stok Güncellendi!*\n\nÜrün: ${product.name}\nEklenen Miktar: +${qty} adet\nGüncel Stok: *${product.stock} adet*`,
          actionTaken: 'stock_updated',
          meta: { code, newStock: product.stock }
        };
      }
    }

    // 2. Ürün / Stok Listesi Talebi
    if (lower.includes('ürün') || lower.includes('urun') || lower.includes('liste') || lower.includes('katalog') || lower.includes('fiyat') || lower.includes('stok')) {
      const activeProds = storage.products.filter(p => p.isActive);
      const list = activeProds.map(p => {
        const stockStatus = p.stock > 0 ? `(Stok: ${p.stock} adet)` : '❌ Tükendi';
        return `🔹 *[${p.code}]* ${p.name} - *${p.price} TL* ${stockStatus}`;
      }).join('\n');

      return {
        replyText: `📦 *${storage.profile.name} Güncel Ürün Kataloğu:*\n\n${list}\n\nSipariş vermek için ürün kodunu ve adedini yazabilirsiniz.\n*(Örnek: 2 adet PR1, 1 adet PR2 veya PR1 2)*`
      };
    }

    // 3. Sipariş Algılama (Kod bazlı örn: "PR1 2", "2 adet PR1", "KP2")
    const orderItems: { product: Product; quantity: number }[] = [];
    for (const prod of storage.products) {
      const codeRegex = new RegExp(`\\b${prod.code}\\b(?:\\s*(\\d+))?|(?:(\\d+)\\s*(?:adet|tane)?\\s*${prod.code})`, 'i');
      const match = text.match(codeRegex);
      if (match) {
        const qty = parseInt(match[1] || match[2] || '1', 10);
        orderItems.push({ product: prod, quantity: qty });
      }
    }

    // İsimle arama (Örn: "şampuan", "serum", "kemik suyu")
    if (orderItems.length === 0) {
      for (const prod of storage.products) {
        const prodNameTokens = prod.name.toLowerCase().split(' ');
        if (prodNameTokens.some(token => token.length > 3 && lower.includes(token))) {
          const qtyMatch = lower.match(/(\d+)\s*(?:adet|tane)/);
          const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
          orderItems.push({ product: prod, quantity: qty });
          break;
        }
      }
    }

    if (orderItems.length > 0) {
      // Stok Kontrolü
      const outOfStock = orderItems.find(item => item.product.stock < item.quantity);
      if (outOfStock) {
        return {
          replyText: `Üzgünüz, *${outOfStock.product.name}* ürününden elimizde yalnızca *${outOfStock.product.stock} adet* kaldı. Lütfen adedi güncelleyiniz.`
        };
      }

      // Adres algılama veya adres isteme
      const hasAddressHint = lower.includes('mah') || lower.includes('cad') || lower.includes('sok') || lower.includes('no:');
      
      let subtotal = 0;
      const summaryLines = orderItems.map(item => {
        const total = item.product.price * item.quantity;
        subtotal += total;
        return `• ${item.quantity}x ${item.product.name} = *${total} TL*`;
      });

      const shippingFee = subtotal >= 500 ? 0 : 45;
      const grandTotal = subtotal + shippingFee;

      if (!hasAddressHint) {
        return {
          replyText: `🛒 *Sipariş Özeti:*\n${summaryLines.join('\n')}\n\nAra Toplam: ${subtotal} TL\nKargo Bedeli: ${shippingFee === 0 ? 'ÜCRETSİZ' : shippingFee + ' TL'}\n*Genel Toplam: ${grandTotal} TL*\n\nSiparişinizi tamamlamak için lütfen *Teslimat Adresinizi ve Şehir/İlçe* bilginizi yazınız.`
        };
      }

      // Adres mevcutsa siparişi oluştur ve stoktan düş
      const newOrder = storage.addOrder({
        orderNo: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        customerPhone: phone,
        customerName: customerName.startsWith('Değerli') ? 'Müşteri' : customerName,
        sector: 'retail_stock',
        items: orderItems.map(item => ({
          productId: item.product.id,
          code: item.product.code,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity
        })),
        subtotal,
        shippingFee,
        totalAmount: grandTotal,
        shippingAddress: text,
        city: 'Türkiye Geneli',
        district: 'Kargo',
        trackingNo: 'TRK-' + Date.now().toString().slice(-6),
        status: 'preparing',
        orderType: 'shipping',
        paymentStatus: 'paid'
      });

      return {
        replyText: `🎉 *Siparişiniz Alındı ve Hazırlanıyor!*\n\nSipariş No: *${newOrder.orderNo}*\nToplam Tutar: *${grandTotal} TL*\nKargo Takip No: *${newOrder.trackingNo}*\n\nÜrünleriniz özenle paketlenip gün içinde kargoya verilecektir. Bizi tercih ettiğiniz için teşekkür ederiz! 🚚`,
        actionTaken: 'order_created',
        meta: newOrder
      };
    }

    // 4. Genel Karşılama
    return {
      replyText: `Merhaba! 📦 *${storage.profile.name}* sipariş ve stok hattına hoş geldiniz.\n\nÜrünlerimizi ve güncel stok durumunu görmek için *Katalog* veya *Ürünler* yazabilir, doğrudan sipariş vermek için ürün kodunu belirtebilirsiniz.`
    };
  }

  public async getOverviewMetrics(): Promise<Record<string, any>> {
    const totalOrders = storage.orders.filter(o => o.sector === 'retail_stock').length;
    const lowStockCount = storage.products.filter(p => p.stock <= p.minStockAlert).length;
    return {
      totalOrders,
      lowStockCount,
      activeProductsCount: storage.products.length
    };
  }
}
