# AI SDLC Dönüşüm Danışmanı (Lightweight Agent)

C-Level yöneticilere **yapay zeka destekli SDLC (Yazılım Geliştirme Yaşam Döngüsü)
dönüşümünü** anlatan, **sunucusuz** (serverless) bir danışman ajan.

Sunucu, Redis veya harici API barındırmadan; yalnızca **GitHub Issues + GitHub
Actions + Node.js/TypeScript** ile çalışır. Müşteri bir Issue açar, ajan yorumlarla
yanıt verir; bütün durum ve hafıza GitHub'ın kendi yapıtaşlarında tutulur.

## Mimari

| Katman | Teknoloji |
|--------|-----------|
| Sohbet arayüzü (Chat UI) | **GitHub Issues** (yorumlar) |
| Ajan orkestrasyonu | **GitHub Actions** içinde anlık çalışan **Node.js/TypeScript** betiği (Octokit) |
| Durum yönetimi (State Machine) | **GitHub Labels** — `state:discovery`, `state:bottleneck`, `state:metrics`, `state:proposal_ready` |
| Oturum hafızası (Memory) | **Issue yorum geçmişi** (son 10 yorum bağlama beslenir) |
| LLM | Resmi **Anthropic SDK** (`@anthropic-ai/sdk`), model `claude-opus-4-8` (adaptif düşünme) |

Beyin tamamen olaya dayalıdır: her yeni yorumda Action ayağa kalkar, durumu okur,
LLM'i çalıştırır, yanıtı yazar ve kapanır.

## Durum Makinesi (akış)

```
Issue açılır ──▶ state:discovery   (Karşılama + kültür tespiti: 1 soru)
   yorum ─────▶ state:bottleneck   (Darboğaz analizi: nerede gecikiyor?)
   yorum ─────▶ state:metrics      (ROI için sayısal metrikler)
   yorum ─────▶ state:proposal_ready (ROI tablosu + teklif → Issue kapatılır)
   yorum ─────▶ (pilot onayı) ────▶ create_pilot_workflow aracı (skill)
```

## Kurulum

1. **Secret ekle:** Repo → Settings → Secrets and variables → Actions →
   `LLM_API_KEY` adıyla Anthropic API anahtarını ekleyin.
2. **Issues açık olsun:** Repo → Settings → Issues etkin olmalı.
3. **Workflow hazır:** [`.github/workflows/consultant-agent.yml`](../.github/workflows/consultant-agent.yml)
   `issues: [opened]` ve `issue_comment: [created]` olaylarında tetiklenir.
4. **Şablon hazır:** [`.github/ISSUE_TEMPLATE/consultant-request.yml`](../.github/ISSUE_TEMPLATE/consultant-request.yml)
   "Yeni Danışmanlık Talebi" şablonu `consultant` etiketini ekler.

> Yalnızca `consultant` (veya `state:*`) etiketli Issue'lar işlenir; diğerleri atlanır.

## Yerelde geliştirme

```bash
cd consultant-agent
npm install
npm run typecheck   # tip denetimi
```

Betik bir GitHub Actions runner'ı içinde `npx tsx src/index.ts` ile çalışır;
ortam değişkenleri: `GITHUB_TOKEN`, `ANTHROPIC_API_KEY` (LLM_API_KEY secret'ından),
opsiyonel `LLM_MODEL`.

## Dosya yapısı

```
consultant-agent/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts     # Giriş: olayı çöz, durumu ilerlet, yanıtla
    ├── states.ts    # Durum makinesi ve faz bazlı sistem istemleri
    ├── github.ts    # Octokit yardımcıları: etiket/hafıza/yorum/pilot dosyası
    ├── llm.ts       # Anthropic çağrısı + araç (tool use) döngüsü
    ├── reviewer.ts  # Pilot: çalışan AI Kod İnceleme Ajanı (PR diff → bulgular)
    └── config.ts    # Sabitler (model, sınırlar)
```

## Pilot: AI Kod İnceleme Ajanı

Müşteri teklifi onaylayıp pilotu istediğinde, danışman ajan `create_pilot_workflow`
aracıyla repoya [`.github/workflows/ai-code-reviewer.yml`](../.github/workflows/ai-code-reviewer.yml)
benzeri bir iş akışı ekler. Bu iş akışı **çalışan** bir inceleyicidir:

1. Açılan/güncellenen her PR'de tetiklenir.
2. [`src/reviewer.ts`](src/reviewer.ts) değişen dosyaların diff'ini toplar.
3. Diff'i Claude'a gönderip **yapılandırılmış** inceleme bulguları (önem, dosya,
   **satır**, başlık, açıklama, öneri) ister.
4. Tek bir PR incelemesi yazar: öncelik gruplarıyla (🔴/🟠/🟡) **özet gövde** +
   geçerli satırlara **satır içi (inline) yorumlar**.

> Satır içi yorumlar, modelin verdiği satır numarası diff hunk'larına karşı
> doğrulandıktan sonra eklenir; eşleşmeyen satırlar yalnızca özette listelenir.
> Satır içi inceleme reddedilirse (422) güvenli biçimde tek özet yorumuna düşülür.

Yerelde denemek için (bir PR bağlamında):

```bash
cd consultant-agent
GITHUB_TOKEN=... ANTHROPIC_API_KEY=... npm run review
```

## Güvenlik notları

- **Sonsuz döngü koruması:** `github.actor == 'github-actions[bot]'` olduğunda iş atlanır.
- **Kapsam koruması:** yalnızca `consultant`/`state:*` etiketli Issue'lar işlenir.
- **Eşzamanlılık:** Issue başına `concurrency` grubuyla durum tutarlılığı korunur.
- **Skill (pilot dosyası) yalnızca** müşteri açıkça onayladığında, `proposal_ready`
  fazında, LLM'in `create_pilot_workflow` aracını çağırmasıyla oluşturulur.
