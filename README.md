# ai-core

**Otonom Yapay Zekâ Ajanlarını (Agentic AI)** hem **öğrenmenizi** hem de
**deneyimlemenizi** sağlayan Türkçe bir kaynak.

Bu depo size iki şey sunar:

1. **📚 Öğrenme kaynağı** — Agentic AI'nın tüm temel kavramlarını kısa açıklamalar
   ve gerçek hayattan mini senaryolarla anlatan bir sözlük ve öğrenme yol haritası.
2. **🤖 Canlı bir ajan** — Bu kavramların çalışan bir örneği: firmanıza yapay zekâ
   destekli yazılım dönüşümünü anlatan, **GitHub üzerinden sohbet eden** bir danışman.

---

## 📚 Agentic AI kavramlarını öğrenin

Hangi yöntem size uyuyorsa onunla başlayın:

- **Hızlı sözlük** → **[📖 GLOSSARY.md](GLOSSARY.md)**
  Tüm terimler; her biri **kısa açıklama + mini senaryo** ile. Bir terimin ne
  olduğunu 10 saniyede anlamak için ideal.

- **Sıfırdan öğrenme yolu** → **[Kategoriler ve Öğrenme Yolu](docs/00-kategoriler-ve-ogrenme-yolu.md)**
  Tüm kavramlar amaçlarına göre 11 kategoride ve **🟢 Temel → 🔵 Orta → 🟠 İleri
  → 🔴 Uzman** sırasında. Nereden başlayacağınızı bilmiyorsanız buradan girin.

- **Konuya göre derinleşme** → aşağıdaki kategori sayfaları.

### Kategoriler

| # | Kategori | Ne anlatır? |
|---|----------|-------------|
| 1 | [Temeller ve Çalışma Modeli](docs/01-temeller-ve-calisma-modeli.md) | Ajan nedir, neyden oluşur, nasıl çalışır |
| 2 | [Muhakeme ve Planlama](docs/02-muhakeme-ve-planlama.md) | Ajan nasıl düşünür ve karar verir |
| 3 | [Bağlam ve İstem Mühendisliği](docs/03-baglam-ve-istem-muhendisligi.md) | Modele doğru bilgiyi doğru biçimde verme |
| 4 | [Bellek ve Bilgi Yönetimi](docs/04-bellek-ve-bilgi-yonetimi.md) | Ajan nasıl hatırlar ve bilgiye erişir |
| 5 | [Araç Kullanımı ve Entegrasyon](docs/05-arac-kullanimi-ve-entegrasyon.md) | Ajan dış dünyada nasıl eylem alır |
| 6 | [İş Akışı ve Yürütme](docs/06-is-akisi-ve-yurutme.md) | Görevler nasıl yürütülür |
| 7 | [Çoklu Ajan ve Koordinasyon](docs/07-coklu-ajan-ve-koordinasyon.md) | Birden fazla ajan birlikte nasıl çalışır |
| 8 | [İletişim ve Protokoller](docs/08-iletisim-ve-protokoller.md) | Ajanlar ve sistemler nasıl konuşur |
| 9 | [Güvenlik, Hizalama ve Denetim](docs/09-guvenlik-hizalama-ve-denetim.md) | Ajanı güvenli ve denetlenebilir tutmak |
| 10 | [Değerlendirme ve Kalite](docs/10-degerlendirme-ve-kalite.md) | Ajanın performansını ölçmek |
| 11 | [Operasyon ve Gözlemlenebilirlik](docs/11-operasyon-ve-gozlemlenebilirlik.md) | Ajanı canlıda ayakta tutmak ve izlemek |

> Her kavramı kendi sayfasında, seviye seviye de inceleyebilirsiniz:
> 🟢 [Temel](seviyeler/01-temel/) · 🔵 [Orta](seviyeler/02-orta/) · 🟠 [İleri](seviyeler/03-ileri/) · 🔴 [Uzman](seviyeler/04-uzman/)

### Önerilen öğrenme sırası

1. **🟢 Temel** — Her kategorideki giriş kavramlarını tarayın; ajanın ne olduğunu kavrayın.
2. **🔵 Orta** — Tool Use, RAG, Orchestrator, Evals, Guardrails ile ilk basit ajanınızı kurun.
3. **🟠 İleri** — Çoklu ajan koordinasyonu, gelişmiş bellek ve gözlemlenebilirlik ekleyin.
4. **🔴 Uzman** — ADLC, State Machine, Swarm, Constitutional AI, LLMOps ile üretime taşıyın.

---

