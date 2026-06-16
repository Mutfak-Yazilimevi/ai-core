# 🧭 AI Benimseme & SDLC→ADLC Dönüşüm Danışmanı

Firmanızın yapay zekâyı yazılım süreçlerine **ne ölçüde ve nasıl** dahil etmesi
gerektiğini analiz eden; size özel bir **olgunluk değerlendirmesi ve geçiş yol
haritası** çıkaran **sunucusuz** bir danışman ajan. Sunucu, veritabanı veya
kurulum gerektirmez — tamamen **GitHub Issues** üzerinden sohbet eder.

> **👉 Sohbeti başlatmak için:**
> **<https://github.com/Mutfak-Yazilimevi/ai-core/issues/new?template=consultant-request.yml>**
>
> _(Kendi kopyanızda çalıştırıyorsanız adres `…/<kullanıcı-adınız>/ai-core/…` olur.)_

## Ne yapar?

Tek tip bir "AI'a geçin" tavsiyesi vermez ve **belirli bir markaya bağlı kalmaz**.
Önerileri **sağlayıcıdan bağımsızdır** (vendor-agnostic): yönetilen bulut LLM'leri,
özel bulut/VPC içi barındırma veya **self-hosted açık kaynak** modeller arasından
sizin verinize, maliyetinize ve uyumluluğunuza uygun olanı **dengeli seçeneklerle**
sunar; satın-alma bağımlılığını (lock-in) azaltacak açık standartlar önerir.

Sizi **dinler**, koşullarınıza göre sorularını **derinleştirir** ve şunları içeren
gerçekçi bir rapor üretir:

- **Mevcut durumunuz** — hangi olgunluk seviyesindesiniz (0–5).
- **Önerilen hedef seviye** — mantıken nereye ulaşmalısınız ve **neden daha
  fazlası şu an gereksiz/riskli** olabilir.
- **Otonomi derecesi** — tam mı, kısmi mi? Hangi adımlar insan onaylı (HITL) kalmalı?
- **Geçiş hızı** — kademeli mi, doğrudan mı? (Regülasyon, olgunluk ve riske göre.)
- **Fazlı yol haritası** — her fazda hangi yapıtaşları (Skill, Agent, MCP, Guardrails,
  Evals…), başarı ölçütü ve yaklaşık süre.
- **Size özel öneri** — ör. _"Size Skill + Agent yeterli, tam ADLC gerekmez"_ veya
  _"SDLC'den ADLC'ye şu adımlarla geçmelisiniz"_.
- **ROI / etki tahmini**, **riskler & önlemler** ve **bu hafta atılacak ilk adım**.

### Olgunluk seviyeleri (kullanılan çerçeve)

| Seviye | Kısaca |
|--------|--------|
| 0 | AI yok, tümü manuel |
| 1 | Asistanlı (bireysel/dağınık LLM kullanımı) |
| 2 | Standartlaştırılmış yardım (CLAUDE.md, Skill, Command, Settings) |
| 3 | Araçlı & yarı-otonom ajanlar (Agent + MCP + Hook + Guardrails, HITL) |
| 4 | ADLC / çok-ajanlı pipeline (Orchestrator, Evals, Observability, HOTL) |
| 5 | Yüksek otonom (uçtan uca otonom iş akışları) |

## Nasıl kullanılır? (4 adım)

1. **Talebi başlatın:** Yukarıdaki bağlantıdan **"Yeni Danışmanlık Talebi"**
   şablonunu doldurun (sektör, ekip büyüklüğü, mevcut AI kullanımı, hedef).
2. **Sohbet edin:** Ajan yorumlarla yanıt verir ve **yanıtlarınıza göre uyarlanan**
   sorular sorar (olgunluk, regülasyon, darboğazlar, risk iştahı…). Birkaç tur sürebilir.
3. **Raporunuzu alın:** Yeterli bilgi toplanınca ajan, kişiye özel **AI Benimseme
   Analizi & Yol Haritası** raporunu son yorum olarak ekler ve talebi kapatır.
