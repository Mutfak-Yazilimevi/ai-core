# Örnekleme Parametreleri (Top-P / Top-K)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 3. Bağlam ve İstem Mühendisliği

Modelin bir sonraki jetonu belirlerken değerlendireceği olasılık havuzunu daraltan; odaklanmayı ve tutarlılığı yöneten matematiksel örnekleme parametreleridir.

## Mini Senaryo

> Top-P'yi düşürerek ajanın alakasız nadir kelimeler seçmesini engeller, yanıtları odakta tutarsın.

## 📖 Ayrıntılı Açıklama

Top-P ve Top-K, bir dil modelinin bir sonraki jetonu seçerken hangi adayları dikkate alacağını sınırlayan örnekleme (sampling) parametreleridir. Model her adımda tüm sözlük için bir olasılık dağılımı üretir; bu parametreler o dağılımdan yalnızca bir alt kümeyi "aday havuzu" olarak alır ve seçimi bunlarla sınırlar. Amaç, alakasız ya da çok düşük olasılıklı jetonların seçilmesini engellemektir.

Top-K, en yüksek olasılıklı ilk K jetonu havuza alır (örneğin K=40 ise yalnızca en olası 40 aday). Top-P (çekirdek örnekleme / nucleus sampling) ise sabit bir sayı yerine, olasılıkları toplandığında belirli bir eşiği (örneğin 0,9) aşan en küçük jeton kümesini alır. Top-P'nin avantajı uyarlanabilir olmasıdır: Model çok emin olduğunda havuz küçülür, belirsiz olduğunda büyür. Top-K ise sabit bir kesme uygular.

Bu parametreler önemlidir çünkü sıcaklıkla (temperature) birlikte çıktının odağını ve tutarlılığını yönetir. Düşük Top-P (örneğin 0,5) modeli yalnızca en olası, "güvenli" jetonlara mahkûm eder; bu, hassas ve tutarlı yanıtlar için iyidir ama yaratıcılığı kısar. Yüksek Top-P (0,95+) ise daha geniş bir kelime dağarcığına ve çeşitliliğe izin verir.

Genelde bu parametrelerden biri ayarlanıp diğeri ve sıcaklık varsayılanda bırakılır; üçünü birden agresif değiştirmek etkileri öngörülemez biçimde çakıştırır. Hassas çıktıda (kod, yapılandırılmış veri) düşük değerler; çeşitlilik gereken üretimde yüksek değerler kullanılır. Not: Bazı yeni nesil muhakeme modellerinde örnekleme parametreleri devre dışıdır ve davranış doğrudan istemle yönetilir.

Dikkat edilmesi gereken tuzaklar: Top-P ve Top-K ile sıcaklığı aynı anda zorlamak, kısıtların üst üste binmesine ve ya çok dar ya çok dağınık çıktıya yol açabilir. Çok düşük Top-P, modeli tekrarlayıcı ve sığ hale getirebilir; çok yüksek değerler ise konudan sapma ve tutarsızlık riskini artırır. Uygulamada en pratik yol tek bir parametreyi ayarlayıp etkisini ölçmektir.

## 🎬 Detaylı Senaryo

"DestekBot" adlı bir müşteri hizmetleri firması, teknik destek ajanının yanıtlarını odakta tutmak için Top-P'yi ayarlar:

1. Ekip, ajanın bazen alakasız ya da fazla "yaratıcı" teknik terimler ürettiğini fark eder.
2. Sorunu çözmek için Top-P değerini varsayılan 0,95'ten 0,7'ye düşürürler.
3. Artık model, her adımda yalnızca en olası, konuyla ilgili jetonları havuza alır.
4. Test ederler: "Modem ışığı kırmızı yanıyor" sorusuna ajan artık tutarlı, standart sorun giderme adımlarını verir; uçuk öneriler kaybolur.
5. Aynı firmanın bir de pazarlama ekibi vardır; onlar e-posta başlıkları için çeşitlilik ister.
6. Pazarlama modülünde Top-P'yi 0,95'te bırakır, hatta Top-K'yı geniş tutarlar; böylece farklı başlık varyasyonları gelir.
7. Bir mühendis, destek modülünde hem düşük Top-P hem yüksek sıcaklık denemek ister; sonuç tutarsız çıkar.
8. Ekip kuralı netleştirir: Tek parametreyi ayarla, diğerini varsayılanda bırak.

Sonuç: Destek yanıtları odaklı ve güvenilir, pazarlama metinleri ise çeşitli kalır.

## 💻 Kullanım / Uygulama Örneği

Odaklı, tutarlı yanıtlar için Top-P düşürülür (örnekleme parametrelerini destekleyen modellerde).

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY ortamdan okunur

# Odaklı destek yanıtı: dar aday havuzu
resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=512,
    top_p=0.7,
    system="Sen bir teknik destek asistanısın. Standart sorun giderme adımları ver.",
    messages=[{"role": "user", "content": "Modem ışığı kırmızı yanıyor"}],
)
print(resp.content[0].text)
```

Çeşitlilik için geniş havuz (Top-K ile):

```python
# Daha çeşitli üretim: geniş aday havuzu
resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=256,
    top_k=100,
    messages=[{"role": "user", "content": "Bir kahve markası için 5 farklı slogan öner"}],
)
print(resp.content[0].text)
```

## 🔗 İlgili Kavramlar

- [Sıcaklık (Temperature)](../temperature/temperature.md) — örnekleme rastgeleliğini ayarlayan tamamlayıcı parametre
- [Temel Model (Foundation Model)](../foundation-model/foundation-model.md) — aday olasılıklarını üreten model
- [Jetonlar (Tokens)](../tokens-tokenization/tokens-tokenization.md) — havuzdan seçilen birimler
- [Sistem İstemi (System Prompt)](../system-prompt/system-prompt.md) — örnekleme dışında davranışı yönlendirir
- Çekirdek Örnekleme (Nucleus Sampling) — Top-P'nin diğer adı
- Aç Gözlü Kod Çözme (Greedy Decoding) — her zaman en olası jetonu seçen uç durum
