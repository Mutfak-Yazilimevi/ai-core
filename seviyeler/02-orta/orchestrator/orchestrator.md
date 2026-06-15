# Orkestratör (Orchestrator)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Birden fazla uzmanlaşmış ajanı yöneten; onların görevlerini ve aralarındaki bilgi akışını koordine eden merkezî sistemdir. Hangi alt ajanın ne zaman çalışacağına karar verir, çıktıları toplar ve nihai sonucu birleştirir.

## Mini Senaryo

> Orkestratör, bir seyahat talebini uçuş, otel ve araç ajanlarına dağıtıp sonuçları tek planda birleştirir.

## 📖 Ayrıntılı Açıklama

Orkestratör (orchestrator), çoklu ajan sistemlerinde "şef" rolünü üstlenen merkezî bileşendir. Tek bir büyük problemi alt görevlere böler, her alt görevi en uygun uzman alt ajana (subagent) atar, onların çıktılarını toplar ve nihai bir sonuçta birleştirir. Bu desen, "böl ve yönet" (divide and conquer) mantığının ajan dünyasındaki karşılığıdır ve karmaşıklığı yönetilebilir parçalara indirir.

Orkestratör önemlidir çünkü tek bir ajanın her şeyi yapmasını beklemek hem bağlam penceresini (context window) zorlar hem de uzmanlaşmadan kaynaklanan kalite kaybına yol açar. Görevleri ayırarak her alt ajan kendi dar alanında daha doğru ve hızlı çalışır; orkestratör ise koordinasyon, sıralama, paralelleştirme ve hata yönetimine odaklanır. Bu mimari aynı zamanda gözlemlenebilirliği (observability) artırır: hangi alt ajanın ne kadar sürede ne ürettiği net biçimde izlenebilir.

Çalışma biçimi genellikle şöyledir: orkestratör, kullanıcı isteğini analiz eder ve bir görev planı oluşturur. Bağımsız alt görevleri paralel, bağımlı olanları sıralı çalıştırır. Her alt ajandan dönen sonucu doğrular; eksik veya çelişkili veri varsa yeniden dener ya da farklı bir alt ajana yönlendirir. Son adımda bütün parçaları tutarlı bir yanıtta sentezler. Orkestratörün kendisi de bir LLM tarafından yönlendirilebilir veya deterministik kodla yazılabilir.

Orkestratör desenini, görev gerçekten birbirinden ayrılabilir uzmanlık alanlarına bölünüyorsa kullanın (seyahat planlama, çok kaynaklı araştırma, kod tabanını birden çok dosyada tarama gibi). Buna karşılık, problem küçük ve tek akışlıysa orkestratör gereksiz karmaşıklık (overhead) ekler; tek bir ajan veya basit bir iş akışı (workflow) daha verimlidir.

Tuzaklar: alt ajanlar arasında bağlam kaybı (her alt ajan diğerinin ne yaptığını bilmez), maliyetin katlanması (her alt ajan ayrı LLM çağrısı), ve orkestratörün hatalı görev dağıtımıyla sonsuz döngüye girmesi. İyi bir orkestratör; net görev sözleşmeleri, zaman aşımı (timeout), yeniden deneme sınırları ve toplama mantığı içermelidir.

## 🎬 Detaylı Senaryo

"GeziAsistan" adlı bir seyahat teknolojisi şirketi, kullanıcı taleplerini tek bir orkestratör üzerinden yönetiyor.

1. Kullanıcı "15 Temmuz'da İstanbul'dan Roma'ya 4 günlük tatil planla" der.
2. Orkestratör isteği ayrıştırır ve üç bağımsız alt görev belirler: uçuş, otel, araç kiralama.
3. Uçuş ajanı ve otel ajanı paralel çalıştırılır; ikisi de aynı tarih aralığını kullanır.
4. Uçuş ajanı varış saatini döndürür; orkestratör bu bilgiyi araç ajanına bağımlılık olarak geçirir.
5. Araç ajanı, uçuşun iniş saatinden sonra teslim alınabilecek araçları arar.
6. Otel ajanı havaalanına yakınlık kriterini kullanarak üç seçenek üretir.
7. Orkestratör çıktıları doğrular: toplam bütçe kullanıcı limitini aşıyor mu kontrol eder.
8. Bütçe aşılınca otel ajanını daha ucuz seçenekler için yeniden tetikler.
9. Tüm parçaları tek bir tutarlı tatil planında birleştirir ve maliyet özeti ekler.
10. Telemetri, her alt ajanın süresini ve token tüketimini panoya yazar.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki kavramsal örnek, orkestratörün alt görevleri belirleyip alt ajanları çağırmasını gösterir.

```python
import anthropic

client = anthropic.Anthropic()

def alt_ajan(rol: str, gorev: str) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        system=f"Sen bir {rol} uzmanısın. Yalnızca kendi alanında yanıt ver.",
        messages=[{"role": "user", "content": gorev}],
    )
    return resp.content[0].text

def orkestratör(istek: str) -> dict:
    # Bağımsız alt görevleri ilgili uzman ajanlara dağıt
    sonuclar = {
        "ucus": alt_ajan("uçuş", f"{istek} için uçuş bul"),
        "otel": alt_ajan("otel", f"{istek} için otel bul"),
        "arac": alt_ajan("araç kiralama", f"{istek} için araç bul"),
    }
    return sonuclar

print(orkestratör("15 Temmuz İstanbul-Roma 4 gün"))
```

Alt görevler birbirinden bağımsızsa paralel çalıştırarak gecikmeyi azaltabilirsiniz.

```python
import concurrent.futures as cf

with cf.ThreadPoolExecutor() as ex:
    isler = {k: ex.submit(alt_ajan, k, f"{k} bul") for k in ["uçuş", "otel", "araç"]}
    sonuclar = {k: f.result() for k, f in isler.items()}
```

## 🔗 İlgili Kavramlar

- [Subagent (Alt Ajan)](../subagent/subagent.md) — orkestratörün yönettiği uzman ajanlar
- [Plan-and-Execute (Planla-ve-Yürüt)](../plan-and-execute/plan-and-execute.md) — önce plan, sonra yürütme
- [Workflow vs Agent (İş Akışı / Ajan Ayrımı)](../workflow-vs-agent/workflow-vs-agent.md) — ne zaman dinamik karar gerekir
- [Telemetry (Telemetri)](../telemetry/telemetry.md) — alt ajan performans izleme
- Görev ayrıştırma (task decomposition) — büyük görevi parçalara bölme
