# İş Akışı / Ajan Ayrımı (Workflow vs Agent)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 1. Temeller ve Çalışma Modeli

Sabit kodlanmış, önceden tanımlı yollarla ilerleyen iş akışları (workflow) ile kendi adımlarına dinamik olarak karar veren gerçek otonom ajanlar (agent) arasındaki temel ayrımdır. Hangi problemin hangisini gerektirdiğini bilmek mimari kararların temelidir.

## Mini Senaryo

> Sabit "3 adımlı onay" süreci bir workflow'dur; "gerekirse ek belge iste" kararını veren ise ajandır.

## 📖 Ayrıntılı Açıklama

İş akışı / ajan ayrımı (workflow vs agent), LLM tabanlı sistemleri tasarlarken alınan en temel mimari karardır. İş akışı (workflow), önceden tanımlı, sabit kodlanmış bir yol izler: hangi adımın ne zaman çalışacağı geliştirici tarafından belirlenmiştir. Ajan (agent) ise kendi adımlarına çalışma anında, kendisi karar verir; hangi aracı kullanacağına, döngüye devam edip etmeyeceğine dinamik olarak hükmeder.

Bu ayrım önemlidir çünkü iki yaklaşımın getiri ve riskleri zıttır. İş akışları öngörülebilir, ucuz, test edilebilir ve hata ayıklaması kolaydır; ama esnek değildir ve öngörülmeyen durumlarda tıkanır. Ajanlar esnek ve güçlüdür; karmaşık, açık uçlu görevleri çözebilir; ama daha pahalı, daha az öngörülebilir ve denetlenmesi daha zordur. Yanlış seçim, ya gereksiz karmaşıklık (basit işe ajan) ya da yetersiz esneklik (karmaşık işe katı akış) doğurur.

Pratik rehber şudur: Mümkün olan en basit çözümle başlayın. Görev adımları önceden biliniyor ve sabitse iş akışı kullanın; yalnızca esneklik gerçekten gerekiyorsa ajan ekleyin. Anthropic'in önerdiği yaklaşım da budur: çoğu üretim sistemi aslında iyi tasarlanmış iş akışlarıdır; tam otonom ajan yalnızca adımların önceden kestirilemediği, çok dallı görevlerde gereklidir. İkisi melez de olabilir: sabit bir iskelet içinde belirli noktalarda ajan kararları.

İş akışını seçin: belge onayı, veri dönüştürme boru hatları, sabit raporlama, sınıflandırma+yönlendirme gibi adımların belli olduğu görevlerde. Ajanı seçin: açık uçlu araştırma, hangi araçların gerekeceğinin baştan bilinmediği görevler, kullanıcı niyetine göre dallanan karmaşık etkileşimlerde. Karar verirken "adımları ben önceden yazabiliyor muyum?" sorusu iyi bir ölçüttür; yanıt evetse iş akışı yeterlidir.

Tuzaklar: her şeyi "ajan" yapma hevesiyle basit işlere gereksiz maliyet/öngörülemezlik eklemek; tersine, katı bir iş akışını gerçek esneklik gerektiren bir göreve zorlayıp kırılgan, devasa if-else ağaçları üretmek. Ayrıca ajanların öngörülemezliği denetim, test ve maliyet tahmininde zorluk yaratır; bunlar telemetri ve sınırlamalarla (guardrails) yönetilmelidir.

## 🎬 Detaylı Senaryo

"BelgeOnay" adlı bir fintek şirketi, kredi başvurularını işleyen bir sistem tasarlıyor ve ekip hangi yaklaşımı kullanacağını tartışıyor.

1. İlk aşama net ve sabittir: başvuru gelir, kimlik doğrulanır, gelir belgesi kontrol edilir, skor hesaplanır.
2. Ekip bu dört adımı bir iş akışı (workflow) olarak sabit kodlar; çünkü sıra her zaman aynıdır.
3. İş akışı öngörülebilir, hızlı ve kolay test edilebilir; her adım birim testlerle doğrulanır.
4. Ancak "eksik belge" durumu ortaya çıkar: bazen hangi ek belgenin isteneceği başvuruya göre değişir.
5. Bu dallanma noktası, sabit kuralla çözülemeyecek kadar çeşitlidir.
6. Ekip yalnızca bu noktaya bir ajan yerleştirir: "Hangi ek belge gerekli?" kararını ajan verir.
7. Ajan, başvurunun bağlamına bakıp dinamik olarak doğru belgeyi talep eder.
8. Belge gelince kontrol, tekrar sabit iş akışına döner (skor hesaplama).
9. Böylece sistem melez olur: sağlam iskelet iş akışı + tek bir kritik noktada ajan esnekliği.
10. Telemetri, ajan kararlarının doğruluğunu izleyip gerektiğinde insan denetimine yönlendirir.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, sabit bir iş akışını (önceden bilinen adımlar) gösterir; karar dallanması koddadır, modelde değil.

```python
# İŞ AKIŞI: adımlar sabit ve önceden bellidir
def basvuru_isle(basvuru: dict) -> str:
    if not kimlik_dogrula(basvuru):
        return "Reddedildi: kimlik"
    if not gelir_kontrol(basvuru):
        return "Reddedildi: gelir"
    skor = skor_hesapla(basvuru)        # sabit, deterministik akış
    return "Onaylandı" if skor > 700 else "Reddedildi: skor"
```

Aşağıdaki örnek ise bir ajanı gösterir: hangi aracın kullanılacağına model dinamik karar verir.

```python
import anthropic
client = anthropic.Anthropic()

# AJAN: adımlara model karar verir (araçlar arasında dinamik seçim)
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    tools=[{"name": "belge_iste", "description": "Eksik belgeyi talep eder.",
            "input_schema": {"type": "object",
                "properties": {"tur": {"type": "string"}}}}],
    messages=[{"role": "user",
               "content": "Bu başvuruda eksik ne var, gerekeni iste."}],
)
# Model gerekirse 'belge_iste' aracını kendisi çağırır (stop_reason == tool_use)
```

## 🔗 İlgili Kavramlar

- [ReAct (Reasoning + Acting)](../react/react.md) — dinamik karar veren ajan döngüsü
- [Prompt Chaining (İstem Zincirleme)](../prompt-chaining/prompt-chaining.md) — tipik bir sabit iş akışı
- [Plan-and-Execute (Planla-ve-Yürüt)](../plan-and-execute/plan-and-execute.md) — yarı dinamik melez yaklaşım
- [Orchestrator (Orkestratör)](../orchestrator/orchestrator.md) — ajan koordinasyonu
- Korkuluklar (guardrails) — ajan öngörülemezliğini sınırlama
