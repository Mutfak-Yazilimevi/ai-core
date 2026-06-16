# Düşünce Zinciri (Chain-of-Thought (CoT))

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 2. Muhakeme ve Planlama

Modelin bir sonuca varmadan önce adım adım, açık şekilde akıl yürütmesidir. Karmaşık problemlerde doğruluğu belirgin biçimde artıran en temel muhakeme tekniğidir.

## Mini Senaryo

> Bir KDV sorusunda ajan "önce vergiyi ayırırım, sonra..." diye adım adım yazarak doğru sonuca ulaşır.

## 📖 Ayrıntılı Açıklama

Düşünce Zinciri (Chain-of-Thought, CoT), bir dil modelinin nihai cevabı doğrudan üretmek yerine, sonuca götüren ara adımları açıkça yazarak ilerlemesidir. Yani model "cevap: 42" demeden önce "önce şunu hesaplarım, sonra bunu çıkarırım, dolayısıyla..." gibi bir muhakeme izi (reasoning trace) üretir. Bu, insanların zor bir problemi kâğıt üzerinde adım adım çözmesine benzer.

CoT önemlidir çünkü çok adımlı muhakeme (multi-step reasoning) gerektiren problemlerde doğruluğu belirgin biçimde artırır. Aritmetik, mantık bulmacaları, çok koşullu kurallar ve çıkarım gerektiren sorularda model, tek hamlede doğru cevaba "atlamak" yerine ara adımları üreterek hata olasılığını düşürür. Her ara adım, bir sonraki adımın daha sağlam bir bağlam üzerine kurulmasını sağlar.

Çalışma biçimi modelin otoregresif (autoregressive) doğasıyla ilgilidir: Model her jetonu önceki jetonlara bakarak üretir. Ara muhakeme jetonları üretildiğinde, bunlar bağlamın parçası olur ve sonraki adımları besler; böylece model adeta kendi "çalışma kâğıdını" oluşturur. CoT, ya istemde açıkça istenir ("adım adım düşün") ya da birkaç örnekle (few-shot) gösterilir; modern modellerde ise dahili düşünme (extended/adaptive thinking) mekanizmasıyla otomatik tetiklenebilir.

CoT, problemin gerçekten birden fazla mantıksal adım içerdiği durumlarda kullanılır: matematik, kod hata ayıklama, çok kriterli karar verme, plan oluşturma. Buna karşılık basit bir olgu sorgusunda ("Türkiye'nin başkenti?") veya düz sınıflandırmada CoT gereksiz gecikme (latency) ve maliyet (daha fazla çıktı jetonu) yaratır.

Dikkat edilmesi gereken tuzaklar: Model bazen makul görünen ama hatalı bir muhakeme zinciri üretip yine de yanlış sonuca ulaşabilir; "açıkladı diye doğru" sanmak yanıltıcıdır. Ayrıca uzun zincirler jeton maliyetini ve gecikmeyi artırır. Bazı kullanıcıya yönelik ürünlerde ham muhakemeyi göstermek istenmez; bu durumda zincir gizli tutulup yalnızca sonuç sunulur.

## 🎬 Detaylı Senaryo

"MuhasebePro" adlı bir SaaS firması, KOBİ'ler için fatura kontrol ajanı geliştirir ve KDV hesaplarında doğruluğu artırmak için CoT kullanır:

1. Kullanıcı sorar: "1.180 TL brüt tutarda %18 KDV dahil faturanın net tutarı ve KDV'si nedir?"
2. Ajan, sistem istemiyle "Hesaplama gerektiren sorularda adım adım çöz, sonra net cevabı ver" talimatını taşır.
3. Ajan ilk adımı yazar: "Brüt = net × (1 + 0,18). Yani net = brüt / 1,18."
4. İkinci adım: "net = 1.180 / 1,18 = 1.000 TL."
5. Üçüncü adım: "KDV = brüt − net = 1.180 − 1.000 = 180 TL."
6. Doğrulama adımı: "Kontrol: 1.000 × 0,18 = 180; 1.000 + 180 = 1.180. Tutarlı."
7. Ajan nihai cevabı net biçimde sunar: "Net: 1.000 TL, KDV: 180 TL."
8. Geliştiriciler, ham zinciri loglara yazıp kullanıcıya yalnızca özet sonucu gösterir; böylece hem izlenebilirlik hem temiz arayüz korunur.

Sonuç: Tek adımda yapılan hatalı bölme/çıkarma riski neredeyse ortadan kalkar.

## 💻 Kullanım / Uygulama Örneği

En basit CoT, istemde modelden adım adım düşünmesini istemekle elde edilir.

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY ortamdan okunur

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="Hesaplama gerektiren sorularda adım adım düşün, sonra net cevabı ver.",
    messages=[{
        "role": "user",
        "content": "1.180 TL KDV dahil tutarın (%18) net ve KDV tutarı nedir?",
    }],
)
print(resp.content[0].text)
```

Modern modellerde adaptif düşünme (adaptive thinking) açılarak muhakeme derinliği modele bırakılabilir:

```python
resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=2048,
    thinking={"type": "adaptive"},
    messages=[{"role": "user", "content": "Üç farklı senaryoda kâr marjını karşılaştır."}],
)
```

## 🔗 İlgili Kavramlar

- [Temel Model (Foundation Model)](../foundation-model/foundation-model.md) — muhakeme jetonlarını üreten model
- [Sistem İstemi (System Prompt)](../system-prompt/system-prompt.md) — "adım adım düşün" talimatını kalıcı kılar
- [Jetonlar (Tokens)](../tokens-tokenization/tokens-tokenization.md) — zincir uzunluğu doğrudan jeton maliyetini etkiler
- [Ajan (Agent)](../agent/agent.md) — muhakeme ve eylemi birleştiren sistem
- Adaptif/Genişletilmiş Düşünme (Adaptive / Extended Thinking) — dahili CoT mekanizması
- Az Örnekli İstem (Few-shot Prompting) — örneklerle zincir formatını gösterme
