# 0. Amaca Göre Kategoriler ve Öğrenme Yolu (Basic → Master)

Bu doküman, depodaki tüm Agentic AI kavramlarını **amaçlarına (purpose) göre**
11 kategoriye ayırır ve her kategori içinde **basic'ten master'a** doğru
derecelendirir. Amaç; hangi kavramın ne işe yaradığını ve hangi sırayla
öğrenilmesi/uygulanması gerektiğini netleştiren bir yol haritası sunmaktır.

## Seviye Lejantı

| Seviye | Etiket | Anlamı |
|--------|--------|--------|
| 🟢 | **Temel (Basic)** | Herkesin bilmesi gereken giriş kavramları. |
| 🔵 | **Orta (Intermediate)** | Çalışan bir ajan kurarken gereken kavramlar. |
| 🟠 | **İleri (Advanced)** | Üretim ve ölçeklenme için gereken kavramlar. |
| 🔴 | **Uzman (Master)** | Kurumsal/dağıtık mimari ve derin uzmanlık kavramları. |

---

## 1. Temeller ve Çalışma Modeli
*Amaç: Ajanın ne olduğu, neyden oluştuğu ve nasıl çalıştığı.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Agent (Ajan)** | Algılayan, çıkarım yapan, eyleme geçen özerk sistem. |
| 🟢 | **Foundation Model (Temel Model)** | Ajanın altında yatan önceden eğitilmiş büyük model. |
| 🟢 | **Tokens / Tokenization** | İşleme, maliyet ve sınır birimi. |
| 🔵 | **Agent Loop (Ajan Döngüsü)** | Algıla → çıkarım → eylem → değerlendir döngüsü. |
| 🔵 | **Workflow vs Agent** | Sabit akış ile gerçek otonomi arasındaki ayrım. |
| 🔵 | **Multimodal (Çok Kipli)** | Metin, görüntü, ses gibi türleri birlikte işleme. |
| 🟠 | **Autonomy Levels (Otonomi Seviyeleri)** | Ajanın bağımsızlık derecesi. |
| 🟠 | **Reasoning Engine (Çıkarım Motoru)** | Karar ve kural işleten bilişsel altyapı. |
| 🔴 | **ADLC (Ajan Geliştirme Yaşam Döngüsü)** | Uçtan uca mühendislik süreci. |

## 2. Muhakeme ve Planlama
*Amaç: Ajanın nasıl düşündüğü, plan yaptığı ve karar verdiği.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Chain-of-Thought (CoT)** | Adım adım açık akıl yürütme. |
| 🔵 | **ReAct** | Düşünme ile eylemi iç içe yürütme. |
| 🔵 | **Plan-and-Execute** | Önce planla, sonra adımları uygula. |
| 🟠 | **Tree of Thoughts (ToT)** | Birden çok dalı keşfedip en iyisini seçme. |
| 🟠 | **Self-Consistency** | Çoklu çıkarımdan çoğunlukla en tutarlıyı seçme. |
| 🟠 | **Task Decomposition (Görev Parçalama)** | Karmaşık hedefi alt görevlere bölme. |
| 🔴 | **Reflexion / Self-Correction** | Çıktıyı kendi kendine eleştirip revize etme. |

## 3. Bağlam ve İstem Mühendisliği
*Amaç: Modele doğru bilgiyi, doğru biçimde ve doğru parametrelerle vermek.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **System Prompt (Sistem İstemi)** | Rolü, sınırları ve kuralları belirleyen ana talimat. |
| 🟢 | **Temperature** | Çıktı kararlılığı/yaratıcılık ayarı. |
| 🟢 | **Top-P / Top-K** | Olasılık havuzunu daraltan örnekleme ayarları. |
| 🔵 | **Context Window (Bağlam Penceresi)** | Tek işlemde işlenebilen maksimum veri. |
| 🔵 | **In-context Learning (Few/Zero-shot)** | İstem içinde örnekle/örneksiz öğretme. |
| 🔵 | **Prompt Chaining (İstem Zincirleme)** | Çıktısı bir sonrakine girdi olan ardışık istemler. |
| 🟠 | **Context Engineering (Bağlam Mühendisliği)** | Bilgi ve istemleri stratejik tasarlama. |
| 🟠 | **Context Compression (Bağlam Sıkıştırma)** | Geçmişi özetleyerek pencereye sığdırma. |
| 🔴 | **Grounding (Temellendirme)** | Çıktıyı doğrulanabilir gerçek veriye dayandırma. |

