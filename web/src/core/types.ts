export type SectorMode = 'appointment' | 'retail_stock' | 'restaurant';

export interface BusinessProfile {
  id: string;
  name: string;
  phone: string;
  activeSector: SectorMode;
  operatingHours: string;
  autoReplyEnabled: boolean;
  humanHandoff: boolean;
  apiKeySet: boolean;
  customWelcomeMessage?: string;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  firstSeen: string;
  lastActive: string;
  totalTransactions: number;
}

// 1. Randevu Modülü Tipleri
export interface Appointment {
  id: string;
  customerPhone: string;
  customerName: string;
  serviceName: string;
  staffName?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

// 2. Perakende & Stok Modülü Tipleri
export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStockAlert: number;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  code: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNo: string;
  customerPhone: string;
  customerName: string;
  sector: SectorMode;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress?: string;
  city?: string;
  district?: string;
  trackingNo?: string;
  status: 'received' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  orderType: 'delivery' | 'pickup' | 'shipping';
  paymentStatus: 'pending' | 'paid' | 'cash_on_delivery';
  createdAt: string;
}

// WhatsApp Mesajlaşma Tipleri
export interface ChatMessage {
  id: string;
  phone: string;
  sender: 'customer' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  sector: SectorMode;
}

export interface EngineResponse {
  replyText: string;
  actionTaken?: 'appointment_created' | 'order_created' | 'stock_updated' | 'handoff_triggered' | 'info_provided';
  meta?: Record<string, any>;
}
