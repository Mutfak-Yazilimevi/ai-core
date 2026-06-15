# Sözlük (Glossary)

24 Agentic AI kavramının tek satırlık özetleri. Ayrıntılar için bölüm
dosyalarına bakınız.

| # | Terim (İngilizce) | Türkçe | Kısa Açıklama |
|---|-------------------|--------|----------------|
| 1 | Agent Loop | Ajan Döngüsü | Algılama, çıkarım, eylem ve değerlendirme döngüsü. |
| 2 | Orchestrator | Orkestratör | Birden fazla ajanı yöneten merkezî koordinatör. |
| 3 | Subagent | Alt Ajan | Dar ve spesifik bir işlevi yürüten uzman ajan. |
| 4 | MCP | Model Context Protocol | Bağlam ve araç paylaşımı için standart protokol. |
| 5 | Tool Use | Araç Kullanımı | Dış API ve fonksiyonları çağırma yeteneği. |
| 6 | A2A Protocol | Ajanlar Arası Protokol | Ajanlar arası iletişim ve işbirliği kuralları. |
| 7 | Memory | Bellek | Geçmiş ve göreve dair bilgileri saklama/geri çağırma. |
| 8 | RAG | Retrieval-Augmented Generation | Dış kaynaktan bilgi çekip modele besleme. |
| 9 | Grounding | Temellendirme | Yanıtları doğrulanabilir gerçek verilere dayandırma. |
| 10 | Context Engineering | Bağlam Mühendisliği | Bağlam ve istemleri stratejik tasarlama pratiği. |
| 11 | System Prompt | Sistem İstemi | Ajanın rolünü ve kurallarını belirleyen ana talimat. |
| 12 | Guardrails | Güvenlik Bariyerleri | İstenmeyen eylemleri engelleyen güvenlik kuralları. |
| 13 | Policy Layer | Politika Katmanı | Üst düzey iş kurallarının tanımlandığı katman. |
| 14 | Sandboxing | Korumalı Alan | Ajanı/araçları izole, güvenli ortamda çalıştırma. |
| 15 | HITL | Döngüde İnsan | Kritik kararlarda insan onayını sürece dahil etme. |
| 16 | Handoffs | Devir İşlemleri | Görev bağlamını bir ajandan diğerine aktarma. |
| 17 | Agentic Pipeline | Ajan Boru Hattı | Bir ajanın çıktısının diğerine girdi olduğu zincir. |
| 18 | Task State | Görev Durumu | Görevin anlık ilerleyişini ve aşamasını takip etme. |
| 19 | Parallel Execution | Paralel Yürütme | Bağımsız parçaları eşzamanlı çalıştırma. |
| 20 | Evals | Değerlendirmeler | Ajan performansını ölçen test sistemleri. |
| 21 | Observability | Gözlemlenebilirlik | Ajanın iç süreçlerini izleme yeteneği. |
| 22 | Agent Identity | Ajan Kimliği | Ajanların güvenli kimlik doğrulaması için bilgiler. |
| 23 | Multi-Agent | Çoklu Ajan | Birden fazla ajanın işbirlikçi çalıştığı sistemler. |
| 24 | Agent Protocols | Ajan Protokolleri | Ajanlar arası standart prosedürlerin üst başlığı. |

## İleri Düzey ve İlgili Kavramlar