## 4. Bellek ve Bilgi Yönetimi
*Amaç: Ajanın nasıl hatırladığı, bilgiye eriştiği ve kalıcı bilgi kazandığı.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Memory (Bellek)** | Geçmiş ve göreve dair bilgileri saklama/geri çağırma. |
| 🟢 | **Working / Short-term Memory** | Aktif görevde kullanılan geçici bellek. |
| 🔵 | **RAG** | Dış kaynaktan dinamik bilgi çekip besleme. |
| 🔵 | **Embeddings / Vector DB** | Anlamsal vektörle erişim; RAG'in motoru. |
| 🔵 | **Chunking (Parçalama)** | Belgeleri erişim için anlamlı parçalara bölme. |
| 🟠 | **Episodic Memory (Bölümsel Bellek)** | Geçmiş olayları kronolojik hatırlama. |
| 🟠 | **Semantic Memory (Anlamsal Bellek)** | Genel doğru ve konseptlerin hafızası. |
| 🟠 | **Knowledge Graph (Bilgi Grafiği)** | Yapılandırılmış ilişkisel bellek. |
| 🟠 | **Reranking (Yeniden Sıralama)** | Erişilen belgeleri alaka düzeyine göre yeniden sıralama. |
| 🔴 | **Semantic Caching** | Anlamsal eşleşmeyle LLM'e gitmeden yanıt. |
| 🔴 | **Fine-tuning / RLHF / RLAIF** | Modele kalıcı bilgi/davranış kazandırma. |

## 5. Araç Kullanımı ve Entegrasyon
*Amaç: Ajanın dış dünyada (API, sistem, arayüz) nasıl eylem aldığı.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Tool Use (Araç Kullanımı)** | Dış yazılım/API/fonksiyon çalıştırma yeteneği. |
| 🔵 | **Function Calling (Fonksiyon Çağırma)** | Aracı yapılandırılmış argümanlarla çağırma. |
| 🟠 | **Code Interpreter (Kod Yorumlayıcı)** | Ajanın kod yazıp çalıştırması. |
| 🟠 | **Computer / Browser Use** | Gerçek arayüzleri kullanarak eylem alma. |
| 🔴 | **Idempotency (Eşetkisellik)** | Tekrarlı çağrıda mükerrer değişikliği önleme. |

## 6. İş Akışı ve Yürütme
*Amaç: Görevlerin nasıl yürütüldüğü, durumunun nasıl tutulduğu ve dayanıklılığı.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Task State (Görev Durumu)** | Görevin anlık ilerleyişini takip etme. |
| 🔵 | **Agentic Pipeline (Ajan Boru Hattı)** | Çıktısı diğerine girdi olan ardışık operasyonlar. |
| 🔵 | **Handoffs (Devir İşlemleri)** | Görev bağlamını bir ajandan diğerine aktarma. |
| 🟠 | **Parallel Execution (Paralel Yürütme)** | Bağımsız parçaları eşzamanlı çalıştırma. |
| 🟠 | **State Machine / FSM (Durum Makinesi)** | Süreçleri deterministik durum geçişleriyle kontrol. |
| 🔴 | **Caching / Retry / Circuit Breaker** | Önbellek, yeniden deneme, devre kesme desenleri. |
| 🔴 | **Budget / Loop Limits (Bütçe/Döngü Sınırı)** | Maliyet ve sonsuz döngü kontrolü. |

## 7. Çoklu Ajan ve Koordinasyon
*Amaç: Birden fazla ajanın birlikte nasıl çalıştığı ve koordine edildiği.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Multi-Agent (Çoklu Ajan)** | Birden fazla ajanın işbirlikçi çalıştığı sistem. |
| 🔵 | **Orchestrator (Orkestratör)** | Ajanları yöneten merkezî koordinatör. |
| 🔵 | **Subagent (Alt Ajan)** | Dar ve spesifik bir işlevi yürüten uzman ajan. |
| 🟠 | **Routing (Yönlendirme)** | Girdiyi doğru ajana/araca yönlendirme. |
| 🟠 | **Semantic Routing (Semantik Yönlendirme)** | Anlamsal bağlama göre uzman ajana yönlendirme. |
| 🟠 | **Supervisor / Manager-Worker** | Hiyerarşik görev dağıtım deseni. |
| 🟠 | **Evaluator-Optimizer** | Üretip değerlendirip iyileştiren döngü. |
| 🔴 | **Multi-Agent Debate (Ajan Münazarası)** | Tartışarak doğruya yakınsama. |
| 🔴 | **Swarm (Sürü)** | Merkeziyetsiz, eşler arası ajan topluluğu. |
| 🔴 | **Blackboard (Kara Tahta)** | Paylaşılan bellek üzerinden işbirliği mimarisi. |

