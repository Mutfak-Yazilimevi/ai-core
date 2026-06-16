# Gözlemlenebilirlik (Observability)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 11. Operasyon ve Gözlemlenebilirlik

Hata ayıklama ve optimizasyon yapabilmek için ajanın arka plandaki düşünce süreçlerini, kullandığı araçları ve durum değişikliklerini izleme yeteneğidir. İzler (traces), günlükler (logs) ve metrikler ile ajanın "neyi neden yaptığı" şeffaf hâle gelir.

## Mini Senaryo

> Ajan yanlış cevap verince, geliştirici izlerden hangi aracı yanlış çağırdığını görür.

## 📖 Ayrıntılı Açıklama

Gözlemlenebilirlik (observability), bir ajanın iç işleyişini (akıl yürütme adımları, çağırdığı araçlar, ürettiği ara çıktılar ve durum değişiklikleri) dışarıdan izleyebilme, anlayabilme ve hata ayıklayabilme yeteneğidir. Bir ajan dışarıdan tek bir "girdi→çıktı" kutusu gibi görünse de, içeride çok sayıda model çağrısı, araç çağrısı ve karar adımı vardır. Gözlemlenebilirlik, bu "kara kutuyu" şeffaf hâle getirerek ajanın neyi neden yaptığını görmemizi sağlar. Üç ana sütun üzerine kuruludur: izler (traces), günlükler (logs) ve metrikler (metrics).

Bu yetenek önemlidir çünkü ajan sistemleri olasılıksal, çok adımlı ve dış sistemlere bağımlıdır; bir hata genellikle tek bir satırda değil, adımların etkileşiminde ortaya çıkar. Ajan yanlış bir cevap verdiğinde "neden?" sorusunu yanıtlamak, ancak o isteğin tüm yaşam döngüsünü adım adım görebiliyorsanız mümkündür: hangi istem gönderildi, model hangi aracı seçti, araç hangi sonucu döndü, nerede saptı? Gözlemlenebilirlik olmadan hata ayıklama tahmin yürütmeye dönüşür ve maliyet/gecikme sorunlarının kaynağı bulunamaz.

