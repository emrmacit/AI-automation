import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/m-rex/Desktop/restoranOTO/RestoranBot Veri Şablonu.xlsx";
const outputDir = "/Users/m-rex/Desktop/restoranOTO/outputs/restoranbot-kavanoz-satis";
const outputPath = `${outputDir}/RestoranBot Veri - Kavanoz Corba Satis.xlsx`;

const mapsUrl = "https://www.google.com/maps?q=Pa%C3%A7ac%C4%B1+H%C3%BCsn%C3%BC,+Orhaneli+Yolu,+Odunluk,+Lefko%C5%9Fe+Cd.+Eker+%C4%B0%C5%9F+Merkezi+No:+19B/C,+16110+Ni%CC%87l%C3%BCfer/Bursa,+T%C3%BCrkiye";
const provinces = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];
const orderStatuses = ["siparis_alindi", "odeme_bekliyor", "odendi", "hazirlaniyor", "kargoya_verildi", "teslim_edildi", "iptal", "iade"];
const paymentMethods = ["sanal_pos_test", "sanal_pos", "havale_eft", "kapida_odeme", "kartla_odeme", "odeme_linki"];
const paymentStatuses = ["odeme_bekliyor", "odendi", "prototip_odendi", "iptal", "iade"];
const shippingStatuses = ["hazirlaniyor", "kargoya_verildi", "teslim_edildi", "iptal", "iade"];
const orderTypes = ["kargo"];
const shippingCompanies = ["Yurtici", "Aras", "MNG", "Surat", "PTT", "Diger"];
const statusRows = [
  ["SiparisDurumu", "siparis_alindi", "", "Bot siparişi kaydetti; işletme kontrol edecek."],
  ["SiparisDurumu", "odeme_bekliyor", "", "Sipariş var ama ödeme henüz gerçek olarak doğrulanmadı."],
  ["SiparisDurumu", "odendi", "", "Ödeme doğrulandı."],
  ["SiparisDurumu", "hazirlaniyor", "", "Ürünler paketleniyor/hazırlanıyor."],
  ["SiparisDurumu", "kargoya_verildi", "", "Sipariş kargo firmasına teslim edildi."],
  ["SiparisDurumu", "teslim_edildi", "", "Sipariş müşteriye teslim edildi."],
  ["SiparisDurumu", "iptal", "", "Sipariş iptal edildi."],
  ["SiparisDurumu", "iade", "", "İade süreci var veya tamamlandı."],
  ["OdemeDurumu", "odeme_bekliyor", "", "Ödeme bekleniyor."],
  ["OdemeDurumu", "odendi", "", "Gerçek ödeme doğrulandı."],
  ["OdemeDurumu", "prototip_odendi", "", "Prototip/test akışında ödeme alınmış kabul edildi."],
  ["OdemeDurumu", "iptal", "", "Ödeme/sipariş iptal edildi."],
  ["OdemeDurumu", "iade", "", "Ödeme iade edildi veya iade sürecinde."],
  ["KargoDurumu", "hazirlaniyor", "", "Paket hazırlanıyor."],
  ["KargoDurumu", "kargoya_verildi", "", "Kargo firmasına teslim edildi."],
  ["KargoDurumu", "teslim_edildi", "", "Teslim edildi."],
  ["KargoDurumu", "iptal", "", "Kargo iptal edildi."],
  ["KargoDurumu", "iade", "", "Kargo/iade süreci var."],
  ["OdemeYontemi", "sanal_pos_test", "", "Geçici test ödeme akışı."],
  ["OdemeYontemi", "sanal_pos", "", "Gerçek sanal POS ödemesi."],
  ["OdemeYontemi", "havale_eft", "", "Banka havalesi/EFT."],
  ["OdemeYontemi", "kapida_odeme", "", "Kapıda ödeme, kargo/operasyon izin verirse."],
  ["OdemeYontemi", "kartla_odeme", "", "Manuel kartla ödeme kaydı."],
  ["OdemeYontemi", "odeme_linki", "", "Müşteriye ödeme linki gönderildi."],
  ["SiparisTuru", "kargo", "", "Türkiye geneli kargo siparişi."],
  ["KargoFirmasi", "Yurtici", "", "Yurtiçi Kargo."],
  ["KargoFirmasi", "Aras", "", "Aras Kargo."],
  ["KargoFirmasi", "MNG", "", "MNG Kargo."]
];

