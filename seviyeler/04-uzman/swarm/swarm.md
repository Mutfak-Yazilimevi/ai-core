# Sürü (Swarm)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Katı bir hiyerarşi veya merkezî bir orkestratör olmadan, çok sayıda spesifik ajanın bir arı sürüsü gibi birbiriyle doğrudan haberleşerek büyük bir problemi çözdüğü merkeziyetsiz mimaridir.

## Mini Senaryo

> Yüzlerce küçük ajan, merkezî yönetici olmadan haberleşerek bir şehrin trafiğini optimize eder.

## 📖 Ayrıntılı Açıklama

Sürü (Swarm), katı bir hiyerarşi veya tek bir merkezî orkestratör (orchestrator) olmadan, çok sayıda görece basit ajanın bir arı sürüsü ya da karınca kolonisi gibi yerel kurallarla ve eşler arası (peer-to-peer) haberleşmeyle birlikte büyük bir problemi çözdüğü merkeziyetsiz (decentralized) bir mimaridir. Sistemdeki "akıllı" davranış, tek bir ajandan değil, çok sayıda ajanın etkileşiminden beliren (emergent) toplu davranıştan doğar.

Bu kavram önemlidir çünkü merkezî bir koordinatör bazı durumlarda darboğaz (bottleneck) ve tek hata noktası (single point of failure) oluşturur; çok büyük ölçekte veya doğası gereği dağıtık problemlerde (trafik, lojistik, dağıtık arama) merkezden yönetmek hem yavaş hem kırılgandır. Sürü mimarisi, ajanların yerel kararlar alıp komşularıyla bilgi paylaşmasıyla ölçeklenebilir (scalable) ve dayanıklı (resilient) bir çözüm sunar; birkaç ajan düşse bile sistem çalışmaya devam eder.

Nasıl çalışır? Her ajan basit yerel kurallara sahiptir ve yalnızca yakın komşularıyla veya paylaşılan bir ortamla etkileşir. Ajanlar küresel (global) durumu bilmez; kendi gözlemlerine ve aldıkları mesajlara göre davranır. Karınca kolonisi metaforunda olduğu gibi, ajanlar dolaylı ipuçları (örn. "feromon izi") bırakarak birbirini yönlendirebilir. Bu yerel etkileşimlerin toplamından, kimsenin tek başına tasarlamadığı küresel bir çözüm belirir (örn. en kısa yol, dengeli yük dağılımı). Ayrıca ajanlar gerektiğinde kontrolü birbirine "devredebilir" (handoff).

Ne zaman kullanılır? Doğası gereği dağıtık, çok sayıda benzer alt görevin paralel yürütüldüğü ve merkezî kontrolün darboğaz olacağı problemlerde: dağıtık arama, simülasyon, lojistik optimizasyonu, çok sayıda uzman ajan arasında devir-teslimli akışlar. Ne zaman kullanılmaz? Sıkı koordinasyon, küresel tutarlılık veya net bir karar otoritesi gereken görevlerde; orada merkezî bir orkestratör veya hiyerarşi daha uygundur.

Tuzaklar: Beliren davranışı tahmin etmek ve hata ayıklamak (debugging) zordur; sistem bütünüyle istenmeyen bir duruma yakınsayabilir. Merkezî denetim olmadığından küresel güvenlik ve bütçe sınırlarını uygulamak güçleşir; her ajan için ve toplamda sınır koymak gerekir. Ajanlar arası mesajlaşma kontrolsüz büyürse ağ ve maliyet patlar; ayrıca uzlaşı (consensus) garanti değildir.

## 🎬 Detaylı Senaryo

"AkışKent" adlı bir akıllı şehir şirketi, bir şehrin trafik ışıklarını merkezî bir sunucudan yönetmek yerine, her kavşağa kendi kararını veren bir ajan koyup sürü mantığıyla optimize ediyor.

