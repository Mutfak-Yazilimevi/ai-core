# Model Context Protocol (MCP)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 8. İletişim ve Protokoller

Ajanların bağlam bilgilerini (context), araçları ve veri kaynaklarını kendi aralarında ve dış sistemlerle verimli ve güvenli bir şekilde paylaşmasını sağlayan standartlaştırılmış protokoldür. Modelin dış kaynaklara tek tip bir arabirim üzerinden erişmesini mümkün kılar.

## Mini Senaryo

> Ajan, MCP üzerinden hem Google Drive'a hem veritabanına aynı standart arabirimle erişir.

## 📖 Ayrıntılı Açıklama

Model Context Protocol (MCP), ajanların araçlara, veri kaynaklarına ve bağlam bilgisine (context) tek tip, standart bir arabirim üzerinden erişmesini sağlayan açık bir protokoldür. Her entegrasyon için ayrı, özel bir bağlayıcı (connector) yazmak yerine, MCP "bir kez tanımla, her yerde kullan" yaklaşımını getirir: bir MCP sunucusu (server) belirli araçları/verileri açar, herhangi bir MCP uyumlu istemci (client/ajan) bunları standart şekilde keşfedip kullanabilir.

Bu protokol önemlidir; çünkü ajan ekosistemindeki "M×N entegrasyon problemi"ni çözer. M farklı ajan ve N farklı sistem (Drive, GitHub, veritabanı, takvim) varsa, normalde M×N özel entegrasyon gerekirken, MCP ile her sistem bir kez MCP sunucusu olarak sarılır ve tüm ajanlar onu kullanabilir. Bu, USB'nin donanım için yaptığını yazılım araç entegrasyonu için yapar: ortak bir fiş standardı.

Nasıl çalışır? Mimari istemci-sunucu (client-server) modelidir. MCP sunucusu üç tür yetenek sunabilir: araçlar (tools, ajanın çağırabileceği işlevler), kaynaklar (resources, okunabilir veri) ve istemler (prompts, hazır şablonlar). Ajan tarafındaki MCP istemcisi, başlangıçta sunucuya bağlanıp sunduğu yetenekleri keşfeder (discovery). Ardından ajan, bir aracı çağırmak istediğinde istemci bunu standart JSON-RPC mesajlarıyla sunucuya iletir, sonucu geri alır. Sunucular yerel (stdio) veya uzak (HTTP/SSE) çalışabilir.

Ne zaman kullanılır? Bir ajanı birden çok dış sisteme bağlarken, araçları yeniden kullanılabilir kılmak isterken, üçüncü taraf entegrasyonlarını standartlaştırırken idealdir. Ne zaman gerekmez? Tek bir basit, dahili araç için tam MCP sunucusu kurmak fazladan karmaşıklıktır; doğrudan fonksiyon çağırma (function calling) yeterlidir.

Tuzaklar: Birincisi, güvenlik — MCP sunucusu sistemlere erişim açar; en az yetki (least privilege) ilkesiyle kapsamı dar tutulmalı, güvenilmeyen sunuculara bağlanılmamalıdır. İkincisi, çok fazla araç açıp ajanın araç seçimini zorlaştırmak. Üçüncüsü, sunucu araç açıklamalarının belirsiz olması; ajan aracı yanlış kullanır.

## 🎬 Detaylı Senaryo

Bir danışmanlık firması ("BilgiOrtak") iç asistanını hem doküman deposuna hem proje veritabanına bağlamak ister:

1. Ekip önce her sistem için ayrı, özel kod yazmayı düşünür ama bakımının zor olacağını fark eder.
2. Bunun yerine MCP'ye geçer: şirket dokümanları için bir MCP sunucusu, proje veritabanı için ikinci bir MCP sunucusu kurar.
3. Doküman sunucusu salt okunur bir `belge_ara` aracı açar; veritabanı sunucusu dar yetkili `proje_durumu` aracı açar (least privilege).
4. Asistan (MCP istemcisi) başlangıçta iki sunucuya bağlanır ve sundukları araçları otomatik keşfeder.
5. Bir çalışan sorar: "Atlas projesinin son durumu ve ilgili sözleşme nedir?"
6. Asistan, aynı standart arabirimle önce veritabanı sunucusundaki `proje_durumu`, sonra doküman sunucusundaki `belge_ara` aracını çağırır.
7. İki kaynaktan gelen sonuçları birleştirip yanıtlar.
8. Firma ileride takvim entegrasyonu da ister; sadece yeni bir MCP sunucusu eklemeleri yeterli olur, asistan kodu değişmez.

## 💻 Kullanım / Uygulama Örneği

MCP, sunucuların hangi araçları açtığını ve istemcinin bunlara nasıl bağlandığını tanımlar. Aşağıda bir istemcinin hangi MCP sunucularına bağlanacağını belirten tipik bir yapılandırma (config) yer alır.

```yaml
# mcp-config.yaml — ajanın bağlanacağı MCP sunucuları
mcpServers:
  dokuman-deposu:
    command: "npx"
    args: ["-y", "@firma/mcp-belge-sunucusu"]
    # Yalnızca okuma kapsamı (least privilege)
    env:
      ACCESS_MODE: "read-only"
  proje-veritabani:
    url: "https://mcp.firma.local/projeler"
    transport: "http"
```

İkinci olarak, bir MCP sunucusu kavramsal olarak bir araç açar; aşağıdaki sözde-tanım sunucunun sunduğu aracı gösterir:

```yaml
# MCP sunucusunun açtığı bir araç (kavramsal)
tool:
  name: "belge_ara"
  description: "Şirket doküman deposunda anahtar kelimeyle arama yapar (salt okunur)."
  inputSchema:
    type: object
    properties:
      sorgu: { type: string }
    required: ["sorgu"]
```

## 🔗 İlgili Kavramlar

- [Fonksiyon Çağırma (Function Calling)](../function-calling/function-calling.md) — MCP araçlarının altında yatan çağırma mekanizması
- [En Az Yetki (Least Privilege)](../least-privilege/least-privilege.md) — MCP sunucu erişimini dar tutma
- [Ajan Döngüsü (Agent Loop)](../agent-loop/agent-loop.md) — MCP araçlarının kullanıldığı yürütme çevrimi
- [Devir İşlemleri (Handoffs)](../handoffs/handoffs.md) — farklı sunuculara/ajanlara kontrol aktarımı
- İstemci-Sunucu Mimarisi (Client-Server Architecture) — MCP'nin temel yapısı