function setRows(sheet, startCell, rows) {
  sheet.getRange(startCell).resize(rows.length, rows[0].length).values = rows;
}

function clearRangeIfExists(sheet, range) {
  try {
    sheet.getRange(range).clear({ applyTo: "contents" });
  } catch {
    // Missing clear ranges are harmless for imported templates.
  }
}

function header(sheet, range) {
  sheet.getRange(range).format = { font: { bold: true }, fill: "#C6E0B4" };
}

function dropdown(sheet, range, source, allowBlank = true) {
  sheet.getRange(range).dataValidation = {
    list: {
      source,
      inCellDropDown: true
    },
    allowBlank
  };
}

function deleteWorksheetIfExists(name) {
  try {
    workbook.worksheets.getItem(name).delete();
  } catch {
    // Older templates may already be missing legacy sheets.
  }
}

function getOrAddWorksheet(name) {
  try {
    return workbook.worksheets.getItem(name);
  } catch {
    return workbook.worksheets.add(name);
  }
}

function productJoyMessageForTemplate(code, name) {
  const key = String(code || "").toUpperCase();
  const product = String(name || "").toLocaleLowerCase("tr-TR");

  if (key.startsWith("IK") || product.includes("kemik suyu")) {
    return "Harika seçim; kemik suyu sevenler için dolu dolu, kolajen hissi yüksek bir tercih.";
  }
  if (key.startsWith("KP") || product.includes("kelle")) {
    return "Kelle paça güçlü karakterli bir klasik; seveni için tam yerine oturan bir seçim.";
  }
  if (key.startsWith("AP") || product.includes("ayak")) {
    return "Ayak paça sevenlere güzel gider; yoğun ve geleneksel lezzet arayanlara iyi seçim.";
  }
  if (key.startsWith("TU") || product.includes("tuzlama")) {
    return "Tuzlama seçimi güzel; aroması belirgin, sofrada kendini belli eden bir lezzet.";
  }
  if (key.startsWith("IS") || product.includes("işkembe")) {
    return "İşkembe tam klasiklerden; çorba keyfini sevenler için güzel seçim.";
  }
  if (key.startsWith("KA") || key === "MX" || key === "GL8" || product.includes("karışık") || product.includes("gurme")) {
    return "Karışık paket iyi fikir; tek çeşide bağlı kalmadan lezzetleri deneme şansı verir.";
  }
  if (key.startsWith("BE") || product.includes("beyin")) {
    return "Beyin çorbası daha özel bir tercih; farklı lezzet sevenler için güzel seçim.";
  }
  if (key.startsWith("DI") || product.includes("dil")) {
    return "Dil çorbası seçimi zarif ve lezzetli tarafta; klasiklerin arasında güzel ayrılır.";
  }
  if (key.startsWith("IY") || product.includes("ilik yağı")) {
    return "İlik yağı sevenler için keyifli bir ek; sepete lezzetli bir dokunuş oldu.";
  }
  return "Güzel seçim; siparişinizi özenle hazırlayacağız.";
}

