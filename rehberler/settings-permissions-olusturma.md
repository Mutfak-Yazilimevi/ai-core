# ⚙️ Settings & İzinler (Permissions) Oluşturma

> **Olmazsa olmaz yapıtaşı.** Ajanın neye izinli olduğunu ve nasıl davranacağını belirler.

## Amaç (ne işe yarar?)

`settings.json`, Claude Code'un davranışını yapılandırır: **izinler (permissions)**,
ortam değişkenleri, hook'lar, model ve MCP sunucuları. En kritik kısmı izinlerdir:
hangi araç/komut/dosya **otomatik onaylı (allow)**, hangisi **yasak (deny)**,
hangisi **sorulacak (ask)**. Böylece hem güvenliği sağlar hem de gereksiz onay
sorularını azaltırsınız.

## Dosya konumu (öncelik: yüksekten düşüğe)

| Kapsam | Yol | Paylaşılır mı? |
|--------|-----|----------------|
| Kurumsal (managed) | Sistem/MDM yolu | Evet (IT — ezilemez) |
| CLI argümanları | `--allow-tools` vb. | Oturumluk |
| Yerel | `.claude/settings.local.json` | Hayır (`.gitignore`) |
| Proje | `.claude/settings.json` | Evet (git) |
| Kullanıcı | `~/.claude/settings.json` | Hayır |

> **`deny` her kapsamdan engeller;** `allow` ise yalnızca en yüksek öncelikli
> kapsamda eşleşirse geçerlidir.

## Format (şema)

```json
{
  "permissions": {
    "allow": ["Bash(npm run test:*)", "Read(./src/**)"],
    "deny": ["Bash(rm -rf *)", "Read(./.env)"],
    "ask": ["Edit(*.config.js)"]
  },
  "defaultMode": "default",
  "model": "claude-opus-4-8",
  "env": { "DEBUG": "true" },
  "additionalDirectories": ["~/ortak-kod"],
  "enableAllProjectMcpServers": false
}
```

### İzin kuralı sözdizimi

| Kural | Örnek | Etki |
|-------|-------|------|
| Tüm kullanımlar | `Bash` | Aracın her kullanımı |
| Önek/joker | `Bash(npm run test:*)` | `npm run test ...` |
| Dosya deseni | `Read(./src/**)` | gitignore tarzı; `**` özyineli |
| Alan adı | `WebFetch(domain:github.com)` | Yalnızca o alan |
| MCP aracı | `mcp__github__get_*` | github sunucusunun `get_` araçları |

Tüm diziler (`allow`/`deny`/`ask`) **opsiyoneldir**; boş `{}` geçerlidir.

### İzin modları (`defaultMode`)

- `default` — Her aracın ilk kullanımında sorar.
- `acceptEdits` — Dosya düzenlemelerini ve sık komutları otomatik onaylar.
- `plan` — Salt-okunur (düzenleme yok).
- `dontAsk` — `allow` ile önceden izin verilmedikçe reddeder.
- `bypassPermissions` — Onay atlanır (**tehlikeli**; yalnızca izole VM/konteynerde).

### Sık kullanılan diğer anahtarlar

| Anahtar | Amaç |
|---------|------|
| `model` | Yeni oturumlar için varsayılan model |
| `env` | Ortam değişkenleri |
| `hooks` | Yaşam döngüsü kancaları ([Hook rehberi](hook-olusturma.md)) |
| `additionalDirectories` | Erişilecek ek dizinler |
| `enableAllProjectMcpServers` | `.mcp.json` sunucularını otomatik etkinleştir |

## Tam örnek

`.claude/settings.json` (proje, güvenli):

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run build)",
      "Bash(npm run test:*)",
      "Read(./src/**)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(./.env)",
      "Read(./secrets/**)"
    ],
    "ask": ["Edit(*.config.js)"]
  },
  "defaultMode": "acceptEdits",
  "model": "claude-opus-4-8"
}
```

> Oturum içinde izinleri görmek/düzenlemek için **`/permissions`** komutu.

## Kurallar ve tuzaklar

1. **`deny` her kapsamı bloklar;** hiçbir kapsam onu ezemez. Güvenlik için en güçlü araç.
2. **`allow` kapsam eşleşmesi ister:** proje `deny` ederse kullanıcı `allow` edemez.
3. **Bash joker'ları kelime sınırına dikkat:** `Bash(ls *)` (boşluklu) `ls -la`'yı
   eşler ama `lsof`'u eşlemez.
4. **Bileşik komutlar parçalanır:** `Bash(a && b)` her alt komutu ayrı eşleştirir.
5. **Sırları gizli dosyalarda koru:** `Read(./.env)`'i `deny`'a ekle; `env` içine
   düz sır yazma — repoya gidebilir. Çoğu ayar yeniden başlatmadan yüklenir; `model`
   değişikliği yeniden başlatma ister.

## ⚖️ Kazanımlar ve Kayıplar

| Durum | Kazanım | Kayıp / Risk |
|-------|---------|--------------|
| **Kullanırsan** | Güvenlik (yıkıcı/duyarlı işlemleri engelle); `allow` ile daha az onay sorusu → akış hızlanır; ekipte tutarlı politika; ortam/model standardı. | Aşırı kısıtlama iş akışını yavaşlatır; yanlış `allow` tehlikeli kapı açar; kapsam önceliği başta kafa karıştırabilir. |
| **Kullanmazsan** | Sıfır kurulum; tam esneklik. | Her araçta onay sorusu (yorgunluk) ya da gözetimsiz tehlikeli işlem riski; ekipte tutarsız davranış; duyarlı dosya/sır koruması yok. |

**Denge:** Önce kritik `deny` kurallarını (sır dosyaları, yıkıcı komutlar) koy;
güvenli, sık komutları `allow`'a ekleyerek sürtünmeyi azalt; gerisini varsayılan
sormaya bırak.

## İlgili rehberler

- [Hook Oluşturma](hook-olusturma.md) — kural temelli, programatik denetim için
- [MCP Oluşturma](mcp-olusturma.md) — `enableAllProjectMcpServers` ve MCP izinleri
- Kavramlar: [GLOSSARY → Guardrails · Least Privilege · Policy Layer](../GLOSSARY.md)

> Ayrıntı: <https://code.claude.com/docs/en/settings> ·
> <https://code.claude.com/docs/en/iam>
