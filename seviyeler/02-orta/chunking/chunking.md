# Parçalama (Chunking)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Büyük belgeleri, erişim ve gömme için anlamlı küçük parçalara bölme işlemidir. Doğru parçalama RAG kalitesini doğrudan etkiler.

## Mini Senaryo

> 200 sayfalık kılavuz, her biri tek konuya ait 500 kelimelik parçalara bölünerek aranabilir hâle gelir.

## 📖 Ayrıntılı Açıklama

Parçalama (chunking), büyük bir belgeyi gömme (embedding) ve erişim (retrieval) için anlamlı küçük birimlere bölme işlemidir. Bir dil modeli ya da gömme modeli, devasa bir belgeyi tek seferde alıp anlamlı şekilde indeksleyemez; bu yüzden metin, her biri tutarlı bir konuyu temsil eden parçalara (chunks) ayrılır. Bu parçalar tek tek vektöre dönüştürülüp vektör veritabanına (vector database) konur ve sorgu anında en alakalı parça(lar) bulunur.

Parçalama önemlidir; çünkü RAG (Retrieval-Augmented Generation) kalitesini doğrudan belirler. Parça çok büyükse, alakalı bilgi alakasız metnin içinde "boğulur" ve benzerlik araması (similarity search) zayıflar; ayrıca bağlam penceresini (context window) gereksiz doldurur. Parça çok küçükse, anlam bütünlüğü bozulur (örneğin bir cümlenin yarısı bir parçada, yarısı diğerinde kalır) ve model eksik bağlamla yanıt üretir. İyi parçalama, "tek parça = tek anlamlı fikir" dengesini kurar.

Nasıl çalışır? En basit yöntem sabit boyutlu parçalama (fixed-size chunking): metin belirli token/kelime sayısında kesilir. Daha iyisi, parçalar arasında örtüşme (overlap) bırakmaktır; böylece sınırda kalan bağlam kaybolmaz. Daha gelişmiş yöntemler ise anlamsal parçalama (semantic chunking) veya yapıya dayalı bölme (başlık, paragraf, Markdown bölümü sınırlarından kesme) kullanır. Her parçaya genellikle kaynak, başlık, sayfa gibi meta veriler (metadata) eklenir.

Ne zaman kullanılır? Belge tabanlı soru-cevap, doküman arama, bilgi tabanı (knowledge base) üzerine kurulu her RAG sisteminde gereklidir. Ne zaman gerekmez? Belge zaten bağlam penceresine rahatça sığıyorsa veya tek kısa metinle çalışıyorsanız parçalamaya gerek kalmaz.

Tuzaklar: Birincisi, içeriği anlamı bölecek noktadan kesmek (cümle ortası, tablo ortası). İkincisi, örtüşmeyi atlamak; sınır bilgisi kaybolur. Üçüncüsü, parça boyutunu gömme modelinin ideal girdi uzunluğuna ve sorgu tipine göre ayarlamamak — tek bir "doğru boyut" yoktur, veri tipine göre denenmelidir.

## 🎬 Detaylı Senaryo

Bir hukuk teknolojisi firması ("MevzuatAI"), 200 sayfalık bir vergi mevzuatı kılavuzunu chatbot'a bağlamak istiyor:

1. Ekip ham PDF'i düz metne çevirir.
2. Metni başlık ve madde sınırlarına göre bölmeye karar verir (yapısal parçalama).
3. Her maddeyi yaklaşık 500 kelimelik parçalara böler ve parçalar arasında 50 kelimelik örtüşme bırakır.
4. Her parçaya `{"kaynak": "Vergi Kılavuzu", "madde": "12/3", "sayfa": 47}` meta verisini ekler.
5. Parçaları gömme modeline verip vektörlerini vektör veritabanına yazar.
6. Kullanıcı "KDV iadesi ne zaman alınır?" diye sorar; sorgu da vektöre çevrilir.
7. Veritabanı en yakın 4 parçayı döndürür; kod bunları modele bağlam olarak besler.
8. Ekip, ilk denemede 1000 kelimelik parçaların alakasız sonuç getirdiğini görür, boyutu 500'e düşürünce isabet artar.

## 💻 Kullanım / Uygulama Örneği

Aşağıda örtüşmeli (overlap) basit bir parçalama fonksiyonu yer alır. Parçalar sonradan gömülüp aranır.

```python
def parcala(metin: str, parca_boyut: int = 500, ortusme: int = 50) -> list[str]:
    kelimeler = metin.split()
    parcalar, i = [], 0
    while i < len(kelimeler):
        parca = kelimeler[i : i + parca_boyut]
        parcalar.append(" ".join(parca))
        i += parca_boyut - ortusme  # örtüşme bırakarak ilerle
    return parcalar

parcalar = parcala(uzun_belge, parca_boyut=500, ortusme=50)
# Her parça ardından gömme modeline verilip vektör veritabanına yazılır (kavramsal).
```

İkinci olarak, yapısal bölme genelde daha iyidir: metni `\n\n` (paragraf) veya Markdown başlıklarından bölüp ardından boyut sınırını uygulamak anlam bütünlüğünü korur.

## 🔗 İlgili Kavramlar

- [Gömme / Vektör Veritabanı (Embeddings / Vector Database)](../embeddings-vector-db/embeddings-vector-db.md) — parçaların vektöre çevrilip saklandığı yer
- [RAG (Retrieval-Augmented Generation)](../../01-temel/rag/rag.md) — parçalamanın hizmet ettiği temel mimari
- [Bağlam Penceresi (Context Window)](../context-window/context-window.md) — parça boyutunu sınırlayan kapasite
- Meta Veri (Metadata) — her parçaya eklenen kaynak/sayfa bilgisi