await fs.mkdir(outputDir, { recursive: true });

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const okuBeni = workbook.worksheets.getItem("OKU_BENI");
setRows(okuBeni, "A1", [
  ["PAÇACI HÜSNÜ WHATSAPP SİPARİŞ YÖNETİMİ"],
  ["Bu dosya kavanoz çorba satış botunun yönetim paneli ve kayıt alanıdır."],
  ["Ayarlar, Saatler, Urunler, Secenekler, Bolgeler ve SSS sekmelerinden işletme bilgilerini yönetin."],
  ["Musteriler, Adresler, Gorusmeler, Mesajlar, Siparisler, Siparis_Kalemleri ve Sistem_Hatalari sistem kayıtlarıdır."],
  ["Telefon numaraları her yerde aynı biçimde yazılır: başında artı ve boşluk olmadan, 90 ile başlayan rakamlar. Örnek biçim: 905301112233."],
  ["Altın kural: sekme adlarını ve her sayfanın 1. satırındaki başlıkları değiştirmeyin. Bot bu adlarla okur; ad değişirse ilgili sayfayı bulamaz."],
  ["Siparisler sekmesindeki durum, ödeme ve kargo alanlarını açılır listelerden güncelleyin."],
  ["Durum değişince müşteriye otomatik mesaj gitmesi için Apps Script'te installAutomationTriggers işlevini bir kez çalıştırın."],
  ["Siparis_Kalemleri yeni siparişlerde ürünleri ayrı satırlarda saklar."],
  ["Sistem_Hatalari bot ve dış servis hatalarını kalıcı kaydeder."],
  ["Musteriler sekmesinde pazarlama_rizasi yalnızca açık müşteri izni varsa evet olmalıdır."],
  ["Kod güncellemesinden sonra dağıtımı güncelleyin; testConfiguration ve runRegressionTests işlevlerini çalıştırın."],
  ["Ödeme entegrasyonu tamamlanana kadar ödeme/site yönlendirmesi gerçek ödeme doğrulaması değildir."]
]);
clearRangeIfExists(okuBeni, "A14:A50");
okuBeni.getRange("A:A").format.columnWidth = 120;
okuBeni.getRange("A1:A8").format.wrapText = true;
header(okuBeni, "A1:A1");

const ayarlar = workbook.worksheets.getItem("Ayarlar");
setRows(ayarlar, "A1", [
  ["anahtar", "aciklama", "deger"],
  ["restoran_adi", "Marka / bot adi", "Paçacı Hüsnü Kavanoz Çorba"],
  ["sube_adi", "Operasyon merkezi", "Bursa / Türkiye geneli kargo"],
  ["satis_modu", "Satis modeli", "kavanoz_kargo"],
  ["siparis_7_24", "WhatsApp siparisi 7/24 alinsin mi", "evet"],
  ["adres", "Merkez adres", "Orhaneli Yolu Odunluk Mah. Lefkoşe Cad. Eker İş Merkezi No: 19B/C, 16110 Nilüfer/Bursa"],
  ["harita_linki", "Merkez Google Maps linki", mapsUrl],
  ["telefon", "Bot WhatsApp numarasi", "+90 530 111 22 33"],
  ["saat_dilimi", "Saat dilimi", "Europe/Istanbul"],
  ["kargo_kapsami", "Kargo kapsami", "Türkiye geneli 81 il"],
  ["kargo_ucreti_sabit", "Sabit kargo ucreti (TL) - ornektir", 80],
  ["ucretsiz_kargo_esigi", "Ucretsiz kargo esigi (TL) - ornektir", 1500],
  ["min_sepet", "Minimum siparis tutari (TL) - ornektir", 300],
  ["hazirlik_hedef_dk", "Ortalama paketleme/hazirlik suresi - ornektir", "1-2 iş günü"],
  ["teslimat_hedef_dk", "Ortalama kargo teslim suresi - ornektir", "1-4 iş günü"],
  ["odeme_yontemleri", "Geçici ödeme yöntemi", "Sanal POS / site yönlendirmesi"],
  ["odeme_linki", "Geçici ödeme/site linki", "https://www.pacacihusnu.com/"],
  ["bot_aktif", "Bot aktif mi", "evet"],
  ["pazarlama_aktif", "Proaktif pazarlama", "hayir"],
  ["kvkk_riza_metni", "Musteriye gosterilecek KVKK metni", "Sipariş ve iletişim süreçleri için numaranız, adresiniz ve mesajlarınız kaydedilir. Dilediğiniz an SİL yazarak pazarlama mesajlarından çıkabilirsiniz."],
  ["prototip_notu", "Prototip güvenlik notu", "Fiyatlar, kargo ücreti ve ödeme yöntemleri örnektir; gerçek firma bilgileriyle güncellenmelidir."],
  ["kaynak_notu", "Not", "Bu dosya kavanoz ürün satışı ve Türkiye geneli kargo akışı için hazırlanmıştır."]
]);
clearRangeIfExists(ayarlar, "A22:C80");
header(ayarlar, "A1:C1");
ayarlar.getRange("C6:C21").format.wrapText = true;
ayarlar.getRange("A:A").format.columnWidth = 24;
ayarlar.getRange("B:B").format.columnWidth = 42;
ayarlar.getRange("C:C").format.columnWidth = 92;

