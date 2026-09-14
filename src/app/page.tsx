'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Package, 
  UtensilsCrossed, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  UserCheck, 
  Store, 
  RefreshCw,
  Truck,
  Plus,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { SectorMode, BusinessProfile, Appointment, Product, Order, ChatMessage } from '@/core/types';

export default function Dashboard() {
  const [sector, setSector] = useState<SectorMode>('appointment');
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // WhatsApp Simülasyonu State'leri
  const [inputText, setInputText] = useState('');
  const [simPhone, setSimPhone] = useState('905551112233');
  const [simName, setSimName] = useState('Mehmet Yılmaz');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Veri Çekme
  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      setProfile(data.profile);
      setAppointments(data.appointments || []);
      setProducts(data.products || []);
      setOrders(data.orders || []);
      setMessages(data.messages || []);
      setMetrics(data.metrics || {});
      setSector(data.profile.activeSector);
    } catch (err) {
      console.error('State load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sektör Değiştirme
  const handleSectorChange = async (newSector: SectorMode) => {
    setLoading(true);
    setSector(newSector);
    try {
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_sector', sector: newSector })
      });
      await fetchState();
    } catch (err) {
      console.error('Sector change error:', err);
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Mesaj Gönderme
  const handleSendMessage = async (textToSend?: string) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;
    setIsSending(true);
    if (!textToSend) setInputText('');

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: simPhone,
          text: msg,
          customerName: simName
        })
      });
      await fetchState();
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Randevu Durumu Değiştirme
  const handleAppointmentStatus = async (id: string, status: Appointment['status']) => {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_appointment', id, status })
    });
    fetchState();
  };

  // Stok Ekleme
  const handleAddStock = async (productId: string, quantity: number) => {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_stock', productId, quantity })
    });
    fetchState();
  };

  // İnsan Temsilci Devri (Handoff)
  const handleToggleHandoff = async () => {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_handoff' })
    });
    fetchState();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* 1. ÜST HEADER: Lottie-Style Rozet & Canlı Sektör Seçici */}
      <header className="glass-panel p-5 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4 border border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-float">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                OmniAuto
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">v1.0 SLC</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              {profile?.name || 'Otonom İşletme Platformu'} • WhatsApp Otonom Motoru Aktif
            </p>
          </div>
        </div>

        {/* Sektör Seçici Barı (Tek Tıkla Sektör Değişimi) */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => handleSectorChange('appointment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
              sector === 'appointment'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md glow-blue'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Berber / Randevu</span>
          </button>

          <button
            onClick={() => handleSectorChange('retail_stock')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
              sector === 'retail_stock'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md glow-emerald'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Perakende & Mal Stok</span>
          </button>

          <button
            onClick={() => handleSectorChange('restaurant')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
              sector === 'restaurant'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Restoran</span>
          </button>
        </div>

        {/* Canlı İnsan Temsilci Devir (Handoff) Butonu */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleHandoff}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              profile?.humanHandoff
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            {profile?.humanHandoff ? 'Temsilci Devrede (Bot Sessiz)' : 'Otonom Bot Devrede'}
          </button>
          
          <button
            onClick={fetchState}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700 transition"
            title="Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </header>

      {/* 2. DİNAMİK METRİKLER (Sektöre Göre Canlı Değişir) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sector === 'appointment' && (
          <>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-400" /> Bugünkü Randevular</span>
              <span className="text-2xl font-bold text-white">{metrics.todayAppointmentsCount || appointments.filter(a => a.status === 'confirmed').length}</span>
              <span className="text-[10px] text-emerald-400">Takvimde onaylı</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> Sıradaki Müsait Slot</span>
              <span className="text-2xl font-bold text-indigo-300">{metrics.nextAvailableSlot || '14:30'}</span>
              <span className="text-[10px] text-slate-400">Ahmet Usta</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Teyit Bekleyen</span>
              <span className="text-2xl font-bold text-amber-300">{appointments.filter(a => a.status === 'pending').length}</span>
              <span className="text-[10px] text-amber-400">Otomatik bildirimde</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Toplam Kayıtlı</span>
              <span className="text-2xl font-bold text-white">{appointments.length}</span>
              <span className="text-[10px] text-emerald-400">WhatsApp üzerinden</span>
            </div>
          </>
        )}

        {sector === 'retail_stock' && (
          <>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Kritik Stok Uyarısı</span>
              <span className="text-2xl font-bold text-red-400">{products.filter(p => p.stock <= p.minStockAlert).length} Ürün</span>
              <span className="text-[10px] text-red-400/80">Stok seviyesi kritik</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-blue-400" /> Hazırlanan Kargo</span>
              <span className="text-2xl font-bold text-blue-300">{orders.filter(o => o.status === 'preparing').length}</span>
              <span className="text-[10px] text-slate-400">Kargoya hazır</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-emerald-400" /> Toplam Çeşit</span>
              <span className="text-2xl font-bold text-white">{products.length}</span>
              <span className="text-[10px] text-emerald-400">Aktif satışta</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-purple-400" /> Sipariş Cirosu</span>
              <span className="text-2xl font-bold text-purple-300">
                {orders.reduce((acc, o) => acc + o.totalAmount, 0)} TL
              </span>
              <span className="text-[10px] text-purple-400">Otonom tahsilat</span>
            </div>
          </>
        )}

        {sector === 'restaurant' && (
          <>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" /> Mutfak Siparişleri</span>
              <span className="text-2xl font-bold text-amber-300">{orders.filter(o => o.sector === 'restaurant' && o.status === 'preparing').length}</span>
              <span className="text-[10px] text-amber-400">Ocakta / Hazırlanıyor</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-emerald-400" /> Kuryede Olan</span>
              <span className="text-2xl font-bold text-emerald-400">{orders.filter(o => o.sector === 'restaurant' && o.status === 'shipped').length}</span>
              <span className="text-[10px] text-emerald-400">Yolda</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-blue-400" /> Menü Çeşidi</span>
              <span className="text-2xl font-bold text-white">4</span>
              <span className="text-[10px] text-slate-400">Çorba & Izgara</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border-slate-700/50 flex flex-col gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-purple-400" /> Günlük Sipariş</span>
              <span className="text-2xl font-bold text-purple-300">{orders.filter(o => o.sector === 'restaurant').length}</span>
              <span className="text-[10px] text-purple-400">Paket & Gel-Al</span>
            </div>
          </>
        )}
      </section>

      {/* 3. ANA ÇALIŞMA ALANI: Sol Taraf Operasyon Panosu, Sağ Taraf Canlı WhatsApp Simülasyonu */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SOL: SEKTÖREL OPERASYON PANELİ (8 Kolon) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* A. Randevu Modu Ekranı */}
          {sector === 'appointment' && (
            <div className="glass-panel rounded-2xl p-5 border-slate-700/50 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Berber / Randevu Ajandası
                  </h2>
                  <p className="text-xs text-slate-400">WhatsApp üzerinden otomatik bağlanan ve onaylanan randevular</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Bugün: {new Date().toLocaleDateString('tr-TR')}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase bg-slate-900/60 border-b border-slate-700/60">
                    <tr>
                      <th className="p-3">Saat / Tarih</th>
                      <th className="p-3">Müşteri</th>
                      <th className="p-3">Hizmet & Usta</th>
                      <th className="p-3">Durum</th>
                      <th className="p-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-semibold text-slate-200">
                          <div className="flex items-center gap-1.5 text-blue-400 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {apt.timeSlot}
                          </div>
                          <span className="text-[10px] text-slate-400">{apt.date}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{apt.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">+{apt.customerPhone}</div>
                        </td>
                        <td className="p-3">
                          <span className="text-slate-200">{apt.serviceName}</span>
                          <span className="block text-[10px] text-indigo-400">{apt.staffName || 'Ahmet Usta'}</span>
                        </td>
                        <td className="p-3">
                          {apt.status === 'confirmed' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                              Onaylandı
                            </span>
                          )}
                          {apt.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                              Bekliyor
                            </span>
                          )}
                          {apt.status === 'cancelled' && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-semibold">
                              İptal
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {apt.status !== 'confirmed' && (
                              <button
                                onClick={() => handleAppointmentStatus(apt.id, 'confirmed')}
                                className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                                title="Onayla"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {apt.status !== 'cancelled' && (
                              <button
                                onClick={() => handleAppointmentStatus(apt.id, 'cancelled')}
                                className="p-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                title="İptal Et"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* B. Perakende & Mal Stok Ekranı */}
          {sector === 'retail_stock' && (
            <div className="flex flex-col gap-6">
              {/* Mal Kabul & Stok Listesi */}
              <div className="glass-panel rounded-2xl p-5 border-slate-700/50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Package className="w-5 h-5 text-emerald-400" />
                      Mal Kabul & Stok Kontrol Paneli
                    </h2>
                    <p className="text-xs text-slate-400">Ürünlerin anlık stok durumu ve tek tıkla mal girişi</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {products.map(p => (
                    <div key={p.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-bold">
                            {p.code}
                          </span>
                          <h4 className="text-xs font-semibold text-white mt-1">{p.name}</h4>
                          <span className="text-[10px] text-slate-400">{p.category} • {p.price} TL</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold ${p.stock <= p.minStockAlert ? 'text-red-400' : 'text-emerald-400'}`}>
                            {p.stock} Adet
                          </span>
                          <span className="block text-[9px] text-slate-400">Kalan Stok</span>
                        </div>
                      </div>

                      {/* Hızlı Mal Kabul / Stok Ekleme */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400">Mal Girişi Yap:</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleAddStock(p.id, 5)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center gap-1 transition"
                          >
                            <Plus className="w-3 h-3 text-emerald-400" /> +5
                          </button>
                          <button
                            onClick={() => handleAddStock(p.id, 20)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center gap-1 transition"
                          >
                            <Plus className="w-3 h-3 text-emerald-400" /> +20
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Siparişler & Kargo Takibi */}
              <div className="glass-panel rounded-2xl p-5 border-slate-700/50 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400" />
                  Gelen Kargo Siparişleri
                </h3>
                <div className="divide-y divide-slate-800">
                  {orders.filter(o => o.sector === 'retail_stock').map(ord => (
                    <div key={ord.id} className="py-3 flex flex-col md:flex-row justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{ord.orderNo}</span>
                          <span className="text-slate-300">• {ord.customerName}</span>
                          <span className="text-slate-400 font-mono text-[10px]">({ord.customerPhone})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Adres: {ord.shippingAddress || 'Adres bilgisi mevcut'}
                        </p>
                        <div className="text-[10px] text-indigo-400 mt-0.5">
                          Takip No: {ord.trackingNo || 'Oluşturuluyor'}
                        </div>
                      </div>
                      <div className="text-right flex md:flex-col justify-between items-end gap-1">
                        <span className="font-bold text-emerald-400 text-sm">{ord.totalAmount} TL</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold">
                          {ord.status === 'preparing' ? 'Paketleniyor' : 'Kargoya Verildi'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* C. Restoran Modu Ekranı */}
          {sector === 'restaurant' && (
            <div className="glass-panel rounded-2xl p-5 border-slate-700/50 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                    Restoran Sipariş & Mutfak Akışı
                  </h2>
                  <p className="text-xs text-slate-400">Masa ve paket servis siparişlerinin mutfak takibi</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.filter(o => o.sector === 'restaurant').map(ord => (
                  <div key={ord.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{ord.orderNo}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-semibold">
                        Hazırlanıyor
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-semibold">{it.totalPrice} TL</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Toplam:</span>
                      <span className="font-bold text-emerald-400">{ord.totalAmount} TL</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SAĞ: CANLI WHATSAPP TEST KONSOLU & MOCK TELEFON (5 Kolon) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-4 border border-slate-700/60 shadow-2xl flex flex-col h-[650px] relative overflow-hidden">
            
            {/* Telefon Üst Barı */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{profile?.name}</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Çevrimiçi (WhatsApp)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                {sector.toUpperCase()}
              </span>
            </div>

            {/* Hızlı Test Öneri Baloncukları */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
              {sector === 'appointment' && (
                <>
                  <button
                    onClick={() => handleSendMessage('Yarın 14:30 randevu var mı?')}
                    className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700/60"
                  >
                    💬 Yarın 14:30 randevu?
                  </button>
                  <button
                    onClick={() => handleSendMessage('Fiyat listenizi görebilir miyim?')}
                    className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700/60"
                  >
                    💬 Fiyatlar neler?
                  </button>
                  <button
                    onClick={() => handleSendMessage('Randevumu iptal etmek istiyorum')}
                    className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700/60"
                  >
                    💬 Randevumu iptal et
                  </button>
                </>
              )}

              {sector === 'retail_stock' && (
                <>
                  <button
                    onClick={() => handleSendMessage('Ürün kataloğunu ve stokları atar mısınız?')}
                    className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700/60"
                  >
                    📦 Katalog & Stoklar
                  </button>
                  <button
                    onClick={() => handleSendMessage('2 adet PR1 sipariş etmek istiyorum, adres: Kadıköy Bağdat Cad No:12')}
                    className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700/60"
                  >
                    📦 2 adet PR1 Siparişi
                  </button>
                  <button
                    onClick={() => handleSendMessage('stok: PR3 +10')}
                    className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700/60"
                  >
                    ⚡ Mal Kabul: PR3 +10
                  </button>
                </>
              )}

              {sector === 'restaurant' && (
                <>
                  <button
                    onClick={() => handleSendMessage('Menüyü görebilir miyim?')}
                    className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700/60"
                  >
                    🍲 Menü nedir?
                  </button>
                  <button
                    onClick={() => handleSendMessage('1 adet M1 kelle paça siparişi')}
                    className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700/60"
                  >
                    🍲 1x Kelle Paça Siparişi
                  </button>
                </>
              )}

              <button
                onClick={() => handleSendMessage('Yetkili bir insanla görüşmek istiyorum')}
                className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] whitespace-nowrap border border-amber-500/40"
              >
                👤 Canlı Temsilci İste
              </button>
            </div>

            {/* Mesajlaşma Akışı */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 text-xs">
              {messages.map((m) => {
                const isMe = m.sender === 'customer';
                const isAgent = m.sender === 'agent';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] ${
                      isMe ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : isAgent
                          ? 'bg-amber-600 text-white rounded-tl-none'
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/70'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {isMe ? 'Müşteri' : isAgent ? 'İşletme Temsilcisi' : 'Otonom Bot'} •{' '}
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Mesaj Gönderme Kutusu */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={profile?.humanHandoff ? "Temsilci olarak yazıyorsunuz..." : "WhatsApp mesajı yazın..."}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition flex items-center justify-center shadow-md shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
