# Akış (Streaming) (Streaming)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 11. Operasyon ve Gözlemlenebilirlik

Modelin yanıtını tamamı bitene kadar beklemeden, üretildikçe jeton jeton ileterek kullanıcıya anlık akış hâlinde sunmasıdır. Algılanan gecikmeyi (latency) azaltır ve etkileşimi canlı tutar.

## Mini Senaryo

> Ajan uzun bir raporu yazarken, kullanıcı ilk cümleleri tamamı bitmeden ekranda görmeye başlar.

## 📖 Ayrıntılı Açıklama

Akış (streaming), modelin yanıtını tümü tamamlanana kadar bekletmeden, üretildikçe parça parça (jeton jeton) istemciye iletmesidir. Geleneksel "iste-bekle-al" yaklaşımında kullanıcı tüm yanıt bitene kadar boş ekrana bakar; akışta ise ilk kelimeler saniyeler içinde belirmeye başlar. Bu, sunucu gönderimli olaylar (Server-Sent Events, SSE) gibi protokollerle gerçekleşir.

Bu teknik önemlidir çünkü algılanan gecikme (perceived latency), kullanıcı deneyiminin belirleyici unsurudur. Özellikle uzun yanıtlarda (rapor, kod, makale) toplam süre değişmese bile, kullanıcının "ilk jetona kadar geçen süre" (time to first token) kısaldığında sistem çok daha hızlı ve canlı hissettirir. Sohbet arayüzlerinin "daktilo efekti" tam olarak budur ve kullanıcının ilgisini canlı tutar, erken durdurma (cancel) imkânı sağlar.

Çalışma biçimi olay tabanlıdır. Anthropic SDK'da `client.messages.stream(...)` çağrısı bir akış nesnesi döndürür; bu nesne üzerinde metin parçaları (`text` delta'ları) ve olaylar (mesaj başı, içerik bloğu başı/sonu) yayılır. Uygulama her parçayı geldiği anda ekrana yazar veya bir WebSocket/SSE bağlantısı üzerinden ön yüze iletir. Akış bittiğinde tam mesaj nesnesi de elde edilebilir; böylece hem anlık gösterim hem de nihai işleme mümkün olur.

Akışı, kullanıcı doğrudan yanıtı bekliyorsa ve yanıt uzunsa kullanın: sohbet botları, kod üretimi, uzun metin oluşturma. Buna karşılık, yanıt arka planda işlenip bir sonraki adıma girdi olacaksa (örn. JSON'u ayrıştırıp veritabanına yazma), akış fayda sağlamaz; hatta yapılandırılmış çıktıyı parça parça işlemek hata riskini artırır. Bu durumlarda yanıtın tamamını beklemek daha basittir.

Tuzaklar: akış sırasında bağlantı kopmalarının yönetilmemesi, yarım kalan JSON'un erken ayrıştırılmaya çalışılması, ve istemci tarafında parçaların yanlış birleştirilmesidir. Ayrıca akış, ara katmanlarda (proxy, yük dengeleyici) tamponlanırsa (buffering) avantajı kaybolur. İyi bir uygulama; hata/iptal yönetimi, akış sonunda bütünlük kontrolü ve uçtan uca tamponsuz iletim içerir.

## 🎬 Detaylı Senaryo

"YazıAsistanı" adlı bir içerik üretim aracının ajanı, kullanıcılara uzun blog taslakları yazıyor.

1. Kullanıcı "Yapay zekânın eğitime etkisi üzerine 800 kelimelik bir taslak yaz" der.
2. Ön yüz, isteği akış modunda (`messages.stream`) gönderir.
3. Model ilk cümleyi üretir üretmez, parça ön yüze SSE ile iletilir.
4. Kullanıcı, yanıtın bitmesini beklemeden ilk paragrafı okumaya başlar.
5. Model metni üretmeye devam ederken ekranda "daktilo efekti" oluşur.
6. Kullanıcı ilk paragrafı beğenmeyince "Dur" butonuna basar; akış iptal edilir.
7. Yarım kalan jetonlar için maliyet, tüm yanıttan az olur (erken durdurma tasarrufu).
8. Kullanıcı istemini düzeltip yeniden gönderir; süreç tekrar akışla başlar.
9. Bu kez tüm metin akar; akış sonunda tam mesaj nesnesi saklanır.
10. Telemetri, "ilk jetona kadar süre" ve toplam token tüketimini panoya yazar.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, yanıtı jeton jeton akıtıp geldikçe ekrana yazar.

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-opus-4-8", max_tokens=1024,
    messages=[{"role": "user", "content": "Yapay zekâ üzerine kısa bir yazı yaz."}],
) as stream:
    for parca in stream.text_stream:   # her metin parçası geldikçe yaz
        print(parca, end="", flush=True)
    nihai = stream.get_final_message() # akış bitince tam mesaj
```

TypeScript ile akış olayları üzerinden parçalar dinlenir.

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

const stream = client.messages.stream({
  model: "claude-opus-4-8", max_tokens: 1024,
  messages: [{ role: "user", content: "Yapay zekâ üzerine kısa bir yazı yaz." }],
});
stream.on("text", (parca) => process.stdout.write(parca)); // her parça
const nihai = await stream.finalMessage();                 // tam mesaj
```

## 🔗 İlgili Kavramlar

- [Telemetry (Telemetri)](../telemetry/telemetry.md) — ilk jetona kadar süre ve token izleme
- [Multimodal (Çok Kipli)](../multimodal/multimodal.md) — uzun yanıtların anlık sunumu
- [ReAct (Reasoning + Acting)](../react/react.md) — adımları kullanıcıya canlı yansıtma
- Algılanan gecikme (perceived latency) — kullanıcının hissettiği hız
- Sunucu gönderimli olaylar (Server-Sent Events) — akış taşıma protokolü