const saatler = workbook.worksheets.getItem("Saatler");
setRows(saatler, "A1", [
  ["gun", "acilis", "kapanis", "kapali"],
  ["Pazartesi", "00:00", "23:59", "hayir"],
  ["Salı", "00:00", "23:59", "hayir"],
  ["Çarşamba", "00:00", "23:59", "hayir"],
  ["Perşembe", "00:00", "23:59", "hayir"],
  ["Cuma", "00:00", "23:59", "hayir"],
  ["Cumartesi", "00:00", "23:59", "hayir"],
  ["Pazar", "00:00", "23:59", "hayir"]
]);
header(saatler, "A1:D1");
saatler.getRange("A:D").format.columnWidth = 18;

deleteWorksheetIfExists("Menu");

const urunler = getOrAddWorksheet("Urunler");
clearRangeIfExists(urunler, "A1:J200");
setRows(urunler, "A1", [
  ["kod", "kategori", "urun", "fiyat", "bot_ile_satis", "aciklama", "site_urun_id", "site_linki"],
  ["GL8", "Paket", "Gurme Lezzetler Paketi 660 ml 8 Kavanoz", 6000, "evet", "Siteden alınan fiyat; ödeme entegrasyonunda site fiyatı esas alınmalıdır.", 25, "https://www.pacacihusnu.com/gurme-lezzetler-paketi-660-ml-8-kavanoz"],
  ["AP1", "Kavanoz Çorba", "Ayak Paça Çorbası 660 ml 1 Adet", 800, "evet", "Siteden alınan fiyat.", 28, "https://www.pacacihusnu.com/ayak-paca-corbasi-660-ml-1-adet"],
  ["AP2", "Kavanoz Çorba", "Ayak Paça Çorbası 660 ml 2'li Paket", 1600, "evet", "Siteden alınan fiyat.", 17, "https://www.pacacihusnu.com/u/17/ayak-paca-corbasi-660-ml-2-li-paket"],
  ["AP4", "Kavanoz Çorba", "Ayak Paça Çorbası 660 ml 4'lü Paket", 3000, "evet", "Siteden alınan fiyat.", 1, "https://www.pacacihusnu.com/ayak-paca-corbasi-4-lu-paket"],
  ["KP1", "Kavanoz Çorba", "Kelle Paça Çorbası 660 ml 1 Adet", 800, "evet", "Siteden alınan fiyat.", 29, "https://www.pacacihusnu.com/kelle-paca-corbasi-660-ml-1-adet"],
  ["KP2", "Kavanoz Çorba", "Kelle Paça Çorbası 660 ml 2'li Paket", 1600, "evet", "Siteden alınan fiyat.", 18, "https://www.pacacihusnu.com/kelle-paca-corbasi-660-ml-2-li-paket"],
  ["KP4", "Kavanoz Çorba", "Kelle Paça Çorbası 660 ml 4'lü Paket", 3000, "evet", "Siteden alınan fiyat.", 2, "https://www.pacacihusnu.com/kelle-paca-corbasi-4-lu-paket"],
  ["TU1", "Kavanoz Çorba", "Tuzlama Çorbası 660 ml 1 Adet", 800, "evet", "Siteden alınan fiyat.", 30, "https://www.pacacihusnu.com/tuzlama-corbasi-660-ml-1-adet"],
  ["TU2", "Kavanoz Çorba", "Tuzlama Çorbası 660 ml 2'li Paket", 1800, "evet", "Siteden alınan fiyat.", 20, "https://www.pacacihusnu.com/tuzlama-corbasi-660-ml-2-li-paket"],
  ["TU4", "Kavanoz Çorba", "Tuzlama Çorbası 660 ml 4'lü Paket", 3200, "evet", "Siteden alınan fiyat.", 4, "https://www.pacacihusnu.com/tuzlama-corbasi-4-lu-paket"],
  ["IS1", "Kavanoz Çorba", "İşkembe Çorbası 660 ml 1 Adet", 800, "evet", "Siteden alınan fiyat.", 31, "https://www.pacacihusnu.com/iskembe-corbasi-660-ml-1-adet"],
  ["IS2", "Kavanoz Çorba", "İşkembe Çorbası 660 ml 2'li Paket", 1600, "evet", "Siteden alınan fiyat.", 19, "https://www.pacacihusnu.com/iskembe-corbasi-660-ml-2-li-paket"],
  ["IS4", "Kavanoz Çorba", "İşkembe Çorbası 660 ml 4'lü Paket", 3000, "evet", "Siteden alınan fiyat.", 3, "https://www.pacacihusnu.com/iskembe-corbasi-4-lu-paket"],
  ["KA1", "Kavanoz Çorba", "Karışık Çorba 660 ml 1 Adet", 800, "evet", "Siteden alınan fiyat.", 32, "https://www.pacacihusnu.com/karisik-corba-660-ml-1-adet"],
  ["KA2", "Kavanoz Çorba", "Karışık Çorba 660 ml 2'li Paket", 1600, "evet", "Siteden alınan fiyat.", 23, "https://www.pacacihusnu.com/karisik-corba-660-ml-2-li-paket"],
  ["KA4", "Kavanoz Çorba", "Karışık Çorba 660 ml 4'lü Paket", 3000, "evet", "Siteden alınan fiyat.", 6, "https://www.pacacihusnu.com/karisik-corba-4-lu-paket"],
  ["MX", "Paket", "Karışık Çorba Paketi", 3000, "evet", "Siteden alınan fiyat.", 12, "https://www.pacacihusnu.com/karisik-corba-paketi"],
  ["IK1", "Kavanoz Çorba", "İlikli Kemik Suyu 660 ml 1 Adet", 450, "evet", "Sitede link 2'li paket adresini gösterse de ürün adı 1 adet olarak listeleniyor.", 27, "https://www.pacacihusnu.com/ilikli-kemik-suyu-660-ml-2-li-paket"],
  ["IK2", "Kavanoz Çorba", "İlikli Kemik Suyu 660 ml 2'li Paket", 900, "evet", "Siteden alınan fiyat.", 16, "https://www.pacacihusnu.com/ilikli-kemik-suyu-corbasi-660-ml-2-li-paket"],
  ["IK4", "Kavanoz Çorba", "İlikli Kemik Suyu 660 ml 4'lü Paket", 1800, "evet", "Siteden alınan fiyat.", 8, "https://www.pacacihusnu.com/kemik-suyu-corbasi-4-lu-paket"],
  ["BE1", "Kavanoz Çorba", "Beyin Çorbası 660 ml 1 Adet", 800, "evet", "Siteden alınan fiyat.", 34, "https://www.pacacihusnu.com/beyin-corbasi-660-ml-1-adet"],
  ["BE2", "Kavanoz Çorba", "Beyin Çorbası 660 ml 2'li Paket", 1600, "evet", "Siteden alınan fiyat.", 22, "https://www.pacacihusnu.com/beyin-corbasi-660-ml-2-li-paket"],
  ["BE4", "Kavanoz Çorba", "Beyin Çorbası 660 ml 4'lü Paket", 3000, "evet", "Siteden alınan fiyat.", 7, "https://www.pacacihusnu.com/beyin-corbasi-4-lu-paket"],
  ["DI1", "Kavanoz Çorba", "Dil Çorbası 660 ml 1 Adet", 800, "evet", "Siteden alınan fiyat.", 33, "https://www.pacacihusnu.com/dil-corbasi-660-ml-1-adet"],
  ["DI2", "Kavanoz Çorba", "Dil Çorbası 660 ml 2'li Paket", 1800, "evet", "Siteden alınan fiyat.", 21, "https://www.pacacihusnu.com/dil-corbasi-660-ml-2-li-paket"],
  ["DI4", "Kavanoz Çorba", "Dil Çorbası 660 ml 4'lü Paket", 3000, "evet", "Siteden alınan fiyat.", 5, "https://www.pacacihusnu.com/dil-corbasi-4-lu-paket"],
  ["IY2", "Gurme Lezzet", "İlik Yağı 660 ml 2'li Paket", 500, "evet", "Siteden alınan fiyat.", 24, "https://www.pacacihusnu.com/ilik-yagi"],
  ["APT", "Tek Porsiyon", "Ayak Paça Çorbası Tek Porsiyon", 450, "hayir", "Kargo satışında pasif; gerekirse evet yapılabilir.", 43, "https://www.pacacihusnu.com/ayak-paca-corbasi-tek-porsiyon"],
  ["KPT", "Tek Porsiyon", "Kelle Paça Çorbası Tek Porsiyon", 450, "hayir", "Kargo satışında pasif; gerekirse evet yapılabilir.", 42, "https://www.pacacihusnu.com/kelle-paca-corbasi-tek-porsiyon"],
  ["TUT", "Tek Porsiyon", "Tuzlama Çorbası Tek Porsiyon", 450, "hayir", "Kargo satışında pasif; gerekirse evet yapılabilir.", 39, "https://www.pacacihusnu.com/tuzlama-corbasi-tek-porsiyon"],
  ["IST", "Tek Porsiyon", "İşkembe Çorbası Tek Porsiyon", 450, "hayir", "Kargo satışında pasif; gerekirse evet yapılabilir.", 38, "https://www.pacacihusnu.com/iskembe-corbasi-tek-porsiyon"],
  ["KAT", "Tek Porsiyon", "Karışık Çorba Tek Porsiyon", 450, "hayir", "Kargo satışında pasif; gerekirse evet yapılabilir.", 37, "https://www.pacacihusnu.com/karisik-corba-tek-porsiyon"],
  ["IKT", "Tek Porsiyon", "İlikli Kemik Suyu Tek Porsiyon", 350, "hayir", "Kargo satışında pasif; gerekirse evet yapılabilir.", 40, "https://www.pacacihusnu.com/ilikli-kemik-suyu-tek-porsiyon"],
  ["BET", "Tek Porsiyon", "Beyin Çorbası Tek Porsiyon", 450, "hayir", "Kargo satışında pasif; gerekirse evet yapılabilir.", 36, "https://www.pacacihusnu.com/beyin"],
  ["DIT", "Tek Porsiyon", "Dil Çorbası Tek Porsiyon", 450, "hayir", "Kargo satışında pasif; gerekirse evet yapılabilir.", 35, "https://www.pacacihusnu.com/dil-corbasi-tek-porsiyon"],
  ["IYT", "Tek Porsiyon", "İlik Yağı Tek Porsiyon", 150, "hayir", "Kargo satışında pasif; gerekirse evet yapılabilir.", 41, "https://www.pacacihusnu.com/ilik-yagi-tek-porsiyon"]
]);
const productRows = urunler.getRange("A2:C37").values;
setRows(urunler, "I1", [
  ["keyif_mesaji"],
  ...productRows.map(row => [productJoyMessageForTemplate(row[0], row[2])])
]);
setRows(urunler, "J1", [["stok"]]);
header(urunler, "A1:J1");
urunler.getRange("F2:J37").format.wrapText = true;
urunler.getRange("A:A").format.columnWidth = 12;
urunler.getRange("B:B").format.columnWidth = 20;
urunler.getRange("C:C").format.columnWidth = 38;
urunler.getRange("D:E").format.columnWidth = 16;
urunler.getRange("F:F").format.columnWidth = 58;
urunler.getRange("G:G").format.columnWidth = 14;
urunler.getRange("H:H").format.columnWidth = 72;
urunler.getRange("I:I").format.columnWidth = 70;
urunler.getRange("J:J").format.columnWidth = 14;

