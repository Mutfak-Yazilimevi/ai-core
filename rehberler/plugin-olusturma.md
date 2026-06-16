# 📦 Plugin Oluşturma

> **Paketleme yapıtaşı.** Skill, subagent, hook ve MCP'yi tek, paylaşılabilir bir pakette toplar.

## Amaç (ne işe yarar?)

Bir **Plugin**, şu yapıtaşlarını tek bir kurulabilir pakette bir araya getirir:
**Skill'ler, Subagent'lar, Hook'lar, MCP sunucuları** (ve LSP/monitor/ayarlar).
Bir kurulumu ekip veya toplulukla **paylaşmak**, **sürümlemek** ve **ad alanıyla
çakışmasız** dağıtmak için kullanılır. Tek bir projedeki hızlı denemeler için
`.claude/` yapılandırması yeterlidir; paylaşım/dağıtım gerekince plugin'e geçilir.

## Dizin yapısı ve manifest

```
benim-plugin/
├── .claude-plugin/
│   └── plugin.json        # Manifest (zorunlu)
├── skills/                # Model tarafından çağrılabilir skill'ler
│   └── selamla/
│       └── SKILL.md
├── agents/                # Subagent'lar (opsiyonel)
├── hooks/
│   └── hooks.json         # Hook'lar (opsiyonel)
├── .mcp.json              # MCP sunucuları (opsiyonel)
└── README.md
```

> **Sadece `plugin.json` `.claude-plugin/` içinde durur;** `skills/`, `agents/`,
> `hooks/`, `.mcp.json` plugin **kökünde** olmalıdır.

### `plugin.json` (manifest)

```json
{
  "name": "benim-plugin",
  "description": "Temel örnek bir selamlama eklentisi",
  "version": "1.0.0",
  "author": { "name": "Adınız" }
}
```

| Alan | Zorunlu | Amaç |
|------|---------|------|
| `name` | **Evet** | Benzersiz kimlik; skill ad alanı olur (ör. `/benim-plugin:selamla`). |
| `description` | **Evet** | Eklenti yöneticisinde görünür. |
| `version` | Hayır | Ayarlanırsa kullanıcı yalnızca sürüm yükseltildiğinde güncellenir; yoksa her commit SHA'sı yeni sürüm sayılır. |
| `author` / `homepage` / `repository` / `license` | Hayır | Künye/bağlantı bilgisi. |

## Adım adım oluşturma

1. `mkdir -p benim-plugin/.claude-plugin benim-plugin/skills/selamla`
2. `plugin.json` ve `skills/selamla/SKILL.md` dosyalarını yaz.
3. Geliştirirken yerelde test et: `claude --plugin-dir ./benim-plugin`
4. Oturumda `/benim-plugin:selamla` ile çağır; değişiklik sonrası `/reload-plugins`.

## Tam örnek

`.claude-plugin/plugin.json`:

```json
{
  "name": "benim-plugin",
  "description": "Temel örnek bir selamlama eklentisi",
  "version": "1.0.0",
  "author": { "name": "Adınız" }
}
```

`skills/selamla/SKILL.md`:

```markdown
---
description: Kullanıcıyı sıcak bir mesajla karşıla.
---

Kullanıcıyı sıcak bir dille karşıla ve nasıl yardımcı olabileceğini sor.
$ARGUMENTS bir isim içeriyorsa karşılamayı kişiselleştir.
```

Çağırma: `/benim-plugin:selamla Ahmet`

## Marketplace ve komutlar

| Komut | Amaç |
|-------|------|
| `/plugin marketplace add <kaynak>` | Bir marketplace kaydet |
| `/plugin install <ad>` | Eklenti kur |
| `/plugin remove <ad>` | Kaldır |
| `/reload-plugins` | Yeniden başlatmadan yeniden yükle |
| `claude plugin validate` | Gönderim öncesi doğrula |

## Kurallar ve tuzaklar

1. **Bileşenleri `.claude-plugin/` içine koyma;** orada yalnızca `plugin.json` olur,
   diğer her şey kökte.
2. **Ad alanı çakışmayı önler:** her skill plugin adıyla öneklenir
   (`/benim-plugin:selamla`); kapatılamaz.
3. **Tek-skill kısayolu:** tek skill'li plugin `SKILL.md`'yi doğrudan köke koyabilir.
4. **Sürüm yönetimi:** `version` koyarsan elle yükselttiğinde güncellenir; koymazsan
   her commit yeni sürüm sayılır.
5. **İlk kurulumda güven dialoğu** çıkar; yalnızca onayladığın eklentiler yüklenir.
   Geliştirirken `--plugin-dir`, sonra `/reload-plugins`.

## ⚖️ Kazanımlar ve Kayıplar

| Durum | Kazanım | Kayıp / Risk |
|-------|---------|--------------|
| **Kullanırsan** | Skill+agent+hook+MCP'yi tek pakette dağıtırsın; sürümleme; ekip/topluluk paylaşımı; ad alanıyla çakışma yok. | Paketleme + sürüm bakımı; güven dialoğu/üçüncü taraf güveni; tek proje için fazla ağır olabilir. |
| **Kullanmazsan** | `.claude/` ile hızlı, basit, tek proje kurulumu. | Paylaşım/dağıtım zorlaşır (elle kopyalama); sürümleme yok; ad çakışması riski; her projede tekrar kurulum. |

**Denge:** Tek projede deneme/kullanım için `.claude/`; birden çok projeye veya
ekibe yaymak, sürümlemek istediğinde plugin'e geç.

## İlgili rehberler

- [Skill](skill-olusturma.md) · [Subagent](subagent-olusturma.md) · [Hook](hook-olusturma.md) · [MCP](mcp-olusturma.md) — plugin'in paketlediği yapıtaşları
- Kavram: [GLOSSARY → Agent Protocols](../GLOSSARY.md)

> Ayrıntı: <https://code.claude.com/docs/en/plugins> ·
> <https://code.claude.com/docs/en/plugins-reference>
