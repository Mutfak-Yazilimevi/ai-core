# Yeniden Sıralama (Reranking)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

RAG'de ilk erişimle gelen aday belgelerin, soruyla gerçek alaka düzeyine göre ikinci bir modelle yeniden puanlanıp sıralanması ve en alakalıların öne çıkarılmasıdır. Erişim kalitesini ve yanıt doğruluğunu belirgin biçimde artırır.

## Mini Senaryo

> Vektör araması 20 belge getirir; reranker bunları puanlayıp en alakalı 3'ünü modele verir.

## 📖 Ayrıntılı Açıklama

Yeniden sıralama (reranking), bir RAG (Retrieval-Augmented Generation) hattında ilk erişim adımının (initial retrieval) döndürdüğü aday belgelerin, soruyla gerçek alaka düzeyine göre ikinci bir modelle yeniden puanlanıp sıralanması işlemidir. İlk erişim genellikle hızlı ama kaba bir yöntemdir (vektör benzerliği / vector similarity); amacı geniş bir aday havuzunu hızla daraltmaktır. Reranker ise bu havuzu daha yavaş ama çok daha isabetli bir modelle (örneğin çapraz kodlayıcı / cross-encoder) inceleyip en alakalı birkaçını öne çıkarır.

Bu iki aşamalı (two-stage) yaklaşımın önemi, hız ile doğruluk arasındaki ödünleşimi (trade-off) çözmesinden gelir. Tek başına vektör araması, anlamca yakın ama soruyu tam karşılamayan belgeleri öne taşıyabilir; çünkü soru ile belgeyi ayrı ayrı vektöre çevirir ve aralarındaki ince ilişkiyi kaçırır. Reranker, soru ile her adayı birlikte (jointly) değerlendirir; "bu belge bu soruyu gerçekten yanıtlıyor mu?" sorusunu çok daha doğru yanıtlar. Sonuçta modele verilen bağlam (context) temizlenir, gürültü azalır ve yanıt doğruluğu belirgin biçimde artar.

Nasıl çalışır: İlk erişim 20-100 aday getirir. Reranker her (soru, aday) çiftine bir alaka puanı verir. Adaylar bu puana göre yeniden sıralanır ve yalnızca en üstteki birkaçı (örneğin 3-5) üretici modele (generator) iletilir. Reranker bir çapraz kodlayıcı modeli, özel bir reranking API'si veya bir LLM olabilir.

Ne zaman kullanılır: Bilgi tabanı büyük ve gürültülü olduğunda, ilk erişimin alakasız belgeler getirdiği durumlarda, ya da bağlam penceresine (context window) sığdırılabilecek belge sayısı sınırlı olduğunda. Ne zaman gereksiz olabilir: Belge sayısı zaten azsa veya ilk erişim yeterince isabetliyse ek gecikme (latency) ve maliyet getirir.

Tuzaklar: Reranker ek gecikme ve hesaplama maliyeti ekler; aday havuzunu çok büyük tutmak yavaşlatır. Çok az aday getirilirse reranker'a şans tanınmaz (doğru belge zaten havuzda değildir). Reranker puanlarına mutlak eşik koymak yerine göreli sıralamaya güvenmek genelde daha sağlamdır.

## 🎬 Detaylı Senaryo

"HukukAsist" adlı bir startup, avukatlar için içtihat (case law) arama asistanı geliştiriyor. Binlerce mahkeme kararı bir vektör veritabanında saklanıyor.

1. Bir avukat "kira sözleşmesinde tahliye taahhüdü geçersiz sayılır mı?" sorusunu giriyor.
2. Sistem soruyu bir vektöre çevirip vektör veritabanında en yakın 20 kararı getiriyor (ilk erişim).
3. Bu 20 kararın bazıları "kira" ve "sözleşme" kelimeleri yüzünden yakın çıkıyor ama tahliye taahhüdüyle ilgisi yok.
4. Tüm 20 kararı doğrudan modele vermek hem bağlam penceresini doldurur hem de alakasız metinlerle modeli yanıltır.
5. Sistem bu 20 adayı bir reranker'a gönderiyor; reranker her kararı soruyla birlikte değerlendiriyor.
6. Reranker, tahliye taahhüdünün geçerliliğini doğrudan tartışan 3 kararı en yüksek puanla işaretliyor; yüzeysel benzeyenleri aşağı itiyor.
7. Yalnızca bu en alakalı 3 karar, üretici modele bağlam olarak veriliyor.
8. Model, temiz ve odaklı bağlamla net bir yanıt üretip ilgili kararlara atıf veriyor.
9. Avukat, alakasız metinlerle uğraşmadan doğru içtihada saniyeler içinde ulaşıyor.
10. Ekip, reranker öncesi ve sonrası yanıt doğruluğunu ölçüp belirgin iyileşmeyi raporluyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, bir çapraz kodlayıcı (cross-encoder) reranker'ın kavramsal akışını gösterir: adaylar puanlanır ve en iyileri seçilir.

```python
def yeniden_sirala(soru: str, adaylar: list[str], reranker, k: int = 3) -> list[str]:
    """Her adayı soruyla birlikte puanlayıp en alakalı k tanesini döndürür."""
    puanli = [(aday, reranker.puan(soru, aday)) for aday in adaylar]
    puanli.sort(key=lambda x: x[1], reverse=True)  # yüksek puan önce
    return [aday for aday, _ in puanli[:k]]

# İlk erişim 20 aday getirir, reranker en alakalı 3'ünü seçer:
en_iyiler = yeniden_sirala(soru, ilk_erisim_adaylari, reranker, k=3)
```

İkinci örnek, bir LLM'i reranker olarak kullanır: model adayları alaka düzeyine göre puanlar.

```python
import anthropic
client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=512,
    messages=[{"role": "user", "content":
        "Soru ve 20 belge aşağıda. Her belgeyi 0-10 arası alaka puanıyla "
        "değerlendir ve en alakalı 3 belgenin numarasını döndür.\n..."}])
# Modelin seçtiği belgeler nihai bağlam olarak üretici adıma iletilir.
```

## 🔗 İlgili Kavramlar

- [Anlamsal Bellek (Semantic Memory)](../semantic-memory/semantic-memory.md) — reranker'ın üzerinde çalıştığı yapılandırılmış bilgi kaynağı.
- [Semantik Yönlendirme (Semantic Routing)](../semantic-routing/semantic-routing.md) — anlamsal benzerlikle çalışan akraba teknik.
- Vektör Veritabanı (Vector Database) — ilk erişimi sağlayan altyapı.
- RAG (Retrieval-Augmented Generation) — reranking'in içinde yaşadığı genel hat.
- Gömme (Embedding) — ilk erişimde benzerlik için kullanılan temsiller.
- Çapraz Kodlayıcı (Cross-Encoder) — tipik reranker model mimarisi.