const secenekler = workbook.worksheets.getItem("Secenekler");
clearRangeIfExists(secenekler, "A1:D200");
setRows(secenekler, "A1", [
  ["grup", "secenek", "fiyat_farki", "icerik"],
  ["Odeme", "POS", 0, "Sanal POS / site yönlendirmesi; prototipte ödeme alındı kabul edilir"],
  ["Kargo", "Standart kargo", 80, "Örnek sabit kargo ücreti"],
  ["Kargo", "Ücretsiz kargo eşiği", 1500, "Örnek eşik"],
  ["", "", "", ""],
  ["grup", "secenek", "fiyat_farki", "icerik"],
  ...statusRows
]);
header(secenekler, "A1:D1");
header(secenekler, "A6:D6");
secenekler.getRange("D2:D34").format.wrapText = true;
secenekler.getRange("A:D").format.columnWidth = 22;

const bolgeler = workbook.worksheets.getItem("Bolgeler");
clearRangeIfExists(bolgeler, "A1:D200");
setRows(bolgeler, "A1", [
  ["il", "durum", "kargo_ucreti", "not"],
  ...provinces.map(il => [il, "kargo", 80, "Türkiye geneli gönderim - ücret örnektir."])
]);
header(bolgeler, "A1:D1");
bolgeler.getRange("D2:D82").format.wrapText = true;
bolgeler.getRange("A:C").format.columnWidth = 18;
bolgeler.getRange("D:D").format.columnWidth = 54;

