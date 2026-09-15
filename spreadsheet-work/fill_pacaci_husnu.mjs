import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/m-rex/Desktop/restoranOTO/RestoranBot Veri Şablonu.xlsx";
const outputDir = "/Users/m-rex/Desktop/restoranOTO/outputs/restoranbot-pacaci-husnu";
const outputPath = `${outputDir}/RestoranBot Veri - Pacaci Husnu.xlsx`;

const mapsUrl = "https://www.google.com/maps?q=Pa%C3%A7ac%C4%B1+H%C3%BCsn%C3%BC,+Orhaneli+Yolu,+Odunluk,+Lefko%C5%9Fe+Cd.+Eker+%C4%B0%C5%9F+Merkezi+No:+19B/C,+16110+Ni%CC%87l%C3%BCfer/Bursa,+T%C3%BCrkiye";
const officialUrl = "https://www.pacacihusnu.com/iletisim";
const hoursSourceUrl = "https://nelerimeshur.com/bursa/corbaci/pacaci-husnu";

function setRows(sheet, startCell, rows) {
  sheet.getRange(startCell).resize(rows.length, rows[0].length).values = rows;
}

function clearRangeIfExists(sheet, range) {
  try {
    sheet.getRange(range).clear({ applyTo: "contents" });
  } catch {
    // Some imported sheets may have smaller used ranges. Missing clear ranges are harmless.
  }
}

await fs.mkdir(outputDir, { recursive: true });

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const ayarlar = workbook.worksheets.getItem("Ayarlar");
setRows(ayarlar, "A1", [
  ["anahtar", "aciklama", "deger"],
  ["restoran_adi", "Restoran adi", "Paçacı Hüsnü"],
  ["sube_adi", "Sube", "Odunluk / Nilüfer"],
  ["adres", "Acik adres", "Orhaneli Yolu Odunluk Mah. Lefkoşe Cad. Eker İş Merkezi No: 19B/C, 16110 Nilüfer/Bursa"],
  ["harita_linki", "Google Maps linki", mapsUrl],
  ["telefon", "Iletisim telefonu", "+90 530 111 22 33"],
  ["enlem_boylam", "Konum (yaklasik, mesafe icin)", ""],
  ["saat_dilimi", "Saat dilimi", "Europe/Istanbul"],
  ["teslimat_yaricap_km", "Teslimat yaricapi (km)", ""],
  ["hazirlik_hedef_dk", "Ortalama hazirlik suresi (dk) - örnektir", "20"],
  ["teslimat_hedef_dk", "Ortalama teslimat suresi (dk) - örnektir", "30"],
  ["gecikme_tampon_dk", "Bu kadar dk gecince durum sorusu gruba aktarilir", "15"],
  ["eskalasyon_dk", "Grup yanit vermezse kac dk sonra tekrar hatirlatilir", "7"],
  ["yogunluk_modu", "normal, yogun ya da kapanisa_yakin", "normal"],
  ["odeme_yontemleri", "Kabul edilen odeme", "kapida_nakit, kapida_kart"],
  ["min_sepet", "Minimum sepet tutari (TL) - örnektir", "300"],
  ["gel_al_aktif", "Gel al var mi", "evet"],
  ["pazarlama_aktif", "Proaktif pazarlama", "hayir"],
  ["bot_aktif", "Bot aktif mi", "evet"],
  ["kvkk_riza_metni", "Musteriye gosterilecek KVKK metni", "Paçacı Hüsnü olarak sipariş ve iletişim süreçleri için numaranızı ve mesajlarınızı kaydediyoruz. Dilediğiniz an SİL yazarak kaydınızı kaldırabilirsiniz."],
  ["prototip_notu", "Prototip güvenlik notu", "Botun görünen WhatsApp numarası +90 530 111 22 33 olarak ayarlandı. Testte Apps Script PROTOTYPE_MODE=evet ve TEST_PHONE mesaj gönderen kendi test numaranız olmalı."],
  ["kaynak_notu", "Doldurulan bilgilerin kaynagi", `Adres ve ürün adları resmi iletişim sayfası/Google Maps bilgisinden; saat kaynağı: ${hoursSourceUrl}. Menü fiyatları, teslimat ücretleri, minimum sepet ve süreler örnektir.`]
]);
clearRangeIfExists(ayarlar, "A23:C80");
ayarlar.getRange("A1:C1").format = { font: { bold: true }, fill: "#C6E0B4" };
ayarlar.getRange("C4:C5").format.wrapText = true;
ayarlar.getRange("A:A").format.columnWidth = 22;
ayarlar.getRange("B:B").format.columnWidth = 34;
ayarlar.getRange("C:C").format.columnWidth = 90;

