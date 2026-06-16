# Çok Kipli (Multimodal)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 1. Temeller ve Çalışma Modeli

Ajanın yalnızca metni değil; görüntü, ses, video gibi farklı veri türlerini (kipleri) birlikte algılayıp üretebilme yeteneğidir. Gerçek dünyadaki çeşitli girdileri tek bir akışta işlemeyi sağlar.

## Mini Senaryo

> Kullanıcı bir faturanın fotoğrafını yükler; ajan görüntüyü okuyup tutarı metne döker.

## 📖 Ayrıntılı Açıklama

Çok kipli (multimodal) yapay zekâ, bir modelin tek bir veri türü yerine birden fazla veri türünü (modaliteyi) aynı bağlamda işleyebilmesidir. En yaygın biçimi metin ve görüntü birleşimidir; ama ses, video ve belge (PDF) gibi kipler de bu kapsama girer. Model, görüntüdeki nesneleri ve metinleri "okur", ardından bu algıyı metinsel muhakemeyle harmanlar. Böylece tek bir istem (prompt) içinde "şu grafikte hangi ay en yüksek satışı gösteriyor?" gibi karma sorular cevaplanabilir.

Bu yetenek önemlidir çünkü gerçek dünya verisi nadiren saf metindir. Faturalar, ekran görüntüleri, fotoğraflar, el yazısı notlar ve diyagramlar günlük iş akışlarının merkezindedir. Çok kipli bir ajan, kullanıcıdan "lütfen bu görüntüyü elle yazıya dök" diye istemek yerine doğrudan görüntüyü anlayarak adım sayısını azaltır ve hata payını düşürür. Bu, özellikle belge işleme (document processing), erişilebilirlik (accessibility) ve görsel kalite denetimi gibi alanlarda dönüştürücüdür.

Teknik olarak, Anthropic SDK ile görüntüler mesajın `content` alanında ayrı bloklar olarak gönderilir: bir `image` bloğu (base64 ya da URL) ve bir `text` bloğu yan yana durur. Model bu blokları tek bir bağlamda işler. Görüntüler genellikle metinden daha fazla jeton (token) tükettiği için maliyet ve gecikme (latency) artar; bu yüzden çözünürlük ve görüntü sayısı bilinçli yönetilmelidir.

Çok kipli yaklaşımı, görsel/işitsel bilginin kritik olduğu durumlarda kullanın: fiş okuma, kimlik doğrulama, tıbbi görüntü ön incelemesi, UI test ekran görüntüsü analizi gibi. Buna karşılık, veri zaten yapılandırılmış metin olarak mevcutsa (örneğin bir veritabanı satırı), görüntüye dönüştürüp modele vermek gereksiz maliyet ve doğruluk kaybı yaratır.

Başlıca tuzaklar: düşük çözünürlüklü veya bulanık görüntülerde modelin "halüsinasyon" yapması, küçük yazıları yanlış okuması ve görüntüdeki hassas/kişisel veriyi (PII) farkında olmadan işlemesidir. Üretim ortamında görüntü kalitesini ön doğrulama, sonuçları kritik alanlarda insan onayına (human-in-the-loop) bağlama ve gizlilik için maskeleme önerilir.

## 🎬 Detaylı Senaryo

Bir e-ticaret şirketi olan "TrendKutu"nun finans ekibi, tedarikçilerden gelen kâğıt faturaları manuel girişle sisteme işliyordu. Süreç hem yavaş hem hataya açıktı.

1. Muhasebe uzmanı Elif, tedarikçiden gelen bir faturanın fotoğrafını mobil uygulamadan yükler.
2. Uygulama görüntüyü base64'e çevirip çok kipli ajana bir `image` ve bir `text` bloğu olarak gönderir.
3. Ajan görüntüdeki tablo yapısını ve sayıları okur; "fatura no", "tarih", "KDV", "toplam tutar" alanlarını ayıklar.
4. Model yapılandırılmış bir JSON döndürür: `{"fatura_no": "...", "toplam": 4250.00, "kdv": 765.00}`.
5. Sistem, görüntünün bulanık olduğu kısımlarda düşük güven (confidence) işareti koyar.
6. Düşük güvenli alanlar Elif'in onayına düşer; o sadece bu birkaç alanı kontrol eder.
7. Onaylanan veri muhasebe yazılımına otomatik aktarılır.
8. Telemetri, görüntü başına jeton tüketimini ve ortalama doğruluğu panoya yazar.
9. Ay sonunda ekip, manuel giriş süresinin yüzde 70 azaldığını raporlar.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, bir görüntü (base64) ile metin sorusunu aynı mesajda gönderir.

```python
import anthropic, base64

client = anthropic.Anthropic()

with open("fatura.jpg", "rb") as f:
    img_b64 = base64.standard_b64encode(f.read()).decode("utf-8")

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {"type": "image", "source": {
                "type": "base64", "media_type": "image/jpeg", "data": img_b64}},
            {"type": "text", "text": "Bu faturadaki toplam tutarı ve KDV'yi JSON olarak çıkar."},
        ],
    }],
)
print(resp.content[0].text)
```

TypeScript ile aynı desen, `content` dizisinde görüntü ve metin bloklarını birleştirir.

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";

const client = new Anthropic();
const imgB64 = readFileSync("fatura.jpg").toString("base64");

const res = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imgB64 } },
      { type: "text", text: "Bu faturadaki toplam tutarı ve KDV'yi JSON olarak çıkar." },
    ],
  }],
});
console.log(res.content[0].type === "text" && res.content[0].text);
```

## 🔗 İlgili Kavramlar

- [RAG (Retrieval-Augmented Generation)](../rag/rag.md) — dış kaynaktan bağlam çekme
- [Streaming (Akış)](../streaming/streaming.md) — yanıtı jeton jeton iletme
- [Telemetry (Telemetri)](../telemetry/telemetry.md) — jeton/maliyet izleme
- İnsan-döngüde (human-in-the-loop) — düşük güvenli çıktıların onayı
- Belge işleme (document processing) — fatura/PDF ayıklama
