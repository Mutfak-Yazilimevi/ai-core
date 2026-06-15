# ai-core

Bu depo iki bölümden oluşur:

1. **📚 Kavram Referansı** — **Agentic AI (Otonom Yapay Zekâ Ajanları)** dünyasının
   temel yapı taşlarını oluşturan kavramların Türkçe kılavuzu; kavramları
   **amaçlarına göre 11 kategoriye** ayırır ve her kategori içinde
   **🟢 Temel → 🔵 Orta → 🟠 İleri → 🔴 Uzman** olarak derecelendirir. Böylece
   hem bir sözlük hem de bir öğrenme yol haritası işlevi görür.
2. **🤖 Uygulama** — Bu kavramları hayata geçiren, **sunucusuz** çalışan bir
   örnek ajan: [AI SDLC Dönüşüm Danışmanı](consultant-agent/) (GitHub Actions + Issues).

## Depo Yapısı

```
ai-core/
├── docs/             # Kavramların kategori bazlı, seviye sıralı açıklamaları
├── seviyeler/        # Aynı kavramlar, seviye → terim → terim.md ağacı olarak
├── scripts/          # GLOSSARY.md ve seviyeler/ ağacını üreten betik
├── GLOSSARY.md       # Tüm terimler: kısa açıklama + mini senaryo
├── consultant-agent/ # 🤖 Uygulama: sunucusuz AI SDLC Dönüşüm Danışmanı
└── .github/          # Danışman ajanın iş akışı + Issue şablonu
```

# 📚 Bölüm 1 — Kavram Referansı

## 🎯 Başlangıç Noktası

> **[Kategoriler ve Öğrenme Yolu (Basic → Master)](docs/00-kategoriler-ve-ogrenme-yolu.md)**
> — Tüm kavramları amaca göre 11 kategoride, seviye derecelendirmesiyle ve
> önerilen öğrenme sırasıyla tek bakışta sunan genel bakış / matris.

## Kategoriler

Tüm kavramlar, amaçlarına göre aşağıdaki kategorilerde tanımlanır. Her dosya,
kavramları basic'ten master'a sıralar.

| # | Kategori | Amaç |
|---|----------|------|
| 1 | [Temeller ve Çalışma Modeli](docs/01-temeller-ve-calisma-modeli.md) | Ajanın ne olduğu, neyden oluştuğu ve nasıl çalıştığı |
| 2 | [Muhakeme ve Planlama](docs/02-muhakeme-ve-planlama.md) | Ajanın nasıl düşündüğü, plan yaptığı ve karar verdiği |
| 3 | [Bağlam ve İstem Mühendisliği](docs/03-baglam-ve-istem-muhendisligi.md) | Modele doğru bilgiyi doğru biçimde verme |
| 4 | [Bellek ve Bilgi Yönetimi](docs/04-bellek-ve-bilgi-yonetimi.md) | Ajanın nasıl hatırladığı ve bilgiye eriştiği |
| 5 | [Araç Kullanımı ve Entegrasyon](docs/05-arac-kullanimi-ve-entegrasyon.md) | Ajanın dış dünyada nasıl eylem aldığı |
| 6 | [İş Akışı ve Yürütme](docs/06-is-akisi-ve-yurutme.md) | Görevlerin nasıl yürütüldüğü ve dayanıklılığı |
| 7 | [Çoklu Ajan ve Koordinasyon](docs/07-coklu-ajan-ve-koordinasyon.md) | Birden fazla ajanın birlikte nasıl çalıştığı |
| 8 | [İletişim ve Protokoller](docs/08-iletisim-ve-protokoller.md) | Ajanların ve sistemlerin nasıl konuştuğu |
| 9 | [Güvenlik, Hizalama ve Denetim](docs/09-guvenlik-hizalama-ve-denetim.md) | Ajanı güvenli, sınırlı ve denetlenebilir tutmak |
| 10 | [Değerlendirme ve Kalite](docs/10-degerlendirme-ve-kalite.md) | Ajanın performansını ve güvenilirliğini ölçmek |
| 11 | [Operasyon ve Gözlemlenebilirlik](docs/11-operasyon-ve-gozlemlenebilirlik.md) | Ajanı canlıda ayakta tutmak, izlemek, hata ayıklamak |

Her terimi **kısa açıklama + mini senaryo** ile anlatan kapsamlı sözlük için:
**[📖 GLOSSARY.md](GLOSSARY.md)**

### Seviyeye Göre Gezinme

Her kavramı kendi ayrı dosyasında, seviye klasörleri altında da inceleyebilirsin
(`seviyeler/<seviye>/<terim>/<terim>.md`):

