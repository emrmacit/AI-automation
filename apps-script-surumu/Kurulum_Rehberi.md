# RestoranBot n8n'siz Kurulum Rehberi

Bu rehber, restoran WhatsApp chatbotunu n8n kullanmadan Google Sheets ve Google Apps Script ile kurmak içindir.

## 1. Google Sheets Dosyasını Hazırlayın

1. Google Drive'a girin.
2. `RestoranBot Veri Şablonu.xlsx` dosyasını yükleyin.
3. Dosyayı Google Sheets ile açın.
4. Dosya açılınca Google Sheets formatında kaydedin.
5. Adres çubuğundaki linkten Spreadsheet ID değerini alın.

Örnek link:

```text
https://docs.google.com/spreadsheets/d/1M3mkytSKdmJftcybuYuS5Y8fBhardMI5lAraVq-mzSQ/edit
```

Bu linkte Spreadsheet ID şudur:

```text
1M3mkytSKdmJftcybuYuS5Y8fBhardMI5lAraVq-mzSQ
```

## 2. Sheets İçeriğini Doldurun

Önce yalnız bu sekmeleri güncelleyin:

- `Ayarlar`
- `Saatler`
- `Urunler`
- `Secenekler`
- `Bolgeler`
- `SSS`

Gri/log sekmelerine normalde elle veri girmeyin:

- `Musteriler`
- `Adresler`
- `Gorusmeler`
- `Mesajlar`
- `Siparisler`
- `Kampanyalar`

Bot bu sayfaları kendisi doldurur.

## 3. Apps Script Projesini Açın

1. Google Sheets dosyasının içindeyken üst menüden Extensions > Apps Script seçin.
2. Açılan projede `Code.gs` dosyasını açın.
3. İçindeki örnek kodu silin.
4. Bu klasördeki `Code.gs` dosyasının tamamını yapıştırın.
5. Kaydedin.

## 4. Script Properties Ayarlarını Girin

Apps Script ekranında Project Settings bölümünü açın.

Script Properties alanına şunları ekleyin:

```text
OPENAI_API_KEY
GREEN_API_URL
GREEN_ID_INSTANCE
GREEN_API_TOKEN
SPREADSHEET_ID
OPENAI_MODEL
WEBHOOK_SECRET
PROTOTYPE_MODE
TEST_PHONE
PATRON_TELEFON
```

Örnek:

```text
GREEN_API_URL = https://7107.api.greenapi.com
GREEN_ID_INSTANCE = 710722721729
SPREADSHEET_ID = 1M3mkytSKdmJftcybuYuS5Y8fBhardMI5lAraVq-mzSQ
OPENAI_MODEL = gpt-4o-mini
WEBHOOK_SECRET = uzun-rastgele-bir-metin
PROTOTYPE_MODE = hayir
```

`OPENAI_API_KEY`, `GREEN_API_TOKEN` ve `WEBHOOK_SECRET` gizli değerlerdir. Bunları Sheets hücrelerine yazmayın.

Bot numarası burada yazılmaz. Bot numarası Green API'ye bağladığınız WhatsApp hattıdır. Sizin durumda bot hattı:

```text
+90 530 111 22 33
```

Eğer bu hat aktif restoran hattı değilse ve deneme için kullanılıyorsa:

```text
PROTOTYPE_MODE = hayir
TEST_PHONE = boş bırakılabilir
PATRON_TELEFON = boş bırakılabilir
```

Bu durumda `+90 530 111 22 33` hattına kim mesaj atarsa bot cevap verir.

Ekstra güvenlik isterseniz:

```text
PROTOTYPE_MODE = evet
TEST_PHONE = bot hattına mesaj atacak ikinci telefon numarası
PATRON_TELEFON = aynı ikinci telefon numarası
```

Bu mod açıkken sistem sadece `TEST_PHONE` numarasından gelen mesajı işler ve sadece o numaraya cevap gönderir.

`TEST_PHONE` ile `PATRON_TELEFON` aynıysa normal müşteri testleri yine çalışır. Sistem yalnız şu mesajları yönetici komutu sayar:

```text
durum
bot ac
bot kapat
kampanya: mesaj
yardim
```

## 5. İlk Kontrolü Çalıştırın

Apps Script üst kısmındaki fonksiyon listesinden `testConfiguration` seçin.

