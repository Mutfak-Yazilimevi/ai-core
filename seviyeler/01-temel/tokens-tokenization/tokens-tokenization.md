# Jetonlar / Jetonlaştırma (Tokens / Tokenization)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 1. Temeller ve Çalışma Modeli

Modellerin metni, kodu veya veriyi işlemek ve üretmek için böldüğü en küçük yapı taşlarıdır. Ajanların işlem maliyeti, hızı ve bağlam sınırı bu metrik üzerinden hesaplanır.

## Mini Senaryo

> 10 sayfalık sözleşmeyi modele verirsin; sistem bunu ~15.000 jetona böler ve ücreti buna göre hesaplar.

## 📖 Ayrıntılı Açıklama

Jeton (Token), bir dil modelinin metni işlerken kullandığı en küçük anlamlı birimdir. Bir jeton her zaman tam bir kelime değildir; çoğu zaman bir kelime parçası (subword), bir hece, bir noktalama işareti ya da boşluk olabilir. Jetonlaştırma (Tokenization), ham metni bu birimlere bölen ve her birime sayısal bir kimlik (ID) atayan ön işleme adımıdır. Model aslında metinleri değil, bu sayısal kimlik dizilerini işler.

Jetonlar önemlidir çünkü bir ajanın üç temel pratik özelliği doğrudan jeton sayısına bağlıdır: maliyet (cost), hız (latency) ve bağlam sınırı (context window). API sağlayıcıları ücretlendirmeyi girdi (input) ve çıktı (output) jetonları üzerinden yapar; model tek seferde yalnızca belirli bir jeton sayısını (örneğin 200.000) bağlamında tutabilir. Dolayısıyla "kaç kelime" değil "kaç jeton" sorusu mühendislik kararlarının merkezindedir.

Çalışma biçimi genellikle Byte Pair Encoding (BPE) gibi algoritmalara dayanır: Sık birlikte geçen karakter dizileri tek bir jetonda birleştirilir, nadir kelimeler ise birden çok parçaya bölünür. Bu yüzden İngilizce metinde ortalama bir jeton ~4 karaktere denk gelirken, Türkçe gibi eklemeli dillerde aynı anlam daha fazla jetona bölünebilir; emoji veya nadir Unicode karakterleri de beklenenden fazla jeton tüketebilir.

Jeton hesabı, uzun dokümanlarla çalışırken, bağlamı doldurmadan önce belge bölme (chunking) gerektiğinde, maliyet tahmini yaparken ve yanıt uzunluğunu (`max_tokens`) sınırlarken kullanılır. Kısa, tek seferlik sorgularda jeton sayımı genellikle önemsizdir; ama RAG ya da uzun sohbet geçmişi tutan ajanlarda jeton bütçesi (token budget) yönetimi kritik hale gelir.

Dikkat edilmesi gereken tuzaklar: Karakter ya da kelime sayısından jeton sayısını kabaca tahmin etmek yanıltıcı olabilir, özellikle Türkçe ve kod metinlerinde. Bağlam penceresi dolduğunda en eski mesajların sessizce kırpılması (truncation) bilgi kaybına yol açar. Ayrıca `max_tokens` çok düşük ayarlanırsa yanıt yarıda kesilebilir.

## 🎬 Detaylı Senaryo

"HukukMetin" adlı bir legaltech firması, sözleşmeleri özetleyen bir ajan geliştirir ve jeton bütçesini yönetmek zorundadır:

1. Müşteri 40 sayfalık bir kira sözleşmesini yükler.
2. Ekip, dosyayı sağlayıcının jetonlaştırıcısı (tokenizer) ile sayar ve metnin ~60.000 jetona denk geldiğini görür.
3. Modelin bağlam penceresi yeterli olsa da, maliyeti düşürmek için sözleşmeyi mantıksal bölümlere (chunk) ayırırlar: taraflar, ödeme, fesih, cezai şartlar.
4. Her bölüm ayrı ayrı modele gönderilir; böylece tek bir devasa istem yerine küçük, hedefli istemler oluşur.
5. Çıktı uzunluğunu kontrol etmek için her çağrıda `max_tokens=500` ayarlanır; aksi halde model gereksiz uzun özetler üretebilir.
6. Toplam girdi + çıktı jetonu loglanır ve müşteri başına maliyet hesaplanır.
7. Sık tekrar eden standart maddeler için istem önbellekleme (prompt caching) devreye alınarak tekrarlı jeton maliyeti azaltılır.
8. Sonuç: Firma, her sözleşmenin işlenme maliyetini jeton bazında önceden tahmin edebilir hale gelir.

## 💻 Kullanım / Uygulama Örneği

Anthropic SDK, bir isteği göndermeden önce jeton sayısını ölçmek için sayım uç noktası sunar; böylece maliyeti ve bağlam sığabilirliğini önceden kontrol edebilirsiniz.

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY ortamdan okunur

metin = "Bu sözleşme taraflar arasında ... (uzun metin)"

# İstek göndermeden önce girdi jeton sayısını ölç
sayim = client.messages.count_tokens(
    model="claude-opus-4-8",
    messages=[{"role": "user", "content": metin}],
)
print("Girdi jetonu:", sayim.input_tokens)
```

Bir yanıt döndükten sonra gerçek kullanım `usage` alanından okunabilir:

```python
resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=300,
    messages=[{"role": "user", "content": "Bu metni özetle: " + metin}],
)
print("Girdi:", resp.usage.input_tokens, "Çıktı:", resp.usage.output_tokens)
```

## 🔗 İlgili Kavramlar

- [Temel Model (Foundation Model)](../foundation-model/foundation-model.md) — jetonları işleyip yeni jeton üreten model
- [Çalışan / Kısa Süreli Bellek (Working / Short-term Memory)](../working-short-term-memory/working-short-term-memory.md) — bağlam penceresi jeton sınırıyla belirlenir
- [Sıcaklık (Temperature)](../temperature/temperature.md) — bir sonraki jetonun seçilme rastgeleliğini etkiler
- [Örnekleme Parametreleri (Top-P / Top-K)](../top-p-top-k/top-p-top-k.md) — aday jeton havuzunu daraltır
- Bağlam Penceresi (Context Window) — modelin tutabileceği toplam jeton sınırı
- Geri Getirmeli Üretim (RAG) — bağlama sığacak şekilde jeton bütçesini yönetir
