# Dosya Kılavuzu

## Bu Sürümde Gerekli

### `RestoranBot Veri - Kavanoz Corba Satis.xlsx`

Google Sheets'e yüklenecek ana yönetim dosyasıdır. Bot ürünleri, fiyatları, kargo kapsamını, SSS kayıtlarını, müşterileri, siparişleri, adresleri ve konuşma loglarını buradan okur/yazar.

Gerekli sekmeler:

- `Ayarlar`
- `Saatler`
- `Urunler`
- `Secenekler`
- `Bolgeler`
- `SSS`
- `Musteriler`
- `Adresler`
- `Gorusmeler`
- `Mesajlar`
- `Siparisler`
- `Kalici_Banlilar`
- `Kampanyalar`
- `Admin_Oturum`

### `apps-script-surumu/Code.gs`

Google Apps Script içine yapıştırılacak bot kodudur.

### `apps-script-surumu/Kurulum_Rehberi.md`

n8n kullanmadan kurulum adımlarını anlatır.

### `apps-script-surumu/Script_Properties_Sablonu.txt`

Apps Script ayar anahtarlarını gösterir.

## Bu Sürümde Gerekli Değil

### `RestoranBot Akış Şablonu.json`

n8n workflow dosyasıdır. Apps Script sürümünde import edilmeyecek.

### `RestoranBot_Kisisel.json`

n8n'e özel kişiselleştirilmiş workflow çıktısıdır. Apps Script sürümünde kullanılmayacak.

### `RestoranBot Komut Şablonu.md`

n8n workflow dosyasını kişiselleştirmek için hazırlanmış eski komut dosyasıdır. Apps Script sürümünde kullanılmayacak.

### `Calendly → UTM Tablosu Köprüsü.json`

Restoran chatbotundan bağımsız Calendly/UTM workflow dosyasıdır. Restoran otomasyonu için gerekli değildir.
