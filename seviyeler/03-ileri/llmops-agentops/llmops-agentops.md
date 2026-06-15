# LLM / Ajan Operasyonları (LLMOps / AgentOps)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 11. Operasyon ve Gözlemlenebilirlik

Otonom ajanların ve yapay zekâ modellerinin geliştirme, test, dağıtım, izleme ve sürekli entegrasyon (CI/CD) süreçlerinin uçtan uca yönetildiği modern operasyonel disiplindir.

## Mini Senaryo

> Yeni ajan sürümü, otomatik testlerden geçince CI/CD ile canlıya alınıp izlenmeye başlar.

## 📖 Ayrıntılı Açıklama

LLMOps / AgentOps, dil modeli tabanlı uygulamaların ve otonom ajanların geliştirme, test, dağıtım (deployment), izleme (monitoring) ve sürekli iyileştirme süreçlerini uçtan uca yöneten operasyonel disiplindir. Geleneksel yazılımın DevOps/MLOps pratiklerini, LLM ve ajanlara özgü zorluklara (belirsiz çıktı, istem/model sürümleme, token maliyeti, halüsinasyon) uyarlar. LLMOps tek model çağrılarına, AgentOps ise çok adımlı, araç kullanan ajanların operasyonuna odaklanır.

Bu önemlidir çünkü ajanlar deterministik değildir; aynı girdi farklı çıktı verebilir, bir model güncellemesi davranışı sessizce bozabilir (regresyon). Sağlam bir operasyon olmadan ajanları üretime almak risklidir: kalite düşer, maliyet kontrolden çıkar, hatalar fark edilmez. LLMOps/AgentOps; sürümleme, otomatik değerlendirme (evaluation), izleme ve hızlı geri alma (rollback) ile bu riski yönetir.

Nasıl çalışır: Tipik bir döngü şöyledir — (1) istem/ajan değişikliği bir sürüm deposuna işlenir, (2) CI/CD ardışık düzeni otomatik değerlendirme setlerini (eval suites) çalıştırır, (3) kalite eşiği geçilirse aşamalı dağıtım (canary/staged rollout) yapılır, (4) canlıda gözlemlenebilirlik (observability) ile gecikme, maliyet, hata oranı ve çıktı kalitesi izlenir, (5) izleme alarm üretirse geri alma tetiklenir. İzleme genellikle iz takibi (tracing), günlükleme ve değerlendirme metriklerini içerir.

Ne zaman kullanılır: Üretime giden her ciddi LLM/ajan uygulamasında. Erken prototiplerde hafif tutulabilir; ölçek ve kritiklik arttıkça olgunlaşır.

Tuzaklar: Yazılım için yeterli olan testler LLM için yetersizdir; davranış değişimini yakalayan değerlendirme setleri şarttır. Token maliyetini izlememek faturayı patlatır. İstem ve model sürümlerini birlikte sürümlememek "neden bozuldu?" sorusunu cevapsız bırakır. Gözlemlenebilirlik olmadan ajan hataları sessiz kalır.

## 🎬 Detaylı Senaryo

"AsistanCo" adlı bir SaaS firmasının ekibi, müşteri destek ajanının yeni sürümünü canlıya almak istiyor.

1. Geliştirici, ajanın sistem istemini iyileştirir ve değişikliği sürüm deposuna işler (commit).
2. CI/CD ardışık düzeni tetiklenir ve 200 örnekten oluşan otomatik değerlendirme setini çalıştırır.
3. Değerlendirme; doğruluk, ton ve istenmeyen davranış (refusal/halüsinasyon) metriklerini ölçer.
4. Yeni sürüm doğrulukta %2 artar ama maliyet metriği eşiği aşar; ekip istemi kısaltarak optimize eder.
5. İkinci turda tüm eşikler geçilir; CI/CD önce trafiğin yalnızca %5'ine dağıtır (canary).
6. Canlı izleme panosu gecikme, token maliyeti, hata oranı ve örnek çıktıları takip eder.
7. Canary'de bir anomali görülmez; ekip kademeli olarak %100'e çıkarır.
8. Bir hafta sonra üçüncü taraf model sağlayıcısı bir güncelleme yapar; izleme bir regresyon alarmı üretir ve ekip önceki sürüme saniyeler içinde geri döner (rollback).

## 💻 Kullanım / Uygulama Örneği

Değişiklik, otomatik değerlendirmeden geçince aşamalı olarak dağıtılır. Aşağıda kavramsal bir CI/CD iş akışı ve basit bir değerlendirme adımı gösterilmektedir.

```yaml
# .ci/agent-deploy.yaml — ajan dağıtım iş akışı (kavramsal)
name: ajan-cd
on: [push]
jobs:
  degerlendir-ve-dagit:
    steps:
      - ad: "Otomatik değerlendirme (eval suite)"
        calistir: "python eval/run.py --min-dogruluk 0.9 --max-maliyet 0.02"
      - ad: "Canary dağıtım (%5 trafik)"
        calistir: "deploy --strategy canary --traffic 5"
      - ad: "İzleme ve kademeli artış"
        calistir: "monitor --rollback-on anomaly && deploy --traffic 100"
```

```python
# Dağıtım öncesi otomatik değerlendirme kapısı
import anthropic
client = anthropic.Anthropic()

def degerlendir(ornekler: list[dict]) -> float:
    dogru = 0
    for ex in ornekler:
        r = client.messages.create(model="claude-opus-4-8", max_tokens=256,
            messages=[{"role": "user", "content": ex["girdi"]}])
        if ex["beklenen"] in r.content[0].text:
            dogru += 1
    return dogru / len(ornekler)   # kalite eşiğiyle karşılaştırılır (örn. >= 0.9)
```

## 🔗 İlgili Kavramlar

- [Döngü Üstünde İnsan (HOTL)](../hotl/hotl.md) — canlı izleme ve müdahale
- [Ajan Kimliği (Agent Identity)](../agent-identity/agent-identity.md) — gizli anahtar ve kimlik yönetimi
- [Değerlendirici-İyileştirici (Evaluator-Optimizer)](../evaluator-optimizer/evaluator-optimizer.md) — otomatik değerlendirme mantığı
- Gözlemlenebilirlik (Observability) — iz takibi, günlük ve metrikler
- Sürekli Entegrasyon/Dağıtım (CI/CD) — otomatik test ve yayın
