# RestoranBot Apps Script Sürümü

Bu klasör, restoran chatbotunu n8n kullanmadan çalıştırmak için hazırlandı.

Yeni yapı:

```text
Green API WhatsApp
→ Google Apps Script Webhook
→ Google Sheets
→ OpenAI API
→ Green API ile WhatsApp cevabı
```

## Dosyalar

- `Code.gs`: Google Apps Script projesine yapıştırılacak ana bot kodu.
- `appsscript.json`: V8 çalışma zamanı ve Türkiye saat dilimi manifesti.
- `tests/code.test.mjs`: kritik konuşma, adres, stok ve durum bildirimi testleri.
- `.clasp.json.example`: bir kez Script ID girildikten sonra otomatik kod gönderimi için şablon.
- `Kurulum_Rehberi.md`: Baştan sona kurulum adımları.
- `Kontrol_Listesi.md`: Yayına almadan önce son kontrol.
- `Script_Properties_Sablonu.txt`: Apps Script içine girilecek ayar adları.
- `Dosya_Kilavuzu.md`: Hangi eski dosyanın gerekli olduğu, hangisinin çıkarılabileceği.

## Kullanılacak Ana Dosyalar

- Google Sheets veri dosyası: `RestoranBot Veri - Kavanoz Corba Satis.xlsx`
- Apps Script kodu: `apps-script-surumu/Code.gs`
- Kurulum rehberi: `apps-script-surumu/Kurulum_Rehberi.md`

## Prototip Güvenliği

Bot numarası Script Properties içinde belirlenmez. Bot numarası Green API'ye bağladığınız WhatsApp hattıdır. Sizin durumda bot hattı `+90 530 111 22 33`.

Bu hat aktif restoran hattı değilse ve herkese açık test etmek istiyorsanız:

```text
PROTOTYPE_MODE = hayir
```

Bu ayarda bot hattına yazan herkes bot tarafından işlenir.

Sadece tek bir test numarasına izin vermek isterseniz:

```text
PROTOTYPE_MODE = evet
TEST_PHONE = bot hattına mesaj atacak ikinci telefon numarası
```

Bu ayar açıkken bot yalnız test numarasından gelen mesajı işler ve yalnız test numarasına mesaj gönderir.

Normal müşteri mesajları admin komutu sayılmaz. Test numaranız `PATRON_TELEFON` ile aynı olsa bile `selam`, `menü`, `beni tanıdın mı` gibi mesajlar müşteri akışında çalışır. Sadece `durum`, `bot ac`, `bot kapat`, `kampanya: ...` gibi komutlar yönetici komutu olarak işlenir.

## Müşteri Hafızası

Bot şu kayıtları Google Sheets içinde tutar:

- `Musteriler`: telefon, WhatsApp adı, ilk görülme, son sipariş tarihi, toplam sipariş, toplam tutar, segment.
- `Mesajlar`: gelen ve giden mesajlar, mesaj zamanı, telefon, yön, metin.
- `Urunler`: ürün kodu, ürün adı, paket/adet bilgisi, fiyat, stok, satış durumu, site linki ve ürün bazlı sıcak mesaj. `stok` boşsa sınırsız/bilinmiyor kabul edilir; `0` ise ürün listeden çıkar.
- `Siparisler`: sipariş numarası, müşteri adı, telefon, ürünler, ara toplam, teslimat ücreti, toplam, ödeme, adres, il/ilçe, alıcı telefonu ve not.
- `Adresler`: sipariş sırasında verilen adresler, il/ilçe, mahalle, alıcı adı ve alıcı telefonu.
- `Gorusmeler`: konuşma durumu, devir/bekleme ve uyarı bilgileri.
- `Siparis_Kalemleri`: her siparişin ürünlerini ayrı satırlarda tutar.
- `Sistem_Hatalari`: Apps Script ve dış servis hatalarını kalıcı kaydeder.

Müşteri `beni tanıdın mı` gibi bir şey yazarsa bot yalnız bu kayıtlara dayanarak cevap verir; gerçek kimliği bildiğini iddia etmez.

## Sipariş Takibi

İşletme siparişleri `Siparisler` sekmesinden takip eder. Bot yeni siparişi şu başlangıç değerleriyle açar:

- `durum`: `siparis_alindi`
- `odeme`: `sanal_pos_test`
- `odeme_durumu`: `prototip_odendi`
- `tur`: `kargo`
- `kargo_durumu`: `hazirlaniyor`

Canlı kullanımda işletme bu kolonları dropdown ile günceller. Ana akış için önerilen sıra: `siparis_alindi` -> `odeme_bekliyor` -> `odendi` -> `hazirlaniyor` -> `kargoya_verildi` -> `teslim_edildi`. Sorunlu siparişlerde `iptal` veya `iade` seçilir.

`installAutomationTriggers` bir kez çalıştırıldığında ödeme, hazırlık, kargo, teslim, iptal ve iade değişiklikleri müşteriye otomatik WhatsApp mesajı olarak gider. Aynı durum için tekrar mesaj gönderilmemesi `son_bildirim` alanıyla denetlenir.

## Yerel Test ve Kod Gönderimi

```bash
cd /Users/m-rex/Desktop/restoranOTO/apps-script-surumu
npm test
```

Apps Script Project Settings içindeki Script ID, `.clasp.json.example` kopyalanarak oluşturulan `.clasp.json` dosyasına bir kez girildikten sonra `npm run clasp:login` ve `npm run clasp:push` ile kod doğrudan gönderilebilir.

## Artık Gerekli Olmayan n8n Dosyaları

- `RestoranBot Akış Şablonu.json`
- `RestoranBot_Kisisel.json`
- `RestoranBot Komut Şablonu.md`

Bu dosyalar silinmek zorunda değil; arşiv olarak kalabilir. Apps Script sürümünde kullanılmayacaklar.
