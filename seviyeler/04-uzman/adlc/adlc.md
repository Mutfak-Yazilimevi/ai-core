# Ajan Geliştirme Yaşam Döngüsü (ADLC (Agent Development Life Cycle))

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 1. Temeller ve Çalışma Modeli

Otonom sistemlerin kavramsal tasarımından geliştirilmesine, test edilip (Evals) canlı ortama (production) alınmasına ve sürekli izlenmesine (Observability) kadar geçen uçtan uca yazılım mühendisliği sürecidir.

## Mini Senaryo

> Bir destek ajanı; fikir → prototip → eval → canlı → izleme aşamalarından oluşan tam bir yaşam döngüsüyle geliştirilir.

## 📖 Ayrıntılı Açıklama

Ajan Geliştirme Yaşam Döngüsü (ADLC - Agent Development Life Cycle), otonom yapay zeka sistemlerinin (autonomous AI systems) bir fikirden başlayıp canlı üretim ortamında (production) sürekli izlenen olgun bir ürüne dönüşene kadar geçtiği uçtan uca mühendislik sürecidir. Geleneksel yazılım yaşam döngüsünden (SDLC - Software Development Life Cycle) farkı, ajanların çıktılarının olasılıksal (probabilistic) ve belirsiz (non-deterministic) olmasıdır; bu yüzden "doğru/yanlış" testi yerine değerlendirme setleri (evals) ve istatistiksel kalite ölçümleri devreye girer.

Bu kavram önemlidir çünkü bir LLM tabanlı ajanı "çalışıyor gibi göründü" diye canlıya almak ciddi risklerle doludur: halüsinasyon (hallucination), maliyet patlaması, güvenlik açıkları ve regresyonlar (regression - eski sürümde çalışan bir davranışın bozulması). ADLC, bu riskleri her aşamada disiplinli bir şekilde yöneterek güvenilir, tekrarlanabilir ve geri alınabilir (rollback) bir geliştirme akışı sunar.

Nasıl çalışır? Tipik aşamalar şunlardır: (1) Tasarım/kapsam belirleme (scoping) — ajanın hangi işi yapacağı ve hangi araçlara (tools) ihtiyaç duyduğu tanımlanır; (2) Prototip — hızlı bir ilk sürüm kurulur; (3) Değerlendirme (eval) — bir test seti üzerinde başarı, maliyet ve gecikme (latency) ölçülür; (4) Üretime alma (deployment) — kademeli yayma (canary/gradual rollout) ile canlıya geçilir; (5) İzleme (observability) — gerçek trafikte loglar, izler (traces) ve metrikler toplanıp döngü baştan beslenir.

Ne zaman kullanılır? Birden fazla aşamalı, araç kullanan ve uzun süre çalışacak her ciddi ajan projesinde. Tek seferlik bir prompt çağrısı veya basit bir sınıflandırma için tüm döngüyü kurmak gereksiz bir yüktür (overhead); bu durumlarda hafif bir eval seti yeterlidir.

Tuzaklar: Eval setini ihmal etmek en büyük hatadır — ölçemediğiniz şeyi iyileştiremezsiniz. Bir diğeri, izleme (observability) olmadan canlıya almak; üretimde neyin yanlış gittiğini göremezsiniz. Ayrıca model sürümünü (model version) sabitlememek, bir gün sessizce gelen davranış değişiklikleriyle regresyona yol açar.

## 🎬 Detaylı Senaryo

Bir fintek şirketi olan "ParaAkış", müşteri destek ekibinin yükünü azaltmak için bir hesap-işlem destek ajanı geliştirmek istiyor.

1. **Tasarım:** Ürün ekibi ve ML mühendisi bir araya gelir; ajanın "bakiye sorgulama, son işlemleri listeleme ve fatura itirazı başlatma" görevlerini üstleneceğine, ancak "para transferi yapmayacağına" karar verir (kapsam sınırı).
2. **Araç tanımı:** `get_balance`, `list_transactions` ve `open_dispute` araçları tanımlanır; `open_dispute` için insan onayı (human-in-the-loop) zorunlu kılınır.
3. **Prototip:** Mühendis, `claude-opus-4-8` ile hızlı bir prototip kurar ve birkaç örnek diyalog üzerinde elle test eder.
4. **Eval seti:** Gerçek destek kayıtlarından türetilmiş 200 örnekli bir değerlendirme seti hazırlanır; her örnek için beklenen araç çağrısı ve doğru yanıt etiketlenir.
5. **Değerlendirme:** Ajan eval setinde %88 başarı, ortalama 1.2 sn gecikme ve istek başına 0.03$ maliyet gösterir. Ekip eşiği (threshold) %90 koyduğu için prompt iyileştirilir.
6. **İkinci eval:** Sistem istemi netleştirilince başarı %93'e çıkar; ekip yayına onay verir.
7. **Kademeli yayma:** Ajan önce trafiğin %5'ine açılır (canary); bir hafta gözlemlenir.
8. **İzleme:** Loglar, izler ve geri bildirim butonları (👍/👎) ile gerçek başarı takip edilir; %5'te sorun çıkmayınca %100'e çıkılır.
9. **Geri besleme:** İzlemede ortaya çıkan başarısız diyaloglar yeni eval örneklerine dönüştürülür ve döngü yeniden başlar.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, ADLC'nin "eval" aşamasını basitçe gösterir: bir test seti üzerinde ajanı çalıştırıp başarı oranını hesaplar.

```python
import anthropic

client = anthropic.Anthropic()

# Değerlendirme (eval) seti: girdi + beklenen anahtar kelime
eval_seti = [
    {"soru": "Bakiyemi öğrenebilir miyim?", "beklenen": "bakiye"},
    {"soru": "Son işlemlerimi göster", "beklenen": "işlem"},
]

basari = 0
for ornek in eval_seti:
    yanit = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        system="Sen bir banka destek ajanısın. Sadece bakiye ve işlem konularında yardım et.",
        messages=[{"role": "user", "content": ornek["soru"]}],
    )
    metin = "".join(b.text for b in yanit.content if b.type == "text")
    if ornek["beklenen"] in metin.lower():
        basari += 1

print(f"Başarı oranı: {basari / len(eval_seti) * 100:.0f}%")
```

İkinci örnek, üretim aşamasında bir izleme (observability) kaydı tutmayı gösterir:

```python
import time, json

def izlenen_cagri(soru: str):
    baslangic = time.time()
    yanit = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        messages=[{"role": "user", "content": soru}],
    )
    kayit = {
        "soru": soru,
        "gecikme_sn": round(time.time() - baslangic, 2),
        "girdi_token": yanit.usage.input_tokens,
        "cikti_token": yanit.usage.output_tokens,
    }
    print(json.dumps(kayit, ensure_ascii=False))  # izleme sistemine gönderilir
    return yanit
```

## 🔗 İlgili Kavramlar

- [Değerlendirme Setleri (Evals)](../../01-temel/evals/evals.md) — ADLC'nin kalite ölçüm aşaması
- [İzlenebilirlik (Observability)](../../01-temel/observability/observability.md) — canlı izleme aşaması
- [Bütçe / Döngü Sınırı (Budget / Loop Limits)](../budget-loop-limits/budget-loop-limits.md) — üretim güvenliği
- [Dayanıklılık Desenleri (Caching / Retry / Circuit Breaker)](../caching-retry-circuit-breaker/caching-retry-circuit-breaker.md) — üretim kararlılığı
- Kırmızı Takım (Red Teaming) — yayın öncesi güvenlik testi
