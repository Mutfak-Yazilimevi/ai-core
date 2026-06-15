# Retrieval-Augmented Generation (RAG)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Dil modelinin ürettiği yanıtları sağlam temellere oturtmak için dışarıdan (örn. şirket veritabanından) dinamik olarak bilgi çekip modele besleme yöntemidir. Model, eğitiminde olmayan güncel veya özel bilgilere de erişebilir.

## Mini Senaryo

> Ajan "iade politikamız nedir?" sorusuna, şirketin güncel politika belgesini çekip ona göre yanıt verir.

## 📖 Ayrıntılı Açıklama

Erişimle güçlendirilmiş üretim (Retrieval-Augmented Generation, RAG), dil modelinin yanıt üretmeden önce dış bir bilgi kaynağından ilgili bağlamı (context) çekip bunu isteme ekleme yöntemidir. Model böylece yalnızca eğitim verisindeki "ezberlediği" bilgiye değil, güncel ve özel (örn. şirket içi) belgelere de dayanarak yanıt verir. Temel akış üç adımdır: erişim (retrieve), zenginleştirme (augment), üretim (generate).

Bu teknik önemlidir çünkü dil modelleri belli bir tarihe kadar eğitilir ve özel kurumsal verilere erişimleri yoktur; bu da güncel olmayan veya uydurma (hallucination) yanıtlara yol açar. RAG, yanıtı somut kaynaklara dayandırarak doğruluğu artırır, kaynak gösterme (citation) imkânı sağlar ve modeli yeniden eğitmeden (fine-tuning olmadan) bilgi tabanını güncel tutmayı mümkün kılar. Bu, maliyet ve esneklik açısından büyük avantajdır.

Çalışma biçimi tipik olarak şöyledir: belgeler parçalara (chunk) bölünür, her parça bir gömme (embedding) vektörüne dönüştürülüp bir vektör veritabanında (vector store) saklanır. Kullanıcı sorusu geldiğinde, soru da vektöre çevrilir ve en benzer parçalar anlamsal arama (semantic search) ile bulunur. Bu parçalar isteme bağlam olarak eklenir; model yalnızca verilen bağlama dayanarak yanıt üretir. Anahtar kelime araması, melez (hybrid) arama veya yeniden sıralama (re-ranking) ile erişim kalitesi artırılabilir.

RAG'i, yanıtların güncel, doğrulanabilir veya kuruma özgü bilgiye dayanması gerektiğinde kullanın: müşteri destek botları, iç politika sorgulama, teknik dokümantasyon asistanları gibi. Buna karşılık, soru genel bilgi gerektiriyorsa veya hiç dış kaynak yoksa RAG gereksiz karmaşıklık ekler; ayrıca bilgi tabanı kalitesizse RAG de kalitesiz yanıt üretir ("çöp girer, çöp çıkar").

Tuzaklar: alakasız parçaların çekilip modeli yanıltması, parçalama (chunking) stratejisinin kötü olması nedeniyle bağlamın kopması, bağlam penceresinin (context window) gereğinden fazla doldurulması ve modelin verilen bağlamı yok sayıp yine de uydurma yapmasıdır. İyi bir RAG sistemi; kaliteli parçalama, isabetli erişim, kaynak gösterimi ve "bağlamda yoksa bilmiyorum de" talimatı içerir.

## 🎬 Detaylı Senaryo

"YardımMerkezi" adlı bir SaaS şirketi, müşteri destek ajanını RAG ile güncel politika belgelerine bağladı.

1. Müşteri "Aboneliğimi iptal edersem para iadesi alır mıyım?" diye sorar.
2. Sistem soruyu bir gömme vektörüne dönüştürür.
3. Vektör veritabanında en benzer 4 politika parçası anlamsal arama ile bulunur.
4. Bulunan parçalar yeniden sıralanır; en alakalı 2'si seçilir.
5. Bu parçalar, modelin isteminde "bağlam" bölümü olarak eklenir.
6. Modele "yalnızca verilen bağlama dayan, yoksa bilmiyorum de" talimatı verilir.
7. Model, güncel iade politikasına dayanarak net bir yanıt üretir.
8. Yanıtın altına kaynak belge bağlantısı (citation) eklenir.
9. Müşteri yanıtı görür; belirsizlik kalırsa kaynağa tıklayabilir.
10. Telemetri, hangi belgelerin sık çekildiğini izleyip bilgi tabanı boşluklarını raporlar.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, dış kaynaktan çekilen bağlamı modele besleyen basit bir RAG akışını gösterir.

```python
import anthropic

client = anthropic.Anthropic()

def cek(soru: str) -> str:
    # Gerçekte: vektör veritabanından anlamsal arama ile parça çek
    return "İade politikası: İlk 14 gün içinde tam iade yapılır."

def yanitla(soru: str) -> str:
    baglam = cek(soru)
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=512,
        system="Yalnızca verilen bağlama dayan. Bağlamda yoksa 'bilmiyorum' de.",
        messages=[{"role": "user",
                   "content": f"Bağlam:\n{baglam}\n\nSoru: {soru}"}],
    )
    return resp.content[0].text

print(yanitla("İade alabilir miyim?"))
```

TypeScript ile aynı desen; bağlam istemin içine yerleştirilir.

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

async function yanitla(soru: string, baglam: string): Promise<string> {
  const res = await client.messages.create({
    model: "claude-opus-4-8", max_tokens: 512,
    system: "Yalnızca verilen bağlama dayan. Yoksa 'bilmiyorum' de.",
    messages: [{ role: "user", content: `Bağlam:\n${baglam}\n\nSoru: ${soru}` }],
  });
  return res.content[0].type === "text" ? res.content[0].text : "";
}
```

## 🔗 İlgili Kavramlar

- [Multimodal (Çok Kipli)](../multimodal/multimodal.md) — görüntü/PDF'ten bağlam çıkarma
- [Prompt Chaining (İstem Zincirleme)](../prompt-chaining/prompt-chaining.md) — çekilen bağlamı işleyip zincire sokma
- [ReAct (Reasoning + Acting)](../react/react.md) — araçla dinamik bilgi erişimi
- Gömme (embedding) — metni anlamsal vektöre çevirme
- Vektör veritabanı (vector store) — benzerlik aramasıyla parça saklama
- Anlamsal arama (semantic search) — anlama dayalı erişim
