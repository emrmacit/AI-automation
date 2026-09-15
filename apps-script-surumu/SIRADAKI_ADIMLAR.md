# Sıradaki Adımlar

Bu dosyada sadece senin Google/Green hesaplarında yapılması gereken adımlar var. Yerel dosyalar hazır.

## Benim Hazırladığım Dosyalar

- `apps-script-surumu/Code.gs`
- `outputs/restoranbot-pacaci-husnu/RestoranBot Veri - Pacaci Husnu.xlsx`
- `apps-script-surumu/Script_Properties_Sablonu.txt`
- `apps-script-surumu/Kurulum_Rehberi.md`
- `apps-script-surumu/Kontrol_Listesi.md`

## Google Sheets

Canlı `RESTORAN-OTO` Google Sheets dosyası günceldir. `SPREADSHEET_ID` değerini yalnız dosyayı değiştirirsen güncelle.

## Senin Yapacağın 2. Adım: Apps Script

1. Google Sheets açıkken üst menüden `Extensions > Apps Script` aç.
2. `Code.gs` içindeki örnek kodu sil.
3. `apps-script-surumu/Code.gs` dosyasının tamamını kopyalayıp yapıştır.
4. Kaydet.
5. Fonksiyon listesinden `runRegressionTests` çalıştır; `failures: 0` sonucunu doğrula.
6. `installAutomationTriggers` işlevini bir kez çalıştır ve izin ver.

## Senin Yapacağın 3. Adım: Script Properties

Apps Script içinde `Project Settings > Script Properties` bölümüne şunları gir:

```text
OPENAI_API_KEY = kendi OpenAI API key'in
GREEN_API_URL = https://7107.api.greenapi.com
GREEN_ID_INSTANCE = 710722721729
GREEN_API_TOKEN = kendi Green API token'ın
SPREADSHEET_ID = Google Sheets'ten aldığın ID
OPENAI_MODEL = gpt-4o-mini
WEBHOOK_SECRET = uzun rastgele bir metin
PROTOTYPE_MODE = hayir
```

Önemli:

- `+90 530 111 22 33` bot hattıdır. Bot numarası Script Properties'e yazılmaz, Green API instance'ına bağlı WhatsApp hattından gelir.
- Bu hat aktif restoran hattı değilse `PROTOTYPE_MODE = hayir` kullanabilirsin. O zaman bu hatta yazan herkes bot tarafından cevaplanır.
- Sipariş/devir bildirimi almak istersen `PATRON_TELEFON` ekleyebilirsin.
- Sadece tek bir test numarasına izin vermek istersen `PROTOTYPE_MODE = evet` ve `TEST_PHONE = mesaj atacak numara` yap.
- Telefonları artı işareti olmadan yaz. Örnek: `31612345678`.

## Senin Yapacağın 4. Adım: testConfiguration

1. Apps Script üstündeki fonksiyon listesinden `testConfiguration` seç.
2. `Run` de.
3. İzin ekranı çıkarsa izin ver.
4. Sonuçta `ok: true`, `prototypeMode: false` görmelisin. Çünkü bu kurulumda `PROTOTYPE_MODE = hayir`.

## Senin Yapacağın 5. Adım: Web App Deploy

1. `Deploy > New deployment` seç.
2. Type olarak `Web app` seç.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Deploy et.
6. Web app URL'yi kopyala.
7. URL sonuna secret ekle:

```text
WEB_APP_URL?secret=WEBHOOK_SECRET_DEGERIN
```

## Senin Yapacağın 6. Adım: Green API Webhook

1. Green API'de bot hattının instance sayfasını aç.
2. WhatsApp durumunun `Yetkili` olduğundan emin ol.
3. Webhook URL alanına Apps Script URL'sini secret ile birlikte yapıştır.
4. Incoming message bildirimlerini `Yes` yap.
5. Save de.

## İlk Test

`PROTOTYPE_MODE=hayir` ise herhangi bir telefondan bot hattına şu mesajları gönder. `PROTOTYPE_MODE=evet` yaptıysan yalnız `TEST_PHONE` numarasından gönder:

```text
selam
menü
beni tanıdın mı
1 tane kelle paça istiyorum
```

Sonra Google Sheets'te şunları kontrol et:

- `Mesajlar`
- `Musteriler`
- `Gorusmeler`
- Sipariş onayından sonra `Siparisler`
