# Paralel Yürütme (Parallel Execution)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 6. İş Akışı ve Yürütme

Hız ve verimlilik kazanmak için, bir problemin birbirinden bağımsız parçalarını çözmek üzere birden fazla ajanı aynı anda çalıştırmaktır. Bağımsız alt görevler eşzamanlı işlenerek toplam süre kısaltılır.

## Mini Senaryo

> 10 ürünün fiyatını tek tek değil, 10 ajanla aynı anda sorgulayıp süreyi 10'a böler.

## 📖 Ayrıntılı Açıklama

Paralel Yürütme (Parallel Execution), bir problemin birbirinden bağımsız parçalarını sırayla değil aynı anda (eşzamanlı / concurrent) çalıştırarak toplam süreyi kısaltma tekniğidir. Birden fazla ajan veya birden fazla araç çağrısı paralel koşar; her biri kendi alt görevini bağımsız bitirir ve sonuçlar en sonda birleştirilir (toplama / aggregation). Tek bir ajanın işleri tek tek yapmasına (sıralı / sequential) göre büyük hız kazancı sağlar.

Bu önemlidir çünkü ajan iş akışlarındaki gecikmenin (latency) büyük kısmı model çağrıları ve araç çağrılarını beklemektir. Bu beklemeler bağımsızsa, sıralı yapmak zaman kaybıdır: 10 bağımsız sorgu tek tek 1'er saniye sürerse 10 saniye, paralel koşarsa yaklaşık 1 saniye sürer. Hem kullanıcı deneyimini hem verimliliği belirgin iyileştirir.

Nasıl çalışır: Görev, bağımsız alt görevlere bölünür (genellikle bir "orkestratör" ajan tarafından). Bu alt görevler asenkron (asynchronous) olarak veya iş parçacıkları/süreçlerle eşzamanlı başlatılır; hepsi tamamlanınca sonuçlar toplanır. Bu desen, "orkestratör-işçi" (orchestrator-worker) veya "dağıt-topla" (scatter-gather) olarak da bilinir. Python'da `asyncio`, JS'de `Promise.all` tipik araçlardır.

Ne zaman kullanılır: Alt görevler gerçekten bağımsız olduğunda — çok sayıda belgeyi ayrı ayrı özetleme, birden çok kaynaktan veri çekme, bağımsız fiyat sorguları. Ne zaman kullanılmaz: Görevler birbirine bağımlıysa (biri diğerinin çıktısına ihtiyaç duyuyorsa) paralellik mümkün değildir; orada sıralı zincir gerekir.

Tuzaklar: Yapay bağımlılıkları paralelleştirmeye çalışmak yanlış sonuç verir. Aşırı eşzamanlılık dış servislerde hız limiti (rate limit) hatalarına ve maliyet patlamasına yol açar; eşzamanlılık sınırlanmalıdır (semaphore). Ayrıca bir alt görev başarısız olunca tümünün nasıl davranacağı (kısmi başarı, yeniden deneme) baştan tasarlanmalıdır.

## 🎬 Detaylı Senaryo

"FiyatTakip" adlı bir e-ticaret firmasının ekibi, rakip fiyatlarını izleyen bir ajan kurar.

1. Ekip, ajana 10 ürünün rakip sitelerdeki güncel fiyatını toplamasını söyler.
2. Bir orkestratör ajan görevi 10 bağımsız alt göreve böler — her ürün için ayrı bir sorgu.
3. Sıralı yapsaydı her sorgu ~1 saniye, toplam ~10 saniye sürerdi.
4. Bunun yerine 10 işçi ajan/çağrı eşzamanlı başlatılır (asenkron).
5. Hız limitine takılmamak için eşzamanlılık 5 ile sınırlanır (semaphore); ilk 5 koşar, biten yerine yenisi girer.
6. Sorgulardan biri zaman aşımına uğrar; ajan onu yeniden dener, diğerleri etkilenmez.
7. Tüm sonuçlar geldikçe orkestratör bunları tek bir tabloda toplar (aggregation).
8. Toplam süre ~2 saniyeye iner; ekip fiyat farklarını neredeyse anında görür.

## 💻 Kullanım / Uygulama Örneği

Bağımsız görevler eşzamanlı başlatılıp sonuçlar toplanır. Aşağıda Python `asyncio` ve eşzamanlılık sınırı ile bir örnek gösterilmektedir.

```python
import asyncio

async def fiyat_sorgula(urun: str, semafor: asyncio.Semaphore) -> dict:
    async with semafor:                      # eşzamanlılığı sınırla (rate limit koruması)
        await asyncio.sleep(1)               # gerçekte: bir API/araç çağrısı
        return {"urun": urun, "fiyat": 100}

async def hepsini_topla(urunler: list[str]):
    semafor = asyncio.Semaphore(5)           # en çok 5 eşzamanlı çağrı
    gorevler = [fiyat_sorgula(u, semafor) for u in urunler]
    return await asyncio.gather(*gorevler)   # hepsini paralel bekle ve topla

print(asyncio.run(hepsini_topla([f"urun-{i}" for i in range(10)])))
```

```typescript
// TypeScript: bağımsız görevleri Promise.all ile paralel çalıştırma
async function fiyatSorgula(urun: string): Promise<{ urun: string; fiyat: number }> {
  // gerçekte: bir API/araç çağrısı
  return { urun, fiyat: 100 };
}

const urunler = Array.from({ length: 10 }, (_, i) => `urun-${i}`);
const sonuclar = await Promise.all(urunler.map(fiyatSorgula)); // eşzamanlı topla
```

## 🔗 İlgili Kavramlar

- [Değerlendirici-İyileştirici (Evaluator-Optimizer)](../evaluator-optimizer/evaluator-optimizer.md) — paralel adaylar üretip değerlendirme
- [Ajanlar Arası Protokol (A2A Protocol)](../a2a-protocol/a2a-protocol.md) — paralel ajanlar arası iletişim
- [Kod Yorumlayıcı (Code Interpreter)](../code-interpreter/code-interpreter.md) — paralel hesaplama görevleri
- Orkestratör-İşçi (Orchestrator-Worker) — görev dağıtım deseni
- Eşzamanlılık (Concurrency) — async/await ile bekleme örtüşmesi
