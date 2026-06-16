# Semantik Yönlendirme (Semantic Routing)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Gelen bir talebin kelime anlamına veya niyetine bakarak, o iş için en uygun uzman ajana yönlendirilmesi işlemidir. Akıllı bir API Gateway gibi çalışır; ancak bunu statik if/else kurallarıyla değil, anlamsal bağlamla yapar.

## Mini Senaryo

> "Paramı alamadım" mesajı, kelime eşleşmesi olmasa da anlamca "iade" ajanına yönlendirilir.

## 📖 Ayrıntılı Açıklama

Semantik yönlendirme (semantic routing), gelen bir talebi yüzeydeki kelimelerine değil, taşıdığı anlama ve niyete (intent) bakarak en uygun uzman ajana, modele veya araca yönlendirme işlemidir. Klasik kural tabanlı yönlendirme statik if/else ve anahtar kelime eşleşmesiyle çalışır; semantik yönlendirme ise girdinin anlamsal bağlamını çözümler. Böylece "paramı alamadım" gibi içinde "iade" kelimesi geçmeyen bir mesaj bile, anlamca iade konusuna yakın olduğu için doğru ajana ulaşır. Akıllı bir API ağ geçidi (gateway) gibi davranır, ama yönlendirmeyi anlamla yapar.

Önemi, gerçek kullanıcıların doğal dili öngörülemez biçimde kullanmasından gelir. İnsanlar her zaman "anahtar kelime"yi söylemez; aynı niyeti binlerce farklı cümleyle ifade ederler. Kural tabanlı yönlendirme bu çeşitliliği yakalayamaz ve sayısız özel durum (edge case) yazmayı gerektirir. Semantik yönlendirme, anlam benzerliğine dayandığı için bu çeşitliliği doğal olarak kapsar; yeni ifade biçimleri için kural eklemeye gerek kalmaz.

Nasıl çalışır: İki yaygın yaklaşım vardır. Birincisi gömme (embedding) tabanlıdır: her hedef ajan/niyet için örnek ifadelerin gömmeleri saklanır; gelen mesaj da gömülür ve anlamca en yakın hedefe (vektör benzerliği) yönlendirilir. İkincisi LLM tabanlıdır: bir dil modeli mesajı okuyup hangi kategoriye/ajana ait olduğunu sınıflandırır. Her iki yöntemde de seçim, kelime eşleşmesine değil anlamsal yakınlığa dayanır.

Ne zaman kullanılır: Kullanıcı girdisi serbest metin ve çeşitliyse, birden çok uzman ajan varsa ve niyet kelimelerle güvenilir şekilde ayrılamıyorsa. Ne zaman gereksiz olabilir: Girdi yapılandırılmışsa (örneğin menüden seçim) veya az sayıda net anahtar kelimeyle ayrılabiliyorsa basit kural tabanlı yönlendirme daha ucuz ve öngörülebilirdir.

Tuzaklar: Anlamca yakın ama farklı niyetlerin karışması (örneğin "ödeme yapamadım" teknik mi yoksa muhasebe mi?); bu yüzden bir güven eşiği ve belirsizlikte yedek (fallback) hedef gerekir. Gömme tabanlı yönlendirmede örnek ifadelerin kalitesi sonucu doğrudan etkiler. LLM tabanlı yönlendirme gecikme ve maliyet ekler. Yönlendirme kararlarını izlemek, sistematik hataları yakalamak için şarttır.

## 🎬 Detaylı Senaryo

"BankaPlus" adlı dijital bankanın destek hattında muhasebe, kart işlemleri, kredi ve genel olmak üzere dört uzman ajan var. Müşteriler çok farklı ifadelerle aynı şeyi sorduğu için kural tabanlı yönlendirme yetersiz kalıyor.

1. Bir müşteri "satıcı parayı çekti ama ürün gelmedi, param boşa gitti" yazıyor.
2. Mesajda "iade" veya "geri ödeme" kelimeleri geçmiyor; kural tabanlı sistem bunu kaçırırdı.
3. Semantik yönlendirici mesajı bir gömmeye çeviriyor.
4. Bu gömmeyi, her uzman için önceden tanımlı örnek ifade gömmeleriyle karşılaştırıyor.
5. Mesaj, "iade/itiraz" kategorisinin örneklerine anlamca en yakın çıkıyor (benzerlik puanı yüksek).
6. Yönlendirici talebi kart işlemleri/itiraz ajanına iletiyor.
7. Ajan harcama itirazı sürecini başlatıp müşteriye adımları açıklıyor.
8. Başka bir müşteri "kredi başvurum ne durumda?" diye soruyor; gömme bu kez kredi ajanına en yakın çıkıyor.
9. Belirsiz bir mesajda en yüksek benzerlik bile güven eşiğinin altında kalıyor; sistem genel yardım ajanına düşürüyor (fallback).
10. Ekip, düşük güvenli ve yanlış yönlendirilen vakaları toplayıp örnek ifade setlerini zenginleştirerek yönlendiriciyi sürekli iyileştiriyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, gömme tabanlı semantik yönlendirmenin kavramsal akışını gösterir: mesaj, hedeflerin örneklerine olan benzerliğine göre yönlendirilir.

```python
def semantik_yonlendir(mesaj_gomme, hedef_gommeleri: dict, esik: float = 0.6) -> str:
    """Mesajı, örnek gömmelerine anlamca en yakın hedefe yönlendirir."""
    en_iyi, en_iyi_puan = None, -1.0
    for hedef, ornek_gomme in hedef_gommeleri.items():
        puan = kosinus_benzerligi(mesaj_gomme, ornek_gomme)
        if puan > en_iyi_puan:
            en_iyi, en_iyi_puan = hedef, puan
    return en_iyi if en_iyi_puan >= esik else "genel_yardim_ajani"  # belirsizse fallback
```

İkinci örnek, niyeti bir LLM ile sınıflandırarak yönlendirir; kelime eşleşmesi olmadan anlam çözülür.

```python
import anthropic
client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=32,
    messages=[{"role": "user", "content":
        "Aşağıdaki mesajın niyetini (muhasebe / kart-itiraz / kredi / genel) "
        "yalnızca etiket olarak döndür:\n"
        "'Satıcı parayı çekti ama ürün gelmedi'"}])
# Model 'kart-itiraz' döndürür; mesaj kelime eşleşmesi olmadan doğru ajana gider.
```

## 🔗 İlgili Kavramlar

- [Yönlendirme (Routing)](../routing/routing.md) — semantik yönlendirmenin daha genel/temel biçimi.
- [Yeniden Sıralama (Reranking)](../reranking/reranking.md) — anlamsal benzerlikle çalışan akraba teknik.
- [Anlamsal Bellek (Semantic Memory)](../semantic-memory/semantic-memory.md) — ortak gömme altyapısını paylaşan kavram.
- Gömme (Embedding) — anlamı vektöre çeviren temel yapı taşı.
- Niyet Sınıflandırma (Intent Classification) — yönlendirmenin temelindeki sınıflandırma görevi.
