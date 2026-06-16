# Bağlam Sıkıştırma / Özetleme (Context Compression / Summarization)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 3. Bağlam ve İstem Mühendisliği

Bağlam penceresine sığması için geçmiş bilgiyi özetleyerek veya filtreleyerek sıkıştırma tekniğidir.

## Mini Senaryo

> 20 turluk uzun sohbet, pencereye sığması için "kullanıcı X istiyor, Y'yi reddetti" diye özetlenir.

## 📖 Ayrıntılı Açıklama

Bağlam Sıkıştırma / Özetleme (Context Compression / Summarization), bir ajanın biriken geçmişini (sohbet, araç çıktıları, gözlemler) bağlam penceresine (context window) sığacak şekilde özetleyerek veya filtreleyerek küçültme tekniğidir. Modellerin işleyebileceği belirteç (token) sayısı sınırlıdır; uzun süren bir görevde geçmiş bu sınırı aşar. Sıkıştırma, "neyi tutup neyi atacağız?" sorusunu yöneterek konuşmanın özünü korurken hacmi düşürür.

Bu önemlidir çünkü bağlam penceresi dolduğunda en eski mesajlar düşer ve ajan "unutmaya" başlar; ya da pencere şişince hem maliyet hem gecikme (latency) artar, hatta model dikkatini dağıtır ("ortada kaybolma" / lost in the middle). İyi bir sıkıştırma, ajanın uzun görevlerde tutarlı kalmasını sağlarken token maliyetini düşük tutar.

Nasıl çalışır: Yaygın yaklaşımlar; (1) eski mesajları daha küçük bir model veya aynı modelle özetleyip özetin orijinalin yerine koyulması (özyinelemeli özetleme / recursive summarization), (2) yalnızca alakalı kısımların seçilmesi (filtreleme), (3) önemli gerçeklerin kalıcı bir nota/belleğe yazılıp ham diyaloğun atılması. Genellikle bir eşik (örn. token sayısı) aşılınca tetiklenir.

Ne zaman kullanılır: Uzun çok turlu diyaloglarda, uzun süreli ajan görevlerinde, büyük araç çıktılarının biriktiği durumlarda. Ne zaman dikkat edilir: Hassas detayların (tam sayılar, kimlikler, kararlar) kaybolmaması gerektiğinde; bu detaylar özetlenmeden ayrıca saklanmalıdır.

Tuzaklar: Özetleme kayıplıdır (lossy) — kritik bir karar veya sayı özette kaybolabilir. Çok agresif sıkıştırma "anlam erozyonu" yaratır; ajan neden bir karar aldığını unutur. Ayrıca her turda özetlemek ek model çağrısı maliyeti getirir; tetikleme eşiği dengeli seçilmelidir. Özetlenen içeriğin orijinaline gerektiğinde erişilebilmesi için ham kayıtların ayrı tutulması iyi bir pratiktir.

## 🎬 Detaylı Senaryo

"DanışmanX" adlı bir müşteri destek firmasının ajanı, uzun bir teknik destek görüşmesini yürütüyor.

1. Müşteri bir ürün sorununu 25 mesaj boyunca adım adım anlatır; ajan her adımda tanı denemeleri yapar.
2. 18. turda geçmiş, bağlam penceresinin %80'ini doldurur; izleme sistemi token eşiğini aştığını bildirir.
3. Ajan ilk 15 turu bir özetleme adımına gönderir: "Müşteri X modeli kullanıyor, A ve B çözümleri denendi ve işe yaramadı, hata kodu E42."
4. Özet, ham 15 turun yerine konur; kritik detaylar (model, denenen çözümler, hata kodu) korunur.
5. Ham diyalog ayrı bir kayıtta saklanır ki gerekirse geri getirilebilsin.
6. Ajan kalan boşlukla yeni mesajları işlemeye devam eder; tutarlılığını kaybetmez çünkü özet kararları içerir.
7. 24. turda müşteri eski bir detaya döner; ajan özetten bunu bulamayınca ham kayda başvurup tam ifadeyi getirir.
8. Görüşme çözülünce nihai özet, müşterinin kalıcı kaydına (episodic memory) yazılır.

## 💻 Kullanım / Uygulama Örneği

Belirli bir token eşiği aşılınca eski mesajlar özetlenip yerine konur. Aşağıda Anthropic SDK ile özyinelemeli özetleme gösterilmektedir.

```python
import anthropic

client = anthropic.Anthropic()

def gecmisi_sikistir(eski_mesajlar: list[dict]) -> str:
    metin = "\n".join(f"{m['role']}: {m['content']}" for m in eski_mesajlar)
    resp = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"Aşağıdaki diyaloğu kararları ve sayıları koruyarak özetle:\n{metin}",
        }],
    )
    return resp.content[0].text
```

```python
# Eşik tabanlı tetikleme: pencere dolunca eski turları özetle, son turları bırak
TOKEN_ESIGI = 6000

def pencereyi_yonet(mesajlar: list[dict], token_say) -> list[dict]:
    if token_say(mesajlar) < TOKEN_ESIGI:
        return mesajlar
    ozet = gecmisi_sikistir(mesajlar[:-4])        # eski kısmı özetle
    return [{"role": "user", "content": f"[ÖZET] {ozet}"}] + mesajlar[-4:]
```

## 🔗 İlgili Kavramlar

- [Bağlam Mühendisliği (Context Engineering)](../context-engineering/context-engineering.md) — neyin bağlama gireceğini tasarlama
- [Bölümsel Bellek (Episodic Memory)](../episodic-memory/episodic-memory.md) — özetlenen detayların kalıcı saklanması
- [Bilgi Grafiği (Knowledge Graph)](../knowledge-graph/knowledge-graph.md) — yapılandırılmış bilgi olarak saklama
- Bağlam Penceresi (Context Window) — token sınırının kaynağı
- Geri Getirmeli Üretim (RAG) — alakalı bilgiyi dışarıdan çekme
