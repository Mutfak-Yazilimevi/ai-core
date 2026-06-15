# Kod Yorumlayıcı (Code Interpreter)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 5. Araç Kullanımı ve Entegrasyon

Ajanın görevi çözmek için kod yazıp güvenli bir ortamda çalıştırabilmesidir. Hesaplama, veri analizi ve dosya işleme gibi görevlerde güçlüdür.

## Mini Senaryo

> Ajan, bir CSV'deki satışları analiz etmek için anlık Python kodu yazıp çalıştırır.

## 📖 Ayrıntılı Açıklama

Kod Yorumlayıcı (Code Interpreter), bir ajanın görevi çözmek için anlık olarak kod (genellikle Python) yazıp güvenli ve izole bir ortamda (sandbox) çalıştırabilmesidir. Modelin "düşünerek metin üretmesi" ile çözemediği kesin hesaplama, veri dönüşümü ve dosya işleme gibi işler, kodun gerçekten çalıştırılmasıyla deterministik biçimde çözülür. Ajan kodu üretir, çalıştırır, çıktıyı (veya hatayı) görür ve gerekirse kodu düzeltip yeniden dener.

Bu önemlidir çünkü dil modelleri aritmetik, büyük veri toplama ve hassas mantık konularında hata yapabilir ("halüsinasyon"). Kod yorumlayıcı, modeli bir "hesap makinesi ve veri işleyici" ile donatır: 10.000 satırlık bir CSV'nin ortalamasını tahmin etmek yerine gerçekten hesaplar. Bu, sonuçların güvenilirliğini ve denetlenebilirliğini artırır çünkü üretilen kod ve çıktısı görülebilir.

Nasıl çalışır: Ajana bir "kod yürütme" aracı (code execution tool) tanımlanır. Model, problemi çözecek kodu metin olarak üretir; bir yürütücü (executor) bu kodu izole bir ortamda çalıştırır ve standart çıktıyı/hatayı modele geri verir. Model çıktıyı yorumlar; hata varsa kodu düzeltir (kendi kendini düzeltme / self-correction döngüsü). Anthropic SDK'sında bu, sunucu tarafı kod yürütme aracı (`code_execution`) ile sağlanabilir.

Ne zaman kullanılır: Sayısal analiz, veri temizleme, dosya/format dönüşümü, grafik üretimi ve algoritmik mantık gerektiren görevlerde. Ne zaman kullanılmaz/dikkat edilir: İnternet erişimi veya gizli verilere erişim gerektiren güvenliksiz ortamlarda; bu durumda izolasyon, kaynak limitleri ve ağ kısıtları şarttır.

Tuzaklar: İzolasyonsuz kod çalıştırmak ciddi güvenlik açığıdır — ajan zararlı kod üretebilir veya istem enjeksiyonuyla kandırılabilir. Sonsuz döngüler ve aşırı kaynak tüketimi için zaman aşımı (timeout) ve bellek sınırı konmalıdır. Ayrıca ajanın ürettiği kod körü körüne değil, çıktısı doğrulanarak güvenilmelidir.

## 🎬 Detaylı Senaryo

"SatışPro" adlı bir e-ticaret firmasının analitik ekibi, aylık satış raporlamasını bir ajana devrediyor.

1. Analist ajana 50.000 satırlık bir `satislar.csv` dosyası ve "bölge bazında toplam ciroyu ve en çok satan 3 ürünü çıkar" görevini verir.
2. Ajan, dosyanın yapısını anlamak için önce küçük bir keşif kodu yazar (`pandas` ile ilk satırları okur).
3. Yürütme ortamı kodu çalıştırır; ajan sütun adlarını (bölge, ürün, tutar) görür.
4. Ajan, bölgeye göre gruplayıp ciro toplayan ve en çok satanları sıralayan asıl kodu üretir.
5. İlk denemede bir sütun adı yanlış yazıldığı için kod hata verir; ajan hatayı okur ve kodu düzeltir (kendi kendini düzeltme).
6. Düzeltilen kod çalışır ve sonuç tablosunu üretir.
7. Ajan ayrıca bir çubuk grafik çizen kod yazıp görseli dosya olarak kaydeder.
8. Son olarak ajan, sayısal sonuçları doğal dille özetler ve grafiği rapora ekler; üretilen tüm kod denetim için günlüğe yazılır.

## 💻 Kullanım / Uygulama Örneği

Anthropic SDK'da sunucu tarafı kod yürütme aracıyla model kod yazıp çalıştırabilir. Aşağıda kavramsal bir kullanım gösterilmektedir.

```python
import anthropic

client = anthropic.Anthropic()

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[{"type": "code_execution_20250522", "name": "code_execution"}],
    messages=[{
        "role": "user",
        "content": "Şu sayıların ortalamasını ve std sapmasını hesapla: 12, 7, 22, 9, 15",
    }],
)
# Model bir Python kodu üretip çalıştırır, sonucu yorumlayıp döndürür
print(resp.content)
```

```python
# Ajanın ürettiği kodu yerel izole ortamda (sandbox) çalıştırma — kavramsal yürütücü
import subprocess

def calistir(kod: str, timeout_sn: int = 5) -> str:
    # Üretimde: ağsız, kaynak-limitli bir konteyner içinde çalıştırılmalı
    sonuc = subprocess.run(
        ["python", "-c", kod], capture_output=True, text=True, timeout=timeout_sn,
    )
    return sonuc.stdout or sonuc.stderr

print(calistir("print(sum([12,7,22,9,15]) / 5)"))  # 13.0
```

## 🔗 İlgili Kavramlar

- [Bilgisayar / Tarayıcı Kullanımı (Computer / Browser Use)](../computer-browser-use/computer-browser-use.md) — başka bir eylem alma biçimi
- [Paralel Yürütme (Parallel Execution)](../parallel-execution/parallel-execution.md) — birden çok analiz görevini eşzamanlı koşma
- [Değerlendirici-İyileştirici (Evaluator-Optimizer)](../evaluator-optimizer/evaluator-optimizer.md) — kod çıktısını doğrulama döngüsü
- Araç Kullanımı (Tool Use) — modele kod yürütme yeteneği tanımlama
- Yürütme Ortamı (Sandbox) — güvenli izole çalıştırma
