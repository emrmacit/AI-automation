---
product: "OmniAuto (WhatsApp Çok Sektörlü Otonom İşletme Platformu & Vercel Dashboard)"
status: "validated-for-build"
mode: "idea-to-slc"
updated: "2026-09-14"
---

# SLC Product Brief — OmniAuto

## 1. Executive decision

**Verdict:** Build (SLC v1)

**SLC in one sentence:**  
İşletmelerin WhatsApp üzerinden gelen müşteri taleplerini (randevu, kargolu ürün siparişi veya restoran siparişi) otonom olarak sonuçlandıran, tek bir panelden işletme tipini ve akışını yönetebilen Vercel uyumlu modüler kontrol platformu.

**Current lifecycle stage:**  
SLC v1 (Simple, Lovable, Complete)

**Why this scope/stage:**  
Mevcut repo içinde tekil bir restoran ve çorba satış kodu (`Code.gs` / Google Sheets) zaten çalışır durumda kanıtlanmıştır. Şimdi bunu aşırı karmaşık mikroservislere boğmadan; temiz arayüz sınırları (modular seams) ile randevu (berber/salon), perakende (mal/stok) ve restoranı tek bir çekirdekte birleştiren, Vercel üzerinde koşacak tek parça, ölçeklenebilir ve sağlam bir v1 ürününe dönüştürüyoruz.

---

## 2. Evidence vs assumptions

### Facts
- Müşteriler sipariş vermek veya randevu almak için en çok WhatsApp'ı tercih ediyor (kanıtlanmış kullanıcı alışkanlığı).
- Mevcut `Code.gs` motorunda Türkçe adres/ilçe normalizasyonu ve ürün kodlama akışı doğrulanmış durumda.
- İşletmeler karmaşık CRM ve ERP sistemlerini öğrenmek istemiyor; basit bir panel ve WhatsApp istiyor.

### Assumptions
- Berber/Güzellik salonu işletmecisi için randevunun WhatsApp'tan onaylanıp panelde takvime düşmesi operasyon yükünü %80 azaltır.
- Dükkan sahibinin panelden veya WhatsApp'tan tek mesajla stok güncellemesi yapabilmesi mal takibini kolaylaştırır.
- İşletmeler aynı motor üzerinde tek tıkla sektör modu değiştirebilmeyi büyük bir esneklik olarak görecektir.

### Decisions
- **Modüler Monolit (Modular Monolith):** Mikroservisler yok; domain motorları (`appointment`, `retail_stock`, `restaurant`) tek bir Next.js / Node.js mimarisi içinde Strategy Pattern ile çalışacak.
- **Vercel Native:** Arayüz ve Webhook API'leri doğrudan Vercel üzerinde Serverless Functions / Next.js App Router ile çalışacak.
- **Çift Yönlü Esnek Veri Katmanı:** Hem hafif yerel/API veri deposu hem de Google Sheets köprüsüyle çalışabilecek veri adapter'ı kurulacak.

---

## 3. Product frame

**Primary user:**  
WhatsApp üzerinden müşteri kabul eden, telefonlara yetişemeyen ve işini tek başına veya küçük bir ekiple yöneten KOBİ / Esnaf (Berber/Güzellik Salonu, Dükkan/Butik Satıcısı, Restoran Sahibi).

**Trigger:**  
Müşteri WhatsApp'tan "Salı saat 3'te boş yer var mı?", "2 adet ürün almak istiyorum" veya "Menüyü atar mısınız?" diye yazdığı an.

**Current alternative:**  
WhatsApp'a elle yetişmeye çalışmak, deftere not almak, unutulan randevular, Excel sayfalarında kaybolmak veya pahalı hantal yazılımlar.

**Resolved outcome:**  
Müşteri WhatsApp'ta anında yanıt alıp randevusunu veya siparişini tamamlar; işletme sahibi Vercel panelinde takviminde randevuyu veya sipariş listesinde kargolanacak ürünü ve düşen stoğu hazır görür.

---

## 4. Core Contract

> **Küçük işletme sahipleri için**, bir müşteri WhatsApp'tan randevu veya sipariş talebi gönderdiğinde, **OmniAuto** bu talebi otonom olarak konuşarak onaylar, doğru bilgileri toplar ve işletmenin takvimine/sipariş panosuna işler; böylece işletme sahibi mesajlaşmaya saatler harcamadan işini yönetir, bunu **modüler sektör motoru ve gerçek zamanlı Vercel kontrol paneli** mekanizmasıyla sağlar.

