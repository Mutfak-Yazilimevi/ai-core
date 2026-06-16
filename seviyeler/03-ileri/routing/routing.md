# Yönlendirme (Routing)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Gelen girdiyi, onu en iyi işleyecek uzman ajana, modele veya araca yönlendiren karar mekanizmasıdır.

## Mini Senaryo

> Gelen talep "fatura" içeriyorsa muhasebe ajanına, "arıza" içeriyorsa teknik ajana gider.

## 📖 Ayrıntılı Açıklama

Yönlendirme (routing), gelen bir girdiyi (kullanıcı mesajı, görev, istek) onu en iyi işleyecek hedefe; yani uygun bir uzman ajana (specialist agent), modele veya araca (tool) iletmeye karar veren mekanizmadır. Bir santral memuru veya akıllı bir API ağ geçidi (gateway) gibi düşünülebilir: her gelen isteği analiz eder ve doğru kapıya yönlendirir. Tek bir devasa "her işi yapan" ajan yerine, her biri kendi alanında güçlü birden çok bileşeni koordine etmenin temel yoludur.

Önemi, ölçeklenebilirlik ve kalitedir. Tek bir model tüm görevleri eşit iyi yapamaz; ayrıca her isteği en güçlü (ve en pahalı) modele göndermek israftır. Yönlendirme, basit istekleri ucuz/hızlı modellere, karmaşık olanları güçlü modellere, alana özgü olanları uzman ajanlara dağıtarak hem maliyeti hem yanıt kalitesini optimize eder. Aynı zamanda sistemi modüler kılar: yeni bir uzman eklemek, tüm sistemi yeniden tasarlamadan yönlendiriciye bir hedef daha tanıtmaktan ibarettir.

Nasıl çalışır: Yönlendirici (router) girdiyi inceler ve bir hedef seçer. Bu seçim kural tabanlı (anahtar kelime, regex, if/else), sınıflandırıcı tabanlı (bir model girdiyi kategorilere ayırır) veya anlamsal (semantic) olabilir. Anlamsal yönlendirmede girdinin niyeti/anlamı dikkate alınır; sadece kelime eşleşmesi değil. Seçim yapıldıktan sonra istek ilgili hedefe iletilir ve yanıt geri toplanır.

Ne zaman kullanılır: Birden çok uzmanlık alanı, farklı maliyet/yetenek profilli modeller veya çeşitli araçlar olduğunda. Ne zaman gereksiz olabilir: Tek tip görev varsa veya tek bir model her şeyi yeterince iyi yapıyorsa yönlendirme gereksiz karmaşıklık ekler.

Tuzaklar: Yanlış yönlendirme (misrouting) tüm akışı bozar; yönlendirici yanılırsa doğru ajan bile devreye girmez. Belirsiz girdilerde net hedef seçilemez; bir "varsayılan/yedek" (fallback) hedef tanımlamak gerekir. Aşırı katı kurallar yeni durumları kaçırır; aşırı esnek yönlendirme tutarsızlık üretir. Yönlendirme kararlarını kaydedip izlemek, hataları yakalamak için önemlidir.

## 🎬 Detaylı Senaryo

"DestekHattı" adlı bir e-ticaret şirketi, müşteri destek taleplerini otomatik karşılamak için bir yönlendirici ajan kuruyor. Arkada muhasebe, teknik ve iade olmak üzere üç uzman ajan var.

1. Bir müşteri "geçen ayki faturamda hata var" mesajını gönderiyor.
2. Yönlendirici mesajı alıp niyetini analiz ediyor.
3. "Fatura" ve "hata" sinyalleri muhasebe alanına işaret ediyor; yönlendirici muhasebe ajanını seçiyor.
4. Muhasebe ajanı faturayı inceleyip düzeltme yapıyor ve müşteriye dönüyor.
5. Başka bir müşteri "uygulama açılmıyor, sürekli çöküyor" yazıyor.
6. Yönlendirici bu kez teknik destek ajanını seçiyor; teknik ajan sorun giderme adımlarını sunuyor.
7. Üçüncü bir müşteri "ürünü beğenmedim, geri göndermek istiyorum" diyor; yönlendirici iade ajanına yönlendiriyor.
8. Belirsiz bir mesaj geldiğinde ("merhaba") yönlendirici hiçbir uzmana güvenle karar veremiyor ve varsayılan genel yardım ajanına düşürüyor.
9. Tüm yönlendirme kararları gerekçesiyle kaydediliyor.
10. Ekip, haftalık olarak yanlış yönlendirilen vakaları inceleyip yönlendirme mantığını iyileştiriyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, basit kural tabanlı bir yönlendiriciyi gösterir: anahtar kelimelere göre hedef ajan seçilir.

```python
def yonlendir(mesaj: str) -> str:
    """Mesajı anahtar kelimelere göre uygun uzman ajana yönlendirir."""
    m = mesaj.lower()
    if any(k in m for k in ["fatura", "ödeme", "ücret"]):
        return "muhasebe_ajani"
    if any(k in m for k in ["arıza", "çöküyor", "hata", "açılmıyor"]):
        return "teknik_ajan"
    if any(k in m for k in ["iade", "geri gönder", "iptal"]):
        return "iade_ajani"
    return "genel_yardim_ajani"  # varsayılan/yedek hedef
```

İkinci örnek, bir LLM ile sınıflandırma tabanlı yönlendirme yapar; model girdiyi kategorilere ayırır.

```python
import anthropic
client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=64,
    messages=[{"role": "user", "content":
        "Aşağıdaki müşteri mesajını şu kategorilerden birine ata "
        "(muhasebe / teknik / iade / genel) ve yalnızca kategori adını yaz:\n"
        "'Paramı hâlâ geri alamadım'"}])
# Modelin döndürdüğü kategori, ilgili uzman ajanı seçmek için kullanılır.
```

## 🔗 İlgili Kavramlar

- [Semantik Yönlendirme (Semantic Routing)](../semantic-routing/semantic-routing.md) — anlam temelli, daha akıllı yönlendirme biçimi.
- [Yönetici-İşçi (Supervisor / Manager-Worker)](../supervisor-manager-worker/supervisor-manager-worker.md) — yönlendirmenin hiyerarşik bir biçimi.
- [Görev Parçalama (Task Decomposition)](../task-decomposition/task-decomposition.md) — yönlendirmeden önce işi parçalara ayırma.
- Orkestrasyon (Orchestration) — birden çok ajanı koordine etme.
- Yedek Mekanizma (Fallback) — yönlendirme kararsız kaldığında devreye giren güvenlik ağı.