| Terim (İngilizce) | Türkçe | Kısa Açıklama |
|-------------------|--------|----------------|
| ReAct | Muhakeme + Eylem | Düşünme ve eylemi iç içe yürüten ajan paradigması. |
| Chain-of-Thought (CoT) | Düşünce Zinciri | Adım adım açık akıl yürütme. |
| Tree of Thoughts (ToT) | Düşünce Ağacı | Birden çok muhakeme dalını keşfedip seçme. |
| Reflexion | Öz-Yansıma | Ajanın kendi çıktısını eleştirip düzeltmesi. |
| Plan-and-Execute | Planla-ve-Yürüt | Önce plan çıkarıp sonra adımları uygulama. |
| Self-Consistency | Öz-Tutarlılık | Çoklu çıkarımdan çoğunlukla en tutarlıyı seçme. |
| Supervisor / Manager-Worker | Yönetici-İşçi | Hiyerarşik görev dağıtım deseni. |
| Multi-Agent Debate | Ajan Münazarası | Ajanların tartışarak doğruya yakınsaması. |
| Swarm | Sürü | Merkeziyetsiz, eşler arası ajan topluluğu. |
| Routing | Yönlendirme | Girdiyi doğru uzman ajana/araca yönlendirme. |
| Evaluator-Optimizer | Değerlendirici-İyileştirici | Üretip değerlendirip iyileştiren döngü. |
| Blackboard | Kara Tahta | Paylaşılan bellek üzerinden işbirliği mimarisi. |
| Embeddings / Vector DB | Gömme / Vektör Veritabanı | Anlamsal vektörle erişim; RAG altyapısı. |
| Chunking | Parçalama | Belgeleri erişim için anlamlı parçalara bölme. |
| Knowledge Graph | Bilgi Grafiği | Yapılandırılmış ilişkisel bellek. |
| Semantic/Episodic/Procedural Memory | Bellek Türleri | Anlamsal, epizodik ve prosedürel bellek. |
| Context Compression | Bağlam Sıkıştırma | Geçmiş bilgiyi özetleyerek sıkıştırma. |
| Function Calling | Fonksiyon Çağırma | Tool Use'un yapısal biçimi. |
| Computer / Browser Use | Bilgisayar / Tarayıcı Kullanımı | Gerçek arabirimleri kullanarak eylem alma. |
| Code Interpreter | Kod Yorumlayıcı | Ajanın kod yazıp çalıştırması. |
| Caching / Retry / Circuit Breaker | Dayanıklılık Desenleri | Önbellek, yeniden deneme, devre kesme. |
| Budget / Loop Limits | Bütçe / Döngü Sınırı | Maliyet ve sonsuz döngü kontrolü. |
| Prompt Injection / Jailbreak | İstem Enjeksiyonu / Kısıt Aşımı | Ajanlara yönelik temel saldırı türleri. |
| Alignment / Constitutional AI | Hizalama / Anayasal YZ | Değerlerle uyum ve ilkeyle öz-denetim. |
| Red Teaming | Kırmızı Takım | Saldırgan test ile zafiyet bulma. |
| Least Privilege | En Az Yetki | Yalnızca gerekli asgari erişimi verme. |
| LLM-as-a-Judge | Yargıç Olarak LLM | LLM ile otomatik çıktı puanlama. |
| Trajectory Evaluation | Yörünge Değerlendirmesi | Sonucu değil tüm adımları değerlendirme. |
| In-context Learning (Few/Zero-shot) | Bağlam İçi Öğrenme | İstem içinde örnekle/örneksiz öğretme. |
| Fine-tuning / RLHF / RLAIF | İnce Ayar / Pekiştirmeli Hizalama | Modeli özelleştirme ve hizalama yöntemleri. |
| Workflow vs Agent | İş Akışı / Ajan Ayrımı | Sabit kodlanmış akış ile otonom ajan farkı. |
| Autonomy Levels | Otonomi Seviyeleri | Ajanın bağımsızlık derecesi. |
| Determinism / Temperature | Belirlenircilik / Sıcaklık | Çıktı kararlılığını belirleyen ayar. |

## Mimari ve Operasyonel Kavramlar

| Terim (İngilizce) | Türkçe | Kısa Açıklama |
|-------------------|--------|----------------|
| Agent | Ajan / Otonom Temsilci | Algılayan, çıkarım yapan, eyleme geçen özerk YZ sistemi. |
| ADLC | Ajan Geliştirme Yaşam Döngüsü | Tasarımdan üretime ve izlemeye uçtan uca süreç. |
| Reasoning Engine | Çıkarım Motoru | Mantıksal çıkarım ve karar işleten bilişsel altyapı. |
| State Machine / FSM | Durum Makinesi | Süreçleri deterministik durum geçişleriyle kontrol etme. |
| Task Decomposition | Görev Parçalama | Karmaşık hedefi alt görevlere bölme. |
| Prompt Chaining | İstem Zincirleme | Çıktısı bir sonrakine girdi olan ardışık istemler. |
| Idempotency | Eşetkisellik | Tekrarlı tetiklemede mükerrer değişikliği önleme. |
| Semantic Routing | Semantik Yönlendirme | Talebi anlamsal bağlama göre uzman ajana yönlendirme. |
| Context Window | Bağlam Penceresi | Modelin tek işlemde işleyebileceği maksimum veri boyutu. |
| Working / Short-term Memory | Çalışan / Kısa Süreli Bellek | Aktif görevde kullanılan, görev sonunda sıfırlanan bellek. |
| Episodic Memory | Bölümsel Bellek | Geçmiş olayları kronolojik hatırlama (uzun vadeli alt tür). |
| Semantic Memory | Anlamsal Bellek | Genel doğru ve konseptlerin yapılandırılmış hafızası. |
| Semantic Caching | Semantik Ön Bellekleme | Anlamsal eşleşmeyle LLM'e gitmeden önbellekten yanıt. |
| HOTL | Döngü Üstünde İnsan | İnsanın süreci üstten izleyip gerektiğinde müdahale etmesi. |
| LLMOps / AgentOps | LLM / Ajan Operasyonları | Ajan geliştirme-dağıtım-izleme operasyonel disiplini. |
| Telemetry | Telemetri | Otomatik toplanan log, metrik ve izleme verileri bütünü. |
| Foundation Model | Temel Model | Genel veriyle önceden eğitilmiş, uyarlanabilir taban model. |
| Tokens / Tokenization | Jetonlar / Jetonlaştırma | Modelin işlediği en küçük yapı taşları; maliyet/sınır birimi. |
| Top-P / Top-K | Örnekleme Parametreleri | Olasılık havuzunu daraltan örnekleme ayarları. |
| Hallucination | Halüsinasyon / Sanrı | Modelin uydurma bilgiyi gerçekmiş gibi üretmesi. |