## 🤖 Danışman ajanı deneyin

Öğrendiklerinizin çalışan hâlini görün: **AI SDLC Dönüşüm Danışmanı**, firmanıza
yapay zekâ destekli yazılım geliştirme dönüşümünü anlatan bir ajandır. Sunucu
gerektirmez; tamamen **GitHub Issues** üzerinden sohbet eder.

> **👉 Danışman ajanı:** Sohbeti başlatmak için:
> **<https://github.com/Mutfak-Yazilimevi/ai-core/issues/new?template=consultant-request.yml>**
>
> _(Kendi kopyanızda çalıştırıyorsanız bu adres `…/<kullanıcı-adınız>/ai-core/…`
> biçiminde olacaktır.)_

### Ne yapar?

- Firmanızın kültürünü ve yazılım sürecindeki **darboğazları** anlamak için birkaç soru sorar.
- Verdiğiniz bilgilerle bir **ROI (Yatırım Getirisi) tablosu** ve **dönüşüm teklifi** üretir.
- İsterseniz reponuza, açtığınız Pull Request'leri otomatik inceleyen bir
  **pilot AI Kod İnceleme Ajanı** ekler.

### Nasıl kullanılır? (4 adım)

1. **Talebi başlatın:** Repoda **Issues → New issue → "Yeni Danışmanlık Talebi"**
   şablonunu seçip kısa hedefinizi yazın.
2. **Sohbet edin:** Ajan yorumlarla yanıt verir. Sırasıyla kültürünüzü, darboğazlarınızı
   ve birkaç metriği (ekip büyüklüğü, inceleme süresi, sürüm sıklığı) sorar — siz yanıtlarsınız.
3. **Teklifinizi alın:** Ajan, ROI tablosu ve aşamalı dönüşüm teklifini son yorum olarak ekler.
4. **Pilotu deneyin (opsiyonel):** "Pilotu ekleyin" diye yanıt verin; ajan reponuza
   kod inceleme iş akışını ekler. Sonraki PR'lerinizde otomatik inceleme yorumları başlar.

### Kendi API anahtarınızla çalıştırın

Ajan, yapay zekâ modeline erişmek için bir **Anthropic API anahtarı** kullanır.
Bu anahtar her kullanıcının **kendisine aittir** — kimseyle paylaşılmaz ve
faturalandırma sizin hesabınız üzerinden işler. Ajanı kendi kopyanızda çalıştırmak
için aşağıdaki üç adımı izleyin:

**1) Bu depoyu kendi hesabınıza kopyalayın**
GitHub'da sağ üstteki **Fork** düğmesine basın (veya **Use this template**).
Artık ajan sizin reponuzda, sizin denetiminizde çalışır.

**2) Anthropic API anahtarınızı alın**
- <https://console.anthropic.com> adresine gidin ve giriş yapın (hesabınız yoksa oluşturun).
- Sol menüden **API Keys** → **Create Key** ile yeni bir anahtar üretin.
- Anahtarı (`sk-ant-...` ile başlar) kopyalayın. **Bu anahtar yalnızca bir kez gösterilir.**
- Anahtar kullanımı Anthropic tarafından kullandığınız kadar ücretlendirilir; ayrıntılar
  ve fiyatlandırma için <https://www.anthropic.com/pricing>.

**3) Anahtarı reponuza gizli (secret) olarak ekleyin**
- Forkladığınız repoda **Settings → Secrets and variables → Actions** sayfasını açın.
- **New repository secret** düğmesine basın.
- **Name:** `LLM_API_KEY` &nbsp;|&nbsp; **Secret:** kopyaladığınız `sk-ant-...` anahtarı.
- **Add secret** ile kaydedin.

> 🔒 GitHub secret'ları şifrelenir; loglarda veya kod içinde görünmez. Anahtarı
> asla doğrudan dosyalara yazmayın.

Ayrıca reponuzda **Issues** özelliğinin açık olduğundan emin olun
(Settings → General → Features → Issues). Hepsi bu kadar — artık yukarıdaki
"Nasıl kullanılır?" adımlarıyla kendi danışmanınızla sohbet edebilirsiniz.

> Teknik ayrıntılar, mimari ve yerelde geliştirme için:
> **[`consultant-agent/README.md`](consultant-agent/README.md)**

---

## Lisans ve katkı

Sorularınız, düzeltme önerileriniz veya yeni kavram eklemek için bir Issue açabilir
ya da Pull Request gönderebilirsiniz. Açıklamaların kısa, net ve Türkçe olmasına
özen gösterin.
