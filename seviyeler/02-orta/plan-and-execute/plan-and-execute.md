# Planla-ve-Yürüt (Plan-and-Execute)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 2. Muhakeme ve Planlama

Ajanın önce yüksek seviyeli bir plan çıkarması, ardından bu planın adımlarını sırayla uygulamasıdır. Planlama ve yürütmeyi ayırarak uzun görevlerde tutarlılığı artırır.

## Mini Senaryo

> Ajan önce "tatil planı: uçuş, otel, araç" adımlarını listeler, sonra her birini sırayla rezerve eder.

## 📖 Ayrıntılı Açıklama

Planla-ve-yürüt (plan-and-execute), bir ajanın görevi tek adımda çözmeye çalışmak yerine önce bütünsel bir plan üretmesi, ardından bu planın adımlarını ayrı bir yürütme aşamasında uygulamasıdır. Planlayıcı (planner) "ne yapılacak?" sorusuna; yürütücü (executor) ise "her adımı nasıl yapacağız?" sorusuna odaklanır. Bu ayrım, modelin tüm muhakeme yükünü her adımda yeniden taşımasını engeller ve uzun görevlerde yön kaybını azaltır.

Bu desen önemlidir çünkü saf ReAct gibi adım-adım yaklaşımlarda ajan, uzun görevlerde sık sık ana hedefi unutabilir veya gereksiz döngülere girebilir. Önceden çıkarılmış açık bir plan, hem ajana bir "pusula" sağlar hem de insan denetimine (human-in-the-loop) uygun bir kontrol noktası sunar: plan onaylanmadan yürütme başlamaz. Bu, özellikle maliyetli veya geri alınamaz eylemler içeren iş akışlarında güvenlik katmanı oluşturur.

Çalışma biçimi iki fazlıdır. Birinci fazda model, hedefi alt adımlara böler ve sıralı/koşullu bir plan üretir (genellikle yapılandırılmış JSON olarak). İkinci fazda bir yürütme döngüsü her adımı sırayla çalıştırır; gerektiğinde araç (tool) çağırır. Gelişmiş varyantlarda yürütme sırasında beklenmedik bir gözlem oluşursa plan yeniden gözden geçirilir (re-planning); bu, statik plan ile dinamik uyum arasında denge kurar.

Bu yaklaşımı, görev çok adımlı, adımlar arası bağımlılık net ve önceden öngörülebilirse kullanın: rapor üretimi, veri taşıma boru hatları (pipelines), seyahat planlama gibi. Buna karşılık, ortam çok değişkense ve her adım bir öncekinin sonucuna kökten bağlıysa katı bir ön plan kırılgan olur; bu durumlarda ReAct ya da yeniden planlama yeteneği şarttır.

Tuzaklar: planın baştan eksik/yanlış olması durumunda tüm yürütmenin bozulması, yürütme sırasında değişen koşullara uyum sağlayamama ve planın gereğinden ayrıntılı olup esnekliği öldürmesidir. İyi bir tasarım; plan doğrulama, adım başına hata yönetimi ve gerektiğinde yeniden planlama tetikleyicisi içerir.

## 🎬 Detaylı Senaryo

"DataKöprü" adlı bir veri danışmanlığı şirketinin ajanı, müşteri için aylık satış raporu hazırlıyor.

1. Kullanıcı "Mayıs ayı satış raporunu hazırla ve PDF olarak gönder" der.
2. Planlayıcı faz, hedefi adımlara böler: veri çek, temizle, özetle, grafik üret, PDF derle, e-posta gönder.
3. Plan, yapılandırılmış JSON olarak üretilir ve ekip liderine onaya sunulur.
4. Lider, "e-posta gönder" adımını "taslak olarak kaydet" şeklinde değiştirir; geri kalan plan onaylanır.
5. Yürütücü faz başlar; ilk adımda veritabanından mayıs verisi çekilir.
6. Temizleme adımında eksik satırlar tespit edilir; bu adım bir araç çağrısıyla tamamlanır.
7. Özetleme ve grafik adımları sırayla çalışır; her adımın çıktısı bir sonrakine girer.
8. PDF derleme adımı önceki tüm çıktıları birleştirir.
9. Son adım e-postayı gönder yerine taslak olarak kaydeder (plandaki değişiklik gereği).
10. Telemetri, her adımın süresini ve token tüketimini kaydeder.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, önce yapılandırılmış bir plan üretip ardından adımları sırayla yürütür.

```python
import anthropic, json

client = anthropic.Anthropic()

def plan_uret(hedef: str) -> list[str]:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        system="Hedefi sıralı adımlara böl. Yalnızca JSON dizi döndür.",
        messages=[{"role": "user", "content": hedef}],
    )
    return json.loads(resp.content[0].text)

def adim_yurut(adim: str) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=512,
        messages=[{"role": "user", "content": f"Şu adımı uygula: {adim}"}],
    )
    return resp.content[0].text

plan = plan_uret("Mayıs satış raporu hazırla")
for adim in plan:               # Yürütme fazı: her adımı sırayla işle
    print(adim, "->", adim_yurut(adim))
```

TypeScript ile plan ve yürütme fazları aynı şekilde ayrılır.

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

async function planUret(hedef: string): Promise<string[]> {
  const res = await client.messages.create({
    model: "claude-opus-4-8", max_tokens: 1024,
    system: "Hedefi sıralı adımlara böl. Yalnızca JSON dizi döndür.",
    messages: [{ role: "user", content: hedef }],
  });
  return JSON.parse(res.content[0].type === "text" ? res.content[0].text : "[]");
}

const plan = await planUret("Mayıs satış raporu hazırla");
for (const adim of plan) console.log("Yürütülüyor:", adim);
```

## 🔗 İlgili Kavramlar

- [ReAct (Reasoning + Acting)](../react/react.md) — adım-adım dinamik muhakeme
- [Orchestrator (Orkestratör)](../orchestrator/orchestrator.md) — alt görevleri dağıtıp birleştirme
- [Prompt Chaining (İstem Zincirleme)](../prompt-chaining/prompt-chaining.md) — çıktıyı bir sonraki adıma besleme
- [Workflow vs Agent (İş Akışı / Ajan Ayrımı)](../workflow-vs-agent/workflow-vs-agent.md) — sabit akış mı dinamik karar mı
- Yeniden planlama (re-planning) — yürütme sırasında planı güncelleme
