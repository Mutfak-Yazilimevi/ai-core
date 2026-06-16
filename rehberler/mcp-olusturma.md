# 🔌 MCP Server Oluşturma / Bağlama

## Amaç (ne işe yarar?)

**MCP (Model Context Protocol)**, Claude Code'u dış araçlara, API'lere ve veri
kaynaklarına **standart bir protokolle** bağlar. Bir MCP sunucusu **yerel**
(stdio alt süreci) ya da **uzak** (HTTP/SSE) çalışır. Bağlandığında, sunucunun
sunduğu araçlar Claude'un araç listesine eklenir; ajan veritabanınıza, issue
takip sisteminize, tarayıcıya vb. erişebilir.

## Ne zaman kullanılır?

- Ajanın bir dış sisteme (DB, GitHub, Jira, tarayıcı otomasyonu) erişmesi gerekiyor.
- Birden çok ajan/araç arasında tek tip, güvenli bir arabirim istiyorsunuz.

## Dosya konumu (kapsam)

| Kapsam | Konum | Görünürlük |
|--------|-------|------------|
| Local (varsayılan) | `~/.claude.json` (proje girdisi altında) | Yalnızca bu proje + bu kullanıcı. |
| Project (paylaşılan) | Repo kökünde `.mcp.json` | Repoyu klonlayan herkes (ekip). |
| User (tüm projeler) | `~/.claude.json` (üst düzey `mcpServers`) | Tüm projeleriniz. |

## `.mcp.json` şeması

```json
{
  "mcpServers": {
    "sunucu-adı": {
      "type": "stdio | http | sse",

      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "env": { "DEBUG": "true" },

      "url": "https://api.example.com/mcp",
      "headers": { "Authorization": "Bearer $API_KEY" },
      "allowedEnvVars": ["API_KEY"]
    }
  }
}
```

- **stdio (yerel süreç):** `command` + `args` + `env`. Tarayıcı otomasyonu, yerel
  DB erişimi gibi yerel araçlar için. İlgili CLI yerelde kurulu olmalı.
- **http / sse (uzak):** `url` + `headers`. Barındırılan servisler için; yerel
  süreç gerekmez ama ağ erişimi gerekir. Başlıklarda `$DEĞİŞKEN` ile ortam
  değişkeni kullanın ve **`allowedEnvVars`** ile beyaz listeye alın (güvenlik sınırı).

## Tam örnek

`.mcp.json` (proje köküne):

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "kurumsal-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": { "Authorization": "Bearer $API_KEY" },
      "allowedEnvVars": ["API_KEY"]
    }
  }
}
```

## CLI ile ekleme (`claude mcp`)

```bash
# HTTP sunucu (proje kapsamı, ekiple paylaşılır)
claude mcp add --transport http --scope project dokuman https://code.claude.com/docs/mcp

# Yerel stdio sunucu ("--" sonrası komut/argümanlar)
claude mcp add playwright -- npx -y @playwright/mcp@latest

# Statik token ile (kullanıcı kapsamı)
claude mcp add --scope user --transport http github https://api.github.com/mcp \
  --header "Authorization: Bearer $GITHUB_TOKEN"

# Durum / yönetim
claude mcp list            # bağlantı durumlarını gör
claude mcp get <ad>        # yapılandırmayı gör
claude mcp remove <ad>     # kaldır
```

## Kimlik doğrulama

- **OAuth (barındırılan servisler):** Sunucuyu ekleyin, oturumda `/mcp` → sunucuyu
  seçin → **Authenticate**; tarayıcı açılır.
- **Statik token (API'ler):** `--header "Authorization: Bearer <token>"` ya da
  `.mcp.json`'da `env`/`headers` + `allowedEnvVars`.

## Kurallar ve tuzaklar

1. **Kapsamlar yığılır.** Eşleşen tüm kapsamların sunucuları kullanılabilir.
   **Project** kapsamı ilk bağlantıda **onay** ister (workspace güveni); **user**
   kapsamı otomatik bağlanır.
2. **stdio vs http dengesi:** stdio yerelde süreç açar (yerel CLI gerekir, başlangıç
   timeout'u ~30 sn — `MCP_TIMEOUT` ile artırın); http barındırılan servise erişir
   (ağ gerekir).
3. **Başlıklarda ortam değişkeni** için `$VAR` kullanın ve **`allowedEnvVars`** ile
   beyaz listeye alın — yalnızca listelenenler başlıkta kullanılabilir.
4. **Yapılandırma oturum başında okunur.** `.mcp.json`'u düzenledikten sonra
   oturumu **yeniden başlatın**; oturum içinde durum/yeniden kimlik için `/mcp`.
5. **Sırları koda gömmeyin.** Token'ları ortam değişkeni + `allowedEnvVars` ya da
   OAuth ile yönetin; `.mcp.json` repoya gidiyorsa içine düz token yazmayın.

## İlgili rehberler

- [Hook Oluşturma](hook-olusturma.md) — `type: "mcp_tool"` hook'u bir MCP aracını çağırır
- [Subagent Oluşturma](subagent-olusturma.md) — alt ajanlara araç erişimi verme
- Kavram: [GLOSSARY → MCP · Tool Use · Agent Protocols](../GLOSSARY.md)

> Ayrıntı: <https://code.claude.com/docs/en/mcp> ·
> <https://code.claude.com/docs/en/mcp-quickstart>
