# Ajan (Agent)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 1. Temeller ve Çalışma Modeli

Belirli bir amaca yönelik çalışan; durumları algılayan, mantıksal çıkarım yapan ve hedeflerine ulaşmak için dış dünyayla etkileşime giren özerk yapay zekâ sistemidir. Tüm bu kılavuzun merkezindeki birimdir.

## Mini Senaryo

> Kullanıcı "uçuşumu yarına al" der; ajan takvimi okur, havayolu API'sini çağırır ve değişikliği onaylar.

## 📖 Ayrıntılı Açıklama

Ajan (Agent), bir hedefe ulaşmak için kendi başına karar veren, çevresinden bilgi toplayan (algılama / perception), bu bilgiyi yorumlayıp bir eylem planı kuran ve bu planı dış araçlar (tools) aracılığıyla uygulayan özerk (autonomous) bir yapay zekâ sistemidir. Klasik bir sohbet botundan en büyük farkı, tek bir soru-cevap turunda kalmaması; bir döngü (loop) içinde "düşün - eylem yap - sonucu gözlemle - tekrar düşün" adımlarını hedef gerçekleşene kadar yinelemesidir. Bu döngünün beyni genellikle bir büyük dil modelidir (Large Language Model, LLM).

Ajanların önemi, yapay zekâyı pasif bir metin üreticisinden aktif bir "iş yapan" aktöre dönüştürmelerinden gelir. Bir LLM tek başına yalnızca metin üretir; ona araç çağırma (tool use), bellek (memory) ve planlama yeteneği eklendiğinde takvim güncelleyen, kod yazıp çalıştıran, veritabanı sorgulayan ya da başka ajanları yöneten bir sisteme dönüşür. Bu, tekrarlayan bilgi işi (knowledge work) görevlerini uçtan uca otomatikleştirmenin kapısını açar.

Çalışma biçimi şöyle özetlenebilir: Ajan bir hedef ve bir araç listesi (tool schema) ile başlatılır. Model her turda ya nihai cevabı üretir ya da bir aracı belirli parametrelerle çağırmaya karar verir. Çağrı sonucu (observation) tekrar modele beslenir ve döngü devam eder. ReAct (Reasoning + Acting) gibi desenler bu "muhakeme ve eylem" iç içe geçişini formalize eder.

Ajanlar, hedefin net olduğu, birden fazla adım ve araç gerektiren, dinamik ortamlarda kullanılır; örneğin müşteri taleplerini çözen destek ajanları ya da kod tabanında değişiklik yapan geliştirme ajanları. Buna karşılık tek seferlik basit bir sınıflandırma ya da özetleme görevi için ajan kurmak gereksiz karmaşıklık (over-engineering) yaratır; orada düz bir LLM çağrısı yeterlidir.

Dikkat edilmesi gereken tuzaklar: Sonsuz döngüler ve kontrolsüz araç çağrıları maliyeti patlatabilir, bu yüzden adım sınırı (max iterations) konmalıdır. Yanlış araç çağrıları gerçek dünyada zarar verebileceğinden (örneğin yanlış uçuş iptali) kritik eylemlerde insan onayı (human-in-the-loop) şarttır. Ayrıca hata yönetimi ve gözlemlenebilirlik (observability) olmadan ajanın neden o kararı verdiğini anlamak zorlaşır.

## 🎬 Detaylı Senaryo

Bir e-ticaret firması olan "TrendSepet", müşteri iade taleplerini otomatikleştirmek için bir destek ajanı kurar. Senaryo şöyle ilerler:

1. Müşteri sohbet penceresine "Geçen hafta aldığım ayakkabı küçük geldi, iade etmek istiyorum" yazar.
2. Ajan, sistem istemi (system prompt) ile tanımlı rolünü (iade destek asistanı) ve kullanabileceği araçları (sipariş sorgulama, iade başlatma, kargo etiketi oluşturma) yükler.
3. Ajan önce niyeti anlar ve `siparis_getir(musteri_id)` aracını çağırır; son siparişleri gözlemler.
4. Birden fazla ayakkabı siparişi olduğunu görüp müşteriye "Hangi sipariş numarası?" diye sorarak belirsizliği giderir.
5. Müşteri sipariş numarasını verir; ajan `iade_uygunlugu_kontrol(siparis_no)` aracıyla iade penceresinin (14 gün) hâlâ açık olduğunu doğrular.
6. Kural gereği 200 TL üzeri iadelerde insan onayı gerektiğinden ajan, talebi bir destek temsilcisine yönlendirir (human-in-the-loop) ve müşteriye bilgi verir.
7. Temsilci onaylayınca ajan `iade_baslat(siparis_no)` ve `kargo_etiketi_olustur()` araçlarını sırayla çağırır.
8. Ajan, oluşan kargo kodunu müşteriye iletir ve etkileşimi belleğe (memory) yazar ki müşteri tekrar geldiğinde geçmiş bağlam korunur.

Sonuç: Tipik 10 dakikalık manuel süreç, insan onayı saklı kalarak 1 dakikaya iner.

## 💻 Kullanım / Uygulama Örneği

Aşağıda Anthropic SDK ile basit bir araç çağıran ajan iskeleti yer alır. Model bir aracı çağırmaya karar verirse `stop_reason` `tool_use` olur; sonucu modele geri besleyerek döngüyü sürdürürüz.

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY ortamdan okunur

tools = [{
    "name": "siparis_getir",
    "description": "Müşterinin son siparişlerini döndürür",
    "input_schema": {
        "type": "object",
        "properties": {"musteri_id": {"type": "string"}},
        "required": ["musteri_id"],
    },
}]

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="Sen bir iade destek asistanısın. Gerektiğinde araçları kullan.",
    tools=tools,
    messages=[{"role": "user", "content": "Ayakkabımı iade etmek istiyorum"}],
)

if resp.stop_reason == "tool_use":
    print("Ajan bir araç çağırmak istiyor:", resp.content)
```

Basit bir karar döngüsü (pseudocode) şöyle görünür:

```python
while not gorev_bitti and adim < MAX_ADIM:
    karar = model_dusun(durum)       # muhakeme (reasoning)
    if karar.is_tool_call:
        gozlem = araci_calistir(karar)  # eylem (acting)
        durum.ekle(gozlem)
    else:
        gorev_bitti = True
    adim += 1
```

## 🔗 İlgili Kavramlar

- [Temel Model (Foundation Model)](../foundation-model/foundation-model.md) — ajanın muhakeme yapan beyni
- [Sistem İstemi (System Prompt)](../system-prompt/system-prompt.md) — ajanın rolünü ve sınırlarını belirler
- [Bellek (Memory)](../memory/memory.md) — etkileşimler arası bağlamı korur
- Araç Kullanımı (Tool Use) — ajanın dış dünyayla etkileşim mekanizması
- ReAct (Reasoning + Acting) — muhakeme ve eylemi birleştiren ajan deseni
- İnsan Onayı (Human-in-the-loop) — kritik eylemlerde güvenlik kontrolü
