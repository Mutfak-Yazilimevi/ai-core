# Dayanıklılık Desenleri (Caching / Retry / Circuit Breaker)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 6. İş Akışı ve Yürütme

Önbellekleme (tekrarlı işleri hızlandırma), yeniden deneme/yedeğe geçme ve arızada devreyi kesme gibi sistem dayanıklılığı desenleridir. Üretim ortamındaki ajanların kararlı çalışmasını sağlar.

## Mini Senaryo

> Bir API üst üste hata verince devre kesici devreye girer, ajan yedek kaynağa geçer.

## 📖 Ayrıntılı Açıklama

Dayanıklılık Desenleri (Resilience Patterns), bir ajanın bağımlı olduğu dış servisler (API'ler, araçlar, modeller) arızalandığında veya yavaşladığında sistemin çökmemesini sağlayan üç klasik mühendislik desenini kapsar: Önbellekleme (caching), Yeniden Deneme (retry) ve Devre Kesici (circuit breaker). Birlikte kullanıldıklarında ajanı geçici hatalara, ağ dalgalanmalarına ve servis kesintilerine karşı dirençli (fault-tolerant) hale getirirler.

Bu desenler önemlidir çünkü üretim (production) ortamında dış servisler kaçınılmaz olarak ara sıra hata verir, gecikir veya tamamen düşer. Naif bir ajan bu durumda ya çöker ya da sonsuza dek bekler. Önbellekleme tekrar eden istekleri ucuza yanıtlar; yeniden deneme geçici (transient) hataları otomatik atlatır; devre kesici ise kalıcı olarak bozulmuş bir servise istek yağdırmayı durdurarak hem o servisi hem de kendi sistemini korur.

Nasıl çalışır? (1) Önbellek (cache): Aynı girdi için sonuç bir kez hesaplanıp saklanır; sonraki istekler doğrudan önbellekten döner. (2) Yeniden deneme: Bir çağrı başarısız olursa, genellikle üstel geri çekilme (exponential backoff) ile birkaç kez tekrar denenir; her denemede bekleme süresi artar. (3) Devre kesici: Bir servis ardışık olarak çok hata verirse devre "açılır" (open) ve bir süre boyunca tüm istekler hemen reddedilir veya yedeğe (fallback) yönlendirilir; bir süre sonra "yarı açık" (half-open) durumda deneme yapılıp servis düzelmişse devre kapatılır.

Ne zaman kullanılır? Dış servise bağımlı her üretim ajanında. Yeniden deneme özellikle geçici hatalar (zaman aşımı, 503) için; devre kesici, bir bağımlılığın çökmesinin tüm sistemi kilitlemesini önlemek için; önbellek ise pahalı ve tekrar eden çağrılar için. Ne zaman dikkat? Yan etkili (non-idempotent) işlemlerde körü körüne yeniden deneme tehlikelidir; orada eşetkisellik (idempotency) ile birlikte kullanılmalıdır.

Tuzaklar: Geri çekilme olmadan agresif yeniden deneme, zaten zorlanan bir servisi büsbütün çökertir (retry storm). Önbelleği güncellememek bayat (stale) veri sunmaya yol açar. Devre kesici eşiklerini yanlış ayarlamak ya çok erken devreyi açar (gereksiz kesinti) ya da çok geç açar (koruma sağlamaz). Yan etkili çağrılarda yeniden deneme, mükerrer işlem riskidir.

## 🎬 Detaylı Senaryo

"SeyahatBul" adlı bir şirket, uçuş fiyatlarını birden çok havayolu API'sinden çeken bir ajan işletiyor; bir API'nin çökmesi tüm sistemi nasıl etkiliyor ve dayanıklılık desenleri bunu nasıl önlüyor görelim.

1. **Normal akış:** Ajan bir kullanıcı sorgusu için üç havayolu API'sini çağırır ve en ucuz fiyatı döner.
2. **Önbellek isabeti:** Aynı rotayı 5 dakika içinde tekrar soran kullanıcılar için sonuç önbellekten anında döner, API'lere hiç gidilmez.
3. **Geçici hata:** Bir API anlık olarak zaman aşımı (timeout) verir; ajan bu çağrıyı 1 sn, sonra 2 sn, sonra 4 sn bekleyerek (üstel geri çekilme) tekrar dener.
4. **Başarılı tekrar:** İkinci denemede API yanıt verir; kullanıcı kesintiyi hiç fark etmez.
5. **Kalıcı arıza:** Öğleden sonra bir havayolu API'si tamamen çöker ve ardışık 5 istekte hata döner.
6. **Devre açılır:** Devre kesici eşiği aşıldığını görüp o API için devreyi açar; artık ona hiç istek gönderilmez.
7. **Yedeğe geçiş:** Ajan o havayolu için yedek bir veri sağlayıcıya (fallback) yönelir, böylece kullanıcılar yine fiyat görmeye devam eder.
8. **Yarı açık deneme:** 60 saniye sonra devre kesici "yarı açık" duruma geçip tek bir deneme isteği gönderir.
9. **Devre kapanır:** API düzelmiş olduğundan deneme başarılı olur, devre kapanır ve normal akışa dönülür; tüm olay izleme (observability) sistemine kaydedilir.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, üstel geri çekilmeli (exponential backoff) bir yeniden deneme sarmalayıcısını gösterir.

```python
import time

def yeniden_dene(fonk, max_deneme=3, taban_bekleme=1.0):
    for deneme in range(max_deneme):
        try:
            return fonk()
        except Exception as hata:
            if deneme == max_deneme - 1:
                raise  # son denemede hata fırlat
            bekleme = taban_bekleme * (2 ** deneme)  # 1, 2, 4 sn...
            print(f"Hata: {hata}; {bekleme}sn sonra tekrar denenecek")
            time.sleep(bekleme)
```

İkinci örnek, basit bir devre kesici (circuit breaker) durumunu yönetir:

```python
import time

class DevreKesici:
    def __init__(self, esik=5, bekleme_sn=60):
        self.esik, self.bekleme_sn = esik, bekleme_sn
        self.hata_sayisi, self.acilma_zamani = 0, None

    def cagir(self, fonk):
        if self.acilma_zamani and time.time() - self.acilma_zamani < self.bekleme_sn:
            raise RuntimeError("Devre açık: yedek kaynağa geçilmeli")
        try:
            sonuc = fonk()
            self.hata_sayisi = 0          # başarı: sayacı sıfırla
            return sonuc
        except Exception:
            self.hata_sayisi += 1
            if self.hata_sayisi >= self.esik:
                self.acilma_zamani = time.time()  # devreyi aç
            raise
```

## 🔗 İlgili Kavramlar

- [Eşetkisellik (Idempotency)](../idempotency/idempotency.md) — güvenli yeniden deneme için ön koşul
- [Semantik Ön Bellekleme (Semantic Caching)](../semantic-caching/semantic-caching.md) — anlamsal önbellek varyantı
- [Bütçe / Döngü Sınırı (Budget / Loop Limits)](../budget-loop-limits/budget-loop-limits.md) — yeniden deneme sayısını sınırlama
- [İzlenebilirlik (Observability)](../../01-temel/observability/observability.md) — devre durumunu izleme
- Yedeğe Geçiş (Fallback) — devre açılınca alternatif kaynak
