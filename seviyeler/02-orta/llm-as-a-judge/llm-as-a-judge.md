# Yargıç Olarak LLM (LLM-as-a-Judge)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 10. Değerlendirme ve Kalite

Bir dil modelinin, başka bir modelin veya ajanın çıktısını belirli ölçütlere göre puanlaması; eval'lerde yaygın bir otomatik değerlendirme yöntemidir. İnsan değerlendirmesini ölçeklendirmenin pratik yoludur.

## Mini Senaryo

> İki farklı özet, bir "yargıç" model tarafından "hangisi daha doğru?" diye puanlanır.

## 📖 Ayrıntılı Açıklama

Yargıç olarak LLM (LLM-as-a-Judge), bir dil modelini, başka bir modelin veya ajanın ürettiği çıktıyı belirli ölçütlere göre değerlendirmek ve puanlamak için kullanma yöntemidir. Değerlendirmelerde (evals) insan değerlendirmesini ölçeklendirmenin pratik yoludur: binlerce çıktıyı insanların elle puanlaması pahalı ve yavaşken, bir yargıç model bunu hızlı ve tutarlı biçimde yapabilir.

Bu yaklaşım önemlidir; çünkü üretken yapay zekâ çıktılarının kalitesi çoğu zaman tek bir "doğru cevap" ile ölçülemez (özet kalitesi, üslup, yardımseverlik gibi öznel boyutlar). Otomatik metrikler (örn. kelime örtüşmesi) bu nüansları yakalayamaz. İnsan benzeri muhakeme yapabilen bir yargıç model, "bu yanıt soruyu gerçekten cevaplıyor mu, kaynaklara sadık mı, kibar mı?" gibi nitel ölçütleri değerlendirebilir; bu da hızlı iterasyon ve regresyon testi sağlar.

Nasıl çalışır? Yargıç modele net bir değerlendirme talimatı (rubric / puanlama ölçütü), değerlendirilecek çıktı ve gerekiyorsa referans/bağlam verilir. Yargıç, ölçütlere göre bir puan (örn. 1-5) veya bir karar (geçti/kaldı, A/B karşılaştırması) ve genellikle gerekçesini üretir. Tutarlılık için yargıç çıktısı yapısal (structured, örn. JSON) istenir. İki çıktının kıyaslandığı ikili karşılaştırma (pairwise comparison) ve tek çıktının puanlandığı mutlak puanlama (pointwise) yaygın iki kalıptır.

Ne zaman kullanılır? Öznel kalite ölçümünde, A/B testlerinde, regresyon takibinde, büyük ölçekli eval süitlerinde. Ne zaman dikkatli olunmalı? Yüksek riskli son kararlarda yargıç modele körü körüne güvenmek tehlikelidir; insanla kalibre edilmeli (HITL ile doğrulanmalı). Kesin doğruluk gerektiren durumlarda (matematik, kod) deterministik testler daha güvenilirdir.

Tuzaklar: Birincisi, konum yanlılığı (position bias) — ikili karşılaştırmada yargıç ilk gösterilen seçeneği kayırabilir; seçenek sırasını değiştirip iki kez sormak gerekir. İkincisi, kendini kayırma (self-preference) — model kendi ürettiği çıktıyı yüksek puanlama eğilimi. Üçüncüsü, belirsiz rubric; ölçüt net değilse puanlar tutarsız olur. Dördüncüsü, yargıcın insan yargısıyla hiç kalibre edilmemesi.

## 🎬 Detaylı Senaryo

Bir haber teknolojisi firması ("ÖzetGazete") makale özetleyen modelini iyileştirmek ister ve yargıç model kurar:

1. Ekip iki farklı istem (prompt) sürümü dener: A ve B; her biri 200 makaleyi özetler.
2. Her makale için iki özet üretilir; hangisinin daha iyi olduğunu elle değerlendirmek çok pahalıdır.
3. Ekip bir yargıç model kurar; ona net bir rubric verir: "doğruluk, kapsayıcılık, kısalık" ölçütlerine göre değerlendir.
4. Yargıç modele her makale ile iki özet sunulur ve "hangisi daha iyi, neden?" diye sorulur.
5. Konum yanlılığını engellemek için her çift, hem A-B hem B-A sırasıyla iki kez sorulur.
6. Yargıç, yapısal JSON çıktıyla kazananı ve gerekçesini verir; kod sonuçları toplar.
7. Ekip, yargıcı kalibre etmek için 30 örneği insanlara da puanlatır ve uyumun yüksek olduğunu doğrular.
8. Sonuçta B sürümü %72 oranında kazanır; ekip B'yi üretime alır ve yargıç süitini regresyon testi olarak CI'ya ekler.

## 💻 Kullanım / Uygulama Örneği

Aşağıda bir yargıç modelin, verilen ölçütlere göre tek bir özeti 1-5 arası puanladığı (pointwise) örnek yer alır. Yapısal çıktı tutarlılık sağlar.

```python
import anthropic

client = anthropic.Anthropic()

JURI_ISTEMI = """Sen tarafsız bir değerlendiricisin. Verilen özeti şu ölçütlere göre 1-5 arası puanla:
doğruluk, kapsayıcılık, kısalık. Sadece şu JSON'u döndür:
{"puan": <1-5>, "gerekce": "<kısa açıklama>"}"""

def degerlendir(makale: str, ozet: str) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=512,
        system=JURI_ISTEMI,
        messages=[{"role": "user", "content": f"Makale:\n{makale}\n\nÖzet:\n{ozet}"}])
    return next(b.text for b in resp.content if b.type == "text")

print(degerlendir(makale_metni, uretilen_ozet))
```

İkinci olarak, ikili karşılaştırmada (pairwise) konum yanlılığını azaltmak için aynı çift hem "A önce" hem "B önce" sırasıyla sorulup sonuçlar birleştirilir.

## 🔗 İlgili Kavramlar

- [Bağlam İçi Öğrenme (In-context Learning)](../in-context-learning/in-context-learning.md) — yargıca örnekle puanlama öğretme
- [Döngüde İnsan (HITL)](../hitl/hitl.md) — yargıcı insan yargısıyla kalibre etme
- [Prompt Chaining (İstem Zincirleme)](../../01-temel/prompt-chaining/prompt-chaining.md) — üret-sonra-değerlendir zinciri
- Değerlendirme (Evals) — yargıç modelin kullanıldığı test süiti
- Rubric (Puanlama Ölçütü) — yargıca verilen değerlendirme kriterleri
