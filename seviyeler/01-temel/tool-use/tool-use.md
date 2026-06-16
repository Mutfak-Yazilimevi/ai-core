# Araç Kullanımı (Tool Use)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 5. Araç Kullanımı ve Entegrasyon

Bir ajanın görevleri tamamlayabilmek için dış dünyadaki yazılımlara, API'lere veya fonksiyonlara erişip onları çalıştırabilme yeteneğidir. Ajanı yalnızca metin üreten bir modelden gerçek dünyada eylem alabilen bir sisteme dönüştüren temel yetenektir.

## Mini Senaryo

> Ajan "bugün hava nasıl?" sorusu için bir hava durumu API'sini çağırır.

## 📖 Ayrıntılı Açıklama

Araç kullanımı (tool use), bir dil modelinin yalnızca metin üretmekle kalmayıp dış sistemlerle etkileşime geçebilmesini sağlayan yetenektir. Geliştirici, modele kullanabileceği fonksiyonların bir tanımını (isim, açıklama ve giriş şeması / input schema) verir. Model, kullanıcının isteğini değerlendirir ve bir aracın gerekli olduğuna karar verdiğinde, doğrudan cevap üretmek yerine yapılandırılmış bir "araç çağrısı" (tool call) döner. Bu çağrı, hangi aracın hangi argümanlarla çalıştırılacağını belirten bir JSON nesnesidir.

Bu yetenek önemlidir çünkü dil modellerinin bilgisi eğitim verisiyle sınırlıdır ve gerçek zamanlı, özel ya da işlemsel verilere erişimi yoktur. Araç kullanımı sayesinde model güncel hava durumunu sorgulayabilir, bir veritabanını okuyabilir, e-posta gönderebilir veya bir hesaplama servisini çağırabilir. Böylece model "ne yapılması gerektiğini" akıl yürütürken, gerçek "eylem" deterministik kodunuz tarafından gerçekleştirilir. Bu ayrım, sistemi hem daha güvenilir hem de denetlenebilir kılar.

Çalışma mantığı bir döngü (agent loop) şeklindedir: (1) modele kullanıcı mesajı ve araç tanımları gönderilir, (2) model bir araç çağrısı üretir, (3) uygulamanız bu aracı çalıştırıp sonucu (tool result) modele geri verir, (4) model bu sonucu kullanarak ya başka bir araç çağırır ya da nihai cevabı üretir. Bu döngü, görev tamamlanana kadar devam eder.

Araç kullanımı genellikle güncel/dış veri gerektiğinde, deterministik hesaplamalarda (modelin aritmetikte hata yapmasını önlemek için) ve yan etki içeren işlemlerde (kayıt oluşturma, mesaj gönderme) tercih edilir. Tamamen modelin kendi bilgisiyle yanıtlanabilecek basit sorularda ise gereksizdir.

Dikkat edilmesi gereken tuzaklar: Araç açıklamalarının belirsiz olması modelin yanlış araç seçmesine yol açar; açıklamaları net ve örnekli yazın. Modelin ürettiği argümanlara asla körü körüne güvenmeyin; özellikle silme/ödeme gibi yıkıcı işlemler için doğrulama ve guardrail ekleyin. Sonsuz döngülere karşı bir adım sınırı koyun ve araç hatalarını modele anlaşılır bir mesajla geri bildirin.

## 🎬 Detaylı Senaryo

Bir e-ticaret firması olan "TrendSepet", müşteri destek ajanına sipariş takibi yeteneği eklemek istiyor.

1. Geliştirici ekip, ajana üç araç tanımlar: `siparis_durumu_getir(siparis_no)`, `iade_baslat(siparis_no, sebep)` ve `kargo_takip(takip_no)`.
2. Müşteri sohbete "12345 numaralı siparişim nerede?" yazar.
3. Model mesajı analiz eder ve doğrudan cevap veremeyeceğini, dış veriye ihtiyaç olduğunu anlar; `siparis_durumu_getir` aracını `{"siparis_no": "12345"}` argümanıyla çağırır.
4. Uygulama bu çağrıyı yakalar, gerçek sipariş veritabanına sorgu atar ve `{"durum": "kargoda", "takip_no": "TK987"}` sonucunu modele geri döner.
5. Model bu sonucu görür ve siparişin kargoda olduğunu fark eder; daha ayrıntılı bilgi için `kargo_takip` aracını `{"takip_no": "TK987"}` ile çağırır.
6. Uygulama kargo firmasının API'sinden tahmini teslim tarihini alır ve modele iletir.
7. Model artık yeterli bilgiye sahiptir ve müşteriye doğal dilde cevap verir: "Siparişiniz şu an kargoda, tahmini teslim tarihi yarın."
8. Müşteri memnun kalır; tüm araç çağrıları ve sonuçları gözlemlenebilirlik (observability) sistemine kaydedilerek sonradan denetlenebilir hâle gelir.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki Python örneği, Anthropic SDK ile bir hava durumu aracı tanımlar ve modelin araç çağrısını döndürmesini sağlar.

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "hava_durumu_getir",
        "description": "Verilen şehir için güncel hava durumunu döndürür.",
        "input_schema": {
            "type": "object",
            "properties": {
                "sehir": {"type": "string", "description": "Şehir adı, ör. İstanbul"}
            },
            "required": ["sehir"],
        },
    }
]

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "İstanbul'da hava nasıl?"}],
)

# Model bir araç çağrısı dönerse stop_reason "tool_use" olur.
for block in resp.content:
    if block.type == "tool_use":
        print(block.name, block.input)  # ör: hava_durumu_getir {'sehir': 'İstanbul'}
```

TypeScript tarafında aynı desen şöyle kurulur:

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const res = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  tools: [
    {
      name: "hava_durumu_getir",
      description: "Verilen şehir için güncel hava durumunu döndürür.",
      input_schema: {
        type: "object",
        properties: { sehir: { type: "string" } },
        required: ["sehir"],
      },
    },
  ],
  messages: [{ role: "user", content: "İstanbul'da hava nasıl?" }],
});

console.log(res.stop_reason); // "tool_use"
```

## 🔗 İlgili Kavramlar

- [Ajan Protokolleri (Agent Protocols)](../agent-protocols/agent-protocols.md) — araçların ve sistemlerin standart şekilde konuşmasını sağlar.
- [Güvenlik Bariyerleri (Guardrails)](../guardrails/guardrails.md) — yıkıcı araç çağrılarını engellemek için kullanılır.
- [Görev Durumu (Task State)](../task-state/task-state.md) — çok adımlı araç döngülerinde ilerlemeyi takip eder.
- [Gözlemlenebilirlik (Observability)](../observability/observability.md) — araç çağrılarını izleyip hata ayıklamak için gereklidir.
- MCP (Model Context Protocol) — araçları standart bir arayüzle modele bağlayan protokoldür.
