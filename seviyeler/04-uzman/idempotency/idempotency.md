# Eşetkisellik (Idempotency)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 5. Araç Kullanımı ve Entegrasyon

Ajanın bir aracı kullanırken bir işlemi (örn. bir veritabanı yazması veya API çağrısı) ağ hataları nedeniyle veya otonom olarak birden fazla kez tetiklemesi durumunda bile, sistemde istenmeyen mükerrer değişikliklerin oluşmamasını sağlayan kritik mimari tasarım prensibidir.

## Mini Senaryo

> Ağ hatası yüzünden "ödeme yap" iki kez tetiklenir ama eşetkisellik sayesinde müşteri tek kez ödenir.

## 📖 Ayrıntılı Açıklama

Eşetkisellik (Idempotency), bir işlemin bir veya birden çok kez çalıştırılmasının sistem üzerinde aynı sonucu doğurması özelliğidir. Yani aynı isteği iki, üç ya da on kez göndermek, tek kez göndermekle aynı nihai durumu üretir; ekstra çağrılar yeni bir yan etki (side effect) yaratmaz. Bu, "para çek" gibi mükerrer çalışırsa zarar veren işlemlerin güvenli hale getirilmesinin temel mimari prensibidir.

Bu kavram ajanlar için özellikle önemlidir çünkü ajanlar otonomdur ve dayanıklılık desenleri (retry) ile birlikte çalışır: bir araç çağrısı zaman aşımına uğradığında ajan "acaba gitti mi?" diye tekrar dener, ya da bir ajan kendi mantığıyla aynı eylemi yeniden tetikleyebilir. Ağ, isteği aslında işleyip yanıtı kaybetmiş olabilir. Eşetkisellik olmadan bu, çift ödeme, çift sipariş veya çift e-posta gibi gerçek dünyada pahalı hatalara yol açar.

Nasıl çalışır? En yaygın teknik, eşetkisellik anahtarıdır (idempotency key): istemci her mantıksal işlem için benzersiz bir anahtar (örn. UUID) üretir ve isteğe ekler. Sunucu bu anahtarı kaydeder; aynı anahtarla ikinci bir istek gelince yeni işlem yapmaz, ilk işlemin saklanmış sonucunu döner. Bazı işlemler doğası gereği eşetkilidir (örn. "x=5 olarak ayarla"), bazıları değildir (örn. "x'i 5 artır") ve anahtarla korunmaları gerekir.

Ne zaman kullanılır? Yan etkili (state-changing) ve tekrar zararlı her araç/API çağrısında: ödeme, sipariş oluşturma, e-posta/SMS gönderme, kayıt ekleme. Ne zaman gerekmez? Salt-okunur (read-only) işlemlerde (örn. "bakiyeyi getir") eşetkisellik zaten doğaldır; ek bir anahtara gerek yoktur.

Tuzaklar: Eşetkisellik anahtarını her mantıksal işlem için yeniden üretmek (yeni satın alma = yeni anahtar) ama bir tekrar denemede aynısını korumak gerekir; karıştırmak ya mükerrer işlem ya da meşru işlemin reddi demektir. Anahtar kayıtlarına bir son kullanma süresi (TTL) koymamak veritabanını şişirir. Ayrıca eşetkilliği yalnızca istemci tarafında varsaymak yetmez; asıl güvence sunucu/araç tarafında olmalıdır.

## 🎬 Detaylı Senaryo

"HızlıÖde" adlı bir ödeme şirketi, faturaları otonom olarak ödeyen bir ajan çalıştırıyor; bir ağ dalgalanması nedeniyle çift ödeme riski doğuyor ve eşetkisellik anahtarı bunu önlüyor.

1. **Görev:** Ajana "350 TL'lik elektrik faturasını öde" denir.
2. **Anahtar üretimi:** Ajan bu mantıksal işlem için benzersiz bir eşetkisellik anahtarı üretir: `odeme-2026-06-15-fatura-8842`.
3. **İlk çağrı:** Ajan ödeme API'sini bu anahtarla çağırır; ödeme bankada işlenir ve para çekilir.
4. **Yanıt kaybı:** Tam o sırada ağ hatası olur ve API'nin "başarılı" yanıtı ajana ulaşmaz.
5. **Belirsizlik:** Ajan yanıt alamadığı için ödemenin gerçekleşip gerçekleşmediğini bilmez.
6. **Yeniden deneme:** Dayanıklılık deseni gereği ajan aynı isteği aynı eşetkisellik anahtarıyla tekrar gönderir.
7. **Sunucu kontrolü:** Ödeme API'si bu anahtarı daha önce gördüğünü tespit eder; yeni bir çekim yapmaz.
8. **Saklı sonucu döndürme:** API ilk işlemin sonucunu (başarılı, işlem no: 12345) döner; müşteriden ikinci kez para çekilmez.
9. **Doğrulama:** Ajan "ödeme başarılı" sonucunu alır; muhasebe kayıtlarında tek bir ödeme görünür ve olay loglanır.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, sunucu tarafında bir eşetkisellik anahtarı kontrolünü gösterir; aynı anahtar ikinci kez gelirse işlem tekrarlanmaz.

```python
islenmis = {}  # anahtar -> sonuç (gerçekte kalıcı bir veri deposu olur)

def odeme_yap(eslik_anahtari: str, tutar: float) -> dict:
    if eslik_anahtari in islenmis:
        return islenmis[eslik_anahtari]  # mükerrer: saklı sonucu dön
    # ... gerçek ödeme işlemi burada bir kez yapılır ...
    sonuc = {"durum": "başarılı", "tutar": tutar, "islem_no": 12345}
    islenmis[eslik_anahtari] = sonuc
    return sonuc

print(odeme_yap("odeme-fatura-8842", 350.0))  # ödeme yapılır
print(odeme_yap("odeme-fatura-8842", 350.0))  # tekrar; çift çekim YOK
```

İkinci örnek, ajan tarafında her mantıksal işlem için kararlı bir anahtar üretip yeniden denemede aynısını korur:

```python
import uuid

def yeni_eslik_anahtari(islem_kimligi: str) -> str:
    # Aynı mantıksal işlem -> aynı anahtar (deterministik)
    return f"odeme-{islem_kimligi}"

# Yeni bir satın alma için bambaşka bir anahtar:
benzersiz = f"odeme-{uuid.uuid4()}"
```

## 🔗 İlgili Kavramlar

- [Dayanıklılık Desenleri (Caching / Retry / Circuit Breaker)](../caching-retry-circuit-breaker/caching-retry-circuit-breaker.md) — yeniden denemeyi güvenli kılan eşetkisellik
- [Bütçe / Döngü Sınırı (Budget / Loop Limits)](../budget-loop-limits/budget-loop-limits.md) — tekrarlı eylemleri sınırlama
- Eşetkisellik Anahtarı (Idempotency Key) — temel uygulama tekniği
- Yan Etki (Side Effect) — eşetkiselliğin yönettiği risk
- Durum Yönetimi (State Management) — işlem sonuçlarını saklama
