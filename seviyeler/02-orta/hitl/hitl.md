# Döngüde İnsan (HITL (Human-in-the-Loop))

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 9. Güvenlik, Hizalama ve Denetim

Otonom iş akışındaki kritik karar aşamalarında insanın onayını, incelemesini veya kontrolünü sürece dahil etmektir. Yüksek riskli eylemler (ödeme, silme, yayınlama) öncesinde bir insanın onayını gerektirebilir; süreç onaya kadar durur.

## Mini Senaryo

> Ajan 50.000 TL'lik ödemeyi yapmadan önce durur ve bir yöneticinin onayını bekler.

## 📖 Ayrıntılı Açıklama

Döngüde insan (HITL, Human-in-the-Loop), otonom bir iş akışındaki kritik karar noktalarında insanın onayını, incelemesini veya müdahalesini sürece dahil etme yaklaşımıdır. Ajan, yüksek riskli bir eylemi (ödeme, veri silme, içerik yayınlama, sözleşme imzalama) yapmadan hemen önce durur, eylem niyetini bir insana sunar ve onay gelene kadar bekler. Yani otonomluk ile kontrol arasında bilinçli bir denge kurar.

Bu kavram önemlidir; çünkü dil modelleri hata yapabilir, halüsinasyon (hallucination) üretebilir veya beklenmedik durumlarda yanlış araç çağırabilir. Geri alınamaz veya pahalı eylemlerde bir insanın "evet" demesi, hem güvenlik hem hesap verebilirlik (accountability) hem de yasal/uyumluluk (compliance) açısından kritik bir emniyet kemeridir. HITL, ajan sistemlerini üretime (production) güvenle taşımanın temel desenlerinden biridir.

Nasıl çalışır? Ajan döngüsünde (agent loop), belirli araçlar "onay gerektiren" olarak işaretlenir. Model bu araçlardan birini çağırmak istediğinde, harness aracı hemen çalıştırmaz; bunun yerine akışı durdurur, talebi (araç adı + argümanlar) bir kişiye/kuyruğa iletir ve insanın kararını bekler. Onay gelirse araç çalışır ve sonucu döngüye geri beslenir; ret gelirse modele "reddedildi" bilgisi `tool_result` olarak verilir ve model alternatif bir yol arar.

Ne zaman kullanılır? Geri alınamaz, finansal, yasal veya güvenlik açısından kritik eylemlerde; düşük güven (confidence) durumlarında; düzenlemeye tabi sektörlerde (sağlık, finans). Ne zaman gerekmez? Düşük riskli, kolayca geri alınabilir, yüksek hacimli rutin eylemlerde (örn. bir veriyi okuma) her adımda onay istemek süreci felç eder.

Tuzaklar: Birincisi, "onay yorgunluğu" (approval fatigue) — her şeye onay istenince insan körlemesine onaylamaya başlar; sadece gerçekten kritik adımları kapıya koymak gerekir. İkincisi, ret durumunu modele düzgün bildirmemek; model neden durduğunu anlamadan tekrar dener. Üçüncüsü, onay beklerken durumu (state) kalıcı saklamamak; süreç çökerse bağlam kaybolur.

## 🎬 Detaylı Senaryo

Bir muhasebe yazılımı firması ("HesapKolay") tedarikçi ödemelerini otomatikleştiren bir ajan kurar ama yüksek tutarlara insan onayı koyar:

1. Ajan, gelen faturaları okur ve ödeme talimatı hazırlar.
2. 5.000 TL altındaki ödemeleri otomatik onaylar ve işler (düşük risk).
3. Bir fatura 50.000 TL gelir; ajan `odeme_yap` aracını çağırmak ister.
4. Harness bu aracı "onay gerektiren" olarak işaretlemiştir; çalıştırmaz, akışı durdurur.
5. Talep (tedarikçi, tutar, fatura no) finans müdürünün onay kuyruğuna düşer ve müdüriye bildirim gider.
6. Müdür panelde detayları görür; tutarın doğru olduğunu teyit edip "Onayla" der.
7. Onay döngüye döner; `odeme_yap` çalışır ve sonucu modele beslenir, ajan süreci tamamlar.
8. Başka bir faturada müdür "Reddet" der; modele "ödeme reddedildi, gerekçe: tutar tutarsız" bilgisi gider ve ajan tedarikçiye açıklama talebi yazar.

## 💻 Kullanım / Uygulama Örneği

Aşağıda kritik bir araç çağrısında akışın durup insan onayı beklediği bir kod akışı yer alır.

```python
import anthropic

client = anthropic.Anthropic()
ONAY_GEREKTIREN = {"odeme_yap", "veri_sil"}

def insan_onayi_iste(arac: str, arg: dict) -> bool:
    # Gerçekte: talebi onay kuyruğuna koyup yanıtı bekler (Slack, panel, e-posta...)
    print(f"ONAY GEREKLİ -> {arac}({arg})")
    return input("Onaylıyor musunuz? (e/h): ").strip().lower() == "e"

# ... ajan döngüsünde model bir tool_use döndürdü ...
for b in resp.content:
    if b.type == "tool_use":
        if b.name in ONAY_GEREKTIREN and not insan_onayi_iste(b.name, b.input):
            sonuc = "İşlem insan tarafından reddedildi. Gerekçeyi kullanıcıya sor."
        else:
            sonuc = araci_calistir(b.name, b.input)   # onaylandı veya onay gerekmiyor
        # sonuç tool_result olarak geri beslenir
```

İkinci olarak, onay beklerken durumu kalıcı kaydetmek (örn. veritabanına "beklemede" kaydı) önemlidir; böylece süreç gün sonra onaylansa bile kaldığı yerden devam eder.

## 🔗 İlgili Kavramlar

- [Ajan Döngüsü (Agent Loop)](../agent-loop/agent-loop.md) — onayın araya girdiği yürütme çevrimi
- [En Az Yetki (Least Privilege)](../least-privilege/least-privilege.md) — riski azaltan tamamlayıcı güvenlik ilkesi
- [Fonksiyon Çağırma (Function Calling)](../function-calling/function-calling.md) — onay kapısına takılan araç çağrıları
- [Devir İşlemleri (Handoffs)](../handoffs/handoffs.md) — ajan emin değilse işi insana/uzmana devretme
- Hesap Verebilirlik (Accountability) — kritik kararlarda insan sorumluluğu
