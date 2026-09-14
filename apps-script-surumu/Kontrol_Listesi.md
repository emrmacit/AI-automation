# RestoranBot Apps Script Kontrol Listesi

## 1. Google Sheets

- [ ] `RestoranBot Veri - Kavanoz Corba Satis.xlsx` Google Drive'a yüklendi veya mevcut Google Sheets dosyasında aynı başlıklar güncellendi.
- [ ] Dosya Google Sheets olarak açıldı.
- [ ] `Ayarlar` sekmesindeki restoran adı, adres, harita linki ve prototip minimum sepet bilgileri kontrol edildi.
- [ ] `Saatler` sekmesi 7/24 olacak şekilde `00:00 - 23:59 / hayir` olarak kontrol edildi.
- [ ] `Urunler` sekmesindeki ürün kodları, fiyatlar, stok/aktif-pasif ve `keyif_mesaji` kolonları kontrol edildi.
- [ ] `Secenekler` sekmesi geçici ödeme/site yönlendirmesi ve kargo seçeneklerine göre güncellendi.
- [ ] `Secenekler` sekmesinde `SiparisDurumu`, `OdemeDurumu`, `KargoDurumu`, `OdemeYontemi`, `SiparisTuru`, `KargoFirmasi` seçenekleri duruyor.
- [ ] `Bolgeler` sekmesinde Türkiye geneli 81 il kargo kapsamı kontrol edildi.
- [ ] `SSS` sekmesinde restoranın sık sorulan soruları güncellendi.
- [ ] `Siparisler` sekmesinde `durum`, `odeme`, `odeme_durumu`, `tur`, `kargo_durumu`, `kargo_firmasi` kolonlarında dropdown çalışıyor.
- [ ] `Siparisler` sekmesinde `son_bildirim` ve `son_bildirim_zamani` kolonları var.
- [ ] `Siparis_Kalemleri` ve `Sistem_Hatalari` sekmeleri var.
- [ ] `Musteriler` sekmesinde `isim_kaynagi` kolonu ve pazarlama izni dropdownu var.
- [ ] Örnek müşteri, sipariş ve mesaj satırları silindi veya örnek oldukları bilindi.

## 2. Apps Script

- [ ] Google Sheets içinde Extensions > Apps Script açıldı.
- [ ] `Code.gs` içindeki örnek kod silindi.
- [ ] `apps-script-surumu/Code.gs` dosyasındaki kod komple yapıştırıldı.
- [ ] Script Properties bölümüne gerekli değerler eklendi.
- [ ] `WEBHOOK_SECRET` oluşturuldu ve Web app URL sonuna eklendi.
- [ ] Bu hat serbest test hattıysa `PROTOTYPE_MODE=hayir` yapıldı.
- [ ] Sadece tek numara ile sınırlı test isteniyorsa `PROTOTYPE_MODE=evet` ve `TEST_PHONE` girildi.
- [ ] Sipariş/devir bildirimi isteniyorsa `PATRON_TELEFON` girildi; istenmiyorsa boş bırakıldı.
- [ ] `testConfiguration` fonksiyonu çalıştırıldı.
- [ ] Google izinleri verildi.
- [ ] `testConfiguration` sonucu `ok: true` döndürdü.
- [ ] `runRegressionTests` çalıştırıldı ve `failures: 0` döndürdü.
- [ ] `installAutomationTriggers` bir kez çalıştırıldı.
- [ ] `testConfiguration` sonucunda `orderStatusTriggerInstalled: true` görüldü.

## 3. Web App Deploy

- [ ] Deploy > New deployment seçildi.
- [ ] Type: Web app seçildi.
- [ ] Execute as: Me seçildi.
- [ ] Who has access: Anyone seçildi.
- [ ] Deploy edildi.
- [ ] Web app URL kopyalandı.

## 4. Green API

- [ ] Green API instance durumu Yetkili.
- [ ] Webhook URL alanına Apps Script Web app URL yapıştırıldı.
- [ ] Incoming message bildirimleri açıldı.
- [ ] Outgoing message bildirimleri isteniyorsa açıldı.
- [ ] Ayarlar kaydedildi.

## 5. Prototip Test

- [ ] `PROTOTYPE_MODE=hayir` ise bot hattına herhangi bir test telefonundan mesaj gönderildi.
- [ ] `PROTOTYPE_MODE=evet` ise test mesajı yalnız `TEST_PHONE` numarasından gönderildi.
- [ ] Bot cevap verdi.
- [ ] `Mesajlar` sekmesine gelen ve giden mesaj yazıldı.
- [ ] Selam/merhaba yazılınca bot `Urunler` sekmesindeki kısa kodlu ürün listesini gönderdi.
- [ ] Sipariş denendi, bot özet çıkardı.
- [ ] Özet onaylandı, `Siparisler` sekmesine kayıt düştü.
- [ ] Sipariş ürünleri `Siparis_Kalemleri` sekmesine ayrı satırlar halinde düştü.
- [ ] Yeni sipariş `durum=siparis_alindi`, `odeme_durumu=prototip_odendi`, `kargo_durumu=hazirlaniyor` olarak düştü.
- [ ] İşletme `Siparisler` sekmesindeki dropdownlardan siparişi `odeme_bekliyor`, `odendi`, `hazirlaniyor`, `kargoya_verildi`, `teslim_edildi`, `iptal`, `iade` adımlarıyla ilerletebildi.
- [ ] `Musteriler` sekmesinde telefon, toplam sipariş, toplam tutar ve segment güncellendi.
- [ ] `beni tanıdın mı` mesajı gönderildi, bot kayıtlı sipariş/adres bilgisine göre cevap verdi.
- [ ] Patron telefonuna sipariş bildirimi geldi.
- [ ] `Siparisler` durum dropdownu değiştirildi ve müşteriye tek durum mesajı ulaştı.
- [ ] Bilerek geçersiz bir test çağrısı yapıldığında hata `Sistem_Hatalari` sekmesine düştü.
- [ ] `bot kapat` ve `bot ac` yönetici komutları test edildi.

## 6. Canlıya Geçiş

- [ ] Örnek fiyatlar gerçek fiyatlarla değiştirildi.
- [ ] Örnek teslimat ücretleri gerçek ücretlerle değiştirildi.
- [ ] Teslimat bölgeleri gerçek kapsamla değiştirildi.
- [ ] Restoran/yetkili gerçek bildirim telefonu girildi.
- [ ] `PROTOTYPE_MODE` kapatıldı.

## Eksik Kalmaması Gerekenler

- [ ] OpenAI API hesabında harcama limiti var.
- [ ] Green API planı gerçek müşteri sayısına uygun.
- [ ] Google hesabında Apps Script kota kullanımı izleniyor.
- [ ] API anahtarları Sheets hücrelerinde değil, Script Properties içinde.
- [ ] Web app URL kimseyle gereksiz paylaşılmıyor.
