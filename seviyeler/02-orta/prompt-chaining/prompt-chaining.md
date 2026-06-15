# İstem Zincirleme (Prompt Chaining)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 3. Bağlam ve İstem Mühendisliği

Karmaşık bir görevin, her birinin çıktısı bir sonrakinin girdisi olacak şekilde ardışık ve küçük istemlere bölünerek sırayla işletilmesidir.

## Mini Senaryo

> Önce metni çevir, sonra çeviriyi özetle, sonra özeti başlıklandır — her çıktı bir sonrakine girer.

## 📖 Ayrıntılı Açıklama

İstem zincirleme (prompt chaining), karmaşık bir görevi tek bir dev istemle çözmek yerine, her biri tek ve net bir işten sorumlu küçük istemlere (prompt) bölüp ardışık olarak çalıştırma yöntemidir. Her adımın çıktısı, bir sonraki adımın girdisi olur; böylece bir "işlem hattı" (pipeline) oluşur. Bu, yazılımdaki tek sorumluluk ilkesinin (single responsibility) istem mühendisliğindeki karşılığıdır.

Bu desen önemlidir çünkü tek devasa istemde model birçok talimatı aynı anda dengelemeye çalışır ve kalite düşer; talimatların bir kısmını gözden kaçırabilir. Görevi parçalara böldüğünüzde her adım daha güvenilir olur, ara çıktıları doğrulayabilir (gate), hata ayıklamayı kolaylaştırabilir ve gerektiğinde tek bir adımı yeniden çalıştırabilirsiniz. Ayrıca her adıma özel sistem talimatı vererek odağı keskinleştirirsiniz.

Çalışma biçimi düz ve genellikle deterministiktir: Adım 1 çalışır, çıktısı saklanır; Adım 2 bu çıktıyı girdi alır ve kendi işini yapar; bu böyle devam eder. İsteğe bağlı olarak adımlar arasına programatik doğrulama "kapıları" (validation gates) konur; bir kapı başarısız olursa zincir durdurulur veya o adım yinelenir. Bu yapı, dinamik karar veren bir ajandan farklı olarak önceden bilinen sabit bir akış izler; yani daha çok bir iş akışıdır (workflow).

İstem zincirlemeyi, görev doğal olarak sıralı alt görevlere ayrılabiliyor ve adımların sırası önceden belliyse kullanın: çevir-özetle-başlıklandır, taslak-üret-sonra-düzelt, ayıkla-sonra-sınıflandır gibi. Buna karşılık, hangi adımın çalışacağına çalışma anında karar verilmesi gerekiyorsa (dinamik dallanma), saf zincir yetersiz kalır; orada ajan veya yönlendirme (routing) mantığı gerekir.

Tuzaklar: bir adımdaki hatanın sonraki tüm adımlara yayılması (hata birikmesi), her adımın ayrı LLM çağrısı olması nedeniyle gecikme ve maliyet artışı, ve ara çıktının beklenen formatta gelmemesi durumunda zincirin kırılmasıdır. Bu yüzden ara çıktıları yapılandırılmış (örn. JSON) tutmak ve doğrulama kapıları eklemek önerilir.

## 🎬 Detaylı Senaryo

"GlobalHaber" adlı bir medya şirketinin içerik ekibi, yabancı kaynaklı haberleri Türkçeleştirip yayına hazırlıyor.

1. Editör İngilizce bir haber metnini sisteme yapıştırır.
2. Zincirin ilk adımı yalnızca çeviri yapar; sistem talimatı "akıcı Türkçeye çevir, yorum ekleme" der.
3. Çıktı (Türkçe metin) doğrulama kapısından geçer: boş mu, çok kısa mı kontrol edilir.
4. İkinci adım, Türkçe metni girdi alıp 3 cümlelik bir özet üretir.
5. Üçüncü adım özeti girdi alıp SEO uyumlu bir başlık önerir.
6. Dördüncü adım, tüm çıktıları birleştirip yayın taslağı oluşturur.
7. Herhangi bir adımda format hatası olursa zincir durur ve sadece o adım yeniden çalıştırılır.
8. Editör nihai taslağı gözden geçirip yayımlar.
9. Telemetri, her adımın token tüketimini ayrı ayrı raporlar.
10. Ekip, hangi adımın en pahalı olduğunu görüp o istemi optimize eder.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek üç adımlı bir zinciri gösterir: çevir → özetle → başlıklandır.

```python
import anthropic

client = anthropic.Anthropic()

def adim(talimat: str, girdi: str) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=512,
        system=talimat,
        messages=[{"role": "user", "content": girdi}],
    )
    return resp.content[0].text

metin = "The central bank raised interest rates today..."
ceviri = adim("Akıcı Türkçeye çevir.", metin)
ozet = adim("Bu metni 3 cümlede özetle.", ceviri)   # önceki çıktı girdi olur
baslik = adim("Bu özete kısa bir başlık öner.", ozet)
print(baslik)
```

TypeScript ile aynı zincir; her çağrının sonucu bir sonrakine beslenir.

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

async function adim(talimat: string, girdi: string): Promise<string> {
  const res = await client.messages.create({
    model: "claude-opus-4-8", max_tokens: 512,
    system: talimat,
    messages: [{ role: "user", content: girdi }],
  });
  return res.content[0].type === "text" ? res.content[0].text : "";
}

const ceviri = await adim("Akıcı Türkçeye çevir.", "The bank raised rates...");
const ozet = await adim("3 cümlede özetle.", ceviri);
console.log(await adim("Kısa başlık öner.", ozet));
```

## 🔗 İlgili Kavramlar

- [Plan-and-Execute (Planla-ve-Yürüt)](../plan-and-execute/plan-and-execute.md) — önce plan, sonra adımlar
- [Workflow vs Agent (İş Akışı / Ajan Ayrımı)](../workflow-vs-agent/workflow-vs-agent.md) — sabit akış mı dinamik karar mı
- [ReAct (Reasoning + Acting)](../react/react.md) — dinamik Düşünce-Eylem-Gözlem döngüsü
- [Orchestrator (Orkestratör)](../orchestrator/orchestrator.md) — paralel görev dağıtımı
- Doğrulama kapısı (validation gate) — adımlar arası çıktı denetimi
