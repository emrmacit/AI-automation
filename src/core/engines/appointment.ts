import { DomainEngine } from './base';
import { EngineResponse, SectorMode } from '../types';
import { storage } from '../adapters/storage';

export class AppointmentEngine implements DomainEngine {
  public readonly sector: SectorMode = 'appointment';

  // Standart günlük çalışma slotları
  private readonly defaultSlots = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'];
  private readonly services = [
    { name: 'Saç Kesimi & Yıkama', duration: '45 dk', price: '300 TL' },
    { name: 'Sakal Tıraşı & Buhar Bakımı', duration: '30 dk', price: '200 TL' },
    { name: 'Saç & Sakal Kombin Bakım', duration: '60 dk', price: '450 TL' },
    { name: 'Cilt & Kil Maskesi Bakımı', duration: '30 dk', price: '250 TL' }
  ];

  public async handleMessage(phone: string, text: string, customerName = 'Değerli Müşterimiz'): Promise<EngineResponse> {
    const lower = text.toLowerCase().trim();

    // 1. İptal Talebi
    if (lower.includes('iptal') || lower.includes('vazgeçtim')) {
      const activeApt = storage.appointments.find(a => a.customerPhone === phone && a.status === 'confirmed');
      if (activeApt) {
        storage.updateAppointmentStatus(activeApt.id, 'cancelled');
        return {
          replyText: `Sayın ${activeApt.customerName}, ${activeApt.date} saat ${activeApt.timeSlot} için olan randevunuz isteğiniz üzerine iptal edilmiştir. Başka bir zaman görüşmek üzere!`,
          actionTaken: 'appointment_created',
          meta: { appointmentId: activeApt.id, status: 'cancelled' }
        };
      }
      return {
        replyText: 'Kayıtlarımızda şu an aktif bir randevunuz görünmüyor. Yeni bir randevu oluşturmak ister misiniz?'
      };
    }

    // 2. Fiyat / Hizmet Listesi
    if (lower.includes('fiyat') || lower.includes('hizmet') || lower.includes('neler var') || lower.includes('tarife')) {
      const list = this.services.map((s, i) => `${i + 1}️⃣ *${s.name}* (${s.duration}) - ${s.price}`).join('\n');
      return {
        replyText: `💈 *${storage.profile.name} Hizmet ve Fiyat Listesi:*\n\n${list}\n\nRandevu almak istediğiniz günü ve saati (Örn: *Yarın 14:30*) yazabilirsiniz.`
      };
    }

    // 3. Randevu Saati / Tarihi Yakalama (Örn: "Yarın 14:30", "Salı 16:00", "15:00")
    const timeMatch = lower.match(/(\d{1,2})[:.](\d{2})/) || lower.match(/saat\s*(\d{1,2})/);
    const isToday = lower.includes('bugün') || lower.includes('bugun');
    const isTomorrow = lower.includes('yarın') || lower.includes('yarin');

    if (timeMatch || isToday || isTomorrow || lower.includes('randevu')) {
      let targetDate = new Date();
      if (isTomorrow) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      const dateStr = targetDate.toISOString().split('T')[0];

      let requestedHour = '';
      if (timeMatch) {
        const hour = timeMatch[1].padStart(2, '0');
        const min = timeMatch[2] ? timeMatch[2] : '00';
        requestedHour = `${hour}:${min}`;
      }

      // O günkü mevcut dolu saatleri bul
      const bookedSlots = storage.appointments
        .filter(a => a.date === dateStr && a.status === 'confirmed')
        .map(a => a.timeSlot);

      if (requestedHour) {
        // İstenen saat çakışıyor mu?
        if (bookedSlots.includes(requestedHour)) {
          const availableSlots = this.defaultSlots.filter(s => !bookedSlots.includes(s));
          return {
            replyText: `Maalesef ${requestedHour} saati şu an dolu görünüyor. 😔\n\n${isTomorrow ? 'Yarın' : 'Bugün'} için müsait olan saatlerimiz:\n👉 *${availableSlots.join(', ')}*\n\nHangi saati sizin için ayıralım?`
          };
        }

        // Müsait, randevuyu kaydet
        const serviceCandidate = this.services.find(s => lower.includes(s.name.toLowerCase())) || this.services[0];
        const newApt = storage.addAppointment({
          customerPhone: phone,
          customerName: customerName.startsWith('Değerli') ? 'Misafir Müşteri' : customerName,
          serviceName: serviceCandidate.name,
          staffName: 'Ahmet Usta',
          date: dateStr,
          timeSlot: requestedHour,
          status: 'confirmed',
          notes: 'WhatsApp otonom randevu'
        });

        return {
          replyText: `✅ *Randevunuz Başarıyla Oluşturuldu!*\n\n💈 *İşletme:* ${storage.profile.name}\n📅 *Tarih:* ${dateStr}\n⏰ *Saat:* ${requestedHour}\n✂️ *Hizmet:* ${serviceCandidate.name}\n👤 *Usta:* Ahmet Usta\n\nRandevu saatinizden 15 dakika önce hatırlatma mesajı alacaksınız. Şimdiden sıhhatler dileriz!`,
          actionTaken: 'appointment_created',
          meta: newApt
        };
      }

      // Saat belirtilmediyse müsait saatleri listele
      const availableSlots = this.defaultSlots.filter(s => !bookedSlots.includes(s));
      return {
        replyText: `📅 *${isTomorrow ? 'Yarın' : 'Bugün'} için Müsait Randevu Saatlerimiz:*\n\n👉 *${availableSlots.join('  |  ')}*\n\nİstediğiniz saati belirterek randevunuzu hemen onaylatabilirsiniz. (Örn: *${availableSlots[0] || '14:30'}*)`
      };
    }

    // 4. Genel Karşılama
    return {
      replyText: `Merhaba! 💈 *${storage.profile.name}* randevu hattına hoş geldiniz.\n\nBugün veya yarın için randevu almak isterseniz dilediğiniz saati yazabilir (Örn: *Yarın 14:30 randevu*), veya *Fiyatlar* yazarak güncel tarife listemizi görebilirsiniz.`
    };
  }

  public async getOverviewMetrics(): Promise<Record<string, any>> {
    const today = new Date().toISOString().split('T')[0];
    const todayApts = storage.appointments.filter(a => a.date === today && a.status === 'confirmed');
    return {
      todayAppointmentsCount: todayApts.length,
      pendingCount: storage.appointments.filter(a => a.status === 'pending').length,
      nextAvailableSlot: '14:30',
      totalRegistered: storage.appointments.length
    };
  }
}
