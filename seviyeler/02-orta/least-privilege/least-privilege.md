# En Az Yetki (Least Privilege)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 9. Güvenlik, Hizalama ve Denetim

Ajana veya araca yalnızca görevini yapması için gereken asgari erişim ve yetkiyi verme güvenlik ilkesidir. Olası bir zafiyetin etki alanını daraltır.

## Mini Senaryo

> Rapor okuyan ajana yalnızca "okuma" yetkisi verilir; hiçbir veriyi silemez.

## 📖 Ayrıntılı Açıklama

En az yetki (least privilege), bir ajana, kullanıcıya veya araca yalnızca görevini yerine getirmesi için kesinlikle gereken asgari erişim ve izinleri verme güvenlik ilkesidir. Bir bileşen ne kadar az şeye erişebilirse, ele geçirildiğinde veya hatalı davrandığında verebileceği zarar (blast radius / etki alanı) o kadar küçük olur. Bu, geleneksel siber güvenliğin temel ilkelerinden biridir ve ajan sistemlerinde kritik önem kazanır.

Bu ilke önemlidir; çünkü dil modeli tabanlı ajanlar öngörülemez davranabilir, istem enjeksiyonuna (prompt injection) maruz kalabilir veya yanlış araç çağırabilir. Eğer rapor özetleyen bir ajana veritabanı silme yetkisi verilmişse, kötü niyetli bir girdi onu yıkıcı bir eyleme ikna edebilir. Yetkiler dar tutulursa, en kötü durumda bile ajan yalnızca okuyabileceği için zarar veremez.

Nasıl çalışır? Her araca ve API anahtarına (API key) kapsamı (scope) dar tanımlanır: salt okunur (read-only) erişim, belirli tablolara/dosyalara sınırlı yetki, sadece belirli işlemler. Ajan birden çok yetenek gerektiriyorsa, geniş tek bir yetki yerine her biri kendi dar yetkisine sahip ayrı araçlar/ajanlar tasarlanır. Yüksek riskli işlemler ayrıca insan onayıyla (HITL) korunur. İdeal olarak yetkiler kalıcı değil, görev süresince geçici verilir.

Ne zaman kullanılır? Her zaman — üretimdeki (production) tüm ajan sistemlerinde varsayılan tasarım ilkesi olmalıdır. Özellikle harici verilere, ödemeye, dosya sistemine veya kişisel verilere (PII) dokunan ajanlarda vazgeçilmezdir. Ne zaman gevşetilir? Asla tamamen; ancak izole test ortamlarında geçici olarak daha geniş erişim verilebilir.

Tuzaklar: Birincisi, kolaylık olsun diye "admin" / tam yetkili anahtar kullanmak — en yaygın ve en tehlikeli hata. İkincisi, araç açıklamasında yetkiyi dar belirtip arkadaki gerçek anahtarın geniş olması; asıl kısıt anahtar düzeyinde olmalıdır. Üçüncüsü, geçici yetkileri görev bittikten sonra geri almayı unutmak (yetki birikmesi / privilege creep).

## 🎬 Detaylı Senaryo

Bir finans firması ("ParaTakip") aylık gider raporu hazırlayan bir ajan kurar ve baştan en az yetki ile tasarlar:

1. Ajanın görevi: işlem tablosunu okuyup özet rapor üretmek.
2. Ekip, ajana veritabanının tam erişim anahtarını vermek yerine, yalnızca `islemler` tablosuna salt okunur (read-only) erişimi olan ayrı bir anahtar oluşturur.
3. Ajana hiçbir yazma/silme yetkisi tanımlanmaz; araç seti sadece `islem_oku` içerir.
4. Bir gün ajan, kullanıcı girdisindeki gizli bir talimat yüzünden ("tüm kayıtları sil") yanlış yönlendirilmeye çalışılır.
5. Ajan silme komutu üretse bile, anahtarın yazma yetkisi olmadığı için veritabanı işlemi reddeder; veri güvende kalır.
6. Ekip ayrıca raporu e-posta ile gönderme yeteneğini ayrı bir ajana, yalnızca tek bir dağıtım listesine gönderim yetkisiyle verir.
7. Yüksek riskli ek bir işlem (örn. ödeme) gerekirse, bu HITL onayına bağlanır.
8. Denetimde (audit) ekip, hiçbir bileşenin gereğinden fazla yetkiye sahip olmadığını doğrular.

## 💻 Kullanım / Uygulama Örneği

Aşağıda dar kapsamlı (salt okunur) bir erişim örneği ve ajana yalnızca okuma aracının verilmesi görülür.

```python
import anthropic

client = anthropic.Anthropic()

# Dar kapsamlı erişim: yalnızca SELECT izni olan bir bağlantı (en az yetki)
def islem_oku(sorgu: str) -> str:
    if not sorgu.strip().lower().startswith("select"):
        return "Reddedildi: bu ajanın yalnızca okuma (SELECT) yetkisi var."
    return veritabani_salt_okunur.calistir(sorgu)   # yazma/silme yetkisi olmayan bağlantı

# Ajana yalnızca okuma aracı tanımlanır; silme/yazma aracı HİÇ verilmez
tools = [{
    "name": "islem_oku",
    "description": "İşlem tablosundan SADECE veri okur (salt okunur).",
    "input_schema": {"type": "object", "properties": {"sorgu": {"type": "string"}}, "required": ["sorgu"]},
}]

resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024, tools=tools,
    messages=[{"role": "user", "content": "Bu ayki toplam gideri özetle."}])
```

İkinci olarak, ilkeyi altyapı düzeyinde de uygulamak gerekir: ajanın kullandığı API anahtarının kendisi yalnızca okuma kapsamına (read-only scope) sahip olmalı; güvenlik koda değil, anahtarın yetkisine dayanmalıdır.

## 🔗 İlgili Kavramlar

- [Döngüde İnsan (HITL)](../hitl/hitl.md) — dar yetkiyi tamamlayan kritik adım onayı
- [Fonksiyon Çağırma (Function Calling)](../function-calling/function-calling.md) — yetkilerin araç düzeyinde tanımlanması
- [Devir İşlemleri (Handoffs)](../handoffs/handoffs.md) — farklı yetki gerektiren işleri uzman ajana aktarma
- [Model Context Protocol (MCP)](../mcp/mcp.md) — araç erişimini standart ve kontrollü sunma
- İstem Enjeksiyonu (Prompt Injection) — dar yetkinin sınırladığı tehdit
