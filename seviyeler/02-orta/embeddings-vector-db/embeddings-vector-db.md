# Gömme / Vektör Veritabanı (Embeddings / Vector Database)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Metinleri, kodları veya belgeleri anlamsal vektörlere dönüştürüp benzerlik aramasıyla erişmeyi sağlayan, RAG'in ve uzun vadeli belleğin temel altyapısıdır.

## Mini Senaryo

> "Param geri gelir mi?" sorusu, "iade" belgesiyle anlamca eşleşip vektör veritabanından bulunur.

## 📖 Ayrıntılı Açıklama

Gömme (embedding), bir metni, kodu veya belgeyi anlamını temsil eden sayısal bir vektöre (genellikle yüzlerce-binlerce boyutlu bir sayı dizisi) dönüştürme işlemidir. Anlamca benzer içerikler, bu çok boyutlu uzayda birbirine yakın vektörlere karşılık gelir. Vektör veritabanı (vector database) ise bu vektörleri saklayan ve bir sorgu vektörüne en yakın olanları hızla bulan (benzerlik araması / similarity search) özel bir veri deposudur.

Bu ikili önemlidir; çünkü RAG'in (Retrieval-Augmented Generation) ve ajanların uzun vadeli belleğinin (long-term memory) temel altyapısıdır. Klasik anahtar kelime aramasının aksine, gömme tabanlı arama anlamsal eşleşme yapar: "Param geri gelir mi?" sorusu, hiç "param" kelimesi geçmese bile "iade politikası" belgesiyle eşleşebilir; çünkü vektörleri anlamca yakındır.

Nasıl çalışır? Önce belgeler parçalara (chunks) bölünür. Her parça bir gömme modeline verilerek vektöre dönüştürülür ve vektör veritabanına meta verisiyle (metadata) birlikte yazılır (indeksleme). Sorgu anında kullanıcının sorusu aynı modelle vektöre çevrilir; veritabanı kosinüs benzerliği (cosine similarity) gibi bir ölçütle en yakın K parçayı (top-K) döndürür. Bu parçalar modele bağlam olarak beslenir.

Ne zaman kullanılır? Büyük bilgi tabanları, doküman arama, anlamsal öneri ve ajan belleği gerektiren her durumda. Ne zaman gerekmez? Veri küçük ve doğrudan bağlam penceresine (context window) sığıyorsa veya kesin anahtar kelime/SQL eşleşmesi yeterliyse vektör altyapısı fazladan karmaşıklıktır.

Tuzaklar: Birincisi, sorgu ve belgeleri farklı gömme modelleriyle vektörlemek — uzaylar uyuşmaz, arama bozulur. İkincisi, kötü parçalama; anlamı bölünmüş parçalar zayıf vektör üretir. Üçüncüsü, sadece benzerliğe güvenip meta veri filtresi (örn. tarih, dil, erişim yetkisi) kullanmamak; alakasız ama "benzer" sonuçlar gelebilir. Dördüncüsü, top-K'yi çok büyük tutup bağlamı gereksiz doldurmak.

## 🎬 Detaylı Senaryo

Bir SaaS firması ("DestekHub") müşteri destek dokümanlarını arayan bir asistan kurar:

1. Ekip yardım merkezindeki 800 makaleyi parçalara böler.
2. Her parçayı bir gömme modeliyle vektöre çevirir.
3. Vektörleri, her birine `{"makale_id": ..., "dil": "tr", "kategori": "faturalama"}` meta verisiyle vektör veritabanına yazar.
4. Müşteri "Aboneliğimi iptal edersem param geri yatar mı?" diye sorar.
5. Soru aynı gömme modeliyle vektöre çevrilir.
6. Veritabanı, "dil=tr" filtresiyle en yakın 4 parçayı döndürür; bunların arasında hiç "param" geçmeyen "İptal ve İade Politikası" makalesi de vardır.
7. Bu 4 parça modele bağlam olarak verilir ve doğru, kaynaklı bir yanıt üretilir.
8. Ekip, top-K'yi 10'dan 4'e düşürünce yanıtların hem daha hızlı hem daha isabetli olduğunu görür.

## 💻 Kullanım / Uygulama Örneği

Aşağıda kavramsal akış görülür: belgeler vektöre çevrilir (gömme), sorguya en yakın parçalar bulunur (benzerlik), ardından Anthropic SDK ile bağlama dayalı yanıt üretilir.

```python
import anthropic

client = anthropic.Anthropic()

# 1) İndeksleme (kavramsal): her parça bir gömme modeliyle vektöre çevrilip
#    vektör veritabanına yazılır -> db.add(vektor=embed(parca), metin=parca)
# 2) Sorgu anında: soru vektöre çevrilir, en yakın parçalar getirilir
soru = "Aboneliğimi iptal edersem param geri gelir mi?"
en_yakin_parcalar = vektor_db.ara(embed(soru), top_k=4)   # benzerlik araması
baglam = "\n\n".join(en_yakin_parcalar)

# 3) Getirilen bağlamı modele besle
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    messages=[{"role": "user",
               "content": f"Aşağıdaki belgelere dayanarak yanıtla:\n{baglam}\n\nSoru: {soru}"}])
print(next(b.text for b in resp.content if b.type == "text"))
```

İkinci olarak, meta veri filtresiyle aramayı daraltmak (örn. yalnızca `dil="tr"` parçaları) hem isabeti hem güvenliği artırır.

## 🔗 İlgili Kavramlar

- [Parçalama (Chunking)](../chunking/chunking.md) — vektöre çevrilmeden önce belgeyi bölme
- [RAG (Retrieval-Augmented Generation)](../rag/rag.md) — gömme + arama + üretimin birleşimi
- [Bağlam Penceresi (Context Window)](../context-window/context-window.md) — getirilen parçaların sığması gereken sınır
- Benzerlik Araması (Similarity Search) — en yakın vektörleri bulma yöntemi
- Uzun Vadeli Bellek (Long-term Memory) — ajanın bilgi sakladığı kalıcı katman