const sss = workbook.worksheets.getItem("SSS");
clearRangeIfExists(sss, "A1:C200");
setRows(sss, "A1", [
  ["soru", "cevap", "durum"],
  ["Nasıl sipariş veririm?", "Ürün kodlarını yazabilirsiniz. Örnek: KP2 IS1 IK2. Bot özet çıkarır, onaydan önce sepet ekleme/çıkarma yapabilir, onaydan sonra adres ister ve geçici ödeme linkini paylaşır.", "aktif"],
  ["Türkiye'nin her yerine gönderim var mı?", "Evet, prototipte Türkiye geneli 81 ile kargo gönderimi açıktır.", "aktif"],
  ["Kargo ücreti nedir?", "Örnek sabit kargo ücreti 80 TL'dir. Gerçek ücret firma anlaşmasına göre güncellenmelidir.", "aktif"],
  ["Ödeme seçenekleri nelerdir?", "Şimdilik sanal POS/site yönlendirmesi gösterilir. Gerçek ödeme entegrasyonu bağlanana kadar ödeme test olarak alınmış kabul edilir.", "aktif"],
  ["Adresiniz nerede?", `Operasyon merkezi: Orhaneli Yolu Odunluk Mah. Lefkoşe Cad. Eker İş Merkezi No: 19B/C, 16110 Nilüfer/Bursa. Konum: ${mapsUrl}`, "aktif"],
  ["Ürünler sıcak mı geliyor?", "Hayır. Bu sistem sıcak yemek teslimatı değil, kavanoz çorba ürünlerinin kargo satış akışıdır.", "aktif"]
]);
header(sss, "A1:C1");
sss.getRange("B2:B7").format.wrapText = true;
sss.getRange("A:A").format.columnWidth = 34;
sss.getRange("B:B").format.columnWidth = 90;
sss.getRange("C:C").format.columnWidth = 14;

