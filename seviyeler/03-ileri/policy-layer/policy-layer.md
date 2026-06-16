# Politika Katmanı (Policy Layer)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 9. Güvenlik, Hizalama ve Denetim

Ajanların daha üst düzey kararlar alırken uyması gereken iş kurallarının ve prensiplerinin tanımlandığı katmandır. Hangi eylemlere izin verildiğini ve hangi durumların yasak olduğunu merkezî olarak yönetir.

## Mini Senaryo

> Politika katmanı "10.000 TL üstü harcama CFO onayı gerektirir" kuralını tüm ajanlara dayatır.

## 📖 Ayrıntılı Açıklama

Politika katmanı (policy layer), bir ajanın veya ajan filosunun alabileceği eylemleri yöneten izin ve yasak kurallarının merkezî olarak tanımlandığı ve uygulandığı (enforce) yazılım katmanıdır. İş mantığından (business logic) ayrı, kendi başına duran bir denetim noktasıdır: ajan "ne yapmak istediğini" söyler, politika katmanı "buna izin var mı?" sorusunu yanıtlar. Bu ayrım, kuralların tek bir yerde yaşamasını sağlar; her ajanın koduna dağılmış if/else bloklarına gerek kalmaz.

Neden önemli olduğu, otonomi (autonomy) arttıkça netleşir. Bir ajan kendi başına e-posta gönderebiliyor, ödeme yapabiliyor veya veritabanı değiştirebiliyorsa, hatalı ya da kötü niyetli bir kararın maliyeti çok yüksektir. Politika katmanı, bu eylemleri yürütülmeden önce yakalayan bir "kapı bekçisi" (gatekeeper) görevi görür. Güvenlik, hizalama (alignment) ve denetim (audit) açısından kritik bir kontrol noktasıdır; ayrıca tüm kararların izlenebilir bir kaydını (audit log) tutmayı kolaylaştırır.

Nasıl çalıştığına gelince: ajanın önerdiği eylem (örneğin "10.500 TL transfer et"), bir karar isteği (decision request) olarak politika motoruna iletilir. Motor, tanımlı kuralları girdi bağlamıyla (kullanıcı rolü, tutar, kaynak, zaman) eşleştirir ve `izin ver`, `reddet` veya `onay iste` gibi bir karar döndürür. Genelde kurallar deklaratif olarak (YAML, JSON veya OPA/Rego gibi politika dilleri) yazılır; böylece kuralları değiştirmek için kodu yeniden derlemek gerekmez.

Ne zaman kullanılır: finansal işlemler, kişisel veri erişimi, dış sistemlere yazma gibi yüksek etkili (high-stakes) eylemlerin olduğu her ajan sisteminde. Ne zaman gereksiz kaçabilir: yalnızca okuma yapan, salt bilgilendirici, hiçbir yan etkisi (side effect) olmayan basit prototiplerde ağır bir politika altyapısı erken bir optimizasyon olabilir.

Tuzaklar: Politikanın yalnızca prompt içinde "lütfen şunu yapma" şeklinde tarif edilmesi yeterli değildir; model bunu yok sayabilir, bu yüzden uygulama kod seviyesinde zorlanmalıdır (hard enforcement). Aşırı katı kurallar ajanı işlevsiz bırakabilir (false positive); fazla gevşek kurallar ise koruma sağlamaz. Kuralların çelişmesi (örneğin biri izin verirken diğeri yasaklaması) öncelik (precedence) sırası tanımlanmadığında belirsizlik yaratır; genelde "reddet kazanır" (deny-overrides) ilkesi tercih edilir.

## 🎬 Detaylı Senaryo

Bir fintech şirketi olan "AkçaPay", müşteri destek operasyonlarını hızlandırmak için otonom bir "İade Ajanı" devreye alıyor. Ajan, müşteri taleplerini okuyup uygun gördüğünde iade işlemini doğrudan ödeme sistemine yazabiliyor. Güvenlik ekibi, ajanın denetimsiz para hareketi yapmasını istemiyor.

