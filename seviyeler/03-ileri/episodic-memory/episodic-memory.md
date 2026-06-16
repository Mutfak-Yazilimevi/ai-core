# Bölümsel Bellek (Episodic Memory)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Ajanın spesifik geçmiş olayları, önceki kullanıcı diyaloglarını ve kendi eylem geçmişini kronolojik bir dizi olarak hatırlama yeteneğidir. Uzun vadeli belleğin bir alt türüdür.

## Mini Senaryo

> Ajan "geçen salı şikayet eden müşteri" diyaloğunu olduğu gibi geri çağırır.

## 📖 Ayrıntılı Açıklama

Bölümsel Bellek (Episodic Memory), bir ajanın yaşadığı belirli olayları — geçmiş diyaloglar, aldığı eylemler, gözlemler — zamana bağlı "bölümler" (episodes) olarak saklayıp gerektiğinde geri çağırma yeteneğidir. İnsan belleğinde "geçen yıl tatilde olanları hatırlamak" gibidir: genel bilgi (anlamsal bellek / semantic memory) değil, somut bir olayın "ne, ne zaman, kimle, nasıl" detaylarıdır. Uzun vadeli belleğin (long-term memory) bir alt türüdür.

Bu önemlidir çünkü ajanların oturumlar arası süreklilik göstermesi, kişiselleşmesi ve geçmişten öğrenmesi buna bağlıdır. Bölümsel bellek olmadan ajan her seferinde "amnezi" yaşar; aynı kullanıcıya aynı soruları sorar, geçmiş kararları unutur. Bu bellek sayesinde ajan "bu müşteriyle daha önce ne konuştuk?" diye dönüp bakabilir.

Nasıl çalışır: Her etkileşim/olay, zaman damgası, katılımcılar ve içerikle birlikte bir kayıt deposuna (genellikle bir vektör veritabanı / vector database) yazılır. Yeni bir görevde ajan, mevcut duruma anlamsal olarak benzeyen geçmiş bölümleri arar (benzerlik araması / similarity search) ve en alakalılarını bağlamına getirir. Genellikle anahtar kelime, zaman ve anlamsal arama birlikte kullanılır.

Ne zaman kullanılır: Sürekli müşteri ilişkileri, kişisel asistanlar, uzun süreli projeler ve "geçen sefer ne oldu?" sorusunun önemli olduğu her yerde. Ne zaman gerekmez: Tek seferlik, durumsuz (stateless) görevlerde bölümsel belleğin yükü gereksizdir.

Tuzaklar: Her şeyi saklamak deponun şişmesine ve gürültüye yol açar; alaka ve tazelik (recency) ile budama (pruning) gerekir. Yanlış veya eski bir bölümün geri çağrılması ajanı yanıltabilir. Ayrıca kişisel verilerin saklanması gizlilik (privacy) ve saklama süresi (retention) kurallarına tabidir; unutma/silme (right to be forgotten) desteklenmelidir.

## 🎬 Detaylı Senaryo

"NetMağaza" adlı bir e-ticaret firmasının destek ajanı, müşterilerle sürekli ilişki yürütüyor.

1. Bir müşteri salı günü kargosunun geciktiğinden şikayet eder; ajan sorunu çözer ve tüm diyaloğu bir bölüm olarak kaydeder (zaman, müşteri kimliği, konu: kargo gecikmesi).
2. Perşembe günü aynı müşteri tekrar yazar: "Geçen seferki sorun yine oldu."
3. Ajan, müşteri kimliğiyle bölümsel belleği sorgular ve salı günkü kayıtla anlamsal eşleşmeyi bulur.
4. Geçen diyaloğun özetini bağlamına getirir; müşteriye sıfırdan sormak yerine "salı günkü kargo gecikmesi sorununuzla ilgili mi?" diye doğrudan ilerler.
5. Müşteri olumlu yanıt verir; ajan önceki çözümün işe yaramadığını görüp farklı bir yaklaşım dener.
6. Yeni etkileşim de bir bölüm olarak kaydedilir ve önceki bölümle ilişkilendirilir.
7. Bir ay sonra eski, çözülmüş ve artık alakasız bölümler budama politikasıyla arşive taşınır.
8. Müşteri verilerinin silinmesini isterse, ilgili tüm bölümler bellek deposundan kaldırılır (gizlilik uyumu).

## 💻 Kullanım / Uygulama Örneği

Olaylar zaman damgasıyla saklanır ve benzerlikle geri çağrılır. Aşağıda kavramsal bir bölümsel bellek deposu gösterilmektedir.

```python
from datetime import datetime

class BolumselBellek:
    def __init__(self):
        self._bolumler = []

    def kaydet(self, musteri_id: str, konu: str, icerik: str):
        self._bolumler.append({
            "musteri_id": musteri_id, "konu": konu, "icerik": icerik,
            "zaman": datetime.now().isoformat(),
        })

    def geri_cagir(self, musteri_id: str, sorgu: str, benzerlik) -> list[dict]:
        adaylar = [b for b in self._bolumler if b["musteri_id"] == musteri_id]
        # En alakalı olayları anlamsal benzerlikle sırala (vektör araması yerine kavramsal)
        return sorted(adaylar, key=lambda b: benzerlik(b["icerik"], sorgu), reverse=True)[:3]
```

```python
# Geri çağrılan bölümleri Anthropic çağrısının bağlamına ekleme
import anthropic
client = anthropic.Anthropic()

def yanitla(bellek, musteri_id, soru, benzerlik):
    gecmis = bellek.geri_cagir(musteri_id, soru, benzerlik)
    ozet = "\n".join(f"[{b['zaman']}] {b['konu']}: {b['icerik']}" for b in gecmis)
    return client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        messages=[{"role": "user", "content": f"Geçmiş olaylar:\n{ozet}\n\nYeni soru: {soru}"}],
    )
```

## 🔗 İlgili Kavramlar

- [Bilgi Grafiği (Knowledge Graph)](../knowledge-graph/knowledge-graph.md) — olaylar arası ilişkileri yapılandırma
- [Bağlam Sıkıştırma (Context Compression)](../context-compression/context-compression.md) — uzun bölümleri özetleyerek saklama
- [Bağlam Mühendisliği (Context Engineering)](../context-engineering/context-engineering.md) — alakalı bölümü bağlama getirme
- Anlamsal Bellek (Semantic Memory) — olaylar değil genel gerçekler
- Vektör Veritabanı (Vector Database) — benzerlik araması altyapısı