const siparisler = workbook.worksheets.getItem("Siparisler");
clearRangeIfExists(siparisler, "A1:AD500");
setRows(siparisler, "A1", [[
  "siparis_no", "durum", "olusturma", "telefon", "musteri_adi", "alici_telefon", "urunler", "ara_toplam",
  "teslimat_ucreti", "toplam", "odeme", "odeme_durumu", "tur", "adres", "il", "ilce", "kargo_takip_no",
  "kargo_durumu", "kargo_firmasi", "not", "son_bildirim", "son_bildirim_zamani"
]]);
header(siparisler, "A1:V1");
siparisler.getRange("A:V").format.columnWidth = 18;
siparisler.getRange("G:G").format.columnWidth = 42;
siparisler.getRange("N:N").format.columnWidth = 54;
siparisler.getRange("T:T").format.columnWidth = 48;
dropdown(siparisler, "B2:B1000", orderStatuses);
dropdown(siparisler, "K2:K1000", paymentMethods);
dropdown(siparisler, "L2:L1000", paymentStatuses);
dropdown(siparisler, "M2:M1000", orderTypes);
dropdown(siparisler, "R2:R1000", shippingStatuses);
dropdown(siparisler, "S2:S1000", shippingCompanies);

const gorusmeler = workbook.worksheets.getItem("Gorusmeler");
clearRangeIfExists(gorusmeler, "A1:J500");
setRows(gorusmeler, "A1", [[
  "telefon", "durum", "atanan_personel", "sebep", "son_mesaj_zamani", "ai_duraklat_kadar", "uyari_sayisi", "beklenen_bilgi", "gecici_siparis_json", "not"
]]);
header(gorusmeler, "A1:J1");