**v1 deliberately does not promise:**  
- Çok şubeli holding ERP entegrasyonları.
- Otomatik kargo bandı robotik entegrasyonu (yalnızca kargo takip kodu ve durum yönetimi).
- Karmaşık çok katmanlı personel yetkilendirmesi (tek işletme sahibi/yönetici rolü).

---

## 5. SLC assessment

| Dimension | Score / 5 | Why |
|---|---:|---|
| Simple | 5 | Tek bir çekirdek akış: WhatsApp Mesajı -> Sektör Motoru -> Tamamlanan Randevu/Sipariş -> Panel Görünümü. |
| Lovable | 5 | Tek tıkla sektör değiştirme (Berber/Salon <-> Perakende <-> Restoran) ve canlı WhatsApp test/handoff simülatörü. |
| Complete | 5 | Müşterinin ilk selamından randevu onayına veya kargo siparişinin panele düşüşüne kadar tüm döngü eksiksiz çalışır. |

**Evolvability risk:** LOW  
Tüm sektör motorları soyut bir `DomainEngine` arayüzü arkasındadır. Veritabanı bir adapter arkasındadır. WhatsApp sağlayıcısı (Green API / Cloud API) bir adapter arkasındadır.

**Main product weakness:**  
İlk kurulumda Green API bağlantısının kullanıcı tarafından girilmesi gerekmesi. (Çözüm: Panel içinde rehberli ve anlık test edilebilir bağlantı sihirbazı).

**Main architecture risk:**  
Sektörler arası veri modeli karmaşası. (Çözüm: Ortak `Event / Transaction` modeli ve sektöre özel meta veri ayrımı).

---

## 6. Simple

### v1 does
1. **Sektör Geçişi (Tenant Switcher):** Panelden tek tıkla Randevu (Berber/Salon), Perakende (Mal/Stok) ve Restoran modları arasında geçiş.
2. **Otonom WhatsApp Randevu Akışı:** Müsait saatleri bildirme, çakışmaları engelleme, randevu oluşturma ve takvimde gösterme.
3. **Otonom WhatsApp Ürün & Stok Satış Akışı:** Stok kontrolü, adres ayrıştırma, sipariş fişi çıkarma, stok düşürme.
4. **Otonom WhatsApp Restoran Akışı:** Menü sunumu, sepet oluşturma, paket/gel-al siparişi alma.
5. **Vercel Web Dashboard:** 
   - Randevu Takvimi (Ajanda görünümü)
   - Sipariş & Mal Yönetim Tablosu (Stok durumları, kargo durumları)
   - Canlı WhatsApp Test & Mesajlaşma Konsolu (İnsan Temsilciye Devir / Handoff)
   - Hızlı Ayarlar (Çalışma saatleri, marka adı, API anahtarları)

### v1 does NOT do
- Sesli arama yapma/cevaplama.
- Çoklu döviz ve uluslararası gümrük vergisi hesaplama.
- Finansal muhasebe / E-Fatura resmi entegrasyonu (v2+).

---

## 7. Lovable

**Primary love lever:**  
**"Tek Tıkla Sektör Değişimi & Canlı Önizleme" (Zero-Friction Sector Switching):**  
Kullanıcı panelden "Berber Modu"na geçtiğinde bot anında bir randevu asistanına, "Perakende Modu"na geçtiğinde stok/kargo asistanına dönüşür. Panelde dahili bir WhatsApp Test Konsolu bulunur; kullanıcı telefonunu eline almadan bile sistemin nasıl konuştuğunu canlı simüle edip test edebilir.

**First useful moment:**  
Paneli açıp işletme adını ve çalışma saatini girdikten sonra test konsolundan "Yarın saat 2'de randevu var mı?" dendiğinde botun takvimi kontrol edip yanıt vermesi (1 dakika içinde).

**First wow moment:**  
Müşterinin WhatsApp'tan girdiği adresin sokak sokak ayrışıp panelde sipariş kartına oturması ve stoktan otomatik 1 adet düşmesi.

---

## 8. Complete (Happy Paths)