1. Ürün ve risk ekipleri bir araya gelip iade politikasını tanımlıyor: 500 TL altı iadeler otomatik onaylanır, 500-5000 TL arası kıdemli temsilci onayı ister, 5000 TL üstü ise finans müdürü (CFO) onayı gerektirir.
2. Bu kurallar koda gömülmek yerine merkezî bir politika dosyasına (YAML) yazılıyor ve politika motoruna yükleniyor.
3. Bir müşteri "350 TL'lik siparişimi iade etmek istiyorum" diye yazıyor. İade Ajanı talebi analiz edip `iade_yap(tutar=350)` eylemini öneriyor.
4. Eylem yürütülmeden önce politika katmanına bir karar isteği gidiyor: tutar 350, müşteri kimliği, sipariş geçmişi.
5. Politika motoru 500 TL eşiğinin altında olduğunu görüp `izin ver` kararını döndürüyor; ajan iadeyi tamamlıyor ve müşteri saniyeler içinde yanıt alıyor.
6. Ertesi gün başka bir müşteri 7.200 TL'lik bir iade talep ediyor. Ajan yine `iade_yap(tutar=7200)` öneriyor.
7. Politika motoru bu kez `onay iste: CFO` kararını döndürüyor; ajan iadeyi yürütmüyor, bunun yerine CFO'nun onay kuyruğuna bir talep düşürüyor ve müşteriye "talebiniz inceleniyor" mesajı veriyor.
8. Tüm bu kararlar, kim-ne-zaman-neden bilgisiyle birlikte denetim kaydına (audit log) yazılıyor.
9. Bir hafta sonra düzenleyici bir denetimde, AkçaPay tüm otomatik kararların gerekçesini bu kayıttan eksiksiz sunabiliyor.
10. Risk ekibi eşikleri güncellemek istediğinde sadece YAML dosyasını değiştiriyor; ajan kodu hiç dokunulmadan yeni kural devreye giriyor.

## 💻 Kullanım / Uygulama Örneği

Aşağıda deklaratif bir politika tanımı ve onu uygulayan basit bir kontrol fonksiyonu yer alıyor. Eylem yürütülmeden önce politika motoruna danışılır.

```yaml
# iade-politikasi.yaml
kurallar:
  - ad: kucuk_iade_otomatik
    kosul: { tutar_max: 500 }
    karar: izin_ver
  - ad: orta_iade_temsilci
    kosul: { tutar_min: 500, tutar_max: 5000 }
    karar: onay_iste
    onaylayan: kidemli_temsilci
  - ad: buyuk_iade_cfo
    kosul: { tutar_min: 5000 }
    karar: onay_iste
    onaylayan: cfo
varsayilan: reddet   # deny-overrides: hiçbir kural eşleşmezse reddet
```

```python
def politika_degerlendir(eylem: dict, kurallar: list) -> dict:
    """Eylemi kurallarla eşleştirip karar döndürür (deny-overrides ilkesi)."""
    tutar = eylem["tutar"]
    for kural in kurallar:
        kosul = kural["kosul"]
        min_ok = tutar >= kosul.get("tutar_min", 0)
        max_ok = tutar <= kosul.get("tutar_max", float("inf"))
        if min_ok and max_ok:
            return {"karar": kural["karar"], "onaylayan": kural.get("onaylayan")}
    return {"karar": "reddet"}  # varsayılan güvenli taraf

# Ajan eylemi yürütmeden önce:
karar = politika_degerlendir({"tutar": 7200}, kurallar)
if karar["karar"] == "izin_ver":
    iade_yap()  # yürüt
else:
    onay_kuyruguna_ekle(karar.get("onaylayan"))  # beklet
```

Bu yapı, kuralları koddan ayırarak değişiklikleri yeniden derlemeden mümkün kılar ve her kararı denetlenebilir hâle getirir.

## 🔗 İlgili Kavramlar

- [Çıkarım Motoru (Reasoning Engine)](../reasoning-engine/reasoning-engine.md) — politika kararlarını işleten çekirdek mantık.
- [Durum Makinesi / FSM (State Machine / FSM)](../state-machine-fsm/state-machine-fsm.md) — izin verilen geçişleri kısıtlayan tamamlayıcı yapı.
- İnsan Onay Döngüsü (Human-in-the-Loop) — politika "onay iste" dediğinde devreye giren mekanizma.
- Korkuluklar (Guardrails) — model çıktısını sınırlayan benzer koruma katmanı.
- Denetim Kaydı (Audit Log) — politika kararlarının izlenebilirliğini sağlayan kayıt.