const operationalSheets = [
  "Musteriler", "Adresler", "Mesajlar", "Kalici_Banlilar", "Kampanyalar", "Admin_Oturum"
];

const adresler = workbook.worksheets.getItem("Adresler");
clearRangeIfExists(adresler, "A1:I500");
setRows(adresler, "A1", [[
  "telefon", "etiket", "acik_adres", "ilce", "mahalle", "varsayilan", "il", "alici_ad_soyad", "alici_telefon"
]]);
header(adresler, "A1:I1");
adresler.getRange("A:I").format.columnWidth = 18;
adresler.getRange("C:C").format.columnWidth = 58;

for (const name of operationalSheets) {
  const sheet = workbook.worksheets.getItem(name);
  clearRangeIfExists(sheet, "A2:Z500");
  header(sheet, "A1:Z1");
}

const musteriler = workbook.worksheets.getItem("Musteriler");
clearRangeIfExists(musteriler, "A1:K500");
setRows(musteriler, "A1", [[
  "telefon", "son_ad", "isim_kaynagi", "ilk_gorulme", "son_siparis_tarihi", "toplam_siparis",
  "toplam_tutar", "pazarlama_rizasi", "riza_tarihi", "segment", "etiket", "son_hatirlatma_tarihi"
]]);
header(musteriler, "A1:L1");
musteriler.getRange("A:L").format.columnWidth = 18;
musteriler.getRange("B:B").format.columnWidth = 24;
dropdown(musteriler, "H2:H1000", ["belirsiz", "evet", "hayir"]);

const siparisKalemleri = getOrAddWorksheet("Siparis_Kalemleri");
clearRangeIfExists(siparisKalemleri, "A1:H1000");
setRows(siparisKalemleri, "A1", [[
  "siparis_no", "satir_no", "urun_kodu", "urun_adi", "adet", "birim_fiyat", "satir_toplami", "olusturma"
]]);
header(siparisKalemleri, "A1:H1");
siparisKalemleri.getRange("A:H").format.columnWidth = 18;
siparisKalemleri.getRange("D:D").format.columnWidth = 42;

const sistemHatalari = getOrAddWorksheet("Sistem_Hatalari");
clearRangeIfExists(sistemHatalari, "A1:F1000");
setRows(sistemHatalari, "A1", [["zaman", "kaynak", "telefon", "hata", "detay", "durum"]]);
header(sistemHatalari, "A1:F1");
sistemHatalari.getRange("A:F").format.columnWidth = 20;
sistemHatalari.getRange("D:E").format.columnWidth = 52;
dropdown(sistemHatalari, "F2:F1000", ["yeni", "incelendi", "cozuldu", "yok_sayildi"]);

["Menu", "Niyetler", "Personel", "Rezervasyonlar", "Egitim_Onerileri", "Konusma_Analiz"].forEach(deleteWorksheetIfExists);

const inspect = await workbook.inspect({
  kind: "table",
  sheetId: "Urunler",
  range: "A1:J37",
  include: "values",
  tableMaxRows: 38,
  tableMaxCols: 10,
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

for (const sheetName of ["Ayarlar", "Urunler", "Bolgeler", "SSS", "Siparisler", "Siparis_Kalemleri", "Sistem_Hatalari", "Adresler", "Gorusmeler", "Mesajlar", "Musteriler"]) {
  const renderRange = sheetName === "Urunler"
    ? "A1:J38"
    : (sheetName === "Siparisler" ? "A1:V14" : (sheetName === "Siparis_Kalemleri" ? "A1:H14" : "A1:F14"));
  const preview = await workbook.render({
    sheetName,
    range: renderRange,
    autoCrop: "all",
    scale: 1,
    format: "png"
  });
  await fs.writeFile(`${outputDir}/preview-${sheetName}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED ${outputPath}`);
