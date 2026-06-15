# ai-core

**Agentic AI (Otonom Yapay Zekâ Ajanları)** dünyasının temel yapı taşlarını
oluşturan kavramların Türkçe referans kılavuzu.

Bu depo, otonom yapay zekâ ajanları geliştirirken karşılaşılan kavramları
**amaçlarına göre 11 kategoriye** ayırır ve her kategori içinde
**🟢 Temel → 🔵 Orta → 🟠 İleri → 🔴 Uzman** olarak derecelendirir. Böylece
hem bir sözlük hem de bir öğrenme yol haritası işlevi görür.

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

Tüm terimlerin alfabetik hızlı özeti için: **[Sözlük (Glossary)](docs/sozluk.md)**

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

## Katkı

Yeni kavram eklemek veya açıklamaları geliştirmek için ilgili kategori dosyasını
düzenleyin; kavramı doğru **amaç kategorisine** ve doğru **seviyeye** (🟢/🔵/🟠/🔴)
yerleştirin. Yeni terimi [sözlüğe](docs/sozluk.md) de ekleyin. Açıklamaların
kısa, net ve Türkçe olmasına özen gösterin.
