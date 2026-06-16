# Temel Model (Foundation Model)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 1. Temeller ve Çalışma Modeli

Geniş ve genel veriyle önceden eğitilmiş; üzerine ince ayar (fine-tuning) veya istem mühendisliği uygulanarak çeşitli görevlere uyarlanabilen büyük taban modeldir. Ajanın "beyni" bu modeldir.

## Mini Senaryo

> Aynı temel model, farklı istemlerle hem müşteri destek hem de kod yazma ajanına dönüştürülür.

## 📖 Ayrıntılı Açıklama

Temel Model (Foundation Model), internet ölçeğinde, geniş ve genel veri üzerinde kendinden gözetimli (self-supervised) yöntemlerle önceden eğitilmiş (pre-trained) büyük bir yapay zekâ modelidir. "Temel" sözcüğü, bu modelin tek bir göreve adanmamış olmasından; aksine sayısız farklı görevin üzerine inşa edilebileceği bir taban (foundation) sağlamasından gelir. Büyük dil modelleri (Large Language Models, LLM) bu kategorinin en yaygın örneğidir.

Önemi, tek bir modelin yeniden eğitilmeden çok sayıda göreve uyarlanabilmesinde yatar. Geçmişte her görev (çeviri, özetleme, sınıflandırma) için ayrı model eğitmek gerekirdi. Temel modeller ise istem mühendisliği (prompt engineering), ince ayar (fine-tuning) ya da bağlam içi öğrenme (in-context learning) ile çeşitlendirilir. Bir ajan mimarisinde bu model, muhakeme ve karar verme yapan "beyin" rolündedir.

Çalışma biçimi temelde bir sonraki jetonu (token) tahmin etmeye dayanır: Model, devasa metin korpusunda istatistiksel örüntüleri öğrenir ve verilen bağlamı (context) izleyen en olası devamı üretir. Eğitimden sonra genellikle bir hizalama (alignment) aşaması — insan geri bildirimiyle pekiştirmeli öğrenme (RLHF) gibi — modelin yararlı, zararsız ve dürüst olmasını sağlar.

Temel modeller, esnekliğin ve hızlı prototiplemenin gerektiği hemen her doğal dil görevi için kullanılır. Buna karşılık çok dar, yüksek hassasiyetli ve düşük gecikme gerektiren bir görevde (örneğin saniyede milyonlarca basit sınıflandırma) küçük ve özel bir model daha ekonomik olabilir. Ayrıca gizlilik kısıtları nedeniyle veri dışarı çıkamıyorsa kendi altyapısında çalışabilen daha küçük modeller tercih edilebilir.

Dikkat edilmesi gereken tuzaklar: Modelin bir bilgi kesim tarihi (knowledge cutoff) vardır ve sonrasını bilmez; bu yüzden güncel veri için geri getirmeli üretim (Retrieval-Augmented Generation, RAG) gerekir. Modeller halüsinasyon (hallucination) üretebilir, eğitim verisindeki önyargıları (bias) yansıtabilir ve kapalı kaynak modeller sağlayıcı bağımlılığı (vendor lock-in) yaratabilir.

## 🎬 Detaylı Senaryo

"FinansPro" adlı bir fintech ekibi, tek bir temel modeli iki farklı ürüne dönüştürmek ister:

1. Ekip, bulut sağlayıcı üzerinden aynı temel modele (örneğin `claude-opus-4-8`) API erişimi alır.
2. İlk ürün için müşteri destek ajanı kurarlar; sadece sistem istemini "Sen sabırlı bir banka destek asistanısın, finansal tavsiye verme" diye ayarlarlar.
3. İkinci ürün için aynı modeli, "Sen bir Python kod incelemecisisin, güvenlik açıklarını işaretle" sistem istemiyle bir kod inceleme ajanına dönüştürürler.
4. Hiçbir model yeniden eğitilmez; yalnızca istemler ve sağlanan araçlar (tools) farklıdır.
5. Destek ajanının doğruluğunu artırmak için şirket içi SSS dokümanlarını RAG ile bağlama eklerler.
6. Kod ajanının belirli kurum stiline uyması için birkaç örnek (few-shot) istemde gösterilir.
7. Maliyeti düşürmek için sık tekrarlanan sistem istemine istem önbellekleme (prompt caching) uygularlar.
8. Sonuç: Tek temel model, iki bağımsız ürünün ortak beyni olur ve bakım maliyeti tek noktada toplanır.

## 💻 Kullanım / Uygulama Örneği

Aynı temel modelin sadece sistem istemiyle iki farklı role büründüğünü gösteren örnek:

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY ortamdan okunur

def cagir(sistem_istemi: str, kullanici: str) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        system=sistem_istemi,
        messages=[{"role": "user", "content": kullanici}],
    )
    return resp.content[0].text

destek = cagir("Sen bir banka destek asistanısın.", "Kartım çalışmıyor")
kod = cagir("Sen bir Python kod incelemecisisin.", "def f(x): return x/0")
print(destek, kod)
```

TypeScript ile aynı taban modele tek bir istek:

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();
const res = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  system: "Sen yardımsever bir asistansın.",
  messages: [{ role: "user", content: "Temel model nedir?" }],
});
console.log(res.content[0].type === "text" ? res.content[0].text : "");
```

## 🔗 İlgili Kavramlar

- [Ajan (Agent)](../agent/agent.md) — temel modeli beyni olarak kullanan sistem
- [Jetonlar / Jetonlaştırma (Tokens / Tokenization)](../tokens-tokenization/tokens-tokenization.md) — modelin işlediği birimler
- [Sistem İstemi (System Prompt)](../system-prompt/system-prompt.md) — modeli farklı rollere uyarlar
- İnce Ayar (Fine-tuning) — modeli özel görevlere özelleştirme
- Geri Getirmeli Üretim (RAG) — güncel/özel bilgiyle modeli zenginleştirme
- Bağlam İçi Öğrenme (In-context Learning) — istemdeki örneklerle uyum sağlama
