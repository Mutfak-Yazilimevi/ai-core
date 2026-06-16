# Değerlendirmeler (Evals)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 10. Değerlendirme ve Kalite

Ajanların performansını; doğruluk, güvenilirlik ve güvenlik metrikleri üzerinden ölçüp puanlayan titiz test çerçeveleridir. Bir değişikliğin ajanı iyileştirip iyileştirmediğini nesnel olarak göstermek için kullanılır.

## Mini Senaryo

> Yeni bir istem versiyonu, 200 örnekli test setinde %85'ten %91 doğruluğa çıkar mı diye ölçülür.

## 📖 Ayrıntılı Açıklama

Değerlendirmeler (evals), bir ajanın veya dil modeli uygulamasının performansını nesnel, tekrarlanabilir ve ölçülebilir biçimde test eden çerçevelerdir. Bir ajanın "iyi çalışıp çalışmadığı"nı sezgiye veya birkaç elle yapılan denemeye bırakmak yerine, eval'lar belirli bir test seti üzerinde doğruluk, güvenilirlik, güvenlik ve maliyet gibi metrikleri sistematik olarak hesaplar. Yazılımdaki birim/entegrasyon testlerinin yapay zekâ dünyasındaki karşılığıdır; ancak çıktılar olasılıksal olduğu için klasik testlerden farklı yöntemler gerektirir.

Eval'lar önemlidir çünkü dil modeli uygulamaları sürekli değişir: istemler (prompts) güncellenir, model sürümü değişir, yeni araçlar eklenir. Bu değişikliklerden hangisinin sistemi gerçekten iyileştirdiğini, hangisinin sessizce bozduğunu (regresyon) bilmenin tek güvenilir yolu ölçmektir. "Bana daha iyi geldi" gibi öznel izlenimler yanıltıcıdır. İyi bir eval süreci, bir değişikliği üretime almadan önce "bu gerçekten ilerleme mi?" sorusunu sayılarla yanıtlar ve karar vermeyi mühendislik disiplinine dönüştürür.

Çalışma mantığı şöyledir: Önce temsili bir test seti (girdi ve beklenen/ideal çıktı çiftleri) hazırlanır. Ajan her girdi için bir çıktı üretir ve bu çıktı bir puanlama yöntemiyle değerlendirilir. Puanlama üç biçimde olabilir: (1) kesin eşleşme veya kural tabanlı kontrol (deterministik görevler için), (2) LLM-as-a-Judge, yani çıktının kalitesini değerlendirmesi için ayrı bir modelin "yargıç" olarak kullanılması, (3) insan değerlendirmesi. Sonuçlar bir skor olarak toplanır ve sürümler arasında karşılaştırılır.

Eval'lar; üretime alınacak her ciddi ajanda, istem veya model değişikliklerinde ve güvenlik açısından kritik sistemlerde zorunludur. Hızlı, tek seferlik bir denemede gerek olmayabilir; ancak sistem büyüdükçe eval'sız geliştirme körlemesine gitmek demektir.

Dikkat edilmesi gereken tuzaklar: Test setinin gerçek kullanımı temsil etmemesi yanıltıcı yüksek skorlar verir. LLM-as-a-Judge kullanırken yargıç modelin de yanlı veya tutarsız olabileceğini unutmayın; yargıcı da kalibre edin. Tek bir toplam skora bakmak yerine hata türlerini ayrıştırın (hangi kategoride başarısız?). Ayrıca eval setine aşırı uyum sağlama (overfitting) riskine karşı seti zaman zaman yenileyin.

## 🎬 Detaylı Senaryo

Bir müşteri hizmetleri yazılımı geliştiren "DestekZeka" firması, destek ajanının cevap kalitesini iyileştirmek istiyor.

1. Ekip, geçmiş gerçek müşteri sohbetlerinden 200 örnek seçer; her örnek için bir soru ve uzmanlarca onaylanmış "ideal cevap" hazırlar. Bu, altın test setidir (golden set).
2. Mevcut ajan sürümü bu 200 soruyu yanıtlar ve her cevap, bir LLM-as-a-Judge tarafından doğruluk ve yardımcılık açısından 1–5 arası puanlanır.
3. Mevcut sürümün ortalama doğruluk skoru %85 olarak ölçülür; bu, temel çizgidir (baseline).
4. Bir geliştirici, sistem istemini iyileştiren yeni bir sürüm önerir ve bunun gerçekten daha iyi olduğunu iddia eder.
5. Yeni sürüm aynı 200 soruluk set üzerinde çalıştırılır ve aynı yargıç ile puanlanır; skor %91'e çıkar.
6. Ekip ayrıca hata türlerini ayrıştırır ve yeni sürümün halüsinasyon (hallucination) vakalarını azalttığını ama yanıt süresini biraz artırdığını görür.
7. Bu nesnel kanıta dayanarak ekip yeni sürümü onaylar; eğer skor düşseydi (regresyon), değişiklik geri alınırdı.
8. Eval süreci sürekli entegrasyon (CI) hattına bağlanır; bundan sonra her istem değişikliği otomatik olarak bu sete karşı puanlanır ve eşik altında kalan değişiklikler engellenir.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki Python örneği, bir LLM-as-a-Judge ile çıktı puanlamayı gösterir: yargıç model, ajanın cevabını ideal cevapla karşılaştırıp 1–5 arası puan verir.

```python
import anthropic

client = anthropic.Anthropic()

def puanla(soru: str, ajan_cevabi: str, ideal_cevap: str) -> int:
    resp = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=10,
        system=(
            "Sen bir değerlendirme yargıcısın. Ajanın cevabını ideal cevapla "
            "karşılaştır ve 1 (çok kötü) ile 5 (mükemmel) arası tek bir tam sayı ver. "
            "Yalnızca sayıyı yaz."
        ),
        messages=[{
            "role": "user",
            "content": f"SORU: {soru}\nAJAN: {ajan_cevabi}\nİDEAL: {ideal_cevap}",
        }],
    )
    return int(resp.content[0].text.strip())

test_seti = [
    {"soru": "İade süresi kaç gün?", "ideal": "14 gün"},
    {"soru": "Kargo ücretsiz mi?", "ideal": "100 TL üzeri ücretsiz"},
]
# Her örnek için ajanın cevabını puanlayıp ortalamayı al
```

Aşağıdaki Python örneği ise deterministik bir görev için basit, kural tabanlı bir doğruluk eval'ı gösterir.

```python
def kesin_eslesme_skoru(tahminler: list[str], beklenenler: list[str]) -> float:
    dogru = sum(1 for t, b in zip(tahminler, beklenenler) if t.strip() == b.strip())
    return dogru / len(beklenenler)

print(kesin_eslesme_skoru(["14 gün", "yanlış"], ["14 gün", "100 TL"]))  # 0.5
```

## 🔗 İlgili Kavramlar

- LLM-as-a-Judge — çıktı kalitesini değerlendirmek için ayrı bir model kullanma yöntemi.
- [Halüsinasyon (Hallucination)](../hallucination/hallucination.md) — eval'larla ölçülen tipik bir hata türü.
- [Güvenlik Bariyerleri (Guardrails)](../guardrails/guardrails.md) — etkinlikleri eval'larla doğrulanır.
- [Gözlemlenebilirlik (Observability)](../observability/observability.md) — üretim verisinden eval örnekleri toplamayı sağlar.
- [Görev Durumu (Task State)](../task-state/task-state.md) — çok adımlı görevlerin başarısı eval'larla ölçülür.
- Regresyon testi (regression test) — bir değişikliğin mevcut başarıyı bozmadığını doğrular.
