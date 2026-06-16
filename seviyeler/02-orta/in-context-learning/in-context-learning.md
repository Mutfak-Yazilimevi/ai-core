# Bağlam İçi Öğrenme (Few/Zero-shot) (In-context Learning)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 3. Bağlam ve İstem Mühendisliği

Modele örnek vererek (few-shot) veya hiç örnek vermeden (zero-shot), eğitimini değiştirmeden istem içinde görev öğretme yöntemleridir.

## Mini Senaryo

> İsteme 2 örnek e-posta yanıtı koyarsın; ajan aynı üslupla üçüncüyü yazar.

## 📖 Ayrıntılı Açıklama

Bağlam içi öğrenme (in-context learning), bir dil modeline görevi, ağırlıklarını yeniden eğitmeden (fine-tuning olmadan), doğrudan istem (prompt) içinde öğretme yöntemidir. Modele birkaç örnek (few-shot) gösterilir ya da hiç örnek verilmeden sadece talimat verilir (zero-shot); model bu örneklerden deseni "anlık" çıkarıp aynı görevi yeni girdilere uygular. Öğrenme kalıcı değildir; yalnızca o çağrının bağlamı içinde geçerlidir.

Bu yöntem önemlidir; çünkü model davranışını ayarlamanın en hızlı, en ucuz ve en esnek yoludur. Yeni bir görev için veri toplayıp eğitim yapmak yerine, sadece isteme birkaç örnek eklemek genellikle yeterlidir. Format tutarlılığını sağlamak (her zaman aynı JSON yapısı), belirli bir üslubu taklit ettirmek veya nüanslı sınıflandırma kurallarını öğretmek için ideal bir tekniktir.

Nasıl çalışır? Zero-shot'ta sadece net bir talimat verilir ("Bu yorumu olumlu/olumsuz diye sınıflandır"). Few-shot'ta talimata ek olarak girdi→çıktı çiftlerinden oluşan örnekler eklenir; model bunları örüntü (pattern) olarak alır ve son (örneksiz) girdiye aynı kalıbı uygular. Örneklerin sırası, çeşitliliği ve formatı çıktı kalitesini doğrudan etkiler.

Ne zaman kullanılır? Görev tarifle tam anlatılamadığında, belirli bir çıktı formatı/üslubu istendiğinde, sınıflandırma sınırları örneklerle daha net olduğunda. Ne zaman gerekmez/yetersizdir? Görev gerçekten karmaşık ve örneklerle ifade edilemiyorsa, ya da binlerce örnek gerekiyorsa; bu durumda ince ayar (fine-tuning) daha uygundur.

Tuzaklar: Birincisi, dengesiz örnekler — hepsi "olumlu" olan örnekler modeli o yöne sapmaya iter (bias). İkincisi, örneklerin bağlam penceresini (context window) şişirmesi; çok fazla örnek maliyeti artırır, az örnek deseni öğretmez. Üçüncüsü, örnek formatıyla beklenen çıktı formatının tutarsız olması; model en son gördüğü kalıbı taklit eder.

## 🎬 Detaylı Senaryo

Bir müşteri deneyimi ekibi ("MutluMüşteri"), gelen e-postalara markaya uygun üslupta yanıt taslağı üreten bir asistan ister:

1. Ekip, marka sesinin "sıcak, kısa ve çözüm odaklı" olmasını ister ama bunu kelimelerle tam tarif edemez.
2. Önce zero-shot dener: "Bu e-postaya markamızın üslubuyla yanıt yaz." Sonuç fazla resmi çıkar.
3. İstemin başına, geçmişten seçilmiş 2 ideal yanıt örneğini (girdi e-posta → ideal yanıt) ekler (few-shot).
4. Model artık örneklerdeki sıcak ve kısa üslubu taklit eder; üçüncü yeni e-postaya aynı tonda yanıt üretir.
5. Ekip, örneklerden birinin çok uzun olduğunu fark eder; model uzun yanıtlar üretmeye başlar.
6. Uzun örneği kısa bir örnekle değiştirir; çıktılar derhal kısalır.
7. Farklı senaryoları (iade, gecikme, teşekkür) kapsayan çeşitli 3 örnek seçerek deseni dengeleyip kalıcılaştırır.
8. Hacim çok büyüyünce, ekip ileride ince ayara (fine-tuning) geçmeyi değerlendirir ama mevcut few-shot çözüm yeterli olur.

## 💻 Kullanım / Uygulama Örneği

Aşağıda few-shot örnekli bir istem yer alır: modele birkaç girdi→çıktı çifti gösterilir, ardından örneksiz yeni girdi verilir.

```python
import anthropic

client = anthropic.Anthropic()

# Few-shot: örnekler deseni öğretir
istem = """Aşağıdaki müşteri e-postalarına kısa, sıcak ve çözüm odaklı yanıt yaz.

E-posta: Siparişim 3 gündür gelmedi.
Yanıt: Gecikme için çok üzgünüz! Kargonuzu hemen takibe aldık, bugün içinde size dönüş yapacağız.

E-posta: Ürün harika, teşekkürler!
Yanıt: Bunu duymak bizi çok mutlu etti, teşekkürler! İyi günlerde kullanın.

E-posta: Faturada fazla ücret görüyorum.
Yanıt:"""

resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=256,
    messages=[{"role": "user", "content": istem}])
print(next(b.text for b in resp.content if b.type == "text"))
```

İkinci olarak, zero-shot'ta sadece net talimat yeterlidir: `"Bu yorumu olumlu, olumsuz veya nötr olarak tek kelimeyle sınıflandır: '...'"` — örnek olmadan da basit görevlerde çalışır.

## 🔗 İlgili Kavramlar

- [Bağlam Penceresi (Context Window)](../context-window/context-window.md) — örneklerin sığması gereken sınır
- [İstem Mühendisliği (Prompt Engineering)](../../03-ileri/context-engineering/context-engineering.md) — örnek seçimi ve istem tasarımı
- [Prompt Chaining (İstem Zincirleme)](../prompt-chaining/prompt-chaining.md) — örnek temelli adımların zincirlenmesi
- Few-shot / Zero-shot — örnekli ve örneksiz öğretim biçimleri
- İnce Ayar (Fine-tuning) — kalıcı öğrenme gerektiğinde alternatif