Çalışma mantığı, ajanın her anlamlı adımının yapılandırılmış biçimde kaydedilmesine dayanır. Bir izleme (trace), tek bir kullanıcı isteğinin baştan sona tüm adımlarını (span'lar) hiyerarşik olarak gösterir: ana görev altında model çağrıları, onların altında araç çağrıları. Her span; süre, girdi, çıktı, token sayısı ve hata bilgisi taşır. Bu veriler genellikle OpenTelemetry gibi standartlar veya özel izleme platformları (ör. tracing araçları) üzerinden toplanır ve görselleştirilir. Metrikler ise zaman içindeki başarı oranı, ortalama gecikme ve maliyet gibi toplulaştırılmış göstergeleri verir.

Gözlemlenebilirlik; üretime alınan her ajanda, çok adımlı ve araç kullanan sistemlerde ve maliyet/gecikmenin önemli olduğu durumlarda zorunludur. Tek seferlik küçük bir denemede basit günlükler yeterli olabilir, ancak sistem karmaşıklaştıkça yapılandırılmış izleme vazgeçilmez hâle gelir.

Dikkat edilmesi gereken tuzaklar: Hassas verilerin (kişisel bilgi, kimlik bilgisi) günlüklere sızması ciddi bir gizlilik riskidir; kaydetmeden önce maskeleme yapın. Her şeyi aşırı ayrıntıyla kaydetmek hem maliyeti hem de gürültüyü artırır; anlamlı span'lara odaklanın. Ayrıca yalnızca veri toplamak yetmez; bu verinin aranabilir ve görselleştirilebilir olması, hatta eval setlerini beslemesi gerçek değeri yaratır.

## 🎬 Detaylı Senaryo

Bir seyahat teknolojisi firması olan "GeziPlan", uçuş ve otel rezervasyonu yapan bir ajan işletiyor ve müşteriler bazı cevapların yanlış olduğundan şikâyet ediyor.

1. Ekip, ajanın her isteğini OpenTelemetry uyumlu bir izleme platformuna bağlar; her model çağrısı, araç çağrısı ve durum geçişi bir span olarak kaydedilir.
2. Bir müşteri "İstanbul-Ankara için yarın sabah uçuş bul" der ve ajan yanlış bir tarihte uçuş listeler.
3. Geliştirici, bu isteğin izini (trace) açar ve tüm yaşam döngüsünü adım adım görür.
4. İzde, modelin `ucus_ara` aracını çağırdığı görülür; ancak argümanlarda tarihin "yarın" yerine bugünün tarihi olarak gönderildiği fark edilir.
5. Span ayrıntısında, modele giden sistem isteminde "bugünün tarihi" bilgisinin hiç verilmediği ortaya çıkar; model bu yüzden göreli tarihi yanlış çözmüştür.
6. Geliştirici sistem istemine güncel tarihi enjekte eder ve düzeltmeyi yayımlar.
7. Metrik panosunda, düzeltme sonrası "tarih hatası" oranının düştüğü ve ortalama gecikmenin değişmediği doğrulanır.
8. Hatalı bu örnek aynı zamanda bir eval setine eklenir; böylece gelecekteki değişikliklerin aynı hatayı tekrar etmediği otomatik olarak test edilir.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki Python örneği, bir ajanın adımlarını yapılandırılmış biçimde kaydeden basit bir izleme deseni gösterir; her adım süresi ve sonucuyla birlikte loglanır.

```python
import time, json, logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("ajan")

def izlenen_adim(ad: str, fn, *args):
    baslangic = time.time()
    try:
        sonuc = fn(*args)
        log.info(json.dumps({
            "adim": ad, "durum": "ok",
            "sure_ms": round((time.time() - baslangic) * 1000),
        }, ensure_ascii=False))
        return sonuc
    except Exception as e:
        log.error(json.dumps({"adim": ad, "durum": "hata", "mesaj": str(e)}))
        raise

# Her araç çağrısını izlenen_adim ile sararak gözlemlenebilir hale getiririz
ucuslar = izlenen_adim("ucus_ara", lambda: [{"saat": "08:00"}])
```

Aşağıdaki YAML ise tek bir isteğe ait basitleştirilmiş bir izleme (trace) yapısını gösterir; iç içe span'lar ajanın akışını ortaya koyar.

```yaml
trace_id: req-9f2c
istek: "İstanbul-Ankara yarın sabah uçuş"
spanlar:
  - ad: model_cagrisi
    sure_ms: 820
    cikti: tool_use=ucus_ara
  - ad: ucus_ara
    girdi: { kalkis: IST, varis: ESB, tarih: "2026-06-15" }  # hata: yarın olmalıydı
    sure_ms: 140
  - ad: model_cagrisi
    sure_ms: 610
    cikti: "Bulunan uçuşlar: 08:00, 09:30"
```

## 🔗 İlgili Kavramlar

- [Araç Kullanımı (Tool Use)](../tool-use/tool-use.md) — araç çağrıları gözlemlenebilirlikle izlenir.
- [Görev Durumu (Task State)](../task-state/task-state.md) — durum geçişleri izlerde görünür.
- [Değerlendirmeler (Evals)](../evals/evals.md) — üretim izlerinden eval örnekleri toplanır.
- [Güvenlik Bariyerleri (Guardrails)](../guardrails/guardrails.md) — guardrail kararları gözlemlenebilirlik kayıtlarına işlenir.
- [Çoklu Ajan (Multi-Agent)](../multi-agent/multi-agent.md) — ajanlar arası akış izlerle takip edilir.
- İzleme (tracing) / OpenTelemetry — adımları span'lar hâlinde kaydeden standart.
