# Ajan Protokolleri (Agent Protocols)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 8. İletişim ve Protokoller

Ajan sistemleri arasında veri paylaşımı, koordinasyon, etkileşim ve hata yönetimini düzenleyen genel standart prosedürlerdir. MCP ve A2A gibi belirli protokolleri kapsayan üst başlıktır.

## Mini Senaryo

> İki firmanın ajanları, ortak bir protokol sayesinde sipariş bilgisini sorunsuz değiş tokuş eder.

## 📖 Ayrıntılı Açıklama

Ajan protokolleri (agent protocols), ajanların ve onları çevreleyen sistemlerin (araçlar, veri kaynakları, diğer ajanlar) birbirleriyle nasıl konuşacağını tanımlayan standart kurallar bütünüdür. Tıpkı internetin HTTP protokolü sayesinde farklı üreticilerin sunucu ve tarayıcılarının anlaşabilmesi gibi, ajan protokolleri de farklı ekiplerin geliştirdiği bileşenlerin ortak bir "dil" üzerinden mesaj alıp vermesini, koordinasyon kurmasını ve hataları tutarlı biçimde yönetmesini sağlar. Bu üst başlık altında MCP (Model Context Protocol) ve A2A (Agent-to-Agent) gibi belirli protokoller yer alır.

Bu standartlar önemlidir çünkü protokol olmadığında her entegrasyon "özel yapım" (ad hoc) hâle gelir: her yeni araç veya ajan için sıfırdan, birbirine uymayan tutkal kodlar yazılır. Bu da bakımı zorlaştırır, hata olasılığını artırır ve sistemleri kırılgan kılar. Ortak bir protokol; bir kez tanımlanan bir aracın birçok farklı ajan tarafından, kod değişikliği gerektirmeden kullanılabilmesini sağlar. Böylece ekosistemde yeniden kullanılabilirlik ve birlikte çalışabilirlik (interoperability) doğar.

Çalışma mantığı genellikle bir istemci-sunucu (client-server) veya eşler arası (peer-to-peer) model üzerine kuruludur. Örneğin MCP'de, bir MCP sunucusu kendi sağladığı araçları ve kaynakları standart bir biçimde "yetenek bildirimi" (capability discovery) ile duyurur; bir MCP istemcisi (genellikle ajan barındıran uygulama) bu yetenekleri keşfeder ve standart mesaj formatıyla çağırır. A2A'da ise bağımsız ajanlar, kimlik doğrulama ve görev devri içeren mesajlarla doğrudan birbirleriyle iş paylaşır.

Protokoller; birden fazla ekibin veya kuruluşun bileşenlerini birbirine bağladığı, araç havuzunun büyük olduğu ve uzun vadeli sürdürülebilirliğin önemli olduğu durumlarda kullanılır. Tek seferlik, küçük bir prototipte ise tam protokol uygulamak fazla mühendislik (over-engineering) olabilir; basit bir fonksiyon çağrısı yeterlidir.

Dikkat edilmesi gereken tuzaklar: Protokol sürüm uyumsuzlukları (version mismatch) sessiz hatalara yol açabilir; sürümleri açıkça yönetin. Güvenlik kritiktir: bir protokol üzerinden bağlanan harici sunucular yetkisiz erişim veya kötü amaçlı yanıtlar üretebilir, bu nedenle kimlik doğrulama ve girdi doğrulaması şarttır. Ayrıca protokolün getirdiği soyutlamanın hata ayıklamayı zorlaştırmaması için iyi bir gözlemlenebilirlik (observability) katmanı ekleyin.

## 🎬 Detaylı Senaryo

Bir lojistik firması olan "HızKargo" ile bir e-ticaret platformu olan "AlışverişNet", ajanlarını ortak bir protokol üzerinden konuşturmak istiyor.

1. AlışverişNet, sipariş oluşturulduğunda kargo sürecini başlatması gereken bir satış ajanı işletiyor.
2. HızKargo, kargo oluşturma ve takip yeteneklerini standart bir MCP sunucusu olarak yayınlıyor; her yeteneğin adı, açıklaması ve giriş şeması (input schema) protokolce tanımlı.
3. AlışverişNet'in ajanı, HızKargo sunucusuna bağlanır ve "yetenek keşfi" adımıyla hangi araçların mevcut olduğunu otomatik öğrenir; iki firma arasında özel bir entegrasyon kodu yazılmasına gerek kalmaz.
4. Bir müşteri sipariş verir; satış ajanı protokol üzerinden `kargo_olustur` yeteneğini standart mesaj formatıyla çağırır.
5. HızKargo sunucusu isteği doğrular, kimlik doğrulamasını kontrol eder ve bir takip numarası içeren standart bir yanıt döner.
6. Daha sonra müşteri durum sorduğunda satış ajanı aynı protokol üzerinden `kargo_takip` yeteneğini çağırır.
7. HızKargo protokolünü v2'ye yükselttiğinde, sürüm bilgisi mesajlarda açıkça taşındığı için AlışverişNet ajanı uyumsuzluğu fark edip ilgili sürüme göre davranır.
8. Tüm protokol mesajları iki tarafta da kaydedilir; bir uyuşmazlık olduğunda hangi mesajın nerede hata verdiği izlerden (traces) görülebilir.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki Python örneği, Anthropic SDK ile bir uygulamanın harici bir MCP sunucusuna bağlanarak o sunucunun araçlarını modele sunmasını gösterir. Böylece araçlar protokol üzerinden standart biçimde çağrılır.

```python
import anthropic

client = anthropic.Anthropic()

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "12345 numaralı siparişin kargosunu oluştur."}],
    mcp_servers=[
        {
            "type": "url",
            "url": "https://mcp.hizkargo.example/sse",
            "name": "hizkargo",
        }
    ],
    extra_headers={"anthropic-beta": "mcp-client-2025-04-04"},
)
print(resp.content[0].text)
```

Aşağıdaki JSON ise protokol düzeyinde standart bir araç çağrısı mesajının basitleştirilmiş biçimini gösterir; gönderici ve alıcı bu yapıyı ortak anlar.

```yaml
mesaj:
  protokol: mcp
  surum: "1.0"
  tur: tool_call
  arac: kargo_olustur
  parametreler:
    siparis_no: "12345"
    adres: "İstanbul"
```

## 🔗 İlgili Kavramlar

- [Araç Kullanımı (Tool Use)](../tool-use/tool-use.md) — protokoller araçların standart biçimde çağrılmasını sağlar.
- [Çoklu Ajan (Multi-Agent)](../multi-agent/multi-agent.md) — ajanlar arası iletişim protokoller üzerinden yürür.
- [Güvenlik Bariyerleri (Guardrails)](../guardrails/guardrails.md) — protokol üzerinden gelen istekleri filtreler.
- [Gözlemlenebilirlik (Observability)](../observability/observability.md) — protokol mesajlarının izlenmesini sağlar.
- MCP (Model Context Protocol) — araçları ve kaynakları standartlaştıran protokol.
- A2A (Agent-to-Agent) — ajanların doğrudan birbiriyle iş paylaşmasını sağlayan protokol.
