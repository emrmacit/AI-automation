import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(new URL("../Code.gs", import.meta.url), "utf8");
const load = new Function(`${source}\nreturn {
  normalizeText_, normalizePhone_, normalizeQuickReplyText_, isGreetingText_,
  isCancelOrderText_, isClosingText_, normalizeAddressText_, isRetriableHttpCode_,
  isInternalTrackingNo_, buildOrderStatusNotification_, isSellableProductForTest_
};`);
const bot = load();

test("Turkce metin ve telefon normalizasyonu", () => {
  assert.equal(bot.normalizeText_("Ağrı Şişli"), "agri sisli");
  assert.equal(bot.normalizePhone_("+90 (501) 234 56 78"), "905012345678");
});

test("selamlama, iptal ve kapanis baglami", () => {
  assert.equal(bot.isGreetingText_(bot.normalizeQuickReplyText_("merhabalr")), true);
  assert.equal(bot.isCancelOrderText_("Vazgeçtim, almayacağım"), true);
  assert.equal(bot.isClosingText_("Tamam teşekkürler"), true);
});

test("adres kisaltmalarini aciklar", () => {
  assert.equal(
    bot.normalizeAddressText_("Sultan mah. Mavi sok. No: 3"),
    "Sultan Mahallesi Mavi Sokak No: 3"
  );
});

test("yalniz gecici HTTP hatalarini yeniden dener", () => {
  assert.equal(bot.isRetriableHttpCode_(429), true);
  assert.equal(bot.isRetriableHttpCode_(503), true);
  assert.equal(bot.isRetriableHttpCode_(400), false);
});

test("stok ve aktiflik satis uygunlugunu belirler", () => {
  assert.equal(bot.isSellableProductForTest_({ urun: "Test", bot_ile_satis: "evet", stok: 0 }), false);
  assert.equal(bot.isSellableProductForTest_({ urun: "Test", bot_ile_satis: "hayir", stok: 8 }), false);
  assert.equal(bot.isSellableProductForTest_({ urun: "Test", bot_ile_satis: "evet", stok: "" }), true);
});

test("gercek kargo numarasini musteri bildirimine ekler", () => {
  const result = bot.buildOrderStatusNotification_({
    siparis_no: "RBTEST",
    durum: "kargoya_verildi",
    odeme_durumu: "odendi",
    kargo_durumu: "kargoya_verildi",
    kargo_firmasi: "Yurtici",
    kargo_takip_no: "123456789012"
  }, ["kargo_durumu"]);
  assert.match(result.text, /123456789012/);
  assert.equal(bot.isInternalTrackingNo_("TRK-20260910-1003"), true);
});