### A. Randevu Happy Path
1. Müşteri WhatsApp'tan "Selam, cuma günü saç kesimi için müsaitlik var mı?" yazar.
2. Bot takvimdeki boş slotları kontrol eder: "Cuma 14:00, 16:30 ve 18:00 müsait. Hangisini ayıralım?".
3. Müşteri "16:30 olsun" der.
4. Bot "Adınızı ve telefonunuzu teyit eder misiniz?" diyerek kaydı doğrular.
5. Randevu paneldeki Ajanda/Takvim ekranına `Onaylandı` olarak işlenir.
6. Müşteriye randevu onay kartı mesajı gider.

### B. Perakende / Mal Satış Happy Path
1. Müşteri "Ürün listesini görebilir miyim?" der.
2. Bot stokta olan güncel ürünleri ve fiyatları listeler.
3. Müşteri "2 adet şampuan istiyorum" der.
4. Bot stok kontrolü yapar, adresi ister, adresi doğrular ve siparişi oluşturur.
5. Paneldeki Siparişler listesine düşer, stok sayısı anında güncellenir.

---

## 9. Minimum Data Model (Clean Architecture)

```typescript
// Sektör Tipleri
type SectorMode = 'appointment' | 'retail_stock' | 'restaurant';

// Ortak Müşteri
interface Customer {
  id: string;
  phone: string;
  name: string;
  firstSeen: string;
  lastActive: string;
  totalOrders: number;
}

// Randevu Kaydı
interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

// Ürün & Stok Kaydı
interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
}

// Sipariş Kaydı
interface Order {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: { productId: string; name: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  deliveryAddress?: string;
  city?: string;
  district?: string;
  orderType: 'delivery' | 'pickup' | 'shipping';
  status: 'received' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}
```

---

## 10. Architecture & Build Slices

### Slice 0: Skeleton (Proje Altyapısı)
- Vercel uyumlu Next.js / React fullstack mimarisinin kurulması.
- Temiz modül dizinleri (`/src/core/engines`, `/src/core/adapters`, `/src/app`, `/src/components`).

### Slice 1: Core Domain Engines (Strateji Deseni)
- `AppointmentEngine`: Randevu uygunluk denetleyicisi ve rezervasyon yöneticisi.
- `RetailStockEngine`: Stok takipli kargo/sipariş yöneticisi.
- `RestaurantEngine`: Menü ve masa/paket servis yöneticisi.
- Ortak `Router`: Gelen mesajı aktif sektöre göre yönlendiren zeka katmanı.

### Slice 2: Vercel Web Dashboard
- Ultra modern, hızlı ve responsive UI.
- Sektör Seçici Barı.
- Randevu Takvimi & Ajanda ekranı.
- Sipariş & Stok Yönetim Tablosu (Mal kabul / stok ekleme).
- Canlı WhatsApp Simülasyonu & Handoff (Destek Temsilcisi) Konsolu.

### Slice 3: Webhook & Dış Entegrasyon Adapter'ları
- Green API / WhatsApp Webhook alıcı endpoint'i (`/api/webhook/whatsapp`).
- Test simülatörü endpoint'i (`/api/chat/simulate`).
- Dışa aktarma ve senkronizasyon (Google Sheets / JSON export).

### Slice 4: Test, Doğrulama ve Vercel Deployment Hazırlığı
- Tüm randevu, stok ve restoran akışlarını kapsayan birim testleri.
- Vercel build doğrulaması (`npm run build`).

---

## 11. Scale Triggers (Ne Zaman Ne Yapılacak?)

| Gelecek Özellik | Neden Şimdi Yapılmıyor? | Ne Zaman Eklenecek? (Tetikleyici) |
|---|---|---|
| PostgreSQL / Supabase geçişi | v1'de sıfır gecikmeli, anında çalışan lokal/JSON/Sheets katmanı yeterli | Eşzamanlı 100+ işletme veya 10.000+ günlük siparişe ulaşıldığında |
| Redis / Mesaj Kuyruğu | Sunucusuz API endpoint'i v1 trafiği için yeterince hızlıdır | WhatsApp mesaj kuyruğu saniyede 20+ mesaja çıktığında |
| Çoklu Şube / Çoklu Kullanıcı RBAC | Esnaf ve KOBİ'ler tek kullanıcı ile başlar | Kurumsal franchising müşterileri geldiğinde |

---

## 12. Next Decision

**Build next:**  
Next.js tabanlı `omni-auto-dashboard` projesinin başlatılması, modüler domain motorlarının (`appointment`, `retail_stock`, `restaurant`) kodlanması ve Vercel kontrol panelinin oluşturulması.
