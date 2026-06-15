# Fonksiyon Çağırma (Function Calling)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 5. Araç Kullanımı ve Entegrasyon

Bir dil modelinin harici bir API'yi tetiklemek için gerekli yapılandırılmış veriyi (örn. JSON parametreleri) doğru formatta üretebilme yeteneğidir. Tool Use'un yapısal ve kesin biçimidir.

## Mini Senaryo

> Ajan, hava durumu için {"city":"İstanbul"} JSON'unu kesin formatta üretip fonksiyonu çağırır.

## 📖 Ayrıntılı Açıklama

Fonksiyon çağırma (function calling), bir dil modelinin harici bir aracı/API'yi tetiklemek için gerekli yapılandırılmış veriyi (genellikle bir JSON parametre nesnesi) doğru ve kesin formatta üretebilme yeteneğidir. Model fonksiyonu kendisi çalıştırmaz; "şu aracı şu argümanlarla çağır" niyetini yapısal biçimde ifade eder, çalıştırmayı uygulama kodu (harness) yapar. Bu, araç kullanımının (tool use) yapısal ve sözleşmeye bağlı biçimidir.

Bu yetenek önemlidir; çünkü dil modelini "metin üreten bir kutu"dan, gerçek dünyada eylem yapabilen (veritabanı sorgulama, e-posta gönderme, hesaplama) bir ajana dönüştürür. Modelin serbest metin yerine makine tarafından ayrıştırılabilir (parse edilebilir) bir çıktı vermesi, sistem entegrasyonunu güvenilir kılar — kodun çıktıyı tahmin ederek ayrıştırmasına gerek kalmaz.

Nasıl çalışır? Geliştirici, modele araçların tanımını (`tools`): adı, açıklaması ve giriş şemasını (input schema, JSON Schema) verir. Model bir aracı kullanmaya karar verirse `tool_use` durdurma nedeniyle (stop reason) durur ve şemaya uygun argümanları içeren bir blok döndürür. Kod aracı çalıştırır, sonucu `tool_result` olarak konuşmaya geri ekler ve modeli tekrar çağırır (araç kullanım döngüsü / tool use loop). Bu, ajan döngüsünün temel yapı taşıdır.

Ne zaman kullanılır? Modelin gerçek zamanlı veriye erişmesi, hesap yapması veya bir sistemde işlem yapması gerektiğinde. Ne zaman gerekmez? Saf metin üretimi, özetleme veya açıklama gibi dış veri gerektirmeyen görevlerde araç tanımlamak gereksiz maliyettir.

Tuzaklar: Birincisi, belirsiz araç açıklaması; model aracı yanlış zamanda veya yanlış argümanla çağırır — açıklama "ne yapar ve ne zaman çağrılmalı" sorularını net yanıtlamalıdır. İkincisi, asistanın `tool_use` blokunu geçmişe eklemeden sadece sonucu eklemek; konuşma bozulur. Üçüncüsü, araç sonucunu doğrulamadan güvenmek; harici API hata verebilir, modele bunu da bildirmek gerekir.

## 🎬 Detaylı Senaryo

Bir seyahat platformu ("UçuşBul") asistanına anlık fiyat sorgulama yeteneği ekler:

1. Geliştirici `ucus_ara` aracını tanımlar: girişi `{kalkis, varis, tarih}` olan bir JSON şeması.
2. Kullanıcı yazar: "Yarın İstanbul'dan İzmir'e en ucuz uçuş ne?"
3. Model, doğal dili çözümleyip `ucus_ara` aracını `{"kalkis": "IST", "varis": "ADB", "tarih": "2026-06-16"}` argümanlarıyla çağırmaya karar verir (`tool_use`).
4. Harness bu JSON'u alır, gerçek uçuş API'sine sorgu atar.
5. API `{"fiyat": 850, "saat": "09:30"}` döndürür; kod bunu `tool_result` olarak konuşmaya ekler.
6. Model sonucu okur ve doğal dilde yanıtlar: "Yarın 09:30 kalkışlı uçuş 850 TL."
7. Kullanıcı "tarihi yanlış yazdım, ayın 20'si" derse, model aynı aracı yeni argümanla tekrar çağırır.
8. Ekip, araç açıklamasını "Yalnızca kullanıcı net bir tarih verdiğinde çağır" diye netleştirerek hatalı çağrıları azaltır.

## 💻 Kullanım / Uygulama Örneği

Aşağıda `tools` parametresiyle araç tanımı ve `tool_use` döngüsü yer alır: model aracı çağırır, kod çalıştırıp sonucu geri besler.

```python
import anthropic

client = anthropic.Anthropic()
tools = [{
    "name": "hava_durumu",
    "description": "Bir şehrin güncel hava durumunu getirir. Kullanıcı hava/sıcaklık sorduğunda çağır.",
    "input_schema": {
        "type": "object",
        "properties": {"sehir": {"type": "string", "description": "Şehir adı, örn. İstanbul"}},
        "required": ["sehir"],
    },
}]
messages = [{"role": "user", "content": "İstanbul'da hava nasıl?"}]

resp = client.messages.create(model="claude-opus-4-8", max_tokens=1024, tools=tools, messages=messages)

if resp.stop_reason == "tool_use":
    messages.append({"role": "assistant", "content": resp.content})  # tool_use blokunu koru
    sonuclar = []
    for b in resp.content:
        if b.type == "tool_use":
            # b.input -> {"sehir": "İstanbul"} : aracı burada gerçekten çalıştırın
            sonuclar.append({"type": "tool_result", "tool_use_id": b.id, "content": "22°C, parçalı bulutlu"})
    messages.append({"role": "user", "content": sonuclar})
    final = client.messages.create(model="claude-opus-4-8", max_tokens=1024, tools=tools, messages=messages)
    print(next(b.text for b in final.content if b.type == "text"))
```

İkinci olarak, TypeScript'te de aynı sözleşme geçerlidir:

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();
const res = await client.messages.create({
  model: "claude-opus-4-8", max_tokens: 1024,
  tools: [{
    name: "hava_durumu",
    description: "Bir şehrin hava durumunu getirir.",
    input_schema: { type: "object", properties: { sehir: { type: "string" } }, required: ["sehir"] },
  }],
  messages: [{ role: "user", content: "Ankara'da hava nasıl?" }],
});
// res.stop_reason === "tool_use" ise araç çağrısını çalıştırıp sonucu geri besleyin.
```

## 🔗 İlgili Kavramlar

- [Ajan Döngüsü (Agent Loop)](../agent-loop/agent-loop.md) — tool_use sonuçlarının geri beslendiği çevrim
- [Model Context Protocol (MCP)](../mcp/mcp.md) — araçları standart bir arabirimle sunma protokolü
- [Ajan Boru Hattı (Agentic Pipeline)](../agentic-pipeline/agentic-pipeline.md) — yapısal çıktının aşamalar arası akışı
- [En Az Yetki (Least Privilege)](../least-privilege/least-privilege.md) — araçlara dar kapsamlı erişim verme
- Yapısal Çıktı (Structured Output) — JSON Schema'ya uygun veri üretimi
