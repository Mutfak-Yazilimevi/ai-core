# Öz-Tutarlılık (Self-Consistency)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 2. Muhakeme ve Planlama

Aynı soru için birden çok bağımsız muhakeme üretip, sonuçlar arasında çoğunluk oyuyla en tutarlı yanıtı seçme tekniğidir.

## Mini Senaryo

> Aynı muhasebe sorusunu 5 kez çözer; 4'ü "120 TL" derse o yanıtı seçer.

## 📖 Ayrıntılı Açıklama

Öz-tutarlılık (self-consistency), aynı soru için modelden birden çok bağımsız muhakeme (reasoning) yolu üretip, ortaya çıkan yanıtlar arasında çoğunluk oyuyla (majority vote) en tutarlı olanı seçme tekniğidir. Tek bir cevap üretmek yerine, modeli birkaç kez (genellikle örnekleme sıcaklığı / temperature açıkken) çalıştırır; her seferinde farklı bir düşünce zinciri (chain-of-thought) izlenir, ama doğru cevaba giden farklı yollar genellikle aynı sonuçta buluşur. En sık tekrar eden cevap nihai yanıt olarak benimsenir.

Önemi, dil modellerinin olasılıksal (probabilistic) doğasından gelir. Tek bir çalıştırma, muhakemenin bir adımında yapılan rastlantısal bir hatayla yanlış sonuca sapabilir. Birden çok bağımsız deneme yapıldığında, doğru yol genellikle çoğunluğu oluşturur; tek seferlik hatalar azınlıkta kalıp elenir. Bu, özellikle aritmetik, mantık ve çok adımlı muhakeme gerektiren görevlerde doğruluğu belirgin biçimde artırır.

Nasıl çalışır: Aynı istem (prompt), model birden çok kez sıfır olmayan sıcaklıkla çalıştırılarak çeşitli muhakeme örnekleri üretilir. Her örnekten nihai cevap çıkarılır. Cevaplar bir araya getirilip oylanır; en çok oyu alan cevap seçilir. Önemli nokta, oylamanın muhakeme metnine değil, çıkarılan nihai cevaba yapılmasıdır.

Ne zaman kullanılır: Tek bir doğru cevabı olan, çoğunlukla nesnel (objektif) görevlerde; matematik problemleri, sınıflandırma, sayısal hesaplar. Ne zaman uygun değildir: Açık uçlu, yaratıcı veya tek "doğru" cevabı olmayan görevlerde (oylanacak ayrık bir cevap yoktur). Ayrıca her ek deneme maliyet ve gecikme (latency) artırdığından, ucuz/kesin görevlerde gereksizdir.

Tuzaklar: Maliyet doğrusal artar (5 deneme ≈ 5 kat maliyet). Sıcaklık çok düşükse denemeler birbirinin kopyası olur ve çeşitlilik kaybolur, teknik işe yaramaz. Çoğunluk her zaman doğru değildir; model sistematik olarak yanılıyorsa yanlış cevap da çoğunlukta olabilir. Cevapları karşılaştırırken normalleştirme (örneğin "120 TL" ile "120,00 TL"yi aynı saymak) gerekir.

## 🎬 Detaylı Senaryo

"FinansBot" adlı bir muhasebe yazılımı, kullanıcıların serbest metin sorularını yanıtlayan bir hesaplama asistanı geliştiriyor. Yanlış sayısal cevaplar kullanıcı güvenini sarstığı için doğruluk kritik.

1. Bir kullanıcı "3 ay boyunca aylık 850 TL kira ve %18 KDV dahil toplam ödemem ne?" diye soruyor.
2. Sistem bu soruyu tek seferde yanıtlamak yerine öz-tutarlılık moduna geçiyor.
3. Modeli aynı soru için 5 kez, sıcaklık açık olarak çalıştırıyor; her çalıştırma farklı bir muhakeme yolu izliyor.
4. Birinci, ikinci, dördüncü ve beşinci denemeler "3.009 TL" sonucuna ulaşıyor.
5. Üçüncü deneme bir ara adımda KDV'yi yanlış uygulayıp "2.550 TL" diyor.
6. Sistem her denemeden yalnızca nihai sayısal cevabı çıkarıp bir araya getiriyor.
7. Çoğunluk oyu yapılıyor: "3.009 TL" 4 oy, "2.550 TL" 1 oy alıyor.
8. Azınlıktaki hatalı cevap eleniyor; "3.009 TL" nihai yanıt olarak kullanıcıya sunuluyor.
9. Sistem ayrıca oyların ne kadar dağıldığını (4'e 1) bir güven göstergesi olarak kaydediyor; oylar çok bölünmüşse soruyu insana yönlendiriyor.
10. Ekip, öz-tutarlılık öncesi/sonrası hata oranını ölçüp belirgin düşüşü doğruluyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, çoğunluk oylaması mantığını gösterir: birden çok cevaptan en sık tekrar eden seçilir.

```python
from collections import Counter

def coğunluk_oyu(cevaplar: list[str]) -> str:
    """Normalleştirilmiş cevaplar arasında en sık tekrar edeni döndürür."""
    normalize = [c.strip().replace(",", ".") for c in cevaplar]
    return Counter(normalize).most_common(1)[0][0]

cevaplar = ["3009 TL", "3009 TL", "2550 TL", "3009 TL", "3009 TL"]
print(coğunluk_oyu(cevaplar))  # '3009 TL'
```

İkinci örnek, aynı soruyu birden çok kez çalıştırarak çeşitli muhakemeler üretir; çeşitlilik için sıcaklık açık tutulur.

```python
import anthropic
client = anthropic.Anthropic()

def coklu_cevap(soru: str, n: int = 5) -> list[str]:
    sonuclar = []
    for _ in range(n):
        r = client.messages.create(
            model="claude-opus-4-8", max_tokens=512, temperature=0.7,
            thinking={"type": "adaptive"},
            messages=[{"role": "user", "content": soru}])
        sonuclar.append(r.content[-1].text)  # nihai cevap çıkarılır
    return sonuclar
# Dönen n cevaba çoğunluk oyu uygulanarak nihai yanıt seçilir.
```

## 🔗 İlgili Kavramlar

- [Çıkarım Motoru (Reasoning Engine)](../reasoning-engine/reasoning-engine.md) — öz-tutarlılığın güvenilirleştirdiği muhakeme çekirdeği.
- [Düşünce Ağacı (Tree of Thoughts)](../tree-of-thoughts/tree-of-thoughts.md) — birden çok dalı keşfeden akraba teknik.
- Düşünce Zinciri (Chain-of-Thought) — her denemede izlenen adım adım muhakeme.
- Çoğunluk Oyu (Majority Vote) — nihai cevabı seçen toplulaştırma yöntemi.
- Örnekleme Sıcaklığı (Temperature) — denemeler arası çeşitliliği sağlayan parametre.
