# Bellek (Memory)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Ajanın daha önceki sohbetlerini, geçmiş deneyimlerini ve göreviyle ilgili bilgileri saklayan ve gerektiğinde geri çağıran sistemlerdir. Genellikle kısa süreli ve uzun süreli bellek olarak ikiye ayrılır.

## Mini Senaryo

> Kullanıcı geçen hafta "glutensiz beslendiğini" söylemişti; ajan bu haftaki tarif önerisinde bunu hatırlar.

## 📖 Ayrıntılı Açıklama

Bellek (Memory), bir ajanın geçmiş etkileşimlerini, kullanıcı tercihlerini ve göreviyle ilgili bilgileri saklayıp gerektiğinde geri çağırabildiği sistemlerin tümüdür. Dil modelleri tek bir API çağrısı arasında durumsuzdur (stateless); yani kendiliğinden hiçbir şeyi "hatırlamaz". Bellek, bu eksikliği dışarıdan kapatan katmandır: bilgi bir yere yazılır, sonraki çağrıda ilgili kısım geri okunup bağlama (context) eklenir.

Bellek genellikle ikiye ayrılır. Kısa süreli / çalışan bellek (short-term / working memory), o anki görev ya da konuşma boyunca tutulan ve bağlam penceresine (context window) sığan geçici bilgidir; görev bitince kaybolur. Uzun süreli bellek (long-term memory) ise oturumlar arasında kalıcı olan bilgidir — kullanıcının glutensiz beslendiği gibi tercihler, geçmiş kararlar ya da öğrenilmiş gerçekler bir veritabanına ya da vektör deposuna (vector store) yazılır.

Bellek önemlidir çünkü ajanı tek seferlik bir araçtan, zamanla kişiselleşen ve bağlamı koruyan bir asistana dönüştürür. Kullanıcı her seferinde kendini baştan anlatmak zorunda kalmaz; ajan geçmişe dayanarak daha isabetli, tutarlı ve kişisel yanıtlar verir. Bu, özellikle çok oturumlu ürünlerde (kişisel asistan, müşteri ilişkileri) deneyimi köklü biçimde iyileştirir.

Çalışma biçimi şöyledir: Önemli bilgiler özetlenip kalıcı bir depoya yazılır (yazma). Yeni bir istek geldiğinde, ilgili anılar genellikle anlamsal arama (semantic search) ya da geri getirmeli üretim (RAG) ile bulunup bağlama eklenir (okuma). Böylece model, sınırlı bağlam penceresini şişirmeden yalnızca gerekli geçmişi görür.

Dikkat edilmesi gereken tuzaklar: Her şeyi hatırlamaya çalışmak bağlamı doldurur, maliyeti ve gürültüyü artırır; bu yüzden neyin saklanacağı seçilmelidir. Hassas kişisel veri (PII) saklamak gizlilik ve uyumluluk (GDPR/KVKK) yükümlülükleri getirir. Yanlış ya da eskimiş anılar, ajanın güncel olmayan bilgiye dayanmasına yol açabilir; bu yüzden anıların güncellenmesi ve gerektiğinde silinmesi gerekir.

## 🎬 Detaylı Senaryo

"SağlıklıTabak" adlı bir beslenme uygulaması, kullanıcıya kişisel tarif öneren bir ajan kurar ve bunu hem kısa hem uzun süreli bellekle destekler:

1. Yeni kullanıcı kaydolur ve ajana "Glutensiz besleniyorum ve fıstık alerjim var" der.
2. Ajan bu iki kritik bilgiyi uzun süreli belleğe (kalıcı profil deposu) yazar.
3. Aynı oturumda kullanıcı "akşam yemeği için bir şey öner" der; ajan kısa süreli bellekteki konuşmayı da kullanarak öneri yapar.
4. Oturum biter; kısa süreli (çalışan) bellek sıfırlanır, ama profil bilgileri kalıcı depoda durur.
5. Bir hafta sonra kullanıcı geri döner ve "Bu hafta için tarif öner" der.
6. Ajan, uzun süreli bellekten "glutensiz" ve "fıstık alerjisi" anılarını geri çağırır ve bağlama ekler.
7. Önerdiği tariflerin hepsi glutensiz ve fıstıksız olur; kullanıcı kendini tekrar anlatmak zorunda kalmaz.
8. Kullanıcı "artık gluten yiyebiliyorum" deyince ajan ilgili anıyı günceller; eski kısıt kaldırılır.

Sonuç: Ajan, oturumlar arasında kişiselleşir ve zamanla daha isabetli öneriler verir.

## 💻 Kullanım / Uygulama Örneği

Basit bir kalıcı profil belleği deseni: tercihleri sakla, yeni istekte geri çağırıp bağlama ekle.

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY ortamdan okunur

# Uzun süreli bellek (gerçekte bir DB/vektör deposu olur)
uzun_sureli_bellek = {"diyet": "glutensiz", "alerji": "fıstık"}

def hatirlanan_baglam(bellek: dict) -> str:
    return "Kullanıcı tercihleri: " + ", ".join(f"{k}={v}" for k, v in bellek.items())

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=512,
    system="Sen bir beslenme asistanısın. " + hatirlanan_baglam(uzun_sureli_bellek),
    messages=[{"role": "user", "content": "Bu akşam için bir tarif öner"}],
)
print(resp.content[0].text)
```

Modern ajanlarda, modelin kendi belleğini yönetebildiği bellek aracı (memory tool) kullanılabilir:

```python
resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=512,
    tools=[{"type": "memory_20250818", "name": "memory"}],
    messages=[{"role": "user", "content": "Glutensiz beslendiğimi hatırla."}],
)
```

## 🔗 İlgili Kavramlar

- [Çalışan / Kısa Süreli Bellek (Working / Short-term Memory)](../working-short-term-memory/working-short-term-memory.md) — belleğin geçici, görev içi türü
- [Ajan (Agent)](../agent/agent.md) — belleği kullanan özerk sistem
- [Jetonlar (Tokens)](../tokens-tokenization/tokens-tokenization.md) — hatırlanan içerik bağlam jetonu tüketir
- [Temel Model (Foundation Model)](../foundation-model/foundation-model.md) — durumsuz çalışan ve belleğe ihtiyaç duyan model
- Geri Getirmeli Üretim (RAG) — ilgili anıları bağlama getiren mekanizma
- Vektör Deposu (Vector Store) — anlamsal aramaya dayalı uzun süreli bellek altyapısı