const saatler = workbook.worksheets.getItem("Saatler");
setRows(saatler, "A1", [
  ["gun", "acilis", "kapanis", "kapali"],
  ["Pazartesi", "06:30", "16:00", "hayir"],
  ["Salı", "06:30", "16:00", "hayir"],
  ["Çarşamba", "06:30", "16:00", "hayir"],
  ["Perşembe", "06:30", "16:00", "hayir"],
  ["Cuma", "06:30", "16:00", "hayir"],
  ["Cumartesi", "06:30", "16:00", "hayir"],
  ["Pazar", "", "", "evet"]
]);
saatler.getRange("A1:D1").format = { font: { bold: true }, fill: "#C6E0B4" };
saatler.getRange("A:D").format.columnWidth = 18;

const menu = workbook.worksheets.getItem("Menu");
clearRangeIfExists(menu, "A2:E200");
setRows(menu, "A1", [
  ["kategori", "urun", "fiyat", "bot_ile_satis", "aciklama"],
  ["Çorba", "Ayak Paça Çorbası Tek Porsiyon", 180, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Ayak Paça Çorbası 660 ml 1 Adet", 300, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Kelle Paça Çorbası Tek Porsiyon", 180, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Kelle Paça Çorbası 660 ml 1 Adet", 300, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Tuzlama Çorbası Tek Porsiyon", 170, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Tuzlama Çorbası 660 ml 1 Adet", 290, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "İşkembe Çorbası Tek Porsiyon", 160, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "İşkembe Çorbası 660 ml 1 Adet", 280, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Karışık Çorba Tek Porsiyon", 190, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Karışık Çorba 660 ml 1 Adet", 320, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "İlikli Kemik Suyu Tek Porsiyon", 150, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "İlikli Kemik Suyu 660 ml 1 Adet", 260, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Beyin Çorbası Tek Porsiyon", 180, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Beyin Çorbası 660 ml 1 Adet", 300, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Dil Çorbası Tek Porsiyon", 180, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Çorba", "Dil Çorbası 660 ml 1 Adet", 300, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Gurme Lezzet", "İlik Yağı Tek Porsiyon", 90, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Gurme Lezzet", "İlik Yağı 660 ml 2'li Paket", 220, "evet", "Örnek fiyattır, gerçek fiyat değildir."],
  ["Gurme Lezzet", "Gurme Lezzetler Paketi 660 ml 8 Kavanoz", 900, "evet", "Örnek fiyattır, gerçek fiyat değildir."]
]);
menu.getRange("A1:E1").format = { font: { bold: true }, fill: "#C6E0B4" };
menu.getRange("E2:E20").format.wrapText = true;
menu.getRange("A:A").format.columnWidth = 18;
menu.getRange("B:B").format.columnWidth = 28;
menu.getRange("C:D").format.columnWidth = 16;
menu.getRange("E:E").format.columnWidth = 58;

const secenekler = workbook.worksheets.getItem("Secenekler");
clearRangeIfExists(secenekler, "A2:D200");
setRows(secenekler, "A1", [
  ["grup", "secenek", "fiyat_farki", "icerik"],
  ["Porsiyon", "Tek porsiyon", 0, "Örnektir."],
  ["Porsiyon", "Paket porsiyon", 0, "Örnektir, paket servis testinde kullanılır."],
  ["Servis", "Gel al", 0, "Gel al talebi için."],
  ["Servis", "Paket servis", 0, "Prototipte evet kabul edilir."],
  ["Servis", "Masada servis", 0, "Restoranda tüketim bilgisi için."]
]);
secenekler.getRange("A1:D1").format = { font: { bold: true }, fill: "#C6E0B4" };
secenekler.getRange("D2:D5").format.wrapText = true;
secenekler.getRange("A:C").format.columnWidth = 18;
secenekler.getRange("D:D").format.columnWidth = 58;

const bolgeler = workbook.worksheets.getItem("Bolgeler");
clearRangeIfExists(bolgeler, "A2:D200");
setRows(bolgeler, "A1", [
  ["ilce", "durum", "teslimat_ucreti", "not"],
  ["Nilüfer", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Osmangazi", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Yıldırım", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Mudanya", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Gemlik", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Gürsu", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Kestel", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["İnegöl", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["İznik", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Orhangazi", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Karacabey", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Mustafakemalpaşa", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Yenişehir", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Orhaneli", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Keles", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Büyükorhan", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."],
  ["Harmancık", "teslim", 50, "Örnek teslimat ücretidir, gerçek ücret değildir."]
]);
bolgeler.getRange("A1:D1").format = { font: { bold: true }, fill: "#C6E0B4" };
bolgeler.getRange("D2:D18").format.wrapText = true;
bolgeler.getRange("A:C").format.columnWidth = 18;
bolgeler.getRange("D:D").format.columnWidth = 64;

const sss = workbook.worksheets.getItem("SSS");
clearRangeIfExists(sss, "A2:C200");
setRows(sss, "A1", [
  ["soru", "cevap", "durum"],
  ["Adresiniz nerede?", `Adresimiz: Orhaneli Yolu Odunluk Mah. Lefkoşe Cad. Eker İş Merkezi No: 19B/C, 16110 Nilüfer/Bursa. Konum: ${mapsUrl}`, "aktif"],
  ["Telefon numaranız nedir?", "Bot WhatsApp numaramız: +90 530 111 22 33.", "aktif"],
  ["Çalışma saatleriniz nedir?", "Pazartesi-Cumartesi 06:30-16:00 arası açık görünüyoruz. Pazar günü kapalıyız. Resmi tatiller ve özel günler için lütfen telefonla teyit edin.", "aktif"],
  ["Pazar günü açık mısınız?", "Pazar günü kapalı görünüyoruz. Özel günler için lütfen telefonla teyit edin.", "aktif"],
  ["Paket servis veya teslimat var mı?", "Prototipte paket servis açıktır. Bursa ilçeleri örnek olarak teslimat bölgesi yapılmıştır, teslimat ücreti örnek 50 TL'dir.", "aktif"],
  ["Menüde neler var?", "Paçacı Hüsnü'nün resmi sitesinde ayak paça, kelle paça, tuzlama, işkembe, karışık çorba, ilikli kemik suyu, beyin çorbası, dil çorbası ve ilik yağı gibi ürünler görünüyor. Prototipte fiyatlar örnektir.", "aktif"],
  ["Rezervasyon alıyor musunuz?", "Rezervasyon talebinizi tarih, saat ve kişi sayısıyla birlikte yetkiliye iletelim.", "aktif"],
  ["Ödeme seçenekleri nelerdir?", "Prototipte kapıda nakit ve kapıda kart kabul ediliyor varsayılmıştır.", "aktif"]
]);
sss.getRange("A1:C1").format = { font: { bold: true }, fill: "#C6E0B4" };
sss.getRange("B2:B9").format.wrapText = true;
sss.getRange("A:A").format.columnWidth = 32;
sss.getRange("B:B").format.columnWidth = 88;
sss.getRange("C:C").format.columnWidth = 14;

const niyetler = workbook.worksheets.getItem("Niyetler");
setRows(niyetler, "A1", [
  ["niyet_kodu", "ornek_ifadeler", "politika", "hedef", "yanit_sablonu"],
  ["selamlama", "merhaba, selam, iyi günler, kolay gelsin", "yapay_zeka_yanitlar", "yok", "Merhaba, Paçacı Hüsnü'ye hoş geldiniz. Size nasıl yardımcı olabiliriz?"],
  ["menu_bilgi", "menü, fiyat, ne var, çorba, paça, işkembe", "yapay_zeka_yanitlar", "sss_ve_menu", "Güncel menü ve fiyat teyidi gerekirse yetkiliye aktar."],
  ["siparis_ver", "sipariş, paket, gel al, gönderir misiniz", "yoneticiye_aktar", "teslimat_teyit", "Menü fiyatları ve teslimat bölgesi tamamlanana kadar siparişi yetkiliye aktar."],
  ["adres_bilgi", "adres, konum, neredesiniz, yol tarifi", "yapay_zeka_yanitlar", "ayarlar", "Adres ve harita linkini paylaş."]
]);
niyetler.getRange("A1:E1").format = { font: { bold: true }, fill: "#C6E0B4" };
niyetler.getRange("A:E").format.columnWidth = 24;

const personel = workbook.worksheets.getItem("Personel");
clearRangeIfExists(personel, "A2:F200");
personel.getRange("A1:F1").format = { font: { bold: true }, fill: "#C6E0B4" };

const operationalSheets = [
  "Musteriler",
  "Adresler",
  "Gorusmeler",
  "Mesajlar",
  "Siparisler",
  "Rezervasyonlar",
  "Kalici_Banlilar",
  "Kampanyalar",
  "Admin_Oturum",
  "Egitim_Onerileri",
  "Konusma_Analiz"
];
for (const name of operationalSheets) {
  const sheet = workbook.worksheets.getItem(name);
  clearRangeIfExists(sheet, "A2:Z500");
  sheet.getRange("A1:Z1").format = { font: { bold: true }, fill: "#D9EAD3" };
}

const inspect = await workbook.inspect({
  kind: "table",
  sheetId: "Ayarlar",
  range: "A1:C21",
  include: "values",
  tableMaxRows: 25,
  tableMaxCols: 4,
  maxChars: 6000
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
  maxChars: 2000
});
console.log(errors.ndjson);

for (const sheetName of [
  "OKU_BENI",
  "Ayarlar",
  "Saatler",
  "Menu",
  "Secenekler",
  "Bolgeler",
  "SSS",
  "Niyetler",
  "Personel",
  "Musteriler",
  "Adresler",
  "Gorusmeler",
  "Mesajlar",
  "Siparisler",
  "Rezervasyonlar",
  "Kalici_Banlilar",
  "Kampanyalar",
  "Admin_Oturum",
  "Egitim_Onerileri",
  "Konusma_Analiz"
]) {
  const preview = await workbook.render({
    sheetName,
    range: "A1:E12",
    autoCrop: "all",
    scale: 1,
    format: "png"
  });
  await fs.writeFile(`${outputDir}/preview-${sheetName}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED ${outputPath}`);
