# Kavanoz Çorba Satış Akışı

Bu sürümde bot artık anlık restoran/paket servis botu değildir. Ana model kavanoz çorba ürünlerinin Türkiye geneline kargo ile satışıdır.

## Müşteri Akışı

1. Müşteri `merhaba`, `selam`, `kolay gelsin` gibi giriş mesajı yazar.
2. Bot yeni müşteride `Paçacı Hüsnü'ye hoş geldiniz`, kayıtlı müşteride `Paçacı Hüsnü'ye tekrar hoş geldiniz` diyerek markayı mutlaka belirtir ve ürün listesini paylaşmasını isteyip istemediğini sorar.
3. Müşteri `evet`, `liste`, `menü` gibi cevap verirse bot ürün listesini kodlarla birlikte gönderir.
4. Müşteri ürün kodlarını yazar. Gerekirse aynı aşamada sepete ürün ekler veya çıkarır.

Örnek:

```text
KP2 IS1 IK2
```

Bu örnek şu anlama gelir:

- 1 adet Kelle Paça 660 ml 2'li Paket
- 1 adet İşkembe 660 ml 1 Adet
- 1 adet İlikli Kemik Suyu 660 ml 2'li Paket

5. Bot sipariş özetini ve toplam fiyatı gönderir.
6. Müşteri `onaylıyorum`, `tamam`, `evet` gibi onay verir.
7. Bot kargo için ad soyad, telefon, il/ilçe ve açık adres ister.
8. Müşteri adresi tek mesajla yazar.
9. Bot geçici ödeme adımında Paçacı Hüsnü site linkini gönderir.
10. Ödeme entegrasyonu bağlanana kadar ödeme prototip/test olarak alınmış kabul edilir.
11. Bot siparişi kaydeder ve kargo takip numarası üretir.

Not: Bu aşamadaki kargo takip numarası sistem içi/prototip takip numarasıdır. Gerçek kargo firması takip numarası olması için ayrıca Yurtiçi, Aras, MNG, PTT vb. kargo API entegrasyonu eklenmelidir.

## Geçici Ödeme Akışı

Şimdilik ödeme yöntemi olarak yalnızca sanal POS/site yönlendirmesi gösterilir. Bot müşteriye `https://www.pacacihusnu.com/` linkini paylaşır ve gerçek ödeme entegrasyonu bağlanana kadar siparişi test ödeme alınmış gibi kaydeder.

Gerçek ödeme altyapısı belli olduğunda bu adım Hipotenüs sepet/ödeme linki API'si veya ödeme sağlayıcısı API'si ile değiştirilmelidir.

## Sheets Yönetimi

- `Ayarlar`: marka adı, 7/24 sipariş, minimum sepet, kargo ücreti, ödeme/site linki
- `Urunler`: ürün kodları, ürün adları, fiyatlar, site ürün ID/linki ve sipariş özetinde kullanılacak `keyif_mesaji`
- `Bolgeler`: Türkiye'nin 81 ili ve kargo kapsamı
- `Mesajlar`: tüm gelen/giden mesajlar ve bot state kayıtları
- `Siparisler`: tamamlanan siparişler, müşteri adı, toplam, ödeme, adres, il/ilçe, alıcı telefonu ve kargo takip no
- `Musteriler`: müşteri telefonu, ad-soyad, isim kaynağı, toplam sipariş, toplam tutar, segment
- `Gorusmeler`: konuşma durumu ve beklenen bilgi kolonları
- `Siparis_Kalemleri`: siparişteki her ürünü kod, adet, birim fiyat ve satır toplamıyla ayrı kayıt eder
- `Sistem_Hatalari`: bot, OpenAI, Green API ve tablo hatalarını inceleme durumuyla birlikte saklar

`Urunler > stok` alanı boşsa stok bilinmiyor/sınırsız kabul edilir. `0` yazılan ürün bot listesinden ve sipariş eşleştirmesinden çıkar. `bot_ile_satis=hayir` da ürünü pasif yapar.

`Urunler` sayfasındaki `keyif_mesaji` kolonunu değiştirerek her ürün için botun sipariş özetinde söyleyeceği kısa sıcak cümleyi yönetebilirsiniz. Boş bırakılırsa Apps Script ürün adına göre güvenli varsayılan bir cümle üretir.

## Müşteri İsmi Nasıl Kaydedilir?

İlk mesajda Green API/WhatsApp profil adı gelirse bot bunu sadece geçici/fallback isim olarak kullanır. Asıl müşteri adı, kargo adresi aşamasında müşterinin yazdığı ad-soyaddan alınır ve `Musteriler > son_ad` alanına kaydedilir. Sonraki siparişlerde bot müşteriyi bu isimle karşılar; kayıtlı adres kullanılırsa `Adresler` sekmesindeki `alici_ad_soyad` ve `alici_telefon` bilgileri siparişe taşınır.

## Sipariş Durumu Takibi

`Siparisler` sekmesinde işletme takibi için dropdown alanları vardır:

- `durum`: `siparis_alindi`, `odeme_bekliyor`, `odendi`, `hazirlaniyor`, `kargoya_verildi`, `teslim_edildi`, `iptal`, `iade`
- `odeme`: `sanal_pos_test`, `sanal_pos`, `havale_eft`, `kapida_odeme`, `kartla_odeme`, `odeme_linki`
- `odeme_durumu`: `odeme_bekliyor`, `odendi`, `prototip_odendi`, `iptal`, `iade`
- `tur`: `kargo`
- `kargo_durumu`: `hazirlaniyor`, `kargoya_verildi`, `teslim_edildi`, `iptal`, `iade`
- `kargo_firmasi`: `Yurtici`, `Aras`, `MNG`, `Surat`, `PTT`, `Diger`

Bot yeni siparişi `durum=siparis_alindi`, `odeme_durumu=prototip_odendi`, `kargo_durumu=hazirlaniyor` olarak açar. Gerçek ödeme entegrasyonu bağlandığında `prototip_odendi` yerine `odeme_bekliyor` veya `odendi` yazacak şekilde güncellenmelidir.

Apps Script içinde `installAutomationTriggers` bir kez çalıştırılır. Bundan sonra işletme dropdownları değiştirdiğinde müşteri ödeme, hazırlık, kargo, teslim, iptal veya iade durumunu WhatsApp'tan alır.

## Canlıya Alma

1. `apps-script-surumu/Code.gs` dosyasının tamamını Apps Script `Kod.gs` içine yapıştır.
2. `testConfiguration` çalıştır.
3. Hata yoksa `Dağıt > Dağıtımları yönet > Kalem > Yeni sürüm > Dağıt`.
4. Yeni workbook dosyasını Google Sheets'e yükle:

```text
outputs/restoranbot-kavanoz-satis/RestoranBot Veri - Kavanoz Corba Satis.xlsx
```

5. Yeni Google Sheets ID değerini Apps Script `SPREADSHEET_ID` içine yaz.
