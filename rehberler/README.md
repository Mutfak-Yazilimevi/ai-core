# 🛠️ Oluşturma Rehberleri (Claude Code Yapıtaşları)

Bu bölüm, Agentic AI sistemlerini **Claude Code** üzerinde pratikte kurarken
kullanılan beş yapıtaşının nasıl **oluşturulacağını** anlatır: amaç, kurallar,
dosya konumları ve çalışan örneklerle.

> Bu yapıtaşlarının **kavramsal** karşılıkları için kök
> [GLOSSARY](../GLOSSARY.md) → "Temel Terimler" bölümüne bakın. Buradaki sayfalar
> ise "nasıl kurulur" odaklıdır.

## Rehberler

| Yapıtaşı | Rehber | Tek cümleyle |
|----------|--------|--------------|
| 🧩 **Skill** | [skill-olusturma.md](skill-olusturma.md) | Gerektiğinde yüklenen, yeniden kullanılabilir talimat/iş akışı paketi. |
| 🤖 **Subagent** | [subagent-olusturma.md](subagent-olusturma.md) | Kendi bağlam penceresinde çalışan uzman alt ajan. |
| 🪝 **Hook** | [hook-olusturma.md](hook-olusturma.md) | Yaşam döngüsü olaylarında otomatik çalışan deterministik betik. |
| ⌨️ **Slash Command** | [command-olusturma.md](command-olusturma.md) | `/ad` ile çağrılan hızlı, yeniden kullanılabilir istem. |
| 🔌 **MCP Server** | [mcp-olusturma.md](mcp-olusturma.md) | Dış araç/veri kaynaklarını standart protokolle bağlama. |

## Hangisini ne zaman kullanmalı?

| İhtiyaç | Doğru yapıtaşı |
|---------|----------------|
| Aynı talimatları/checklist'i tekrar tekrar veriyorum | **Skill** |
| `/ad` ile elle tetiklenen bir iş akışı istiyorum | **Slash Command** (≈ Skill) |
| Yan görev ana sohbeti log/arama çıktısıyla dolduruyor | **Subagent** |
| Belirli bir olayda (araç öncesi/sonrası vb.) **garantili** bir şey çalışsın | **Hook** |
| Ajanın dış bir sisteme (DB, API, tarayıcı) erişmesi gerekiyor | **MCP Server** |

> **Skill vs Slash Command:** Modern Claude Code'da ikisi aynı mekanizmadır —
> bir Skill (`.claude/skills/<ad>/SKILL.md`) hem `/ad` komutu olarak hem de
> otomatik tetiklenebilir. Eski `.claude/commands/<ad>.md` biçimi hâlâ çalışır
> ama yalnızca `/ad` olarak. Ayrıntı için ilgili iki rehbere bakın.

## Dosya konumları — hızlı bakış

| Yapıtaşı | Proje (paylaşılan) | Kullanıcı (global) |
|----------|--------------------|--------------------|
| Skill | `.claude/skills/<ad>/SKILL.md` | `~/.claude/skills/<ad>/SKILL.md` |
| Subagent | `.claude/agents/<ad>.md` | `~/.claude/agents/<ad>.md` |
| Hook | `.claude/settings.json` | `~/.claude/settings.json` |
| Slash Command | `.claude/commands/<ad>.md` veya Skill | `~/.claude/commands/<ad>.md` |
| MCP Server | `.mcp.json` | `~/.claude.json` |

> Kaynaklar: [Skills](https://code.claude.com/docs/en/skills) ·
> [Subagents](https://code.claude.com/docs/en/sub-agents) ·
> [Hooks](https://code.claude.com/docs/en/hooks) ·
> [Commands](https://code.claude.com/docs/en/slash-commands) ·
> [MCP](https://code.claude.com/docs/en/mcp)
