# Muhakeme + Eylem (ReAct (Reasoning + Acting))

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 2. Muhakeme ve Planlama

Düşünme (reasoning) ile eylemi (acting) iç içe yürüten temel ajan paradigmasıdır. Döngü genellikle "Düşünce → Eylem → Gözlem" biçiminde işler; ajan her gözlemden sonra düşüncesini günceller.

## Mini Senaryo

> Ajan "Düşünce: fiyatı bulmalıyım → Eylem: ara → Gözlem: 120 TL → Düşünce: stok da gerek" şeklinde ilerler.

## 📖 Ayrıntılı Açıklama

ReAct (Reasoning + Acting), bir ajanın muhakemeyi (reasoning) ve eylemi (acting) tek bir döngüde iç içe yürüttüğü temel paradigmadır. Her adımda ajan önce bir "Düşünce" üretir (ne yapmalıyım?), ardından bir "Eylem" gerçekleştirir (genellikle bir araç çağırır), sonra bir "Gözlem" alır (aracın sonucu). Bu gözlem, bir sonraki düşünceyi besler ve döngü, hedefe ulaşılana kadar tekrarlanır.

Bu paradigma önemlidir çünkü saf düşünme (sadece muhakeme) modeli dış dünyadan kopuk bırakır ve uydurmaya (hallucination) açık hâle getirir; saf eylem ise körü körüne araç çağırmaya yol açar. ReAct, ikisini birleştirerek modelin her eylemin sonucuna göre planını uyarlayabilmesini sağlar. Böylece ajan, önceden bilemeyeceği bilgileri (güncel fiyat, stok, hava durumu) araçlarla edinip dinamik kararlar alır.

Çalışma biçimi modern SDK'larda araç kullanımı (tool use) ile gerçekleşir. Model, hangi aracı hangi argümanlarla çağıracağını yapılandırılmış biçimde döndürür (`tool_use`); uygulama bu aracı çalıştırıp sonucu `tool_result` olarak modele geri verir. Model bunu "gözlem" gibi değerlendirip ya yeni bir araç çağırır ya da nihai yanıtı üretir. Bu döngü, modelin `stop_reason` değeri artık araç çağrısı istemediğinde sona erer.

ReAct'i, görev dış bilgi veya eylem gerektiriyor ve adımlar önceden tam kestirilemiyorsa kullanın: arama yapan asistanlar, çok adımlı araştırma, hesap makinesi/veritabanı sorgulayan ajanlar gibi. Buna karşılık, akış tamamen önceden belliyse (sabit boru hattı) ReAct'in döngü esnekliği gereksizdir; orada basit istem zincirleme veya iş akışı daha ucuz ve öngörülebilirdir.

Tuzaklar: ajanın sonsuz döngüye girmesi veya aynı eylemi tekrarlaması, araç hatalarını düzgün yorumlayamaması, ve uzun döngülerde bağlam penceresini (context window) doldurup ana hedefi kaybetmesidir. İyi bir ReAct uygulaması; maksimum adım sınırı (max iterations), araç hatalarının modele geri bildirimi ve döngü gözlemlenebilirliği (her Düşünce-Eylem-Gözlem'i loglama) içerir.

## 🎬 Detaylı Senaryo

"FiyatBul" adlı bir alışveriş asistanı şirketinin ajanı, kullanıcıya bir ürünü en uygun fiyata bulup stok durumunu kontrol ediyor.

1. Kullanıcı "Şu kulaklığı en ucuz nereden alabilirim, stokta mı?" diye sorar.
2. Düşünce: "Önce ürünün güncel fiyatlarını aramalıyım."
3. Eylem: `fiyat_ara("kulaklık X")` aracı çağrılır.
4. Gözlem: Üç mağaza ve fiyatları döner; en düşüğü 120 TL.
5. Düşünce: "En ucuz mağazada stok var mı kontrol etmeliyim."
6. Eylem: `stok_kontrol("mağaza A", "kulaklık X")` çağrılır.
7. Gözlem: Stok yok yanıtı gelir.
8. Düşünce: "İkinci en ucuz mağazaya bakmalıyım."
9. Eylem ve Gözlem tekrarlanır; ikinci mağazada stok bulunur.
10. Ajan nihai yanıtı üretir: mağaza, fiyat ve stok bilgisini birleştirir; telemetri tüm döngüyü kaydeder.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, Düşünce→Eylem→Gözlem döngüsünü araç kullanımı (tool use) ile gösterir.

```python
import anthropic

client = anthropic.Anthropic()

araclar = [{
    "name": "fiyat_ara",
    "description": "Bir ürünün güncel fiyatını döndürür.",
    "input_schema": {"type": "object",
        "properties": {"urun": {"type": "string"}}, "required": ["urun"]},
}]

mesajlar = [{"role": "user", "content": "Kulaklık X kaç TL?"}]
resp = client.messages.create(model="claude-opus-4-8", max_tokens=1024,
                              tools=araclar, messages=mesajlar)

while resp.stop_reason == "tool_use":          # Düşünce->Eylem->Gözlem döngüsü
    arac = next(b for b in resp.content if b.type == "tool_use")
    gozlem = "120 TL"                          # gerçekte aracı çalıştır
    mesajlar += [
        {"role": "assistant", "content": resp.content},
        {"role": "user", "content": [{"type": "tool_result",
            "tool_use_id": arac.id, "content": gozlem}]},
    ]
    resp = client.messages.create(model="claude-opus-4-8", max_tokens=1024,
                                  tools=araclar, messages=mesajlar)
print(resp.content[-1].text)
```

TypeScript ile aynı döngünün özü; araç sonucu modele "gözlem" olarak geri verilir.

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

let res = await client.messages.create({
  model: "claude-opus-4-8", max_tokens: 1024,
  tools: [{ name: "fiyat_ara", description: "Fiyat döndürür.",
    input_schema: { type: "object", properties: { urun: { type: "string" } } } }],
  messages: [{ role: "user", content: "Kulaklık X kaç TL?" }],
});
// res.stop_reason === "tool_use" ise aracı çalıştır, tool_result ile döngüyü sürdür
```

## 🔗 İlgili Kavramlar

- [Plan-and-Execute (Planla-ve-Yürüt)](../plan-and-execute/plan-and-execute.md) — önce plan sonra yürütme
- [RAG (Retrieval-Augmented Generation)](../rag/rag.md) — araçla bilgi erişimi
- [Prompt Chaining (İstem Zincirleme)](../prompt-chaining/prompt-chaining.md) — sabit sıralı akış
- [Sandboxing (Korumalı Alan)](../sandboxing/sandboxing.md) — eylemleri güvenli ortamda çalıştırma
- Araç kullanımı (tool use) — modelin dış fonksiyon çağırması
