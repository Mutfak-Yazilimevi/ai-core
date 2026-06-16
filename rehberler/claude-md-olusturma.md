# 📌 CLAUDE.md (Proje Hafızası) Oluşturma

> **Olmazsa olmaz yapıtaşı.** Çoğu projede ilk kurulan ve en çok değer üreten dosyadır.

## Amaç (ne işe yarar?)

`CLAUDE.md`, Claude'a **her oturumda otomatik yüklenen kalıcı talimatlardır**
(proje hafızası). Yapı/komut/standart bilgilerini bir kez yazarsınız; ajan her
seferinde bunları bilerek başlar. "Build şu komutla yapılır", "2 boşluk girinti",
"API handler'ları şurada" gibi her oturumda geçerli kuralların yeridir.

**Ne için kullanılmaz:** çok adımlı prosedürler → **Skill**; tek seferlik kişisel
tercih → `/memory` (otomatik hafıza); zorunlu kısıtlama/güvenlik → **Settings & Hook**.

## Dosya konumu ve yükleme sırası

| Kapsam | Yol | Paylaşılır mı? | Öncelik |
|--------|-----|----------------|---------|
| Kurumsal (managed) | İşletim sistemine göre sistem yolu | Evet (IT) | 1 (en yüksek) |
| Kullanıcı | `~/.claude/CLAUDE.md` | Hayır | 2 |
| Proje | `./CLAUDE.md` (veya `./.claude/CLAUDE.md`) | Evet (git) | 3 |
| Yerel | `./CLAUDE.local.md` | Hayır (`.gitignore`) | 4 |
| Alt dizin | `alt/dizin/CLAUDE.md` | Evet | O dizindeki dosyalara bakılınca yüklenir |

Dosyalar kökten çalışma dizinine doğru **birleştirilerek** yüklenir; alt dizin
dosyaları **ihtiyaç anında** (o dizindeki dosyalarla çalışınca) eklenir.

## Format

Düz Markdown — özel yapı gerekmez. Başlıklar (`##`), maddeler ve kod blokları kullanın.
İki özel sözdizimi:

- **`@yol` ile içe aktarma:** Başka dosyaları dahil eder.
  ```markdown
  Genel bakış: @README.md
  Test kuralları: @docs/testler.md
  Kişisel ayarlar: @~/.claude/ortak.md
  ```
  Yollar, içe aktaran dosyaya görelidir; mutlak/`~` yol da olur. **İçe aktarma
  derinliği en fazla ~4 kademe**; döngüsel içe aktarma güvenle yok sayılır.
- **HTML yorumları** (`<!-- not -->`) bağlama enjekte edilmeden önce **silinir** —
  ekip notları için jeton harcamadan kullanılabilir.

## Komutlar

- **`/init`** — Kod tabanını analiz edip başlangıç `CLAUDE.md`'sini (build/test
  komutları, kurallar) üretir.
- **`/memory`** — Yüklü tüm hafıza dosyalarını listeler, düzenlemenizi sağlar.

## Tam örnek

`./CLAUDE.md` (ekiple paylaşılan):

```markdown
# Proje Talimatları

## Derleme ve Test
- Derleme: `npm run build`
- Test: `npm run test`
- Lint: `npm run lint` (her commit'ten önce çalıştır)

## Kod Stili
- 2 boşluk girinti, TypeScript strict mod
- Dışa aktarımlar `src/index.ts` üzerinden

## Mimari
- API handler'ları `src/api/handlers/`
- Yardımcılar `src/utils/`
- Testler kaynak yanında `.test.ts` ekiyle

## Referanslar
@docs/katki-rehberi.md
```

`./CLAUDE.local.md` (kişisel, gitignore):

```markdown
# Kişisel Tercihler
- Yerel sandbox: http://localhost:3000
- npm yerine pnpm kullan
```

## Kurallar ve tuzaklar

1. **Kısa tut (~200 satır altı).** Uzadıkça jeton tüketir ve ajanın uyumu düşer;
   büyük talimat setleri için `.claude/rules/` veya skill kullan.
2. **İçe aktarma derinliği ~4 kademeyle sınırlı;** çok derin zincirler sessizce yüklenmeyebilir.
3. **Her şey başlangıçta yüklenir** (içe aktarılanlar dahil) ve bağlam tüketir;
   yalnızca gerektiğinde gerekli içeriği `paths`-kapsamlı kurallarla/skill'le ayır.
4. **Çelişen kurallar** (proje + alt dizin) varsa ajan birini keyfî seçebilir;
   çelişkileri ayıkla.
5. **Öncelik:** kurumsal > kullanıcı > proje > yerel; aynı dizinde `CLAUDE.md`,
   `CLAUDE.local.md`'den önce yüklenir.

## ⚖️ Kazanımlar ve Kayıplar

| Durum | Kazanım | Kayıp / Risk |
|-------|---------|--------------|
| **Kullanırsan** | Kalıcı proje hafızası (her oturumda otomatik); tutarlı standartlar; yeni üye/ajan hızlı uyum; "her seferinde anlatma" yok. | Her oturumda jeton tüketir; çok uzunsa uyum düşer; çelişen kurallar kafa karıştırır. |
| **Kullanmazsan** | Sıfır bakım; en yalın. | Ajan proje kurallarını/komutlarını bilmez (her oturum baştan anlatırsın); tutarsız davranış; tekrarlayan hatalar. |

**Denge:** Kısa ve öz tut — "her oturumda geçerli" çekirdek kurallar burada; uzun
prosedürler skill'de, zorunlu kısıtlar settings/hook'ta olsun.

## İlgili rehberler

- [Skill Oluşturma](skill-olusturma.md) — çok adımlı prosedürler için
- [Settings & İzinler](settings-permissions-olusturma.md) — zorunlu kısıtlamalar için
- Kavramlar: [GLOSSARY → Memory · Context Engineering · System Prompt](../GLOSSARY.md)

> Ayrıntı: <https://code.claude.com/docs/en/memory>