4. **Pilotu deneyin (opsiyonel):** "Pilotu ekleyin" diye yanıt verin; ajan reponuza,
   açılan PR'leri otomatik inceleyen bir **AI Kod İnceleme Ajanı** iş akışı ekler.

## Kendi API anahtarınızla çalıştırın

Ajan, yapay zekâ modeline erişmek için bir **Anthropic API anahtarı** kullanır.
Bu anahtar size aittir; faturalandırma kendi hesabınız üzerinden işler.

1. **Bu depoyu kopyalayın:** GitHub'da **Fork** (veya **Use this template**).
2. **Anahtarı alın:** <https://console.anthropic.com> → **API Keys → Create Key**
   (anahtar `sk-ant-...` ile başlar; yalnızca bir kez gösterilir). Fiyatlandırma:
   <https://www.anthropic.com/pricing>.
3. **Anahtarı ekleyin:** Reponuzda **Settings → Secrets and variables → Actions →
   New repository secret** → **Name:** `LLM_API_KEY`, **Secret:** anahtarınız.
4. Reponuzda **Issues** açık olsun (Settings → General → Features → Issues).

> 🔒 GitHub secret'ları şifrelenir; kodda/loglarda görünmez. Anahtarı dosyalara yazmayın.

---

## Geliştiriciler için (mimari)

Sunucusuz **IssueOps**: durum **GitHub etiketleriyle**, hafıza **yorum geçmişiyle**,
beyin **GitHub Actions içinde anlık çalışan Node.js/TypeScript** betiğiyle yönetilir.

| Katman | Teknoloji |
|--------|-----------|
| Arayüz | GitHub Issues (yorumlar) |
| Orkestrasyon | GitHub Actions + Node.js/TS (Octokit) |
| Durum makinesi | `state:discovery` → `state:assessing` → `state:report_ready` |
| Hafıza | Issue yorum geçmişi (son 10 yorum) |
| LLM | Resmi Anthropic SDK, model `claude-opus-4-8` (adaptif düşünme) |

Akış: ajan `discovery` fazında karşılar; `assessing` fazında **uyarlanabilir**
sorular sorar ve yeterli bilgi toplanınca `submit_report` aracıyla raporu teslim
edip Issue'yu kapatır; `report_ready` fazında pilotu kurar.

### Dosya yapısı

```
consultant-agent/
└── src/
    ├── index.ts     # Akış: olayı çöz, fazı yürüt, yanıtla
    ├── states.ts    # Durum makinesi, persona, benimseme çerçevesi ve istemler
    ├── github.ts    # Octokit: etiket/hafıza/yorum/pilot dosyası
    ├── llm.ts       # Anthropic çağrısı + araç (tool use) döngüsü
    ├── reviewer.ts  # Pilot: çalışan AI Kod İnceleme Ajanı (PR diff → bulgular)
    └── config.ts    # Sabitler (model, sınırlar)
```

### Yerelde geliştirme

```bash
cd consultant-agent
npm install
npm run typecheck
```

### Pilot: AI Kod İnceleme Ajanı

Müşteri onaylayınca `create_pilot_workflow` aracı repoya
`.github/workflows/ai-code-reviewer.yml` ekler (içeriği `src/github.ts` üretir).
Bu iş akışı [`src/reviewer.ts`](src/reviewer.ts) ile PR diff'ini inceleyip bulguları
**özet + satır içi (inline) yorumlar** olarak yazar; satır eşleşmezse güvenle tek
özet yorumuna düşer.

## Güvenlik notları

- **Sonsuz döngü koruması:** `github.actor == 'github-actions[bot]'` ise iş atlanır.
- **Kapsam koruması:** yalnızca `consultant`/`state:*` etiketli Issue'lar işlenir.
- **Eşzamanlılık:** Issue başına `concurrency` grubuyla durum tutarlılığı korunur.
- **Pilot dosyası** yalnızca müşteri açıkça onayladığında oluşturulur.
