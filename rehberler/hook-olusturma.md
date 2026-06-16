# 🪝 Hook Oluşturma

## Amaç (ne işe yarar?)

Bir **Hook (Kanca)**, Claude Code'un yaşam döngüsü olaylarında (oturum başı,
araç çağrısı öncesi/sonrası, kullanıcı istemi vb.) **otomatik** çalışan bir
betiktir. Hook'ları **harness çalıştırır, Claude değil** — bu yüzden
deterministiktir. Bir eylemi engellemek, girdiyi değiştirmek, bağlam enjekte
etmek veya doğrulama yapmak için kullanılır. "Şu komut asla çalışmasın",
"her düzenlemeden sonra formatla", "oturum başında şu bilgiyi yükle" gibi
**garantili** kurallar hook'larla kurulur.

## Ne zaman kullanılır?

- Tehlikeli komutları (ör. `rm -rf`) engelleme.
- Araç çıktısından sonra otomatik bağlam ekleme (lint sonucu, test durumu).
- Oturum başında proje durumunu/ortamı hazırlama.

## Dosya konumu (kapsam)

| Kapsam | Yol | Notlar |
|--------|-----|--------|
| Kullanıcı (global) | `~/.claude/settings.json` | Tüm projeler; paylaşılmaz. |
| Proje (paylaşılan) | `.claude/settings.json` | Sürüm kontrolüyle ekiple paylaşılır. |
| Proje (yerel) | `.claude/settings.local.json` | Kişisel override; genelde `.gitignore`'da. |

## Olaylar (en sık kullanılanlar)

- `PreToolUse` — Araç çalışmadan önce (**engelleyebilir / girdiyi değiştirebilir**).
- `PostToolUse` — Araç başarıyla bittikten sonra (engelleyemez; **bağlam enjekte eder**).
- `UserPromptSubmit` — Kullanıcı istem gönderince (engelleyebilir).
- `Stop` / `SubagentStop` — Claude / alt ajan bitince (engelleyebilir).
- `SessionStart` / `SessionEnd` — Oturum başı/sonu.
- `PreCompact` — Bağlam sıkıştırması öncesi.
- `Notification` — Bildirim olayları.

## JSON yapısı

```json
{
  "hooks": {
    "<OlayAdı>": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/betik.sh", "args": [] }
        ]
      }
    ]
  }
}
```

- **`matcher`**: Araç olaylarında araç adıyla eşleşir (`Bash`, `Edit|Write`,
  regex). Boş/atlanırsa tümüyle eşleşir. `SessionStart`'ta kaynak (`startup`,
  `resume`...), `FileChanged`'de dosya adı ile eşleşir.
- **`type`**: `command` (kabuk), `http`, `mcp_tool`, `prompt`, `agent`.

### Komut hook'unun girdisi/çıktısı

- **Girdi:** Hook, olay verisini **stdin'de JSON** olarak alır
  (`tool_name`, `tool_input`, `session_id`, `cwd`, `hook_event_name`...).
- **Çıkış kodu:** `0` = başarı (stdout JSON olarak işlenir); `2` = **engelle**
  (stderr gösterilir, eylem durur); diğer kodlar = engellemeyen hata.
- **Karar JSON'u (PreToolUse):**
  ```json
  {
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "allow|deny|ask",
      "permissionDecisionReason": "Gerekçe",
      "updatedInput": { "command": "değiştirilmiş komut" }
    }
  }
  ```

## Tam örnek — tehlikeli `rm -rf`'i engelle

`.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/block-rm.sh", "args": [] }
        ]
      }
    ]
  }
}
```

`.claude/hooks/block-rm.sh` (çalıştırılabilir yapın: `chmod +x`):

```bash
#!/usr/bin/env bash
# stdin'deki JSON'dan komutu oku
command=$(jq -r '.tool_input.command // empty')

if printf '%s' "$command" | grep -Eq 'rm[[:space:]]+-[a-z]*r[a-z]*f'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Yıkıcı rm -rf komutu hook tarafından engellendi."
    }
  }'
fi
exit 0
```

## Kurallar ve tuzaklar

1. **Çıkış kodları davranışı belirler:** `0` başarı, `2` engelle, diğer = uyarı.
   HTTP hook'larda 2xx = başarı.
2. **`matcher` olay türüne göre değişir:** araç olaylarında araç adı,
   `SessionStart`'ta kaynak, `FileChanged`'de dosya adı. Boş = tümü.
3. **`PreToolUse` engelleyebilir/değiştirebilir; `PostToolUse` engelleyemez**
   (yalnızca `additionalContext` ile bilgi ekler).
4. **Hızlı tutun.** `SessionStart`/`Stop` oturumu bekletir; gereksiz süreç
   doğurmamak için `if`/`matcher` ile kapsamı daraltın.
5. **Öncelik:** kurumsal > kullanıcı > proje; eşleşen tüm kapsamlar çalışır.
   Commit'lenmeyecek yerel kurallar için `.claude/settings.local.json` kullanın.

## ⚖️ Kazanımlar ve Kayıplar

| Durum | Kazanım | Kayıp / Risk |
|-------|---------|--------------|
| **Kullanırsan** | Deterministik garanti (modelin keyfine bağlı değil); güvenlik bariyeri; otomatik format/lint/bağlam enjeksiyonu; denetlenebilir ve tutarlı. | Yanlış yazılmış hook iş akışını engeller/yavaşlatır; bakım + kabuk/`jq` bağımlılığı; hata ayıklaması zor olabilir. |
| **Kullanmazsan** | Kurulum/bakım yok; tam esneklik. | Kritik kural modele veya insana bağlı kalır (atlanabilir/unutulur); tehlikeli işlemler geçebilir; manuel tekrar + insan hatası. |

**Denge:** "Asla olmamalı / her seferinde olmalı" türü garanti gereken kurallar için
hook; esnek, duruma göre değişen davranış için sistem istemi/skill daha uygundur.

## İlgili rehberler

- [Skill Oluşturma](skill-olusturma.md) — skill yaşam döngüsüne bağlı `hooks` alanı
- [Subagent Oluşturma](subagent-olusturma.md) — `SubagentStart/Stop` olayları
- Kavram: [GLOSSARY → Hook · Guardrails](../GLOSSARY.md)

> Tam olay listesi ve şema için: <https://code.claude.com/docs/en/hooks>
