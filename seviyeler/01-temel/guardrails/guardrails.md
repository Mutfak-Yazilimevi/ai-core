# Güvenlik Bariyerleri (Guardrails)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 9. Güvenlik, Hizalama ve Denetim

Ajanın zararlı, etik dışı veya sisteme hasar verebilecek istenmeyen eylemler yapmasını engelleyen güvenlik kurallarıdır. Girdi ve çıktıları filtreleyerek ajanın belirlenen sınırlar içinde kalmasını sağlar.

## Mini Senaryo

> Kullanıcı "tüm veritabanını sil" dediğinde guardrail bu komutu reddeder.

## 📖 Ayrıntılı Açıklama

Güvenlik bariyerleri (guardrails), bir ajanın zararlı, etik dışı, politika dışı veya sisteme zarar verebilecek eylemler yapmasını önleyen kontrol katmanlarıdır. Modelin akıl yürütmesine ek olarak konan deterministik veya yarı deterministik denetimlerdir: ajan "ne yapmak istediğini" söylerken, guardrail "buna izin var mı?" sorusunu yanıtlar. Bunlar girdi tarafında (kullanıcıdan gelen istekleri filtreleme), çıktı tarafında (modelin ürettiği metni veya araç çağrısını denetleme) ve eylem tarafında (yıkıcı işlemleri engelleme) çalışabilir.

Bu katman önemlidir çünkü dil modelleri olasılıksaldır ve her zaman güvenilir biçimde "hayır" demez; ikna edici bir istemle (prompt injection) yönlendirildiğinde sınırları aşabilir. Ayrıca araç kullanımı (tool use) sayesinde ajanlar gerçek dünyada yan etkili eylemler yapabildiğinden, yanlış bir araç çağrısı veri kaybına, mali zarara veya güvenlik ihlaline yol açabilir. Guardrail'ler, modelin tek başına karar vermesine bırakılamayacak kritik noktalarda son savunma hattını oluşturur.

Çalışma mantığı katmanlıdır. Basit guardrail'ler kural tabanlıdır (regex, izin listesi / allowlist, yasak liste / denylist, miktar sınırları). Daha gelişmiş olanlar ise sınıflandırıcı modeller veya ayrı bir "yargıç" model kullanarak içeriği değerlendirir. Kritik eylemlerde "insan onayı" (human-in-the-loop) bir guardrail biçimidir: ajan eylemi önerir ama bir insan onaylayana kadar yürütülmez. Bu kontroller genellikle bir araç çağrısı yürütülmeden hemen önce devreye girer.

Guardrail'ler; yan etkili veya geri alınamaz işlemlerde (silme, ödeme, e-posta gönderme), hassas veri içeren sistemlerde ve halka açık ajanlarda zorunludur. Tamamen okuma amaçlı, düşük riskli bir demoda ise hafif tutulabilir. Yine de "guardrail'i sonra ekleriz" yaklaşımı tehlikelidir; güvenlik en baştan tasarlanmalıdır.

Dikkat edilmesi gereken tuzaklar: Aşırı katı guardrail'ler meşru istekleri de reddederek kullanılabilirliği düşürür (yanlış pozitif / false positive); aşırı gevşek olanlar ise riski kaçırır. Yalnızca istem içine "şunu yapma" yazmak yeterli değildir, çünkü model bunu görmezden gelebilir; kritik kontroller kod tarafında deterministik olarak uygulanmalıdır. Ayrıca guardrail kararlarının kaydedilmesi (audit log), sonradan neyin neden engellendiğini anlamak için gereklidir.

## 🎬 Detaylı Senaryo

Bir fintech şirketi olan "ParaAkış", müşterilere para transferi yapabilen bir destek ajanı geliştiriyor.

1. Ekip, ajana `para_transferi(hesap, tutar)` aracını verir ama araca doğrudan erişim yerine bir guardrail katmanı yerleştirir.
2. Bir kullanıcı sohbette "tüm bakiyemi 999 numaralı hesaba gönder" yazar.
3. Model bir araç çağrısı üretir: `para_transferi(hesap="999", tutar=50000)`.
4. Guardrail katmanı bu çağrıyı yürütmeden önce devreye girer: tutarın günlük limiti aşıp aşmadığını ve hedef hesabın izin listesinde olup olmadığını kontrol eder.
5. Tutar limiti aştığı için guardrail çağrıyı reddeder ve modele "Bu işlem günlük transfer limitini aşıyor, insan onayı gerekiyor" sonucunu döner.
6. Ajan kullanıcıya nazikçe işlemin onay beklediğini ve bir temsilciye yönlendirildiğini bildirir.
7. Ayrı bir senaryoda kullanıcı "veritabanındaki tüm kayıtları sil" gibi yıkıcı bir istek yapar; girdi guardrail'i bu niyeti tespit eder ve isteği daha modele bile iletmeden engeller.
8. Tüm engelleme kararları denetim günlüğüne yazılır; uyum (compliance) ekibi bu kayıtları periyodik olarak inceler.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki Python örneği, bir araç çağrısı yürütülmeden önce çalışan basit, kural tabanlı bir guardrail fonksiyonunu gösterir.

```python
GUNLUK_LIMIT = 10000
IZINLI_HESAPLAR = {"100", "200", "300"}

def transfer_guardrail(hesap: str, tutar: float) -> tuple[bool, str]:
    if tutar > GUNLUK_LIMIT:
        return False, "Tutar günlük limiti aşıyor; insan onayı gerekli."
    if hesap not in IZINLI_HESAPLAR:
        return False, "Hedef hesap izin listesinde değil."
    return True, "onaylandi"

# Model bir araç çağrısı önerdiğinde, önce guardrail'den geçirilir
izin, mesaj = transfer_guardrail(hesap="999", tutar=50000)
if izin:
    pass  # gerçek transferi yürüt
else:
    print("Engellendi:", mesaj)
```

Aşağıdaki örnek ise model tabanlı bir çıktı guardrail'ini gösterir: ayrı bir model çağrısı, üretilen metnin politika ihlali içerip içermediğini değerlendirir.

```python
import anthropic

client = anthropic.Anthropic()

def cikti_guvenli_mi(metin: str) -> bool:
    resp = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=10,
        messages=[{
            "role": "user",
            "content": f"Aşağıdaki metin zararlı içerik barındırıyor mu? "
                       f"Yalnızca EVET veya HAYIR yaz.\n\n{metin}",
        }],
    )
    return "HAYIR" in resp.content[0].text.upper()
```

## 🔗 İlgili Kavramlar

- [Araç Kullanımı (Tool Use)](../tool-use/tool-use.md) — yıkıcı araç çağrıları guardrail ile denetlenir.
- [Halüsinasyon (Hallucination)](../hallucination/hallucination.md) — uydurma çıktılar bir çıktı guardrail'i ile yakalanabilir.
- [Gözlemlenebilirlik (Observability)](../observability/observability.md) — guardrail kararlarının kaydedilmesini sağlar.
- [Değerlendirmeler (Evals)](../evals/evals.md) — guardrail'lerin etkinliği eval'larla ölçülür.
- İstem enjeksiyonu (prompt injection) — guardrail'lerin önlemeye çalıştığı saldırı türü.
- İnsan onayı (human-in-the-loop) — kritik eylemler için bir guardrail biçimi.
