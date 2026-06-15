# Ajanlar Arası Protokol (A2A Protocol)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 8. İletişim ve Protokoller

Farklı otonom birimlerin (ajanların) nasıl iletişim kuracağını ve işbirliği yapacağını belirleyen standart kurallar bütünüdür. Ajanların birbirini keşfetmesi, görev devretmesi ve sonuç paylaşması için ortak bir dil sağlar.

## Mini Senaryo

> Bir firmanın satın alma ajanı, tedarikçinin satış ajanıyla A2A üzerinden doğrudan pazarlık eder.

## 📖 Ayrıntılı Açıklama

Ajanlar Arası Protokol (Agent-to-Agent Protocol, A2A), farklı geliştiriciler veya farklı sistemler tarafından üretilmiş otonom ajanların ortak bir "dil" üzerinden birbirini bulması, yeteneklerini paylaşması ve görev devretmesi için tanımlanan kurallar bütünüdür. İnsanların HTTP veya e-posta gibi standartlar sayesinde farklı sunucularla konuşabilmesi gibi, A2A da heterojen ajan ekosistemlerinin birbirleriyle çalışabilmesini (birlikte çalışabilirlik / interoperability) hedefler.

Bu protokol önemlidir çünkü gerçek dünyada her ajanı tek bir ekip yazmaz. Bir firmanın CRM ajanı, başka bir firmanın lojistik ajanıyla konuşmak zorunda kalabilir. Ortak bir protokol olmadan her entegrasyon için özel bağlayıcılar (adapters) yazmak gerekir; bu hem maliyetli hem de kırılgandır. A2A, "ajan kartı" (agent card) gibi keşif (discovery) mekanizmalarıyla bir ajanın hangi yetenekleri sunduğunu standart bir biçimde ilan etmesini sağlar.

Nasıl çalışır: Tipik olarak her ajan, kendini tanıtan bir tanım belgesi (yetenekler, uç noktalar/endpoints, kimlik doğrulama yöntemi) yayımlar. Diğer ajanlar bu belgeyi okuyarak görev gönderir (task), durum sorgular (status) ve sonuç alır (artifact). Mesajlar genellikle yapılandırılmış JSON formatındadır ve asenkron (asynchronous) olabilir; uzun süren görevler için yoklama (polling) veya akış (streaming) kullanılır.

Ne zaman kullanılır: Birden fazla bağımsız tarafın ajanlarının iş birliği yapması gerektiğinde, mikroservis benzeri ajan mimarilerinde ve ajan pazar yerlerinde (agent marketplaces) idealdir. Ne zaman kullanılmaz: Tek bir uygulama içinde yaşayan, doğrudan fonksiyon çağrısıyla konuşabilen alt ajanlar için A2A fazladan karmaşıklık getirir; orada basit araç çağrısı (tool use) yeterlidir.

Tuzaklar: Kimlik ve yetki doğrulaması (authentication/authorization) eksik bırakılırsa, kötü niyetli bir ajan sahte görevler enjekte edebilir. Ayrıca protokol sürüm uyumsuzlukları sessiz hatalara yol açar; ajan kartlarının sürümlenmesi (versioning) şarttır. Bir diğer risk, ajanların sonsuz görev devretme döngülerine (delegation loops) girmesidir; derinlik sınırı koymak gerekir.

## 🎬 Detaylı Senaryo

"TedarikZinciri A.Ş." adlı bir perakende firmasının satın alma ekibi, stok yenilemeyi otomatikleştirmek istiyor.

1. Satın alma ekibi, kendi "Satın Alma Ajanı"nı (Buyer Agent) devreye alır ve ona aylık bütçe ile minimum stok eşiklerini tanımlar.
2. Tedarikçi firma "MalzemeX Ltd." ise bir "Satış Ajanı" (Seller Agent) yayımlar ve A2A ajan kartında "fiyat teklifi ver", "stok durumu sorgula", "sipariş oluştur" yeteneklerini ilan eder.
3. Stok eşiği aşılınca Satın Alma Ajanı, MalzemeX'in ajan kartını keşfeder ve ona kimlik anahtarıyla (API key) bağlanır.
4. Satın Alma Ajanı bir "fiyat teklifi" görevi gönderir; içine ürün kodu ve miktar koyar.
5. Satış Ajanı, kendi fiyatlandırma kurallarını uygulayıp yapılandırılmış bir teklif (artifact) döndürür.
6. Satın Alma Ajanı teklifi bütçeyle karşılaştırır; uygun bulursa pazarlık için ikinci bir mesaj gönderip indirim ister.
7. Satış Ajanı, yetkisi dahilinde %3 indirim sunar.
8. Satın Alma Ajanı kabul eder ve "sipariş oluştur" görevini tetikler; otonomi seviyesi yüksekse bunu doğrudan, düşükse insan onayından sonra yapar.
9. Her iki ajanın işlem günlükleri (logs), denetim için merkezî bir gözlemlenebilirlik (observability) sistemine yazılır.

## 💻 Kullanım / Uygulama Örneği

Aşağıda kavramsal bir ajan kartı ve basit bir görev mesajı gösterilmektedir. A2A protokol mesajları genellikle yapılandırılmış JSON taşır.

```yaml
# seller-agent-card.yaml — Satış Ajanı'nın yetenek ilanı (kavramsal)
agent:
  name: "MalzemeX Satis Ajani"
  version: "1.2.0"
  endpoint: "https://malzemex.example.com/a2a"
  auth:
    type: "api_key"          # kimlik doğrulama (authentication) yöntemi
  capabilities:
    - id: "get_quote"
      description: "Ürün kodu ve miktara göre fiyat teklifi döndürür"
    - id: "create_order"
      description: "Onaylanmış teklif için sipariş oluşturur"
```

```python
# Satın Alma Ajanı'nın gönderdiği görev mesajı (kavramsal A2A çağrısı)
import requests

task = {
    "capability": "get_quote",
    "input": {"product_code": "MX-204", "quantity": 500},
}
resp = requests.post(
    "https://malzemex.example.com/a2a/tasks",
    headers={"x-api-key": "buyer-agent-key"},  # her ajanın kendi kimliği
    json=task,
)
quote = resp.json()  # {"unit_price": 12.4, "currency": "TRY", "valid_until": "..."}
```

## 🔗 İlgili Kavramlar

- [Ajan Kimliği (Agent Identity)](../agent-identity/agent-identity.md) — ajanların birbirine güvenli bağlanması için
- [Otonomi Seviyeleri (Autonomy Levels)](../autonomy-levels/autonomy-levels.md) — görev devrinde onay gerekip gerekmediği
- Model Bağlam Protokolü (Model Context Protocol, MCP) — ajan-araç iletişimi standardı
- [Çoklu Ajan Koordinasyonu (Multi-agent Coordination)](../evaluator-optimizer/evaluator-optimizer.md) — birden çok ajanın iş birliği
- [Paralel Yürütme (Parallel Execution)](../parallel-execution/parallel-execution.md) — birden fazla ajanı eşzamanlı çalıştırma
