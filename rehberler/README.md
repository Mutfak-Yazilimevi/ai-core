# 🛠️ Oluşturma Rehberleri (Claude Code Yapıtaşları)

Bu bölüm, Agentic AI sistemlerini **Claude Code** üzerinde pratikte kurarken
kullanılan beş yapıtaşının nasıl **oluşturulacağını** anlatır: amaç, kurallar,
dosya konumları ve çalışan örneklerle.

> Bu yapıtaşlarının **kavramsal** karşılıkları için kök
> [GLOSSARY](../GLOSSARY.md) → "Temel Terimler" bölümüne bakın. Buradaki sayfalar
> ise "nasıl kurulur" odaklıdır.

## Rehberler

**Olmazsa olmaz temel yapıtaşları:**

| Yapıtaşı | Rehber | Tek cümleyle |
|----------|--------|--------------|
| 📌 **CLAUDE.md** | [claude-md-olusturma.md](claude-md-olusturma.md) | Her oturumda otomatik yüklenen kalıcı proje hafızası/talimatları. |
| ⚙️ **Settings & İzinler** | [settings-permissions-olusturma.md](settings-permissions-olusturma.md) | Ajanın izinlerini (allow/deny/ask) ve davranışını belirleyen yapılandırma. |
| 🧩 **Skill** | [skill-olusturma.md](skill-olusturma.md) | Gerektiğinde yüklenen, yeniden kullanılabilir talimat/iş akışı paketi. |
| 🤖 **Subagent** | [subagent-olusturma.md](subagent-olusturma.md) | Kendi bağlam penceresinde çalışan uzman alt ajan. |
| 🪝 **Hook** | [hook-olusturma.md](hook-olusturma.md) | Yaşam döngüsü olaylarında otomatik çalışan deterministik betik. |
| ⌨️ **Slash Command** | [command-olusturma.md](command-olusturma.md) | `/ad` ile çağrılan hızlı, yeniden kullanılabilir istem. |
| 🔌 **MCP Server** | [mcp-olusturma.md](mcp-olusturma.md) | Dış araç/veri kaynaklarını standart protokolle bağlama. |

**Paketleme:**

| Yapıtaşı | Rehber | Tek cümleyle |
|----------|--------|--------------|
| 📦 **Plugin** | [plugin-olusturma.md](plugin-olusturma.md) | Skill+agent+hook+MCP'yi tek, paylaşılabilir, sürümlenebilir pakette toplar. |

> Her rehberin sonunda, o yapıtaşını **kullanma ve kullanmama** durumlarındaki
> **kazanımlar ve kayıplar** karşılaştırması bulunur.

## Hangisini ne zaman kullanmalı?

| İhtiyaç | Doğru yapıtaşı |
|---------|----------------|
| Projenin kural/komut/standartlarını ajan her oturumda bilsin | **CLAUDE.md** |
| Hangi araç/komut/dosyaya izinli olduğunu denetlemek istiyorum | **Settings & İzinler** |
| Aynı talimatları/checklist'i tekrar tekrar veriyorum | **Skill** |
| `/ad` ile elle tetiklenen bir iş akışı istiyorum | **Slash Command** (≈ Skill) |
| Yan görev ana sohbeti log/arama çıktısıyla dolduruyor | **Subagent** |
| Belirli bir olayda (araç öncesi/sonrası vb.) **garantili** bir şey çalışsın | **Hook** |
| Ajanın dış bir sisteme (DB, API, tarayıcı) erişmesi gerekiyor | **MCP Server** |
| Yukarıdakileri paketleyip ekiple/toplulukla paylaşmak istiyorum | **Plugin** |

> **Skill vs Slash Command:** Modern Claude Code'da ikisi aynı mekanizmadır —
> bir Skill (`.claude/skills/<ad>/SKILL.md`) hem `/ad` komutu olarak hem de
> otomatik tetiklenebilir. Eski `.claude/commands/<ad>.md` biçimi hâlâ çalışır
> ama yalnızca `/ad` olarak. Ayrıntı için ilgili iki rehbere bakın.

## Dosya konumları — hızlı bakış

| Yapıtaşı | Proje (paylaşılan) | Kullanıcı (global) |
|----------|--------------------|--------------------|
| CLAUDE.md | `./CLAUDE.md` | `~/.claude/CLAUDE.md` |
| Settings & İzinler | `.claude/settings.json` | `~/.claude/settings.json` |
| Skill | `.claude/skills/<ad>/SKILL.md` | `~/.claude/skills/<ad>/SKILL.md` |
| Subagent | `.claude/agents/<ad>.md` | `~/.claude/agents/<ad>.md` |
| Hook | `.claude/settings.json` (`hooks`) | `~/.claude/settings.json` |
| Slash Command | `.claude/commands/<ad>.md` veya Skill | `~/.claude/commands/<ad>.md` |
| MCP Server | `.mcp.json` | `~/.claude.json` |
| Plugin | `.claude-plugin/plugin.json` (paket kökü) | marketplace ile kurulur |

> Kaynaklar: [Memory/CLAUDE.md](https://code.claude.com/docs/en/memory) ·
> [Settings](https://code.claude.com/docs/en/settings) ·
> [Skills](https://code.claude.com/docs/en/skills) ·
> [Subagents](https://code.claude.com/docs/en/sub-agents) ·
> [Hooks](https://code.claude.com/docs/en/hooks) ·
> [Commands](https://code.claude.com/docs/en/slash-commands) ·
> [MCP](https://code.claude.com/docs/en/mcp) ·
> [Plugins](https://code.claude.com/docs/en/plugins)
