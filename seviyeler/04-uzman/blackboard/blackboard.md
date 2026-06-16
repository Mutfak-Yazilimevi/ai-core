# Kara Tahta Mimarisi (Blackboard)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Ajanların ortak ve paylaşılan bir bellek alanı ("kara tahta") üzerinden dolaylı olarak işbirliği yaptığı klasik mimaridir.

## Mini Senaryo

> Farklı uzman ajanlar ortak bir "tahtaya" bulgularını yazar; biri diğerinin notunu görüp ilerletir.

## 📖 Ayrıntılı Açıklama

Kara Tahta Mimarisi (Blackboard), birden çok uzman bileşenin (ajanın) doğrudan birbirine mesaj göndermek yerine, ortak ve paylaşılan bir bellek alanı (shared workspace) üzerinden dolaylı olarak işbirliği yaptığı klasik bir yapay zeka mimarisidir. Adını, bir grup uzmanın bir okul tahtası etrafında toplanıp herkesin kendi bildiğini yazdığı ve başkalarının yazdıklarından beslendiği bir beyin fırtınası metaforundan alır. Her ajan tahtayı sürekli izler; kendi katkısını yapabileceği bir durum gördüğünde devreye girer.

Bu kavram önemlidir çünkü problemin çözüm yolu önceden belli olmadığında (örn. açık uçlu analiz, plan oluşturma, çok kaynaklı sentez) ajanlar arasında katı bir çağrı sırası tanımlamak zorlaşır. Kara tahta, "kim ne zaman konuşacak" kararını merkezî bir akışa hardcode etmek yerine, ajanların verinin durumuna (state) göre fırsatçı (opportunistic) biçimde tetiklenmesini sağlar. Bu sayede yeni bir uzman ajan eklemek, sadece tahtayı dinleyen yeni bir bileşen koymak kadar kolaydır; gevşek bağlılık (loose coupling) sağlar.

Nasıl çalışır? Üç ana bileşen vardır: (1) Kara tahta (blackboard) — tüm ara sonuçların, hipotezlerin ve verilerin tutulduğu paylaşılan veri yapısı; (2) Bilgi kaynakları (knowledge sources) — her biri belirli bir uzmanlığa sahip ajanlar; (3) Kontrol bileşeni (control) — bir sonraki adımda hangi ajanın çalışacağına karar veren zamanlayıcı. Bir ajan tahtaya yazdığında, kontrol bileşeni bu yeni durumla ilgilenebilecek başka bir ajanı uyandırır.

Ne zaman kullanılır? Çözümün adımları önceden bilinmeyen, parça parça ilerleyen ve farklı uzmanlıkların birbirini beslediği problemlerde (örn. belge anlama, çok modlu sentez, karmaşık teşhis). Ne zaman kullanılmaz? Adımları net ve doğrusal olan iş akışlarında bir kara tahta gereksiz karmaşıklık katar; orada basit bir boru hattı (pipeline) veya orkestratör yeterlidir.

Tuzaklar: Tahtaya yazma/okuma için eşzamanlılık (concurrency) kontrolü konmazsa yarış durumları (race conditions) oluşur. Ajanların durumu yanlış yorumlayıp aynı işi tekrar yapması (sonsuz döngü) riski vardır; bu yüzden bir döngü sınırı (loop limit) ve "tamamlandı" koşulu şarttır. Ayrıca tahta büyüdükçe her ajanın tüm tahtayı okuması bağlam (context) ve maliyet açısından pahalılaşır.

## 🎬 Detaylı Senaryo

"HukukAnaliz" adlı bir hukuk teknolojisi şirketi, uzun sözleşmeleri inceleyip risk raporu çıkaran bir sistem geliştiriyor; tek bir ajan tüm işi yapmak yerine uzman ajanlar bir kara tahta üzerinde işbirliği yapıyor.

