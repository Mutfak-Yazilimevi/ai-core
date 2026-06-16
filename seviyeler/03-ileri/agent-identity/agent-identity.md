# Ajan Kimliği (Agent Identity)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 9. Güvenlik, Hizalama ve Denetim

Ajanların sistemlere güvenli bir şekilde giriş yapabilmesi ve doğrulanabilmesi için kullanılan benzersiz kimlik bilgileri ve şifreleme anahtarlarıdır. Yetki ve erişim denetimini (kim, neye, ne zaman erişebilir) mümkün kılar.

## Mini Senaryo

> Her ajanın kendi API anahtarı vardır; loglardan hangi ajanın hangi işlemi yaptığı izlenir.

## 📖 Ayrıntılı Açıklama

Ajan Kimliği (Agent Identity), bir otonom ajanın sistemler nezdinde "kim olduğunu" kanıtlayan benzersiz kimlik bilgileri ve şifreleme anahtarları bütünüdür. Tıpkı bir çalışanın kurumsal hesabı ve rozetiyle binaya girmesi gibi, ajan da kendi kimliğiyle API'lere, veritabanlarına ve diğer ajanlara erişir. Kimlik; kimlik doğrulama (authentication — "sen gerçekten o ajan mısın?") ve yetkilendirme (authorization — "bu işlemi yapmaya iznin var mı?") süreçlerinin temelidir.

Bu önemlidir çünkü ajanlar gittikçe daha fazla gerçek eylem (para transferi, e-posta gönderme, veri silme) yapıyor. Eğer tüm ajanlar tek bir paylaşılan anahtarı kullanırsa, bir sorun çıktığında hangi ajanın neyi yaptığını ayırt etmek imkânsız hale gelir ve "en az ayrıcalık" (least privilege) ilkesi uygulanamaz. Ajana özel kimlik, hem izlenebilirliği (auditability) hem de güvenlik sınırlarını mümkün kılar.

Nasıl çalışır: Her ajana benzersiz bir kimlik (örneğin bir servis hesabı / service account) ve buna bağlı bir gizli anahtar (API key) veya kısa ömürlü erişim belirteci (token) verilir. Ajan bir kaynağa erişirken bu kimliği sunar; kaynak tarafı kimliği doğrular ve o kimliğin yetki kümesine (scopes/roles) bakarak işlemi onaylar veya reddeder. Modern sistemlerde statik anahtarlar yerine otomatik yenilenen kısa ömürlü belirteçler (OAuth, Workload Identity Federation) tercih edilir.

Ne zaman kullanılır: Üretim ortamındaki her ajan için zorunludur; özellikle çok ajanlı (multi-agent) sistemlerde ve dış servislere erişen ajanlarda. Ne zaman dikkatli olunur: Anahtarları sistem isteminin (system prompt) veya kullanıcı mesajının içine gömmek tehlikelidir — bunlar günlüklere ve geçmişe yazılır ve sızabilir. Kimlikler bir kasada (vault / secrets manager) saklanmalı, isteme gömülmemelidir.

Tuzaklar: Aşırı geniş yetkili anahtarlar "patlama yarıçapını" (blast radius) büyütür — ajan beklenmedik davranınca verebileceği zarar artar. Anahtar rotasyonu yapılmaması ve sızan anahtarların hızlı iptal edilememesi de yaygın hatalardır. İstem enjeksiyonu (prompt injection) ile bir ajan kendi yetkisini kötüye kullanmaya kandırılabilir; bu yüzden gizli bilgi ajanın eriştiği yürütme ortamından (sandbox) uzakta, ağ çıkışında (egress) enjekte edilmelidir.

## 🎬 Detaylı Senaryo

"FinBank" adlı bir bankanın operasyon ekibi, müşteri taleplerini işleyen üç ayrı ajan çalıştırıyor.

1. Ekip her ajan için ayrı bir servis hesabı oluşturur: "Sorgu Ajanı", "Onay Ajanı", "Rapor Ajanı".
2. Sorgu Ajanı'na yalnızca "okuma" yetkisi (read-only scope) verilir; bakiye sorgulayabilir ama transfer yapamaz.
3. Onay Ajanı'na sınırlı transfer yetkisi tanınır, ancak günlük limit ve insan onayı kuralına bağlanır.
4. Tüm anahtarlar koda gömülmek yerine merkezî bir gizli anahtar kasasında (vault) tutulur.
5. Bir müşteri talebi geldiğinde Sorgu Ajanı kendi kimliğiyle bakiye okur; her istek günlüğe ajan kimliğiyle birlikte yazılır.
6. Onay Ajanı transfer denerken kimliği ve yetkisi kontrol edilir; limiti aşan işlem reddedilir.
7. Bir gün loglarda anormal bir transfer denemesi görülür; kimlik sayesinde bunun hangi ajan ve hangi anahtardan geldiği saniyeler içinde bulunur.
8. Ekip o anahtarı anında iptal edip yenisini üretir (rotation); diğer ajanlar etkilenmez çünkü her birinin kimliği ayrıdır.

## 💻 Kullanım / Uygulama Örneği

Anahtarı koda gömmek yerine ortam değişkeninden okuyup, her ajan için ayrı kimlik kullanmak temel ilkedir. Aşağıda ajana özel anahtarla Anthropic istemcisi kuruluyor.

```python
import os
import anthropic

# Her ajanın kendi kimliği: anahtar ortamdan/kasadan gelir, koda gömülmez
client = anthropic.Anthropic(api_key=os.environ["SORGU_AJANI_ANAHTARI"])

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Bu müşterinin son bakiyesini özetle."}],
)
# İşlem günlüğüne hangi ajan kimliğinin çağrı yaptığı not edilir
print(resp.content[0].text)
```

```python
# Yetki denetimi (authorization): kimlik doğru olsa bile izin kontrol edilir
ALLOWED = {"sorgu_ajani": {"read"}, "onay_ajani": {"read", "transfer"}}

def yetkili_mi(ajan_kimligi: str, eylem: str) -> bool:
    return eylem in ALLOWED.get(ajan_kimligi, set())

if not yetkili_mi("sorgu_ajani", "transfer"):
    raise PermissionError("Sorgu Ajanı transfer yapamaz")  # en az ayrıcalık ilkesi
```

## 🔗 İlgili Kavramlar

- [Ajanlar Arası Protokol (A2A Protocol)](../a2a-protocol/a2a-protocol.md) — ajanların birbirine güvenli bağlanması
- [Döngü Üstünde İnsan (HOTL)](../hotl/hotl.md) — yetkili işlemlerde denetim
- [LLMOps / AgentOps](../llmops-agentops/llmops-agentops.md) — kimlik ve gizli anahtar yönetimi operasyonları
- En Az Ayrıcalık İlkesi (Principle of Least Privilege) — minimum yetki tasarımı
- İstem Enjeksiyonu (Prompt Injection) — kimlik kötüye kullanımı riski