1. **Kurulum:** Her kavşağa, yalnızca kendi sensör verisini gören ve komşu kavşaklarla haberleşen bir ajan yerleştirilir.
2. **Yerel kural:** Her ajanın basit bir kuralı vardır: "kendi sıranı azalt, yoğunluğu komşuna bildir".
3. **Komşu haberleşmesi:** Bir kavşak ajanı, yaklaşan yoğun trafiği fark edip komşu ajanlara "bana akış geliyor" mesajı yollar.
4. **Yerel uyum:** Komşu ajanlar bu bilgiye göre kendi ışık sürelerini ayarlayıp yeşil dalga oluşturur.
5. **Merkez yok:** Hiçbir ajan tüm şehrin durumunu bilmez; herkes yalnızca yerel bilgisine göre karar verir.
6. **Beliren davranış:** Bu yerel ayarların toplamından, kimsenin tek başına planlamadığı şehir çapında akıcı bir trafik akışı belirir.
7. **Dayanıklılık testi:** Bir kavşak ajanının sensörü arızalanır; komşular onun etrafında kendini yeniden düzenler, sistem çökmez.
8. **Sınır koyma:** Mesaj trafiğinin patlamaması için her ajana iletişim ve karar bütçesi konur.
9. **İzleme:** Operatörler, beliren davranışı denetlemek için toplu metrikleri (ortalama bekleme süresi) bir panodan izler.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, merkezî yönetici olmadan komşularıyla haberleşen basit bir sürü ajanını gösterir.

```python
class SuruAjani:
    def __init__(self, ad):
        self.ad = ad
        self.komsular = []
        self.yogunluk = 0

    def baglan(self, komsu):
        self.komsular.append(komsu)

    def algila(self, yeni_yogunluk):
        self.yogunluk = yeni_yogunluk
        if self.yogunluk > 80:  # yerel kural: eşik aşılınca komşuları uyar
            for k in self.komsular:
                k.uyari_al(self.ad, self.yogunluk)

    def uyari_al(self, kaynak, yogunluk):
        # yerel tepki: kendi süreni komşu yoğunluğuna göre ayarla
        print(f"{self.ad}: {kaynak}'tan yoğunluk {yogunluk}; uyum sağlanıyor")

a, b = SuruAjani("Kavşak-A"), SuruAjani("Kavşak-B")
a.baglan(b); b.baglan(a)
a.algila(95)  # A yoğunlaşır, B'yi uyarır; merkez yok
```

İkinci örnek, LLM tabanlı ajanlar arasında kontrolün merkezsiz biçimde devredilmesini (handoff) gösterir:

```python
import anthropic
client = anthropic.Anthropic()

def ajan_calistir(rol: str, gorev: str) -> str:
    yanit = client.messages.create(
        model="claude-opus-4-8", max_tokens=512,
        system=f"Sen {rol} ajanısın. İşin bittiğinde 'DEVRET: <ajan>' yaz.",
        messages=[{"role": "user", "content": gorev}],
    )
    return "".join(b.text for b in yanit.content if b.type == "text")
# Çıktıdaki 'DEVRET:' işaretine göre kontrol bir sonraki eşe geçer (merkezî yönetici yok)
```

## 🔗 İlgili Kavramlar

- [Kara Tahta Mimarisi (Blackboard)](../blackboard/blackboard.md) — paylaşılan alan üzerinden işbirliği
- [Ajan Münazarası (Multi-Agent Debate)](../multi-agent-debate/multi-agent-debate.md) — etkileşimle yakınsayan çoklu ajan
- [Bütçe / Döngü Sınırı (Budget / Loop Limits)](../budget-loop-limits/budget-loop-limits.md) — merkezsiz sistemde kaynak sınırı
- Orkestratör (Orchestrator) — merkezî koordinasyon alternatifi
- Beliren Davranış (Emergent Behavior) — sürünün temel özelliği
