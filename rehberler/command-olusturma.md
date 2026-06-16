# ⌨️ Slash Command (Komut) Oluşturma

## Amaç (ne işe yarar?)

Bir **Slash Command**, `/ad` yazarak çağırdığınız hızlı, yeniden kullanılabilir
bir istemdir (prompt). Tekrarlayan bir iş akışını (issue düzelt, PR özeti çıkar,
test yaz) bir kez tanımlayıp her seferinde `/ad` ile tetiklersiniz.

> **Önemli:** Modern Claude Code'da slash command ile **Skill aynı mekanizmadır**.
> Bir Skill (`.claude/skills/<ad>/SKILL.md`) hem `/ad` komutu olur hem de otomatik
> tetiklenebilir. **Eski (legacy)** biçim ise `.claude/commands/<ad>.md` tek
> dosyasıdır ve yalnızca `/ad` olarak çalışır. Yeni işler için Skill önerilir
> (yan dosya desteği, otomatik tetikleme denetimi). Bu sayfa **legacy komut**
> biçimine odaklanır; Skill için bkz. [skill-olusturma.md](skill-olusturma.md).

## Dosya konumu

| Kapsam | Legacy komut | Skill (önerilen) |
|--------|--------------|------------------|
| Proje | `.claude/commands/<ad>.md` | `.claude/skills/<ad>/SKILL.md` |
| Kullanıcı | `~/.claude/commands/<ad>.md` | `~/.claude/skills/<ad>/SKILL.md` |

> **Komut adı dosya/klasör adından gelir:** `.claude/commands/test-yaz.md` →
> `/test-yaz`. Alt klasörlerle ad alanı (namespace) oluşturulabilir.

## Format (frontmatter — hepsi opsiyonel)

| Alan | Amaç |
|------|------|
| `description` | Otomatik tamamlamada ve (Skill'de) otomatik tetiklemede kullanılır. |
| `argument-hint` | İpucu metni, ör. `[issue-no]` veya `[dosya] [format]`. |
| `allowed-tools` | Onay sormadan izinli araçlar (ör. `Bash(git commit:*)`). |
| `model` | Bu komut için model override. |

### Argüman ve dinamik içerik

| Sözdizimi | Anlamı |
|-----------|--------|
| `$ARGUMENTS` | Girilen tüm argümanlar (tek dize). |
| `$0`, `$1`, `$2` | Konuma göre tek argüman (0 tabanlı). |
| `$ad` | `arguments` frontmatter'ından adlandırılmış argüman. |
| `` !`komut` `` | İçerik Claude'a gitmeden **önce** kabukta çalışır; çıktısı yerine konur. |
| `@dosya` | Dosya içeriğini bağlama ekler. |

Çok kelimeli argümanları tırnakla: `/komut "merhaba dünya" ikinci`.

## Tam örnek

`.claude/commands/issue-duzelt.md`:

```markdown
---
description: Bir GitHub issue'sunu standartlara uygun düzeltir.
argument-hint: [issue-no]
allowed-tools: Bash(git:*) Read Edit
---

GitHub issue #$ARGUMENTS'i kodlama standartlarımıza uygun şekilde düzelt:

1. Issue açıklamasını ve kabul ölçütlerini oku.
2. Gerekli değişiklikleri uygula.
3. Test ekle/güncelle.
4. Açıklayıcı bir commit oluştur.
```

Çağırma: `/issue-duzelt 123`

İkinci örnek — dinamik bağlam:

```markdown
---
description: Çalışan testleri hızlıca çalıştırıp özetler.
allowed-tools: Bash(npm test:*)
---

## Test çıktısı

!`npm test --silent 2>&1 | tail -30`

## Talimat

Yukarıdaki çıktıyı özetle: kaç test geçti/kaldı, başarısızların olası nedeni ne?
```

Çağırma: `/test-ozet`

## Kurallar ve tuzaklar

1. **Ad konumdan gelir**, frontmatter `name`'den değil. Legacy'de dosya adı,
   Skill'de klasör adı. Eklenti komutları `eklenti:ad` ile ad-alanlıdır.
2. **`` !`komut` `` Claude görmeden önce çalışır;** çıktı yerine konur, yeniden
   taranmaz. Politikayla kapatılabilir (`disableSkillShellExecution: true`).
3. **Argüman değişimi düz metin yerleştirmedir.** Çok kelimeli argümanları
   tırnağa alın; literal `$` için `\$` kullanın.
4. **`$ARGUMENTS` içerikte yoksa**, Claude Code sona `ARGUMENTS: <girdi>` ekler;
   böylece argüman yine görülür.
5. **Aynı ada sahip Skill, legacy komutun önüne geçer.** İkisi birden varsa Skill
   kazanır.

## ⚖️ Kazanımlar ve Kayıplar

| Durum | Kazanım | Kayıp / Risk |
|-------|---------|--------------|
| **Kullanırsan** | Hızlı tekrar tetikleme; ekip içi standart iş akışı; argümanlı parametreleme; `/` menüsünde keşfedilebilir. | Komutlar çoğalınca menü kalabalıklaşır; legacy ile Skill biçimi karışabilir; bakım gerektirir. |
| **Kullanmazsan** | Sıfır kurulum. | Uzun istemleri her seferinde elle yazarsın (zaman + tutarsızlık); ekip farklı yapar; yeni üyeye öğretme yükü. |

**Denge:** Birden çok kez tekrarlanan, parametre alan istemler için komut/skill;
tek seferlik istekler için düz yazı yeterli.

## İlgili rehberler

- [Skill Oluşturma](skill-olusturma.md) — `/ad`'in modern, önerilen biçimi
- [Hook Oluşturma](hook-olusturma.md) — komut değil, olay temelli otomasyon için
- Kavram: [GLOSSARY → Command / Slash Command](../GLOSSARY.md)

> Ayrıntı: <https://code.claude.com/docs/en/slash-commands>
