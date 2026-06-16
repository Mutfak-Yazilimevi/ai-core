# 🧩 Skill Oluşturma

## Amaç (ne işe yarar?)

Bir **Skill (Beceri)**, Claude'a kazandırılan; gerektiğinde yüklenen,
yeniden kullanılabilir bir **talimat/iş akışı paketidir**. Aynı yönergeleri,
checklist'leri veya çok adımlı prosedürleri tekrar tekrar yazıyorsanız onları
bir skill'e koyarsınız. `CLAUDE.md`'den farkı: skill içeriği **yalnızca
çağrıldığında** bağlama yüklenir (tembel yükleme), böylece bağlam jetonlarını
gereksiz yere doldurmaz.

## Ne zaman kullanılır?

- Tekrar eden bir prosedür (sürüm çıkma, PR inceleme şablonu, rapor formatı).
- Belirli dosya türleriyle çalışırken otomatik devreye girmesini istediğiniz uzmanlık.
- `/ad` ile elle tetiklemek istediğiniz hazır bir iş akışı.

## Dosya konumu

| Kapsam | Yol |
|--------|-----|
| Proje (ekiple paylaşılan) | `.claude/skills/<skill-adı>/SKILL.md` |
| Kullanıcı (tüm projeler) | `~/.claude/skills/<skill-adı>/SKILL.md` |
| Eklenti (plugin) | `<plugin>/skills/<skill-adı>/SKILL.md` |

> **Komut adı klasör adından gelir:** `.claude/skills/surum-cik/SKILL.md` →
> `/surum-cik`. Frontmatter'daki `name` yalnızca listelerdeki görünen etikettir.

## Format (SKILL.md frontmatter)

`SKILL.md`, YAML frontmatter + Markdown gövdeden oluşur. En sık kullanılan alanlar:

| Alan | Zorunlu | Amaç |
|------|---------|------|
| `description` | **Önerilir** | Claude'a *ne zaman* kullanacağını söyler (otomatik tetikleme bunu kullanır). |
| `name` | Hayır | Listelerde görünen ad. Varsayılan: klasör adı. |
| `argument-hint` | Hayır | Otomatik tamamlamada görünen ipucu, ör. `[issue-no]`. |
| `arguments` | Hayır | `$ad` ile değiştirilen adlandırılmış konumsal argümanlar. |
| `allowed-tools` | Hayır | Skill etkinken onay sormadan izin verilen araçlar (ör. `Bash(git add *)`). |
| `disable-model-invocation` | Hayır | `true` ise Claude otomatik tetiklemez; yalnızca `/ad` ile çalışır. |
| `user-invocable` | Hayır | `false` ise `/` menüsünde gizlenir (arka plan bilgisi). |
| `model` | Hayır | Bu skill için model override (ör. `claude-opus-4-8`, `inherit`). |
| `paths` | Hayır | Glob desenleri; yalnızca eşleşen dosyalarla çalışırken otomatik yüklenir. |

**Gövdede dinamik bağlam:** `` !`komut` `` satırı, içerik Claude'a gitmeden
**önce** kabukta çalışır ve çıktısı yerine konur (satır başında veya boşluktan
sonra tanınır).

## Adım adım oluşturma

1. Klasörü oluştur: `mkdir -p .claude/skills/surum-notu`
2. İçine `SKILL.md` yaz (aşağıdaki örnek).
3. Oturumda `/` yazarak listede göründüğünü doğrula; `/surum-notu` ile çağır.

## Tam örnek

`.claude/skills/surum-notu/SKILL.md`:

```markdown
---
description: Son commit'lerden sürüm notu taslağı üretir. Kullanıcı "sürüm notu", "changelog" ya da "neler değişti" dediğinde kullan.
argument-hint: [etiket]
allowed-tools: Bash(git log:*) Bash(git tag:*)
---

## Son değişiklikler

!`git log $(git describe --tags --abbrev=0 2>/dev/null)..HEAD --oneline`

## Talimat

Yukarıdaki commit'lerden, son kullanıcıya yönelik bir **sürüm notu** taslağı üret:
- "Yenilikler", "Düzeltmeler" ve "Diğer" başlıkları altında grupla.
- Teknik commit mesajlarını sade Türkçeye çevir.
- En üste bir cümlelik özet ekle. Argüman verildiyse sürüm etiketi olarak `$ARGUMENTS` kullan.
```

Çağırma: `/surum-notu v1.2.0`

İkinci örnek — adlandırılmış argümanlar:

```markdown
---
description: Bir bileşeni bir çerçeveden diğerine taşır.
arguments: [bilesen, kaynak, hedef]
---

`$0` bileşenini `$1`'den `$2`'ye taşı. Mevcut davranışı ve testleri koru.
```

Çağırma: `/migrate SearchBar React Vue`

## Kurallar ve tuzaklar

1. **Komut adı = klasör adı.** Frontmatter `name` yalnızca görünen etiket; `/ad`
   klasör adından gelir.
2. **`description` iyi yazılmalı.** Otomatik tetikleme buna bakar; tetik
   kelimelerini ve "ne zaman" bilgisini net ver. `disable-model-invocation: true`
   ise skill listesinde görünmez, yalnızca elle çalışır.
3. **İçerik oturum boyunca bağlamda kalır.** Tek seferlik adımlar değil, *duran
   talimatlar* yaz.
4. **`` !`komut` `` içeriği Claude'a gitmeden önce çalışır;** çıktısı yerine konur,
   yeniden taranmaz. Politikayla kapatılabilir (`disableSkillShellExecution: true`).
5. **Kapsam önceliği:** Kurumsal > Kişisel > Proje. Aynı ada sahip Skill, eski
   `commands/` komutunun önüne geçer.

## ⚖️ Kazanımlar ve Kayıplar

| Durum | Kazanım | Kayıp / Risk |
|-------|---------|--------------|
| **Kullanırsan** | Tekrar eden talimatları tek kaynakta toplar; yalnızca gerektiğinde yüklenir (token tasarrufu); tutarlı çıktı; ekiple paylaşılır; otomatik tetiklenebilir. | Kötü `description` yanlış tetikler; çağrıldıktan sonra içerik oturum boyu bağlamda kalır (çok büyük skill bağlamı şişirir); bakım gerektirir. |
| **Kullanmazsan** | Sıfır kurulum/bakım; en yalın başlangıç. | Aynı yönergeleri her seferinde elle yapıştırırsın (zaman + tutarsızlık) ya da `CLAUDE.md`'ye koyup her oturumda bağlamı şişirirsin; bilgi kişiden kişiye değişir. |

**Denge:** Sık tekrarlanan, çok adımlı işler için skill; tek seferlik veya çok kısa
işler için düz istem yeterli.

## İlgili rehberler

- [Slash Command Oluşturma](command-olusturma.md) — `/ad` ile çağırmanın diğer biçimi
- [Subagent Oluşturma](subagent-olusturma.md) — `context: fork` ile skill'i izole çalıştırma
- Kavram: [GLOSSARY → Skill](../GLOSSARY.md)