## 8. İletişim ve Protokoller
*Amaç: Ajanların ve sistemlerin birbiriyle nasıl konuştuğu.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Agent Protocols (Ajan Protokolleri)** | Ajanlar arası standart prosedürlerin üst başlığı. |
| 🔵 | **MCP (Model Context Protocol)** | Bağlam/araç paylaşımı için standart protokol. |
| 🟠 | **A2A Protocol (Ajanlar Arası Protokol)** | Ajanlar arası iletişim ve işbirliği kuralları. |

## 9. Güvenlik, Hizalama ve Denetim
*Amaç: Ajanı güvenli, sınırlı ve denetlenebilir tutmak.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Guardrails (Güvenlik Bariyerleri)** | İstenmeyen eylemleri engelleyen kurallar. |
| 🟢 | **Hallucination (Halüsinasyon)** | Önlenmesi gereken uydurma bilgi riski. |
| 🔵 | **Sandboxing (Korumalı Alan)** | Ajanı/araçları izole ortamda çalıştırma. |
| 🔵 | **HITL (Döngüde İnsan)** | Kritik kararda insan onayı (süreç durur). |
| 🔵 | **Least Privilege (En Az Yetki)** | Yalnızca gerekli asgari erişimi verme. |
| 🟠 | **Policy Layer (Politika Katmanı)** | Üst düzey iş kurallarının tanımlandığı katman. |
| 🟠 | **HOTL (Döngü Üstünde İnsan)** | İnsanın üstten izleyip gerektiğinde müdahale etmesi. |
| 🟠 | **Agent Identity (Ajan Kimliği)** | Güvenli kimlik doğrulama ve erişim denetimi. |
| 🔴 | **Alignment & Constitutional AI** | Değerlerle uyum ve ilkeyle öz-denetim. |
| 🔴 | **Prompt Injection / Jailbreak** | Temel saldırı türleri ve savunması. |
| 🔴 | **Red Teaming (Kırmızı Takım)** | Saldırgan testle zafiyet bulma. |

## 10. Değerlendirme ve Kalite
*Amaç: Ajanın performansını ve güvenilirliğini ölçmek.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Evals (Değerlendirmeler)** | Performansı ölçen test çerçeveleri. |
| 🔵 | **LLM-as-a-Judge (Yargıç Olarak LLM)** | LLM ile otomatik çıktı puanlama. |
| 🟠 | **Trajectory Evaluation (Yörünge Değerlendirmesi)** | Sonucu değil tüm adımları değerlendirme. |

## 11. Operasyon ve Gözlemlenebilirlik
*Amaç: Ajanı canlı ortamda ayakta tutmak, izlemek ve hata ayıklamak.*

| Seviye | Kavram | Amaç / Not |
|--------|--------|------------|
| 🟢 | **Observability (Gözlemlenebilirlik)** | Ajanın iç süreçlerini izleme yeteneği. |
| 🔵 | **Telemetry (Telemetri)** | Toplanan log, metrik ve izleme verileri bütünü. |
| 🔵 | **Streaming (Akış)** | Yanıtı üretildikçe jeton jeton iletme. |
| 🟠 | **LLMOps / AgentOps** | Ajan operasyonlarının uçtan uca disiplini. |

---

## Önerilen Öğrenme Sırası

1. **🟢 Temel kavramları yatay tara:** Her kategorideki Basic satırlarını öğren —
   ajanın ne olduğunu ve temel parçalarını kavra.
2. **🔵 Orta seviyeyle ilk ajanını kur:** Tool Use, RAG, Orchestrator, Evals ve
   Guardrails ile çalışan basit bir ajan inşa et.
3. **🟠 İleri seviyeyle ölçekle:** Çoklu ajan koordinasyonu, gelişmiş bellek,
   politika katmanı ve gözlemlenebilirlik ekle.
4. **🔴 Uzman seviyeyle kurumsallaştır:** ADLC, Idempotency, State Machine,
   Swarm, Constitutional AI ve LLMOps ile dağıtık/üretim mimarisine geç.
