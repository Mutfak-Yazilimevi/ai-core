# Alt Ajan (Subagent)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Daha büyük bir otonom sistem veya orkestratör içinde, çok daha dar ve spesifik bir işlevi yerine getirmekle görevlendirilmiş uzman ajandır.

## Mini Senaryo

> Yalnızca PDF'lerden tablo çıkarmakla görevli bir alt ajan, daha büyük raporlama sistemi içinde çalışır.

## 📖 Ayrıntılı Açıklama

Alt ajan (subagent), daha büyük bir ajan sistemi veya orkestratör (orchestrator) içinde, dar ve iyi tanımlı tek bir işi yapmakla görevlendirilmiş uzman bir ajandır. Kendine ait sistem talimatı, araçları ve bazen kendi bağlam penceresi (context window) vardır. "Her şeyi yapan tek dev ajan" yerine, her biri kendi alanında derinleşen küçük uzmanların bir araya gelmesi fikrine dayanır.

Bu kavram önemlidir çünkü tek bir ajana çok sayıda araç ve sorumluluk yüklemek hem kararların kalitesini düşürür hem de bağlam penceresini gereksiz bilgiyle doldurur. Alt ajanlara bölmek; her birinin odağını keskinleştirir, bağlamı temiz tutar (context isolation), yeniden kullanılabilirliği artırır ve farklı alt ajanların farklı model/araç yapılandırmalarıyla optimize edilmesine olanak tanır. Bu, yazılımdaki modülerlik ilkesinin ajan mimarisindeki yansımasıdır.

Çalışma biçimi tipik olarak hiyerarşiktir: Bir orkestratör (veya ana ajan) görevi alt görevlere böler ve her birini ilgili alt ajana devreder. Alt ajan kendi görevini bağımsız olarak (kendi muhakeme döngüsü ve araçlarıyla) tamamlar, sonucu üst katmana döndürür. Önemli bir tasarım kararı, alt ajanın yalnızca işine yarayan minimum bağlamı almasıdır; bu hem maliyeti düşürür hem de kafa karışıklığını azaltır. Sonuçlar üst katmanda birleştirilir.

Alt ajan desenini, sistem birden çok farklı uzmanlık alanı içeriyorsa kullanın: bir araştırma sisteminde "arama ajanı", "özetleme ajanı", "doğrulama ajanı" gibi. Buna karşılık, görev küçük ve tek alanlıysa alt ajanlara bölmek gereksiz koordinasyon yükü, ek gecikme ve maliyet getirir; tek bir ajan daha verimlidir.

Tuzaklar: alt ajanlar arası bağlam kaybı (birinin bildiğini diğeri bilmez), her alt ajanın ayrı LLM çağrısı olması nedeniyle artan maliyet/gecikme, ve sorumluluk sınırlarının bulanık olması durumunda işlerin çakışması ya da boşta kalmasıdır. İyi bir tasarım; net görev sözleşmeleri (input/output), minimum gerekli bağlam aktarımı ve üst katmanda sağlam bir sonuç birleştirme mantığı içerir.

## 🎬 Detaylı Senaryo

"RaporZeka" adlı bir finansal analiz şirketi, kurumsal raporları işleyen bir sistemi alt ajanlarla kurguladı.

1. Ana sistem (orkestratör) 200 sayfalık bir yıllık faaliyet raporu alır.
2. Görev üç uzmanlığa bölünür: tablo çıkarma, metin özetleme, sayısal doğrulama.
3. "Tablo ajanı" yalnızca PDF'ten tabloları yapılandırılmış veriye çevirmekle görevlidir.
4. Bu alt ajana yalnızca tablo içeren sayfalar bağlam olarak verilir (minimum bağlam).
5. "Özet ajanı" metin bölümlerini alıp yönetici özeti üretir; tabloları görmez.
6. "Doğrulama ajanı", tablo ajanının çıkardığı toplamları yeniden hesaplar.
7. Doğrulama ajanı bir tutarsızlık bulur ve tablo ajanını yeniden tetikler.
8. Tablo ajanı düzeltilmiş veriyi döndürür; doğrulama bu kez geçer.
9. Orkestratör üç alt ajanın çıktısını tek bir analiz raporunda birleştirir.
10. Telemetri, her alt ajanın token tüketimini ve süresini ayrı ayrı kaydeder.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki kavramsal örnek, tek bir göreve odaklanmış bir alt ajanı tanımlar.

```python
import anthropic

client = anthropic.Anthropic()

def tablo_ajani(sayfa_metni: str) -> str:
    # Dar ve net görev: yalnızca tabloları yapılandır
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        system="Sen bir tablo çıkarma uzmanısın. Yalnızca tabloları JSON'a çevir, "
               "başka hiçbir yorum ekleme.",
        messages=[{"role": "user", "content": sayfa_metni}],
    )
    return resp.content[0].text

print(tablo_ajani("Q1 gelir 100, Q2 gelir 150 ..."))
```

TypeScript ile alt ajan, kendi dar sistem talimatıyla tanımlanır.

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

async function ozetAjani(metin: string): Promise<string> {
  const res = await client.messages.create({
    model: "claude-opus-4-8", max_tokens: 512,
    system: "Sen bir özetleme uzmanısın. Yalnızca 3 cümlelik özet üret.",
    messages: [{ role: "user", content: metin }],
  });
  return res.content[0].type === "text" ? res.content[0].text : "";
}
```

## 🔗 İlgili Kavramlar

- [Orchestrator (Orkestratör)](../orchestrator/orchestrator.md) — alt ajanları yöneten merkez
- [Plan-and-Execute (Planla-ve-Yürüt)](../plan-and-execute/plan-and-execute.md) — görevi adımlara bölme
- [Sandboxing (Korumalı Alan)](../sandboxing/sandboxing.md) — alt ajanları izole çalıştırma
- [Telemetry (Telemetri)](../telemetry/telemetry.md) — alt ajan başına performans izleme
- Bağlam izolasyonu (context isolation) — her alt ajana minimum bağlam
- Görev ayrıştırma (task decomposition) — büyük görevi parçalama
