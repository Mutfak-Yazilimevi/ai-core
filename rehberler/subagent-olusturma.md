# 🤖 Subagent (Alt Ajan) Oluşturma

## Amaç (ne işe yarar?)

Bir **Subagent**, odaklı bir alt görevi **kendi izole bağlam penceresinde**
yürüten uzman bir asistandır. Kendi sistem istemi, araç erişimi ve izinleri
vardır. Ana sohbeti bir daha bakmayacağınız loglar/arama çıktılarıyla dolduracak
bir yan görev olduğunda kullanılır; Claude görevi **açıklamaya** göre otomatik
devreder ya da `/agents` ile yönetirsiniz. Alt ajan yalnızca **özet** döndürür,
böylece ana bağlam temiz kalır.

## Ne zaman kullanılır?

- Geniş kod tabanında derin arama/araştırma (sonuçların çoğu bir kez gerekli).
- Bağımsız, paralel iş kolları (birden çok dosya/aday inceleme).
- Ana akıştan farklı yetki/araç/model isteyen özel bir rol (ör. yalnızca okuma).

## Dosya konumu

| Kapsam | Yol |
|--------|-----|
| Proje | `.claude/agents/<ajan-adı>.md` |
| Kullanıcı (global) | `~/.claude/agents/<ajan-adı>.md` |

## Format (frontmatter + gövde)

Frontmatter **meta veri**, Markdown gövde ise alt ajanın **sistem istemidir**.

| Alan | Zorunlu | Amaç |
|------|---------|------|
| `name` | Hayır | Görünen ad. Varsayılan: dosya adı. |
| `description` | **Önerilir** | Claude'un *ne zaman* bu ajana devredeceği. Otomatik delegasyon bununla eşleşir. |
| `tools` | Hayır | İzin verilen araçlar (boşluk/virgülle; `Bash(git *)` gibi desenler). Verilmezse ana ajanın araçlarını miras alır. |
| `model` | Hayır | Bu ajan için model override (ör. `claude-opus-4-8`). |

## Adım adım oluşturma

1. `mkdir -p .claude/agents`
2. `.claude/agents/arastirmaci.md` dosyasını yaz (örnek aşağıda).
3. `/agents` ile listede gör; ya da görev açıklamaya uyduğunda Claude otomatik devreder.

## Tam örnek

`.claude/agents/arastirmaci.md`:

```markdown
---
name: arastirmaci
description: Konuları derinlemesine araştırır. GitHub issue inceleme, hata analizi ve tanımadık kod tabanını keşfetme için kullan.
tools: Read Grep Glob Bash(git log:*)
model: claude-opus-4-8
---

Sen bir araştırma uzmanısın. Sana bir konu verildiğinde:

1. Read, Grep, Glob ile ilgili dosya ve kodu bul.
2. Desenleri ve ilişkileri analiz et.
3. Bulguları **kesin dosya yolları ve satır numaralarıyla** özetle.
4. Eyleme dönük, kısa bir rapor döndür. Ana sohbeti gereksiz ayrıntıyla doldurma.

Asla kod değiştirme; yalnızca araştır ve raporla.
```

## Kurallar ve tuzaklar

1. **Sistem istemi = Markdown gövdesi.** Frontmatter davranışı yapılandırır,
   gövde ajanın okuduğu talimattır; ikisi de gerekir.
2. **Otomatik delegasyon yalnızca `description` eşleşirse olur.** Zayıf açıklama =
   devredilmez. Net, tetik kelimeli açıklama yaz (eylem fiilleri, problem türleri).
3. **`tools` erişimi daraltır, izinleri değil.** Kendi izin ayarların hâlâ
   geçerlidir; ajan yalnızca listelenen araçlara erişebilir.
4. **Sonuç özetlenerek döner.** Uzun araştırmada tüm geçmiş değil, özet gelir —
   ana bağlam bütçesi korunur.
5. **Alt ajanlar alt ajan açabilir** (ön planda her derinlikte; arka planda ~5
   seviyeye kadar). Her seviye kendi izole bağlamına sahiptir.

## ⚖️ Kazanımlar ve Kayıplar

| Durum | Kazanım | Kayıp / Risk |
|-------|---------|--------------|
| **Kullanırsan** | Ana bağlam temiz kalır; paralel iş kolları; role özel araç/model/yetki; uzun aramalar özetlenerek döner. | Ayrı tur olduğu için ek gecikme/jeton; zayıf `description` → delege edilmez; aşırı kullanımda koordinasyon karmaşası. |
| **Kullanmazsan** | Tek bağlam, basit akış, daha az gecikme. | Yan görev logları ana bağlamı şişirir, pencere erken kompaktlanır; paralellik yok; her şey tek rol/araç setiyle yürür. |

**Denge:** Bağlamı kirletecek, bağımsız ve ana akışta tekrar gerekmeyecek yan
görevleri alt ajana ver; küçük, akışın parçası işleri ana ajanda tut.

## İlgili rehberler

- [Skill Oluşturma](skill-olusturma.md) — `context: fork` ile bir skill'i alt ajanda çalıştırma
- [Hook Oluşturma](hook-olusturma.md) — `SubagentStart` / `SubagentStop` olayları
- Kavramlar: [GLOSSARY → Subagent / Multi-Agent](../GLOSSARY.md)
