# Hizalama ve Anayasal YZ (Alignment & Constitutional AI)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 9. Güvenlik, Hizalama ve Denetim

Ajanın davranışını insan değerleriyle uyumlu kılma; Constitutional AI ise bir ilkeler dizisine (anayasa) göre ajanın kendini denetlemesi yaklaşımıdır.

## Mini Senaryo

> Ajan, "asla zarar verme" ilkesine göre tehlikeli bir talebi kendi kendine reddeder.

## 📖 Ayrıntılı Açıklama

Hizalama (Alignment), bir yapay zeka modelinin davranışını insan değerleri, niyetleri ve güvenlik beklentileriyle uyumlu hale getirme problemidir. Anayasal YZ (Constitutional AI) ise Anthropic tarafından geliştirilen, modelin davranışını sabit insan etiketleri yerine yazılı bir ilkeler dizisine ("anayasa" - constitution) göre düzenleyen bir yaklaşımdır. Model, bu ilkeleri kullanarak kendi çıktısını eleştirir (critique) ve gerekirse düzeltir (revision).

Bu kavram önemlidir çünkü bir ajan ne kadar yetenekli olursa olsun, zararlı, yanıltıcı veya kullanıcının çıkarına aykırı davranabiliyorsa güvenilmez olur. Geleneksel pekiştirmeli öğrenme (RLHF - Reinforcement Learning from Human Feedback) her örnek için insan etiketi gerektirirken, Anayasal YZ insan emeğini büyük ölçüde azaltır: insanlar tek tek yanıtları puanlamak yerine yüksek seviyeli ilkeleri yazar, model bu ilkelere göre kendini hizalar (RLAIF - Reinforcement Learning from AI Feedback).

Nasıl çalışır? İki aşama vardır: (1) Denetimli aşama — model bir yanıt üretir, sonra anayasal bir ilkeye göre kendi yanıtını eleştirir ve yeniden yazar; bu eleştiri-düzeltme çiftleriyle ince ayar (fine-tuning) yapılır. (2) Pekiştirme aşaması — model iki yanıt üretir, hangisinin ilkelere daha uygun olduğunu kendisi seçer ve bu tercihlerle bir ödül modeli (reward model) eğitilir. Uygulama düzeyinde ise bu yaklaşım, ajanın sistem istemine (system prompt) açık ilkeler yazıp ona göre öz-denetim yaptırmak şeklinde de yaşar.

Ne zaman kullanılır? Kullanıcıya açık, yüksek riskli veya düzenlemeye tabi (regulated) alanlarda çalışan her ajanda. Ne zaman fazla gelir? Kapalı bir iç araç veya tamamen güvenli, dar kapsamlı bir görev için ağır bir anayasal denetim katmanı gereksiz gecikme ve maliyet ekler.

Tuzaklar: İlkeleri çelişkili yazmak (örn. "her zaman yardımcı ol" ile "şüpheli her şeyi reddet") modeli kararsız bırakır. Aşırı katı ilkeler iyi niyetli istekleri de reddettiren (over-refusal) bir davranışa yol açabilir. Ayrıca anayasayı sistem istemine yazmak, kötü niyetli kullanıcı girdisiyle (prompt injection) atlatılabilir; bu yüzden kritik denetimi tek başına isteme bırakmamak gerekir.

## 🎬 Detaylı Senaryo

"SağlıkAsistan" adlı bir şirket, hastalara genel sağlık bilgisi veren bir ajan geliştiriyor; ancak teşhis koymasını veya ilaç dozu önermesini kesinlikle istemiyor.

1. **Anayasa yazımı:** Güvenlik ekibi dört ilke belirler: zarar verme, teşhis koyma, kişisel veriyi sızdırma, her zaman bir hekime danışmayı öner.
2. **Sistem istemine gömme:** Bu ilkeler ajanın sistem istemine açık biçimde yazılır.
3. **Kullanıcı talebi:** Bir kullanıcı "Göğsüm ağrıyor, kalp krizi mi geçiriyorum, hangi ilacı alayım?" diye sorar.
4. **İlk taslak:** Model içsel olarak bir yanıt taslağı üretir; bu taslak bir ilaç ismi içermektedir.
5. **Öz-eleştiri (critique):** Model "teşhis koyma ve doz önerme" ilkesine göre taslağını denetler ve ihlal tespit eder.
6. **Düzeltme (revision):** Model yanıtı yeniden yazar: ilaç önerisini kaldırır, acil durum uyarısı ekler.
7. **Son yanıt:** Ajan kullanıcıya "Bu belirtiler acil olabilir, lütfen hemen 112'yi arayın veya en yakın acile gidin; ilaç önerisi veremem" der.
8. **Loglama:** Eleştiri-düzeltme adımı denetim için kaydedilir, böylece güvenlik ekibi ilkenin işlediğini doğrulayabilir.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, anayasal ilkeleri sistem istemine yerleştirerek ajanın öz-denetim yapmasını sağlar.

```python
import anthropic

client = anthropic.Anthropic()

ANAYASA = """Aşağıdaki ilkelere her zaman uy:
1. Asla tıbbi teşhis koyma veya ilaç/doz önerme.
2. Acil belirtilerde kullanıcıyı profesyonel yardıma yönlendir.
3. Kişisel sağlık verisini isteme veya sakla.
Bir yanıt vermeden önce bu ilkelere uygunluğunu kendi kendine denetle."""

yanit = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system=ANAYASA,
    messages=[{"role": "user", "content": "Göğsüm ağrıyor, hangi ilacı alayım?"}],
)
print("".join(b.text for b in yanit.content if b.type == "text"))
```

İkinci örnek, açık bir eleştir-ve-düzelt (critique-and-revise) döngüsünü gösterir:

```python
def anayasal_duzelt(taslak: str) -> str:
    yanit = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        system="Aşağıdaki taslağı 'teşhis ve ilaç önermeme' ilkesine göre eleştir ve gerekiyorsa yeniden yaz.",
        messages=[{"role": "user", "content": f"Taslak: {taslak}"}],
    )
    return "".join(b.text for b in yanit.content if b.type == "text")
```

## 🔗 İlgili Kavramlar

- [İnce Ayar / Pekiştirmeli Hizalama (RLHF / RLAIF)](../fine-tuning-rlhf-rlaif/fine-tuning-rlhf-rlaif.md) — anayasal YZ'nin temel eğitim mekanizması
- [Öz-Yansıma / Kendi Kendini Düzeltme (Reflexion)](../reflexion-self-correction/reflexion-self-correction.md) — benzer öz-eleştiri döngüsü
- [İstem Enjeksiyonu / Kısıt Aşımı (Prompt Injection / Jailbreak)](../prompt-injection-jailbreak/prompt-injection-jailbreak.md) — hizalamayı atlatma saldırıları
- [Kırmızı Takım (Red Teaming)](../red-teaming/red-teaming.md) — hizalamayı test etme
- Temellendirme (Grounding) — yanıtları gerçeklere dayandırma
