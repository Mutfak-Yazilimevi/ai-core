# Sıcaklık (Temperature)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 3. Bağlam ve İstem Mühendisliği

Modelin çıktısındaki rastgelelik/yaratıcılık seviyesini belirleyen hiperparametredir. Düşük değerler daha deterministik ve tutarlı (kod, analiz), yüksek değerler daha çeşitli ve yaratıcı sonuç üretir.

## Mini Senaryo

> Sıcaklığı 0.1'e çekersin; ajan her seferinde aynı, kararlı SQL sorgusunu üretir.

## 📖 Ayrıntılı Açıklama

Sıcaklık (Temperature), bir dil modelinin bir sonraki jetonu seçerken uyguladığı rastgelelik (randomness) seviyesini ayarlayan bir hiperparametredir (hyperparameter). Model her adımda olası jetonlara bir olasılık dağılımı atar; sıcaklık bu dağılımı "yumuşatır" ya da "keskinleştirir". Düşük sıcaklık en olası jetonu neredeyse her zaman seçtirir (deterministik davranış), yüksek sıcaklık daha az olası jetonlara da şans tanır (çeşitlilik ve yaratıcılık).

Sıcaklık önemlidir çünkü aynı model ve aynı istemle bile çıktının karakterini kökten değiştirir. Hassasiyet ve tutarlılık gereken görevlerde (SQL üretimi, kod, veri çıkarımı, sınıflandırma) düşük sıcaklık tercih edilir; çeşitlilik, fikir üretimi ya da yaratıcı yazım gereken görevlerde yüksek sıcaklık işe yarar. Bu, tek bir ayarla "muhasebeci modu" ile "beyin fırtınası modu" arasında geçiş yapmak gibidir.

Çalışma biçimi matematikseldir: Model, ham puanları (logits) olasılığa çevirirken softmax fonksiyonunu kullanır ve sıcaklık bu fonksiyonda bir bölen görevi görür. Sıcaklık 0'a yaklaştıkça dağılım tek bir jetona kilitlenir (aç gözlü / greedy seçim); 1'e ve üzerine çıktıkça olasılıklar birbirine yakınlaşır ve seçim daha rastgele olur. Çoğu API'de değer aralığı 0 ile 1 (bazılarında 2) arasındadır.

Sıcaklık, çıktının ne kadar öngörülebilir olması gerektiğine göre ayarlanır. Bir ajan üretim hattında deterministik, tekrar üretilebilir sonuç istiyorsa düşük; pazarlama metni varyasyonları ya da farklı çözüm önerileri istiyorsa yüksek değer seçilir. Not: Bazı yeni nesil muhakeme modellerinde örnekleme parametreleri kullanımdan kaldırılmış olabilir; bu durumda davranış istemle yönlendirilir.

Dikkat edilmesi gereken tuzaklar: Sıcaklık 0 olsa bile çıktının bit bit aynı olması garanti değildir (donanım/uygulama farkları nedeniyle). Çok yüksek sıcaklık tutarsız, konudan sapan ya da anlamsız metne yol açabilir. Ayrıca sıcaklık ile Top-P/Top-K aynı anda agresif kullanılırsa etkiler çakışıp beklenmedik sonuç verebilir; genelde bunlardan birini ayarlayıp diğerini varsayılanda bırakmak daha öngörülebilirdir.

## 🎬 Detaylı Senaryo

"VeriAkışı" adlı bir analitik firması, doğal dil sorularını SQL'e çeviren bir ajan geliştirir ve sıcaklığı görevin doğasına göre ayarlar:

1. Ürün ekibi, SQL üretiminin her seferinde aynı, güvenilir sorguyu vermesi gerektiğine karar verir.
2. Bu modül için sıcaklığı 0,1'e çekerler; böylece "geçen ayın satışları" sorusu hep aynı `SELECT ... WHERE` yapısını üretir.
3. Test ederken aynı soruyu 10 kez çalıştırırlar; çıktılar pratikte birebir aynı çıkar — bu, hata ayıklamayı ve önbellekleme avantajından yararlanmayı kolaylaştırır.
4. Aynı üründe bir de "rapor başlığı öner" özelliği vardır; burada çeşitlilik istenir.
5. Başlık önerisi modülü için sıcaklığı 0,9'a yükseltirler; her çağrıda farklı, yaratıcı başlıklar gelir.
6. Bir kullanıcı şikayet eder: SQL bazen değişiyor. Ekip, o modülde sıcaklığın yanlışlıkla 0,8 kaldığını fark eder.
7. Değeri 0,1'e düzeltirler ve tutarlılık geri gelir.
8. Ekip, iki modülün sıcaklık ayarını yapılandırma dosyasında belgeler ki gelecekteki geliştiriciler farkı bilsin.

Sonuç: Aynı model, iki farklı sıcaklık değeriyle hem kararlı SQL hem yaratıcı başlık üretir.

## 💻 Kullanım / Uygulama Örneği

Deterministik bir görev için düşük sıcaklık verilir (örnekleme parametrelerini destekleyen modellerde).

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY ortamdan okunur

# Kararlı, tekrar üretilebilir SQL için düşük sıcaklık
resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=512,
    temperature=0.1,
    system="Doğal dil sorusunu geçerli bir SQL sorgusuna çevir. Sadece SQL döndür.",
    messages=[{"role": "user", "content": "Geçen ayın toplam satışı"}],
)
print(resp.content[0].text)
```

Yaratıcı çeşitlilik için yüksek sıcaklık:

```python
# Farklı başlık önerileri için yüksek sıcaklık
resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=256,
    temperature=0.9,
    messages=[{"role": "user", "content": "Çevre dostu ürün için 5 yaratıcı slogan üret"}],
)
print(resp.content[0].text)
```

## 🔗 İlgili Kavramlar

- [Örnekleme Parametreleri (Top-P / Top-K)](../top-p-top-k/top-p-top-k.md) — sıcaklıkla birlikte rastgeleliği yöneten parametreler
- [Temel Model (Foundation Model)](../foundation-model/foundation-model.md) — olasılık dağılımını üreten model
- [Jetonlar (Tokens)](../tokens-tokenization/tokens-tokenization.md) — sıcaklığın seçim yaptığı birimler
- [Sistem İstemi (System Prompt)](../system-prompt/system-prompt.md) — davranışı sıcaklık dışında yönlendiren araç
- Softmax — logitleri olasılığa çeviren ve sıcaklığın etkidiği fonksiyon
- Determinizm (Determinism) — düşük sıcaklığın hedeflediği tekrar üretilebilirlik