1. **Başlatma:** Sözleşme metni kara tahtaya "ham belge" olarak yazılır.
2. **Bölümleyici ajan:** Tahtayı izleyen "bölümleyici" ajan ham belgeyi görür, maddelere ayırır ve bölümleri tahtaya ekler.
3. **Tanım ajanı:** Bölümleri gören "tanım çıkaran" ajan, sözleşmedeki tarafları ve tanımlı terimleri tespit edip tahtaya yazar.
4. **Risk ajanı:** Tahtadaki maddeleri ve tanımları gören "risk" ajanı, tek taraflı fesih ve sınırsız sorumluluk gibi riskli maddeleri işaretler.
5. **Fırsatçı tetikleme:** Risk ajanı bir "belirsiz tazminat" maddesi bulunca, tahtaya bir "açıklama gerekli" notu düşer.
6. **Sorgulama ajanı:** Bu notu gören "sorgulama" ajanı, ilgili maddeyi netleştirmek için bir özet soru üretip tahtaya ekler.
7. **Kontrol bileşeni:** Zamanlayıcı, her yeni katkıdan sonra hangi ajanın ilgileneceğine karar verir; ilgilenen ajan kalmayınca süreç durur.
8. **Sentez ajanı:** Tahtada yeterli bulgu birikince "raportör" ajan hepsini tek bir risk raporuna sentezler.
9. **Sonlandırma:** Rapor tahtaya yazılır, "tamamlandı" bayrağı kalkar ve sistem çıktıyı insan avukata sunar.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, basit bir kara tahta ve onu izleyen ajanların fırsatçı tetiklenmesini gösterir.

```python
import anthropic

client = anthropic.Anthropic()
tahta = {"ham_metin": "Sözleşme: Taraf A...", "bolumler": None, "riskler": None}

def llm(gorev: str, icerik: str) -> str:
    yanit = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        system=f"Sen bir {gorev} uzmanısın. Sadece kendi uzmanlığını uygula.",
        messages=[{"role": "user", "content": icerik}],
    )
    return "".join(b.text for b in yanit.content if b.type == "text")

# Bilgi kaynakları: koşul sağlanınca tetiklenen ajanlar
def bolumleyici():
    if tahta["ham_metin"] and tahta["bolumler"] is None:
        tahta["bolumler"] = llm("bölümleyici", tahta["ham_metin"])

def risk_ajani():
    if tahta["bolumler"] and tahta["riskler"] is None:
        tahta["riskler"] = llm("hukuki risk", tahta["bolumler"])

# Kontrol döngüsü: ilgilenen ajan kalmayana kadar çalış
ajanlar = [bolumleyici, risk_ajani]
for _ in range(10):  # döngü sınırı
    onceki = dict(tahta)
    for ajan in ajanlar:
        ajan()
    if onceki == tahta:  # değişiklik yoksa bitti
        break
```

İkinci örnek, tahtanın eşzamanlı erişime karşı bir kilitle (lock) korunmasını gösterir:

```python
import threading

class KaraTahta:
    def __init__(self):
        self._veri = {}
        self._kilit = threading.Lock()

    def yaz(self, anahtar, deger):
        with self._kilit:  # yarış durumunu önle
            self._veri[anahtar] = deger

    def oku(self, anahtar):
        with self._kilit:
            return self._veri.get(anahtar)
```

## 🔗 İlgili Kavramlar

- [Sürü (Swarm)](../swarm/swarm.md) — merkeziyetsiz ama doğrudan haberleşen koordinasyon
- [Ajan Münazarası (Multi-Agent Debate)](../multi-agent-debate/multi-agent-debate.md) — ajanların etkileşimle yakınsaması
- [Bütçe / Döngü Sınırı (Budget / Loop Limits)](../budget-loop-limits/budget-loop-limits.md) — kontrol döngüsünü güvenli tutma
- Orkestratör (Orchestrator) — merkezî koordinasyon alternatifi
- Paylaşılan Bellek (Shared Memory) — tahtanın temel veri yapısı