- 🟢 [Temel (Basic)](seviyeler/01-temel/) · 🔵 [Orta (Intermediate)](seviyeler/02-orta/) · 🟠 [İleri (Advanced)](seviyeler/03-ileri/) · 🔴 [Uzman (Master)](seviyeler/04-uzman/)

Bu ağaç, [`scripts/generate_levels.py`](scripts/generate_levels.py) ile üretilir;
yeni terim eklerken betikteki listeye ekleyip yeniden çalıştırman yeterlidir.

## Seviye Sistemi

| Seviye | Anlamı |
|--------|--------|
| 🟢 **Temel (Basic)** | Herkesin bilmesi gereken giriş kavramları. |
| 🔵 **Orta (Intermediate)** | Çalışan bir ajan kurarken gereken kavramlar. |
| 🟠 **İleri (Advanced)** | Üretim ve ölçeklenme için gereken kavramlar. |
| 🔴 **Uzman (Master)** | Kurumsal/dağıtık mimari ve derin uzmanlık kavramları. |

## Önerilen Öğrenme Sırası

1. **🟢 Temel kavramları yatay tara** — her kategorideki Basic satırlarını öğren.
2. **🔵 Orta seviyeyle ilk ajanını kur** — Tool Use, RAG, Orchestrator, Evals,
   Guardrails ile çalışan basit bir ajan inşa et.
3. **🟠 İleri seviyeyle ölçekle** — çoklu ajan koordinasyonu, gelişmiş bellek,
   politika katmanı ve gözlemlenebilirlik ekle.
4. **🔴 Uzman seviyeyle kurumsallaştır** — ADLC, Idempotency, State Machine,
   Swarm, Constitutional AI ve LLMOps ile dağıtık/üretim mimarisine geç.

# 🤖 Bölüm 2 — Uygulama: AI SDLC Dönüşüm Danışmanı

Kavram referansının pratiğe döküldüğü, **sunucusuz (serverless)** bir danışman
ajan. Sunucu, Redis veya harici barındırma olmadan; yalnızca **GitHub Issues +
GitHub Actions + Node.js/TypeScript** ile çalışır. Müşteri bir Issue açar, ajan
yorumlarla yanıt verir; tüm durum ve hafıza GitHub'ın kendi yapıtaşlarında tutulur.

| Katman | Teknoloji | İlgili kavram |
|--------|-----------|----------------|
| Sohbet arayüzü | GitHub Issues (yorumlar) | — |
| Orkestrasyon | GitHub Actions içinde anlık Node.js/TS (Octokit) | Agent Loop, Orchestrator |
| Durum yönetimi | GitHub Labels (`state:*`) | State Machine / Task State |
| Hafıza | Issue yorum geçmişi (son 10 yorum) | Memory |
| LLM | Resmi Anthropic SDK, `claude-opus-4-8` (adaptif düşünme) | Foundation Model, Reasoning |
| Beceri (skill) | `create_pilot_workflow` aracı | Tool Use |

**Sohbet akışı (durum makinesi):**

```
Issue açılır → state:discovery   (karşılama + kültür tespiti)
   yorum ────→ state:bottleneck  (darboğaz analizi)
   yorum ────→ state:metrics     (ROI için sayısal metrikler)
   yorum ────→ state:proposal_ready (ROI tablosu + teklif → Issue kapanır)
   yorum ────→ (pilot onayı) → create_pilot_workflow aracı
```

**Pilot: AI Kod İnceleme Ajanı.** Müşteri pilotu onaylayınca ajan repoya çalışan
bir `pull_request` iş akışı ekler. Bu inceleyici, açılan PR'lerin diff'ini Claude
ile inceleyip bulguları **özet gövde + geçerli satırlara satır içi (inline) yorumlar**
olarak yazar; satır eşleştirme reddedilirse güvenle tek özet yorumuna düşer.

**Kurulum (özet):** Repo Settings → Secrets → **`LLM_API_KEY`** (Anthropic API
anahtarı) ekleyin; Issues etkin olsun. Ayrıntılar ve dosya yapısı için:
**[`consultant-agent/README.md`](consultant-agent/README.md)**

# Katkı

Yeni kavram eklemek veya açıklamaları geliştirmek için ilgili kategori dosyasını
düzenleyin; kavramı doğru **amaç kategorisine** ve doğru **seviyeye** (🟢/🔵/🟠/🔴)
yerleştirin. Terim listesinin **tek kaynağı** [`scripts/generate_levels.py`](scripts/generate_levels.py)
betiğidir; yeni terimi oradaki listeye (kısa açıklama + mini senaryo ile birlikte)
ekleyip betiği çalıştırın — `GLOSSARY.md` ve `seviyeler/` ağacı otomatik güncellenir.
Açıklamaların kısa, net ve Türkçe olmasına özen gösterin.
