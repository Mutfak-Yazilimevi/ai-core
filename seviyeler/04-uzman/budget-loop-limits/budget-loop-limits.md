# Bütçe / Döngü Sınırı (Budget / Loop Limits)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 6. İş Akışı ve Yürütme

Maliyeti ve sonsuz döngüleri kontrol altında tutmak için token, süre veya adım sayısına konan üst sınırlardır. Ajanın kontrolden çıkmasını ve aşırı maliyeti önler.

## Mini Senaryo

> Ajana "20 adım veya 1$ üst sınır" konur; döngüye girerse otomatik durur.

## 📖 Ayrıntılı Açıklama

Bütçe / Döngü Sınırı (Budget / Loop Limits), bir ajanın tüketebileceği kaynaklara (token, çağrı adımı, geçen süre veya parasal maliyet) önceden konan üst sınırlardır. Otonom bir ajan kendi kararıyla araç çağırıp düşünmeye devam edebildiği için, bir mantık hatası veya beklenmedik girdi onu sonsuz bir döngüye (infinite loop) sokabilir; sınırlar bu durumu sert biçimde keserek hem maliyeti hem de güvenliği korur.

Bu kavram önemlidir çünkü olasılıksal (probabilistic) bir sistem olan LLM ajanları, "bir adım daha" mantığıyla kendini sürekli besleyebilir. Bir araç hep boş sonuç dönerse ajan defalarca aynı çağrıyı yapabilir; bu, faturayı dakikalar içinde patlatabilir veya hedef sisteme istem dışı yük (denial of service) bindirebilir. Bütçe sınırı, "ne olursa olsun durulacak nokta" tanımlayarak öngörülebilirlik (predictability) sağlar.

Nasıl çalışır? Tipik olarak birkaç sayaç (counter) tutulur: (1) Adım sayısı (step count) — ajanın kaç düşün-eylem turu yaptığı; (2) Token bütçesi — toplam girdi+çıktı token miktarı; (3) Süre sınırı (timeout) — duvar saati zamanı; (4) Parasal sınır — token kullanımından hesaplanan tahmini maliyet. Her tur başında bu sayaçlar kontrol edilir; herhangi biri eşiği aşarsa döngü temiz biçimde sonlandırılır ve genellikle "bütçe doldu, kısmi sonuç" şeklinde bir yanıt döner.

Ne zaman kullanılır? Araç kullanan, çok adımlı (multi-step) ve otonom çalışan her ajanda — istisnasız. Üretim (production) ortamında bütçesiz bir döngüye sahip ajan ciddi bir mali ve operasyonel risktir. Ne zaman gereksiz? Tek seferlik, döngüsüz bir tamamlamada (single completion) ayrı bir adım sayacı gerekmez; orada sadece `max_tokens` yeterlidir.

Tuzaklar: Sınırı çok düşük koymak ajanın geçerli görevleri yarıda bırakmasına yol açar; çok yüksek koymak ise koruma sağlamaz. Sadece adım sayısına bakıp token maliyetini izlememek, az adımda çok pahalı bir çağrı yapıldığında işe yaramaz. Ayrıca sınıra ulaşıldığında ajanı sessizce kesmek yerine, neden durduğunu loglamak ve kullanıcıya/sisteme bildirmek gerekir.

## 🎬 Detaylı Senaryo

"VeriToplar" adlı bir şirket, web'den fiyat bilgisi toplayan otonom bir araştırma ajanı çalıştırıyor; bir gün ajan beklenmedik bir döngüye girince ekip bütçe sınırlarının değerini anlıyor.

1. **Görev:** Ajana "rakip ürünlerin fiyatlarını topla ve karşılaştır" denir; ajanın bir arama aracı ve bir sayfa-getirme aracı vardır.
2. **Sınır tanımı:** Mühendis ajana "en fazla 20 adım, 50.000 token ve 60 saniye" sınırı koyar.
3. **Normal akış:** Ajan birkaç arama yapar, sayfaları getirir, fiyatları çıkarır.
4. **Beklenmedik durum:** Bir rakip sitesi sürekli "tekrar deneyin" hatası döndürür; ajan bunu yeni bilgi sanıp tekrar tekrar aynı sayfayı getirmeye çalışır.
5. **Sayaç artışı:** Her başarısız denemede adım sayacı ve token bütçesi tükenmeye başlar.
6. **Sınır tetiği:** Ajan 20. adıma ulaşınca döngü sınırı devreye girer ve yürütme durdurulur.
7. **Temiz sonlandırma:** Ajan "20 adım sınırına ulaşıldı, 5 rakipten 4'ünün fiyatı toplandı" şeklinde kısmi bir sonuç döner.
8. **Loglama ve uyarı:** Sistem, sınıra takılma olayını izleme (observability) panosuna kaydeder ve ekibe uyarı gönderir.
9. **İyileştirme:** Ekip, sorunlu siteye karşı bir devre kesici (circuit breaker) ekleyerek ajanın aynı kaynakta takılmasını kalıcı olarak önler.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, bir ajan döngüsüne adım, token ve süre sınırları koymayı gösterir.

```python
import time
import anthropic

client = anthropic.Anthropic()

def sinirli_ajan(soru: str, max_adim=20, max_token=50_000, max_sn=60):
    baslangic = time.time()
    toplam_token = 0
    mesajlar = [{"role": "user", "content": soru}]

    for adim in range(max_adim):  # ADIM sınırı
        if time.time() - baslangic > max_sn:        # SÜRE sınırı
            return "Süre sınırına ulaşıldı (kısmi sonuç)."
        if toplam_token > max_token:                # TOKEN bütçesi
            return "Token bütçesi doldu (kısmi sonuç)."

        yanit = client.messages.create(
            model="claude-opus-4-8", max_tokens=1024, messages=mesajlar,
        )
        toplam_token += yanit.usage.input_tokens + yanit.usage.output_tokens
        # ... araç çağrısı / yanıt işleme ...
        if yanit.stop_reason == "end_turn":
            return "".join(b.text for b in yanit.content if b.type == "text")
    return "Adım sınırına ulaşıldı (kısmi sonuç)."
```

İkinci örnek, token kullanımından tahmini maliyet hesaplayıp parasal bir sınır uygular:

```python
FIYAT_GIRDI = 0.000003   # token başına örnek tarife
FIYAT_CIKTI = 0.000015

def maliyet_hesapla(usage) -> float:
    return usage.input_tokens * FIYAT_GIRDI + usage.output_tokens * FIYAT_CIKTI

# Döngü içinde: toplam_maliyet > 1.0 olunca dur (1$ üst sınır)
```

## 🔗 İlgili Kavramlar

- [Dayanıklılık Desenleri (Caching / Retry / Circuit Breaker)](../caching-retry-circuit-breaker/caching-retry-circuit-breaker.md) — döngü kesmenin tamamlayıcısı
- [İzlenebilirlik (Observability)](../observability/observability.md) — sınıra takılma olaylarını izleme
- [Ajan Geliştirme Yaşam Döngüsü (ADLC)](../adlc/adlc.md) — üretim güvenliği aşaması
- Zaman Aşımı (Timeout) — süre tabanlı sınırın temel biçimi
- Maliyet Optimizasyonu (Cost Optimization) — bütçe yönetiminin geniş çerçevesi
