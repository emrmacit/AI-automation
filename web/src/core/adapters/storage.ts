import { BusinessProfile, Appointment, Product, Order, ChatMessage, SectorMode, Customer } from '../types';

class StorageAdapter {
  private static instance: StorageAdapter;

  public profile: BusinessProfile = {
    id: 'biz_default',
    name: 'Berber Ahmet & Güzellik Stüdyosu',
    phone: '905301234567',
    activeSector: 'appointment',
    operatingHours: 'Hafta içi & Cmt: 09:00 - 20:00, Pazar Kapalı',
    autoReplyEnabled: true,
    humanHandoff: false,
    apiKeySet: false,
    customWelcomeMessage: 'Hoş geldiniz! WhatsApp asistanımızla 7/24 randevu alabilir veya bilgi edinebilirsiniz.'
  };

  public appointments: Appointment[] = [
    {
      id: 'apt_1',
      customerPhone: '905551112233',
      customerName: 'Mehmet Yılmaz',
      serviceName: 'Saç & Sakal Tıraşı',
      staffName: 'Ahmet Usta',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '14:00',
      status: 'confirmed',
      notes: 'VIP Müşteri',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'apt_2',
      customerPhone: '905554445566',
      customerName: 'Can Demir',
      serviceName: 'Cilt Bakımı & Saç Kesimi',
      staffName: 'Ahmet Usta',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '16:30',
      status: 'confirmed',
      notes: 'WhatsApp üzerinden alındı',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'apt_3',
      customerPhone: '905329998877',
      customerName: 'Murat Kaya',
      serviceName: 'Klasik Saç Kesimi',
      staffName: 'Ali Kalfa',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: '11:00',
      status: 'pending',
      notes: 'Yarın için teyit bekliyor',
      createdAt: new Date().toISOString()
    }
  ];

  public products: Product[] = [
    {
      id: 'prod_1',
      code: 'PR1',
      name: 'Keratin Saç Bakım Serumu (250ml)',
      category: 'Kozmetik / Bakım',
      price: 350,
      stock: 24,
      minStockAlert: 5,
      isActive: true
    },
    {
      id: 'prod_2',
      code: 'PR2',
      name: 'Mat Briyantin & Şekillendirici Wax',
      category: 'Şekillendirici',
      price: 180,
      stock: 40,
      minStockAlert: 10,
      isActive: true
    },
    {
      id: 'prod_3',
      code: 'PR3',
      name: 'Doğal Sakal & Bıyık Bakım Yağı',
      category: 'Sakal Bakımı',
      price: 220,
      stock: 8,
      minStockAlert: 10,
      isActive: true
    },
    {
      id: 'prod_4',
      code: 'KP2',
      name: 'Kelle Paça 660 ml (2li Paket)',
      category: 'Kavanoz Çorba',
      price: 480,
      stock: 15,
      minStockAlert: 5,
      isActive: true
    },
    {
      id: 'prod_5',
      code: 'IK2',
      name: 'İlikli Kemik Suyu 660 ml (2li Paket)',
      category: 'Kavanoz Çorba',
      price: 390,
      stock: 30,
      minStockAlert: 5,
      isActive: true
    }
  ];

  public orders: Order[] = [
    {
      id: 'ord_1',
      orderNo: 'ORD-2026-101',
      customerPhone: '905553332211',
      customerName: 'Hakan Çelik',
      sector: 'retail_stock',
      items: [
        {
          productId: 'prod_1',
          code: 'PR1',
          name: 'Keratin Saç Bakım Serumu (250ml)',
          quantity: 2,
          unitPrice: 350,
          totalPrice: 700
        }
      ],
      subtotal: 700,
      shippingFee: 0,
      totalAmount: 700,
      shippingAddress: 'Bağdat Cad. No:142 Kadıköy',
      city: 'İstanbul',
      district: 'Kadıköy',
      trackingNo: 'YURT-948382',
      status: 'shipped',
      orderType: 'shipping',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'ord_2',
      orderNo: 'ORD-2026-102',
      customerPhone: '905321110099',
      customerName: 'Selim Aras',
      sector: 'retail_stock',
      items: [
        {
          productId: 'prod_2',
          code: 'PR2',
          name: 'Mat Briyantin & Şekillendirici Wax',
          quantity: 1,
          unitPrice: 180,
          totalPrice: 180
        }
      ],
      subtotal: 180,
      shippingFee: 50,
      totalAmount: 230,
      shippingAddress: 'Çankaya Mah. 45. Sokak No:12',
      city: 'Ankara',
      district: 'Çankaya',
      status: 'preparing',
      orderType: 'shipping',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString()
    }
  ];

  public messages: ChatMessage[] = [
    {
      id: 'msg_1',
      phone: '905551112233',
      sender: 'customer',
      text: 'Merhaba, bugün saç tıraşı için yer var mı?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      sector: 'appointment'
    },
    {
      id: 'msg_2',
      phone: '905551112233',
      sender: 'bot',
      text: 'Merhaba! Bugün saat 14:00 ve 17:30 müsait. Hangisini ayıralım?',
      timestamp: new Date(Date.now() - 3590000).toISOString(),
      sector: 'appointment'
    },
    {
      id: 'msg_3',
      phone: '905551112233',
      sender: 'customer',
      text: '14:00 süper olur, adım Mehmet Yılmaz',
      timestamp: new Date(Date.now() - 3580000).toISOString(),
      sector: 'appointment'
    },
    {
      id: 'msg_4',
      phone: '905551112233',
      sender: 'bot',
      text: 'Harika Mehmet Bey! Bugün saat 14:00 için randevunuz Ahmet Usta adına başarıyla kaydedildi.',
      timestamp: new Date(Date.now() - 3570000).toISOString(),
      sector: 'appointment'
    }
  ];

  public static getInstance(): StorageAdapter {
    if (!StorageAdapter.instance) {
      StorageAdapter.instance = new StorageAdapter();
    }
    return StorageAdapter.instance;
  }

  // Sektör Güncelleme
  public setSector(mode: SectorMode) {
    this.profile.activeSector = mode;
    if (mode === 'appointment') {
      this.profile.name = 'Makas & Stil Kuaför Salonu';
    } else if (mode === 'retail_stock') {
      this.profile.name = 'Nova Kozmetik & Malzeme Deposu';
    } else if (mode === 'restaurant') {
      this.profile.name = 'Paçacı Hüsnü Restoran';
    }
  }

  // Randevu İşlemleri
  public addAppointment(apt: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const newApt: Appointment = {
      ...apt,
      id: 'apt_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this.appointments.unshift(newApt);
    return newApt;
  }

  public updateAppointmentStatus(id: string, status: Appointment['status']) {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) apt.status = status;
  }

  // Ürün & Stok İşlemleri
  public addStock(productId: string, quantity: number): Product | null {
    const prod = this.products.find(p => p.id === productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock + quantity);
      return prod;
    }
    return null;
  }

  public addOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...order,
      id: 'ord_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);

    // Otomatik stok düşümü
    for (const item of newOrder.items) {
      this.addStock(item.productId, -item.quantity);
    }
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']) {
    const ord = this.orders.find(o => o.id === id);
    if (ord) ord.status = status;
  }

  // Mesaj Kaydı
  public addMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const newMsg: ChatMessage = {
      ...msg,
      id: 'msg_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    this.messages.push(newMsg);
    return newMsg;
  }
}

export const storage = StorageAdapter.getInstance();
