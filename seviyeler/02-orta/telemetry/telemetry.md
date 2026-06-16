# Telemetri (Telemetry)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 11. Operasyon ve Gözlemlenebilirlik

Ajanın karar mekanizmalarından, API çağrılarından, token tüketiminden ve sistem performansından otomatik olarak toplanan yapılandırılmış log, metrik ve izleme (trace) verilerinin bütünüdür. Observability'nin ham veri kaynağıdır.

## Mini Senaryo

> Her araç çağrısının süresi ve token tüketimi otomatik kaydedilip izleme panosuna akar.

## 📖 Ayrıntılı Açıklama

Telemetri (telemetry), bir ajanın çalışırken otomatik olarak ürettiği yapılandırılmış log, metrik ve izleme (trace) verilerinin tümüdür. Bir araç çağrısının ne kadar sürdüğü, kaç jeton (token) tüketildiği, hangi kararların alındığı, hataların nerede oluştuğu gibi sinyalleri kapsar. Telemetri, gözlemlenebilirliğin (observability) ham veri kaynağıdır: "sistem ne yapıyor?" sorusunu yanıtlayan verinin kendisidir.

Bu kavram önemlidir çünkü ajanlar kara kutu (black box) gibi davranabilir; aynı girdiye farklı yanıtlar verebilir, beklenmedik araç çağrıları yapabilir. Telemetri olmadan bir ajanın neden yavaşladığını, neden pahalılaştığını veya neden yanlış karar verdiğini anlamak imkânsızdır. İyi telemetri; maliyet kontrolü (token başına ücret), performans ayarı (gecikme darboğazları), hata ayıklama ve güvenlik denetimi için temel sağlar.

Telemetri üç ana sinyal türü etrafında kurulur: loglar (zaman damgalı ayrık olaylar), metrikler (sayısal toplam değerler — token sayısı, süre, hata oranı) ve izlemeler (traces — bir isteğin tüm adımlarını uçtan uca bağlayan kayıt). Modern uygulamalarda OpenTelemetry gibi standartlar kullanılır; her araç çağrısı, LLM isteği ve karar bir "span" olarak kaydedilir ve bir trace altında toplanır. Bu veri bir gözlem panosuna (dashboard) akar.

Telemetriyi her üretim ajanında kullanın; bu pazarlık konusu değildir. Özellikle araç kullanan, çok adımlı veya maliyetli ajanlar için kritiktir. Buna karşılık, hızlı bir prototip veya tek seferlik betikte ağır bir telemetri altyapısı kurmak erken optimizasyon olur; orada basit loglama yeterlidir. Ancak ürünleştikçe telemetri ertelenmemesi gereken bir yatırımdır.

Tuzaklar: hassas verinin (kullanıcı mesajları, PII) loglara sızması, aşırı loglamanın hem maliyeti hem gürültüyü artırması, ve metriklerin birbirine bağlanmaması nedeniyle bir sorunun kök nedeninin bulunamamasıdır. İyi telemetri; veri maskeleme, anlamlı örnekleme (sampling), tutarlı etiketleme (labels) ve trace'lerle korelasyon içerir.

## 🎬 Detaylı Senaryo

"AkilliDestek" adlı bir müşteri hizmetleri platformunun ajanı üretime alındı ve telemetri ile izleniyor.

1. Bir kullanıcı sorusu geldiğinde, sistem yeni bir trace (izleme) başlatır ve benzersiz bir kimlik atar.
2. Ajan ilk LLM çağrısını yapar; bu çağrı bir "span" olarak süresi ve token sayısıyla kaydedilir.
3. Ajan bir bilgi tabanı arama aracı çağırır; araç çağrısı ayrı bir span olur.
4. Aracın 2 saniye sürdüğü ve sonuç döndürdüğü kaydedilir.
5. Ajan ikinci LLM çağrısıyla nihai yanıtı üretir; girdi/çıktı token'ları metriklere yazılır.
6. Tüm span'ler aynı trace altında birleşip isteğin uçtan uca akışını gösterir.
7. Hassas kullanıcı verisi loglanmadan önce maskelenir (PII koruması).
8. Veri, gözlem panosuna akar; ekip "ortalama yanıt süresi" ve "istek başına maliyet" grafiklerini görür.
9. Bir gün arama aracının gecikmesi fırlar; pano alarm üretir ve sorumlu span işaretlenir.
10. Ekip trace'i inceleyip darboğazın bilgi tabanı sorgusu olduğunu tespit eder ve optimize eder.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, bir LLM çağrısının süresini ve token tüketimini yapılandırılmış olarak loglar.

```python
import time, json, anthropic

client = anthropic.Anthropic()

def izlemeli_cagri(soru: str) -> str:
    baslangic = time.perf_counter()
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=512,
        messages=[{"role": "user", "content": soru}],
    )
    sure_ms = (time.perf_counter() - baslangic) * 1000
    # Yapılandırılmış telemetri kaydı (panoya akacak)
    print(json.dumps({
        "olay": "llm_cagrisi",
        "sure_ms": round(sure_ms, 1),
        "girdi_token": resp.usage.input_tokens,
        "cikti_token": resp.usage.output_tokens,
        "model": "claude-opus-4-8",
    }))
    return resp.content[0].text

izlemeli_cagri("Merhaba")
```

TypeScript ile araç çağrısı süresi ve token kullanımı kaydedilir.

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

const t0 = performance.now();
const res = await client.messages.create({
  model: "claude-opus-4-8", max_tokens: 512,
  messages: [{ role: "user", content: "Merhaba" }],
});
console.log(JSON.stringify({
  olay: "llm_cagrisi",
  sure_ms: Math.round(performance.now() - t0),
  girdi_token: res.usage.input_tokens,
  cikti_token: res.usage.output_tokens,
}));
```

## 🔗 İlgili Kavramlar

- [Streaming (Akış)](../streaming/streaming.md) — ilk jetona kadar süre metriği
- [Orchestrator (Orkestratör)](../orchestrator/orchestrator.md) — alt ajan başına performans toplama
- [Subagent (Alt Ajan)](../subagent/subagent.md) — alt ajan başına maliyet izleme
- [Sandboxing (Korumalı Alan)](../sandboxing/sandboxing.md) — çalıştırma kaynaklarını ölçme
- Gözlemlenebilirlik (observability) — telemetrinin üzerine kurulan anlama yeteneği
- İzleme (trace) — bir isteğin uçtan uca adım kaydı