Run düğmesine basın.

İzin ekranı çıkarsa kendi Google hesabınızla izin verin.

Başarılı sonuç şuna benzer:

```json
{
  "ok": true,
  "spreadsheet": "RestoranBot Veri Şablonu",
  "model": "gpt-4o-mini",
  "prototypeMode": false,
  "testPhone": "",
  "requiredProperties": 4,
  "checkedSheets": 17
}
```

Hata alırsanız genelde sebep şunlardan biridir:

- Script Properties içinde eksik değer var.
- Spreadsheet ID yanlış.
- Google Sheets içinde gerekli sekme eksik.
- Dosya hâlâ Excel olarak duruyor, Google Sheets'e çevrilmemiş.

## 6. Web App Olarak Yayınlayın

1. Apps Script ekranında Deploy > New deployment seçin.
2. Select type kısmından Web app seçin.
3. Description alanına örneğin `RestoranBot Webhook` yazın.
4. Execute as: Me seçin.
5. Who has access: Anyone seçin.
6. Deploy düğmesine basın.
7. Web app URL adresini kopyalayın.

Bu URL Green API webhook adresi olacak. `WEBHOOK_SECRET` kullandıysanız URL sonuna şu şekilde ekleyin:

```text
https://script.google.com/macros/s/AKfy.../exec?secret=uzun-rastgele-bir-metin
```

## 7. Green API Webhook Ayarı

1. Green API konsolunda restoran hattının instance sayfasını açın.
2. Durum satırının Yetkili olduğundan emin olun.
3. Webhook URL alanına Apps Script Web app URL adresini yapıştırın. `WEBHOOK_SECRET` kullandıysanız `?secret=...` eklenmiş tam URL'yi yapıştırın.
4. Incoming ile başlayan mesaj bildirimlerini Yes yapın.
5. Outgoing bildirimlerini kullanmak istiyorsanız Yes yapın.
6. Save deyin.

## 8. Test Edin

`PROTOTYPE_MODE=hayir` ise herhangi bir telefondan Green API'ye bağlı bot hattına yazabilirsiniz. `PROTOTYPE_MODE=evet` yaptıysanız yalnız `TEST_PHONE` numarasından yazın:

```text
selam
```

Sonra şunları kontrol edin:

- WhatsApp'tan cevap geldi mi?
- `Mesajlar` sekmesine gelen mesaj yazıldı mı?
- `Mesajlar` sekmesine bot cevabı yazıldı mı?
- Selam/merhaba veya ürün sorusunda `Urunler` sekmesindeki ürünlere göre cevap verdi mi?
- Sipariş özetinde fiyatlar doğru mu?
- Onaydan sonra `Siparisler` sekmesine kayıt düştü mü?
- Onaydan sonra `Musteriler` sekmesinde toplam sipariş, toplam tutar ve segment güncellendi mi?
- `beni tanıdın mı` yazınca bot bu numaraya ait kayıtları hatırlıyor mu?
- Patron telefonuna sipariş bildirimi geldi mi?

## 9. Yönetici Komutları

Patron telefonundan restoran WhatsApp hattına şu komutlar yazılabilir:

```text
durum
bot kapat
bot ac
kampanya: Bugüne özel menümüz hazır, sipariş verebilirsiniz.
yardim
```

`bot kapat` komutu botu susturur. Müşteri mesajları patrona bildirilir.

`bot ac` komutu botu tekrar aktif eder.

## 10. Maliyet

Bu yapıda n8n ücreti yoktur.

Muhtemel ücretli kalemler:

- OpenAI API kullanımı.
- Green API, gerçek müşteri kullanımında Business plan gerekebilir.

Google Sheets ve Apps Script başlangıç için ücretsiz kullanılabilir; yoğun kullanımda Google kotaları takip edilmelidir.

## 11. Canlıya Geçerken

Prototip bittiğinde gerçek kullanıma almak için:

1. Sheets içindeki örnek fiyatları gerçek fiyatlarla değiştirin.
2. Menüdeki `Örnek fiyattır` notlarını kaldırın.
3. Teslimat bölgelerini gerçek kapsamla değiştirin.
4. `PROTOTYPE_MODE` değerini `hayir` yapın veya property'yi silin.
5. `PATRON_TELEFON` değerini gerçek yetkili/patron numarası yapın.
