# Semantik Ön Bellekleme (Semantic Caching)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Sisteme gelen yeni bir talebin, kelimesi kelimesine aynı olmasa bile anlamsal olarak önceki taleplerle eşleştirilerek; LLM'e tekrar istek atmadan (maliyet ve zaman tasarrufuyla) önbellekten doğrudan yanıtlanması mimarisidir.

## Mini Senaryo

> "Kargom nerede?" ve "siparişim nerede?" aynı anlama gelir; ikincisi önbellekten anında yanıtlanır.

## 📖 Ayrıntılı Açıklama

Semantik Ön Bellekleme (Semantic Caching), gelen bir talebin kelimesi kelimesine (verbatim) aynı olmasa bile, anlamsal olarak önceki bir talebe yeterince benzemesi durumunda LLM'e yeni bir istek göndermeden önbellekteki yanıtın doğrudan döndürülmesidir. Geleneksel önbelleğin "tam eşleşme" mantığının aksine, semantik önbellek anlam (meaning) düzeyinde eşleştirme yapar; bu yüzden farklı ifade edilmiş ama özde aynı sorular tek bir yanıttan beslenir.

Bu kavram önemlidir çünkü LLM çağrıları pahalı ve görece yavaştır; kullanıcılar ise aynı şeyi sayısız farklı şekilde sorar ("kargom nerede", "siparişim ne zaman gelir", "paketim hangi aşamada"). Tam eşleşmeli bir önbellek bu varyasyonları kaçırır ve hepsi için ayrı ayrı modele gider. Semantik önbellek, anlamca eşdeğer sorulara saniyeler yerine milisaniyelerde ve neredeyse sıfır maliyetle yanıt vererek hem masrafı hem gecikmeyi (latency) ciddi biçimde düşürür.

Nasıl çalışır? (1) Her gelen sorgu bir gömme modeli (embedding model) ile bir vektöre dönüştürülür; (2) Bu vektör, daha önce yanıtlanmış sorguların vektörlerinin tutulduğu bir vektör veritabanında (vector database) en yakın komşu (nearest neighbor) aramasıyla karşılaştırılır; (3) Bulunan en benzer sorgunun benzerlik skoru bir eşiği (threshold) aşıyorsa, o sorgunun önbellekteki yanıtı doğrudan döner (cache hit); aşmıyorsa modele gidilir (cache miss) ve yeni soru-yanıt çifti önbelleğe eklenir.

Ne zaman kullanılır? Tekrarlayan ve sınırlı çeşitlilikte soruların geldiği yüksek trafikli senaryolarda: müşteri destek SSS, ürün bilgisi, dokümantasyon sorguları. Ne zaman kullanılmaz? Yanıtın kullanıcıya/zamana/duruma özel olduğu (örn. "benim bakiyem nedir") veya her seferinde taze/yaratıcı çıktı beklenen durumlarda; orada yanlış bir önbellek isabeti hatalı yanıt verir.

Tuzaklar: Benzerlik eşiğini çok düşük tutmak, anlamca farklı soruları yanlışlıkla eşleştirir (false positive) ve kullanıcıya alakasız yanıt döner; çok yüksek tutmak ise önbelleğin neredeyse hiç isabet etmemesine yol açar. Kişiselleştirilmiş veya zaman duyarlı sorguları önbelleğe almak tehlikelidir. Ayrıca önbellekteki yanıtların eskimesi (staleness) için bir geçerlilik süresi (TTL) ve geçersiz kılma (invalidation) stratejisi gerekir.

## 🎬 Detaylı Senaryo

"KargoTakip" adlı bir lojistik şirketi, destek ajanının aldığı yüksek soru hacmini ucuzlatmak ve hızlandırmak için bir semantik önbellek katmanı kuruyor.

1. **İlk soru:** Bir müşteri "Kargom nerede, ne zaman gelir?" diye sorar.
2. **Önbellek kontrolü:** Sistem soruyu vektöre çevirir, önbellekte yeterince benzer bir kayıt bulamaz (cache miss).
3. **Modele gitme:** Soru LLM'e gönderilir; ajan kargo durumunu açıklayan genel bir yanıt üretir.
4. **Önbelleğe ekleme:** Soru-yanıt çifti, sorgu vektörüyle birlikte önbelleğe (vektör veritabanına) eklenir.
5. **Benzer soru:** Kısa süre sonra başka bir müşteri "Siparişim hangi aşamada?" diye sorar.
6. **Anlamsal eşleşme:** Sistem bu sorunun vektörünü hesaplar; ilk soruyla benzerlik skoru eşiği (örn. 0.92) aşar.
7. **Önbellek isabeti:** Modele hiç gidilmeden, ilk sorunun yanıtı milisaniyeler içinde döndürülür (cache hit), maliyet neredeyse sıfır.
8. **Kişisel soru ayrımı:** Bir müşteri "Benim 8842 numaralı siparişim nerede?" derse, sistem bunu kişiselleştirilmiş sayıp önbelleği atlar ve canlı veriye gider.
9. **Bakım:** Önbellek kayıtlarına bir TTL konur; politika değişince ilgili kayıtlar geçersiz kılınır.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, gömme tabanlı bir semantik önbelleğin temel mantığını gösterir: benzerlik eşiği aşılırsa önbellekten döner, aşılmazsa modele gider.

```python
import numpy as np
import anthropic

client = anthropic.Anthropic()
onbellek = []  # (vektor, yanit) çiftleri
ESIK = 0.92

def gomme(metin: str) -> np.ndarray:
    # Üretimde bir embedding modeli çağrılır; burada kavramsal placeholder
    ...

def benzerlik(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def yanitla(soru: str) -> str:
    v = gomme(soru)
    for kayit_v, kayit_yanit in onbellek:
        if benzerlik(v, kayit_v) >= ESIK:
            return kayit_yanit  # önbellek isabeti (cache hit)
    # önbellek kaçması: modele git
    yanit = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        messages=[{"role": "user", "content": soru}],
    )
    metin = "".join(b.text for b in yanit.content if b.type == "text")
    onbellek.append((v, metin))
    return metin
```

İkinci örnek, kişiselleştirilmiş/zaman duyarlı sorguların önbelleğe alınmamasını sağlar:

```python
KISISEL_IZLER = ["benim", "numaralı siparişim", "hesabım", "bakiyem"]

def onbelleklenebilir_mi(soru: str) -> bool:
    return not any(iz in soru.lower() for iz in KISISEL_IZLER)
```

## 🔗 İlgili Kavramlar

- [Dayanıklılık Desenleri (Caching / Retry / Circuit Breaker)](../caching-retry-circuit-breaker/caching-retry-circuit-breaker.md) — tam eşleşmeli önbelleğin üst kümesi
- [Temellendirme (Grounding)](../grounding/grounding.md) — vektör veritabanı ve gömme paylaşımı
- [Bütçe / Döngü Sınırı (Budget / Loop Limits)](../budget-loop-limits/budget-loop-limits.md) — maliyet azaltmanın tamamlayıcısı
- Gömme (Embedding) — semantik eşleştirmenin temel aracı
- Vektör Veritabanı (Vector Database) — önbellek kayıtlarının saklandığı yapı
