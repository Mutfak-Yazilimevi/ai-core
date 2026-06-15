# Anlamsal Bellek (Semantic Memory)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Ajanın; sistem, iş kuralları veya dünyayla ilgili genel doğruları ve konseptleri (kronolojik olaylardan bağımsız olarak) sakladığı yapılandırılmış bilgi hafızasıdır.

## Mini Senaryo

> Ajan, "şirketimizin çalışma saatleri 9-18" gibi genel bir gerçeği kalıcı olarak bilir.

## 📖 Ayrıntılı Açıklama

Anlamsal bellek (semantic memory), bir ajanın sistem, iş kuralları ve dünyayla ilgili genel doğruları, kavramları ve gerçekleri (facts) kronolojik olaylardan bağımsız olarak sakladığı yapılandırılmış bilgi hafızasıdır. Terim, insan belleği psikolojisinden ödünç alınmıştır: "Paris Fransa'nın başkentidir" gibi genel bilgi anlamsal belleğe, "geçen yıl Paris'e gittim" gibi kişisel olaylar ise epizodik belleğe (episodic memory) aittir. Ajan bağlamında anlamsal bellek, "ne olduğu" değil "neyin doğru olduğu" bilgisidir.

Önemi, bir ajana kalıcı ve tutarlı bir bilgi temeli sağlamasıdır. Bir ajan her oturumda sıfırdan başlarsa, şirket politikalarını, ürün özelliklerini veya temel kuralları sürekli yeniden öğrenmek zorunda kalır. Anlamsal bellek bu genel doğruları kalıcılaştırır; ajan "çalışma saatleri 9-18'dir" veya "iade süresi 14 gündür" gibi gerçekleri her seferinde sorgulamadan bilir. Bu, hem tutarlılık (aynı soruya hep aynı yanıt) hem de verimlilik sağlar.

Nasıl çalışır: Genel doğrular yapılandırılmış bir biçimde saklanır; bu bir bilgi grafiği (knowledge graph), bir gerçekler veritabanı, anahtar-değer deposu veya gömme (embedding) tabanlı bir vektör deposu olabilir. Ajan bir göreve geldiğinde, ilgili gerçekleri bu bellekten çekip (retrieval) bağlamına ekler. Anlamsal arama kullanılıyorsa, soruyla anlamca en yakın gerçekler getirilir.

Ne zaman kullanılır: İstikrarlı, nadiren değişen bilgilerin (politikalar, tanımlar, kavramlar) ajanlar arası ve oturumlar arası tutarlı kullanılması gerektiğinde. Ne zaman uygun değildir: Hızla değişen, olaya bağlı veya kişiye özel anlık bilgiler için; bunlar epizodik veya kısa vadeli belleğe aittir. Anlamsal bellekte güncel olmayan bir gerçek, yanlış yanıtlar üretir.

Tuzaklar: Bellekteki gerçeklerin güncelliği kritiktir; "çalışma saatleri" değişirse bellek güncellenmezse ajan yanlış bilgi verir. Çelişen gerçekler (aynı konuda iki farklı kayıt) belirsizlik yaratır. Aşırı dolu bellek ilgisiz gerçekleri de getirip bağlamı kirletebilir; iyi bir erişim/filtreleme katmanı gerekir. Epizodik ile anlamsal belleğin karıştırılması (olayların genel gerçek gibi saklanması) hatalara yol açar.

## 🎬 Detaylı Senaryo

"TeknoMarket" adlı bir elektronik perakendecisi, müşteri destek ajanını anlamsal bellekle güçlendiriyor. Amaç, ajanın şirket politikalarını ve ürün gerçeklerini tutarlı biçimde bilmesi.

1. Ürün ve operasyon ekibi şirketin sabit gerçeklerini belirliyor: çalışma saatleri, iade süresi, garanti koşulları, kargo süreleri.
2. Bu gerçekler anlamsal belleğe yapılandırılmış kayıtlar olarak yazılıyor; her biri konu ve değerle etiketleniyor.
3. Bir müşteri akşam 19:00'da "şimdi mağazaya gelebilir miyim?" diye soruyor.
4. Ajan anlamsal bellekten "çalışma saatleri 9-18" gerçeğini çekiyor.
5. Bu gerçeği bağlamına ekleyip "Mağazamız 18:00'de kapanıyor, şu an kapalıyız" yanıtını veriyor.
6. Başka bir müşteri "ürünü 20 gün önce aldım, iade edebilir miyim?" diye soruyor.
7. Ajan "iade süresi 14 gün" gerçeğini bellekten alıp 20 > 14 olduğunu görüyor ve iade süresinin dolduğunu açıklıyor.
8. Şirket bir kampanya kapsamında iade süresini geçici olarak 30 güne çıkarınca, ekip yalnızca anlamsal bellekteki ilgili kaydı güncelliyor.
9. Ajan kodu değişmeden, sonraki tüm yanıtlarda yeni 30 günlük kural otomatik geçerli oluyor.
10. Tüm ajan örnekleri aynı belleği paylaştığı için müşteriler hangi kanaldan sorarsa sorsun tutarlı yanıt alıyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, basit bir yapılandırılmış gerçek deposunu ve erişimi gösterir.

```python
class AnlamsalBellek:
    """Genel doğruları konuya göre saklayıp getiren basit bellek."""
    def __init__(self):
        self.gercekler = {}

    def yaz(self, konu: str, deger: str):
        self.gercekler[konu] = deger  # gerçeği kalıcılaştır/güncelle

    def getir(self, konu: str) -> str | None:
        return self.gercekler.get(konu)

bellek = AnlamsalBellek()
bellek.yaz("calisma_saatleri", "09:00-18:00")
bellek.yaz("iade_suresi_gun", "14")
print(bellek.getir("calisma_saatleri"))  # '09:00-18:00'
```

İkinci örnek, bellekten getirilen gerçeği modelin bağlamına ekleyerek tutarlı yanıt üretir.

```python
import anthropic
client = anthropic.Anthropic()

gercek = bellek.getir("iade_suresi_gun")  # '14'
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=256,
    system=f"Bilinen gerçek: iade süresi {gercek} gündür. Bu gerçeğe sadık kal.",
    messages=[{"role": "user", "content":
        "Ürünü 20 gün önce aldım, iade edebilir miyim?"}])
# Model, belleğe dayanarak süreyi doğru karşılaştırıp yanıt verir.
```

## 🔗 İlgili Kavramlar

- [Yeniden Sıralama (Reranking)](../reranking/reranking.md) — bellekten getirilen gerçekleri alaka düzeyine göre süzme.
- [Semantik Yönlendirme (Semantic Routing)](../semantic-routing/semantic-routing.md) — anlamsal arama ortak altyapısını paylaşan teknik.
- Epizodik Bellek (Episodic Memory) — olaya/zamana bağlı, anlamsal belleğin tamamlayıcısı.
- Bilgi Grafiği (Knowledge Graph) — gerçekleri ilişkili biçimde saklamanın bir yolu.
- RAG (Retrieval-Augmented Generation) — bellekten bilgi çekip yanıta katma deseni.
