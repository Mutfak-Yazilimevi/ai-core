#!/usr/bin/env python3
"""Seviye-temelli kavram ağacını üretir: seviyeler/<seviye>/<terim>/<terim>.md"""
import os
import shutil

BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "seviyeler")

LEVELS = {
    "temel":  ("01-temel",  "🟢", "Temel (Basic)"),
    "orta":   ("02-orta",   "🔵", "Orta (Intermediate)"),
    "ileri":  ("03-ileri",  "🟠", "İleri (Advanced)"),
    "uzman":  ("04-uzman",  "🔴", "Uzman (Master)"),
}

# (level, category, slug, title_tr, title_en, description)
TERMS = [
    # ---------------- 🟢 TEMEL ----------------
    ("temel", "1. Temeller ve Çalışma Modeli", "agent", "Ajan", "Agent",
     "Belirli bir amaca yönelik çalışan; durumları algılayan, mantıksal çıkarım yapan ve hedeflerine ulaşmak için dış dünyayla etkileşime giren özerk yapay zekâ sistemidir. Tüm bu kılavuzun merkezindeki birimdir."),
    ("temel", "1. Temeller ve Çalışma Modeli", "foundation-model", "Temel Model", "Foundation Model",
     "Geniş ve genel veriyle önceden eğitilmiş; üzerine ince ayar (fine-tuning) veya istem mühendisliği uygulanarak çeşitli görevlere uyarlanabilen büyük taban modeldir. Ajanın \"beyni\" bu modeldir."),
    ("temel", "1. Temeller ve Çalışma Modeli", "tokens-tokenization", "Jetonlar / Jetonlaştırma", "Tokens / Tokenization",
     "Modellerin metni, kodu veya veriyi işlemek ve üretmek için böldüğü en küçük yapı taşlarıdır. Ajanların işlem maliyeti, hızı ve bağlam sınırı bu metrik üzerinden hesaplanır."),
    ("temel", "2. Muhakeme ve Planlama", "chain-of-thought", "Düşünce Zinciri", "Chain-of-Thought (CoT)",
     "Modelin bir sonuca varmadan önce adım adım, açık şekilde akıl yürütmesidir. Karmaşık problemlerde doğruluğu belirgin biçimde artıran en temel muhakeme tekniğidir."),
    ("temel", "3. Bağlam ve İstem Mühendisliği", "system-prompt", "Sistem İstemi", "System Prompt",
     "Bir ajanın rolünü, karakterini, sınırlarını ve temel çalışma kurallarını belirleyen ana talimatlardır. Ajanın tüm davranışına zemin oluşturan, kullanıcı mesajlarının üzerinde önceliğe sahip kalıcı yönergedir."),
    ("temel", "3. Bağlam ve İstem Mühendisliği", "temperature", "Sıcaklık", "Temperature",
     "Modelin çıktısındaki rastgelelik/yaratıcılık seviyesini belirleyen hiperparametredir. Düşük değerler daha deterministik ve tutarlı (kod, analiz), yüksek değerler daha çeşitli ve yaratıcı sonuç üretir."),
    ("temel", "3. Bağlam ve İstem Mühendisliği", "top-p-top-k", "Örnekleme Parametreleri", "Top-P / Top-K",
     "Modelin bir sonraki jetonu belirlerken değerlendireceği olasılık havuzunu daraltan; odaklanmayı ve tutarlılığı yöneten matematiksel örnekleme parametreleridir."),
    ("temel", "4. Bellek ve Bilgi Yönetimi", "memory", "Bellek", "Memory",
     "Ajanın daha önceki sohbetlerini, geçmiş deneyimlerini ve göreviyle ilgili bilgileri saklayan ve gerektiğinde geri çağıran sistemlerdir. Genellikle kısa süreli ve uzun süreli bellek olarak ikiye ayrılır."),
    ("temel", "4. Bellek ve Bilgi Yönetimi", "working-short-term-memory", "Çalışan / Kısa Süreli Bellek", "Working / Short-term Memory",
     "Ajanın o anki aktif görevi süresince anlık olarak kullandığı; Context Window limitiyle doğrudan sınırlı olan ve görev bittiğinde sıfırlanan geçici işlem hafızasıdır."),
    ("temel", "5. Araç Kullanımı ve Entegrasyon", "tool-use", "Araç Kullanımı", "Tool Use",
     "Bir ajanın görevleri tamamlayabilmek için dış dünyadaki yazılımlara, API'lere veya fonksiyonlara erişip onları çalıştırabilme yeteneğidir. Ajanı yalnızca metin üreten bir modelden gerçek dünyada eylem alabilen bir sisteme dönüştüren temel yetenektir."),
    ("temel", "6. İş Akışı ve Yürütme", "task-state", "Görev Durumu", "Task State",
     "Belirli bir görevin veya ana hedefin dinamik ilerleyişini, geçmişini ve o anki aşamasını anlık olarak takip etmektir. Ajanın nerede kaldığını bilmesini ve kesinti sonrası kaldığı yerden devam etmesini sağlar."),
    ("temel", "7. Çoklu Ajan ve Koordinasyon", "multi-agent", "Çoklu Ajan", "Multi-Agent",
     "Karmaşık ve çok katmanlı sorunları çözmek için birden fazla otonom ajanın birlikte çalıştığı işbirlikçi sistemlerdir. Her ajan kendi uzmanlığına odaklanırken sistem bütünü tek bir ajanın kapasitesini aşan görevleri başarır."),
    ("temel", "8. İletişim ve Protokoller", "agent-protocols", "Ajan Protokolleri", "Agent Protocols",
     "Ajan sistemleri arasında veri paylaşımı, koordinasyon, etkileşim ve hata yönetimini düzenleyen genel standart prosedürlerdir. MCP ve A2A gibi belirli protokolleri kapsayan üst başlıktır."),
    ("temel", "9. Güvenlik, Hizalama ve Denetim", "guardrails", "Güvenlik Bariyerleri", "Guardrails",
     "Ajanın zararlı, etik dışı veya sisteme hasar verebilecek istenmeyen eylemler yapmasını engelleyen güvenlik kurallarıdır. Girdi ve çıktıları filtreleyerek ajanın belirlenen sınırlar içinde kalmasını sağlar."),
    ("temel", "9. Güvenlik, Hizalama ve Denetim", "hallucination", "Halüsinasyon / Sanrı", "Hallucination",
     "Ajanın (veya temel alınan dil modelinin) gerçek dışı, uydurma veya var olmayan bilgileri son derece kendinden emin bir şekilde gerçekmiş gibi üretmesi durumudur. Önlenmesi gereken temel risktir; Grounding ve RAG bu amaçla kullanılır."),
    ("temel", "10. Değerlendirme ve Kalite", "evals", "Değerlendirmeler", "Evals",
     "Ajanların performansını; doğruluk, güvenilirlik ve güvenlik metrikleri üzerinden ölçüp puanlayan titiz test çerçeveleridir. Bir değişikliğin ajanı iyileştirip iyileştirmediğini nesnel olarak göstermek için kullanılır."),
    ("temel", "11. Operasyon ve Gözlemlenebilirlik", "observability", "Gözlemlenebilirlik", "Observability",
     "Hata ayıklama ve optimizasyon yapabilmek için ajanın arka plandaki düşünce süreçlerini, kullandığı araçları ve durum değişikliklerini izleme yeteneğidir. İzler (traces), günlükler (logs) ve metrikler ile ajanın \"neyi neden yaptığı\" şeffaf hâle gelir."),

    # ---------------- 🔵 ORTA ----------------
    ("orta", "1. Temeller ve Çalışma Modeli", "agent-loop", "Ajan Döngüsü", "Agent Loop",
     "Bir ajanın hedeflerine ulaşmak için izlediği algılama → mantıksal çıkarım → eylem → sonuçları değerlendirme döngüsüdür. Ajan, her tur sonunda elde ettiği sonuca göre bir sonraki adımını planlar ve hedefe ulaşana (veya bir durdurma koşulu sağlanana) kadar bu döngüyü tekrarlar."),
    ("orta", "1. Temeller ve Çalışma Modeli", "workflow-vs-agent", "İş Akışı / Ajan Ayrımı", "Workflow vs Agent",
     "Sabit kodlanmış, önceden tanımlı yollarla ilerleyen iş akışları (workflow) ile kendi adımlarına dinamik olarak karar veren gerçek otonom ajanlar (agent) arasındaki temel ayrımdır. Hangi problemin hangisini gerektirdiğini bilmek mimari kararların temelidir."),
    ("orta", "2. Muhakeme ve Planlama", "react", "Muhakeme + Eylem", "ReAct (Reasoning + Acting)",
     "Düşünme (reasoning) ile eylemi (acting) iç içe yürüten temel ajan paradigmasıdır. Döngü genellikle \"Düşünce → Eylem → Gözlem\" biçiminde işler; ajan her gözlemden sonra düşüncesini günceller."),
    ("orta", "2. Muhakeme ve Planlama", "plan-and-execute", "Planla-ve-Yürüt", "Plan-and-Execute",
     "Ajanın önce yüksek seviyeli bir plan çıkarması, ardından bu planın adımlarını sırayla uygulamasıdır. Planlama ve yürütmeyi ayırarak uzun görevlerde tutarlılığı artırır."),
    ("orta", "3. Bağlam ve İstem Mühendisliği", "context-window", "Bağlam Penceresi", "Context Window",
     "Bir dil modelinin tek bir işlemde (istem ve cevap dâhil) işleyebileceği maksimum veri boyutudur. Ajanın kısa vadeli belleğinin matematiksel sınırını belirler."),
    ("orta", "3. Bağlam ve İstem Mühendisliği", "in-context-learning", "Bağlam İçi Öğrenme (Few/Zero-shot)", "In-context Learning",
     "Modele örnek vererek (few-shot) veya hiç örnek vermeden (zero-shot), eğitimini değiştirmeden istem içinde görev öğretme yöntemleridir."),
    ("orta", "3. Bağlam ve İstem Mühendisliği", "prompt-chaining", "İstem Zincirleme", "Prompt Chaining",
     "Karmaşık bir görevin, her birinin çıktısı bir sonrakinin girdisi olacak şekilde ardışık ve küçük istemlere bölünerek sırayla işletilmesidir."),
    ("orta", "4. Bellek ve Bilgi Yönetimi", "rag", "Retrieval-Augmented Generation", "RAG",
     "Dil modelinin ürettiği yanıtları sağlam temellere oturtmak için dışarıdan (örn. şirket veritabanından) dinamik olarak bilgi çekip modele besleme yöntemidir. Model, eğitiminde olmayan güncel veya özel bilgilere de erişebilir."),
    ("orta", "4. Bellek ve Bilgi Yönetimi", "embeddings-vector-db", "Gömme / Vektör Veritabanı", "Embeddings / Vector Database",
     "Metinleri, kodları veya belgeleri anlamsal vektörlere dönüştürüp benzerlik aramasıyla erişmeyi sağlayan, RAG'in ve uzun vadeli belleğin temel altyapısıdır."),
    ("orta", "4. Bellek ve Bilgi Yönetimi", "chunking", "Parçalama", "Chunking",
     "Büyük belgeleri, erişim ve gömme için anlamlı küçük parçalara bölme işlemidir. Doğru parçalama RAG kalitesini doğrudan etkiler."),
    ("orta", "5. Araç Kullanımı ve Entegrasyon", "function-calling", "Fonksiyon Çağırma", "Function Calling",
     "Bir dil modelinin harici bir API'yi tetiklemek için gerekli yapılandırılmış veriyi (örn. JSON parametreleri) doğru formatta üretebilme yeteneğidir. Tool Use'un yapısal ve kesin biçimidir."),
    ("orta", "6. İş Akışı ve Yürütme", "agentic-pipeline", "Ajan Boru Hattı", "Agentic Pipeline",
     "Bir ajanın çıktısının, bir sonraki ajanın girdisi olduğu yapılandırılmış, ardışık operasyonlar dizisidir. Her aşama belirli bir işlemi yapar ve sonucu zincirdeki bir sonraki aşamaya iletir."),
    ("orta", "6. İş Akışı ve Yürütme", "handoffs", "Devir İşlemleri", "Handoffs",
     "Bir görevin bağlamının ve kontrolünün, bir ajandan diğer bir uzman ajana kesintisiz ve sorunsuz bir şekilde aktarılmasıdır. Devir sırasında ilgili tüm bilgi (görev durumu, geçmiş, hedef) yeni ajana taşınır."),
    ("orta", "7. Çoklu Ajan ve Koordinasyon", "orchestrator", "Orkestratör", "Orchestrator",
     "Birden fazla uzmanlaşmış ajanı yöneten; onların görevlerini ve aralarındaki bilgi akışını koordine eden merkezî sistemdir. Hangi alt ajanın ne zaman çalışacağına karar verir, çıktıları toplar ve nihai sonucu birleştirir."),
    ("orta", "7. Çoklu Ajan ve Koordinasyon", "subagent", "Alt Ajan", "Subagent",
     "Daha büyük bir otonom sistem veya orkestratör içinde, çok daha dar ve spesifik bir işlevi yerine getirmekle görevlendirilmiş uzman ajandır."),
    ("orta", "8. İletişim ve Protokoller", "mcp", "Model Context Protocol", "MCP",
     "Ajanların bağlam bilgilerini (context), araçları ve veri kaynaklarını kendi aralarında ve dış sistemlerle verimli ve güvenli bir şekilde paylaşmasını sağlayan standartlaştırılmış protokoldür. Modelin dış kaynaklara tek tip bir arabirim üzerinden erişmesini mümkün kılar."),
    ("orta", "9. Güvenlik, Hizalama ve Denetim", "sandboxing", "Korumalı Alan", "Sandboxing",
     "Yetkisiz erişimleri veya sistem hasarını önlemek amacıyla, ajanın veya kullandığı araçların izole edilmiş, güvenli bir ortamda çalıştırılmasıdır. Sandbox içindeki bir hata veya kötü niyetli eylem, ana sisteme zarar veremez."),
    ("orta", "9. Güvenlik, Hizalama ve Denetim", "hitl", "Döngüde İnsan", "HITL (Human-in-the-Loop)",
     "Otonom iş akışındaki kritik karar aşamalarında insanın onayını, incelemesini veya kontrolünü sürece dahil etmektir. Yüksek riskli eylemler (ödeme, silme, yayınlama) öncesinde bir insanın onayını gerektirebilir; süreç onaya kadar durur."),
    ("orta", "9. Güvenlik, Hizalama ve Denetim", "least-privilege", "En Az Yetki", "Least Privilege",
     "Ajana veya araca yalnızca görevini yapması için gereken asgari erişim ve yetkiyi verme güvenlik ilkesidir. Olası bir zafiyetin etki alanını daraltır."),
    ("orta", "10. Değerlendirme ve Kalite", "llm-as-a-judge", "Yargıç Olarak LLM", "LLM-as-a-Judge",
     "Bir dil modelinin, başka bir modelin veya ajanın çıktısını belirli ölçütlere göre puanlaması; eval'lerde yaygın bir otomatik değerlendirme yöntemidir. İnsan değerlendirmesini ölçeklendirmenin pratik yoludur."),
    ("orta", "11. Operasyon ve Gözlemlenebilirlik", "telemetry", "Telemetri", "Telemetry",
     "Ajanın karar mekanizmalarından, API çağrılarından, token tüketiminden ve sistem performansından otomatik olarak toplanan yapılandırılmış log, metrik ve izleme (trace) verilerinin bütünüdür. Observability'nin ham veri kaynağıdır."),

    # ---------------- 🟠 İLERİ ----------------
    ("ileri", "1. Temeller ve Çalışma Modeli", "autonomy-levels", "Otonomi Seviyeleri", "Autonomy Levels",
     "Bir ajanın insan müdahalesi olmadan ne ölçüde bağımsız karar alıp eylem yapabildiğini tanımlayan kademelendirmedir. Düşük seviyede her adım insana sorulurken, yüksek seviyede ajan baştan sona kendi yürütür."),
    ("ileri", "1. Temeller ve Çalışma Modeli", "reasoning-engine", "Çıkarım Motoru", "Reasoning Engine",
     "Ajanın salt metin (token) üretmekle kalmayıp; mantıksal çıkarım yaptığı, kuralları uyguladığı ve karar ağaçlarını işlettiği temel bilişsel altyapıdır."),
    ("ileri", "2. Muhakeme ve Planlama", "tree-of-thoughts", "Düşünce Ağacı", "Tree of Thoughts (ToT)",
     "Birden çok muhakeme dalını paralel olarak keşfedip en umut verici yolu seçerek ilerleme yöntemidir. CoT'nin ağaç biçiminde genelleştirilmiş hâlidir."),
    ("ileri", "2. Muhakeme ve Planlama", "self-consistency", "Öz-Tutarlılık", "Self-Consistency",
     "Aynı soru için birden çok bağımsız muhakeme üretip, sonuçlar arasında çoğunluk oyuyla en tutarlı yanıtı seçme tekniğidir."),
    ("ileri", "2. Muhakeme ve Planlama", "task-decomposition", "Görev Parçalama", "Task Decomposition",
     "Orkestratör ajanın, kendisine verilen çok bileşenli ve karmaşık hedefi; alt ajanların çözebileceği bağımsız, yönetilebilir küçük görev parçacıklarına bölmesi sürecidir."),
    ("ileri", "3. Bağlam ve İstem Mühendisliği", "context-engineering", "Bağlam Mühendisliği", "Context Engineering",
     "Ajanın doğruluğunu artırmak için ona verilen bilgi setlerini ve istemleri en stratejik şekilde tasarlama pratiğidir. Hangi bilginin, hangi sırayla ve ne kadarının bağlam penceresine konacağını optimize etmeyi içerir."),
    ("ileri", "3. Bağlam ve İstem Mühendisliği", "context-compression", "Bağlam Sıkıştırma / Özetleme", "Context Compression / Summarization",
     "Bağlam penceresine sığması için geçmiş bilgiyi özetleyerek veya filtreleyerek sıkıştırma tekniğidir."),
    ("ileri", "4. Bellek ve Bilgi Yönetimi", "episodic-memory", "Bölümsel Bellek", "Episodic Memory",
     "Ajanın spesifik geçmiş olayları, önceki kullanıcı diyaloglarını ve kendi eylem geçmişini kronolojik bir dizi olarak hatırlama yeteneğidir. Uzun vadeli belleğin bir alt türüdür."),
    ("ileri", "4. Bellek ve Bilgi Yönetimi", "semantic-memory", "Anlamsal Bellek", "Semantic Memory",
     "Ajanın; sistem, iş kuralları veya dünyayla ilgili genel doğruları ve konseptleri (kronolojik olaylardan bağımsız olarak) sakladığı yapılandırılmış bilgi hafızasıdır."),
    ("ileri", "4. Bellek ve Bilgi Yönetimi", "knowledge-graph", "Bilgi Grafiği", "Knowledge Graph",
     "Verilerin düz metin olarak değil; nesneler (varlıklar) ve aralarındaki anlamsal ilişkiler şeklinde yapılandırılarak tutulduğu mimaridir. RAG'in mantıksal çıkarım doğruluğunu en üst düzeye çıkarır."),
    ("ileri", "5. Araç Kullanımı ve Entegrasyon", "code-interpreter", "Kod Yorumlayıcı", "Code Interpreter",
     "Ajanın görevi çözmek için kod yazıp güvenli bir ortamda çalıştırabilmesidir. Hesaplama, veri analizi ve dosya işleme gibi görevlerde güçlüdür."),
    ("ileri", "5. Araç Kullanımı ve Entegrasyon", "computer-browser-use", "Bilgisayar / Tarayıcı Kullanımı", "Computer Use / Browser Use",
     "Ajanın ekran görüntüsü, fare ve klavye ya da bir tarayıcı üzerinden gerçek arabirimleri kullanarak eylem almasıdır. API'si olmayan sistemlerle etkileşimi mümkün kılar."),
    ("ileri", "6. İş Akışı ve Yürütme", "parallel-execution", "Paralel Yürütme", "Parallel Execution",
     "Hız ve verimlilik kazanmak için, bir problemin birbirinden bağımsız parçalarını çözmek üzere birden fazla ajanı aynı anda çalıştırmaktır. Bağımsız alt görevler eşzamanlı işlenerek toplam süre kısaltılır."),
    ("ileri", "6. İş Akışı ve Yürütme", "state-machine-fsm", "Durum Makinesi / FSM", "State Machine / FSM",
     "Ajanın ve alt görevlerin, önceden tanımlı kurallara göre bir durumdan diğerine geçtiği deterministik mimari yapıdır. Karmaşık mikroservis veya saga desenleriyle entegre çalışırken otonom süreçlerin raydan çıkmasını engeller."),
    ("ileri", "7. Çoklu Ajan ve Koordinasyon", "routing", "Yönlendirme", "Routing",
     "Gelen girdiyi, onu en iyi işleyecek uzman ajana, modele veya araca yönlendiren karar mekanizmasıdır."),
    ("ileri", "7. Çoklu Ajan ve Koordinasyon", "semantic-routing", "Semantik Yönlendirme", "Semantic Routing",
     "Gelen bir talebin kelime anlamına veya niyetine bakarak, o iş için en uygun uzman ajana yönlendirilmesi işlemidir. Akıllı bir API Gateway gibi çalışır; ancak bunu statik if/else kurallarıyla değil, anlamsal bağlamla yapar."),
    ("ileri", "7. Çoklu Ajan ve Koordinasyon", "supervisor-manager-worker", "Yönetici-İşçi", "Supervisor / Manager-Worker",
     "Bir yönetici ajanın görevleri parçalayıp işçi ajanlara dağıttığı ve sonuçları birleştirdiği hiyerarşik koordinasyon desenidir."),
    ("ileri", "7. Çoklu Ajan ve Koordinasyon", "evaluator-optimizer", "Değerlendirici-İyileştirici", "Evaluator-Optimizer",
     "Bir ajanın ürettiği çıktının, başka bir ajan tarafından değerlendirilip geri bildirimle iyileştirildiği döngüsel desendir."),
    ("ileri", "8. İletişim ve Protokoller", "a2a-protocol", "Ajanlar Arası Protokol", "A2A Protocol",
     "Farklı otonom birimlerin (ajanların) nasıl iletişim kuracağını ve işbirliği yapacağını belirleyen standart kurallar bütünüdür. Ajanların birbirini keşfetmesi, görev devretmesi ve sonuç paylaşması için ortak bir dil sağlar."),
    ("ileri", "9. Güvenlik, Hizalama ve Denetim", "policy-layer", "Politika Katmanı", "Policy Layer",
     "Ajanların daha üst düzey kararlar alırken uyması gereken iş kurallarının ve prensiplerinin tanımlandığı katmandır. Hangi eylemlere izin verildiğini ve hangi durumların yasak olduğunu merkezî olarak yönetir."),
    ("ileri", "9. Güvenlik, Hizalama ve Denetim", "hotl", "Döngü Üstünde İnsan", "HOTL (Human-on-the-Loop)",
     "Otonom sistemin çalışmaya devam ettiği, ancak insanın süreci dışarıdan/üstten (Observability üzerinden) izleyerek yalnızca yanlış giden bir durum gördüğünde müdahale ettiği yüksek otonomi seviyesidir."),
    ("ileri", "9. Güvenlik, Hizalama ve Denetim", "agent-identity", "Ajan Kimliği", "Agent Identity",
     "Ajanların sistemlere güvenli bir şekilde giriş yapabilmesi ve doğrulanabilmesi için kullanılan benzersiz kimlik bilgileri ve şifreleme anahtarlarıdır. Yetki ve erişim denetimini (kim, neye, ne zaman erişebilir) mümkün kılar."),
    ("ileri", "10. Değerlendirme ve Kalite", "trajectory-evaluation", "Yörünge Değerlendirmesi", "Trajectory Evaluation",
     "Yalnızca nihai sonucu değil; ajanın hedefe giderken izlediği adımların (araç çağrıları, kararlar) tümünü değerlendirme yaklaşımıdır. Ajanın \"doğru yanıta yanlış yoldan\" ulaşmasını tespit eder."),
    ("ileri", "11. Operasyon ve Gözlemlenebilirlik", "llmops-agentops", "LLM / Ajan Operasyonları", "LLMOps / AgentOps",
     "Otonom ajanların ve yapay zekâ modellerinin geliştirme, test, dağıtım, izleme ve sürekli entegrasyon (CI/CD) süreçlerinin uçtan uca yönetildiği modern operasyonel disiplindir."),

    # ---------------- 🔴 UZMAN ----------------
    ("uzman", "1. Temeller ve Çalışma Modeli", "adlc", "Ajan Geliştirme Yaşam Döngüsü", "ADLC (Agent Development Life Cycle)",
     "Otonom sistemlerin kavramsal tasarımından geliştirilmesine, test edilip (Evals) canlı ortama (production) alınmasına ve sürekli izlenmesine (Observability) kadar geçen uçtan uca yazılım mühendisliği sürecidir."),
    ("uzman", "2. Muhakeme ve Planlama", "reflexion-self-correction", "Öz-Yansıma / Kendi Kendini Düzeltme", "Reflexion / Self-Correction",
     "Ajanın ürettiği bir kodu, metni veya kararı dışarıya (veya bir sonraki adıma) iletmeden önce kendi kendine eleştirmesi sürecidir. Ajan \"Burada hata yaptım mı?\" veya \"Bu çıktı asıl hedefle uyuşuyor mu?\" diye sorarak hatalı çıktıları otonom olarak revize eder."),
    ("uzman", "3. Bağlam ve İstem Mühendisliği", "grounding", "Temellendirme", "Grounding",
     "Ajanın kararlarının ve eylemlerinin halüsinasyonlara değil, doğrulanabilir gerçek verilere dayanmasını sağlama işlemidir. Yanıtların kaynaklarla ilişkilendirilmesini ve denetlenebilir olmasını sağlar."),
    ("uzman", "4. Bellek ve Bilgi Yönetimi", "semantic-caching", "Semantik Ön Bellekleme", "Semantic Caching",
     "Sisteme gelen yeni bir talebin, kelimesi kelimesine aynı olmasa bile anlamsal olarak önceki taleplerle eşleştirilerek; LLM'e tekrar istek atmadan (maliyet ve zaman tasarrufuyla) önbellekten doğrudan yanıtlanması mimarisidir."),
    ("uzman", "4. Bellek ve Bilgi Yönetimi", "fine-tuning-rlhf-rlaif", "İnce Ayar / Pekiştirmeli Hizalama", "Fine-tuning / RLHF / RLAIF",
     "Modeli özel veriyle yeniden eğitme (fine-tuning) ve insan (RLHF) veya YZ (RLAIF) geri bildirimiyle pekiştirmeli öğrenme yoluyla kalıcı bilgi/davranış kazandırma ve hizalama yöntemleridir."),
    ("uzman", "5. Araç Kullanımı ve Entegrasyon", "idempotency", "Eşetkisellik", "Idempotency",
     "Ajanın bir aracı kullanırken bir işlemi (örn. bir veritabanı yazması veya API çağrısı) ağ hataları nedeniyle veya otonom olarak birden fazla kez tetiklemesi durumunda bile, sistemde istenmeyen mükerrer değişikliklerin oluşmamasını sağlayan kritik mimari tasarım prensibidir."),
    ("uzman", "6. İş Akışı ve Yürütme", "caching-retry-circuit-breaker", "Dayanıklılık Desenleri", "Caching / Retry / Circuit Breaker",
     "Önbellekleme (tekrarlı işleri hızlandırma), yeniden deneme/yedeğe geçme ve arızada devreyi kesme gibi sistem dayanıklılığı desenleridir. Üretim ortamındaki ajanların kararlı çalışmasını sağlar."),
    ("uzman", "6. İş Akışı ve Yürütme", "budget-loop-limits", "Bütçe / Döngü Sınırı", "Budget / Loop Limits",
     "Maliyeti ve sonsuz döngüleri kontrol altında tutmak için token, süre veya adım sayısına konan üst sınırlardır. Ajanın kontrolden çıkmasını ve aşırı maliyeti önler."),
    ("uzman", "7. Çoklu Ajan ve Koordinasyon", "multi-agent-debate", "Ajan Münazarası", "Multi-Agent Debate",
     "Birden çok ajanın aynı problem üzerinde tartışarak, birbirinin argümanlarını sınayarak daha doğru bir sonuca yakınsamasıdır."),
    ("uzman", "7. Çoklu Ajan ve Koordinasyon", "swarm", "Sürü", "Swarm",
     "Katı bir hiyerarşi veya merkezî bir orkestratör olmadan, çok sayıda spesifik ajanın bir arı sürüsü gibi birbiriyle doğrudan haberleşerek büyük bir problemi çözdüğü merkeziyetsiz mimaridir."),
    ("uzman", "7. Çoklu Ajan ve Koordinasyon", "blackboard", "Kara Tahta Mimarisi", "Blackboard",
     "Ajanların ortak ve paylaşılan bir bellek alanı (\"kara tahta\") üzerinden dolaylı olarak işbirliği yaptığı klasik mimaridir."),
    ("uzman", "9. Güvenlik, Hizalama ve Denetim", "alignment-constitutional-ai", "Hizalama ve Anayasal YZ", "Alignment & Constitutional AI",
     "Ajanın davranışını insan değerleriyle uyumlu kılma; Constitutional AI ise bir ilkeler dizisine (anayasa) göre ajanın kendini denetlemesi yaklaşımıdır."),
    ("uzman", "9. Güvenlik, Hizalama ve Denetim", "prompt-injection-jailbreak", "İstem Enjeksiyonu / Kısıt Aşımı", "Prompt Injection / Jailbreak",
     "Ajanları kötü niyetli girdilerle yönlendirme (prompt injection) veya güvenlik kısıtlarını atlatma (jailbreak) saldırı türleridir. Savunması, ajan güvenliğinin en kritik başlıklarından biridir."),
    ("uzman", "9. Güvenlik, Hizalama ve Denetim", "red-teaming", "Kırmızı Takım", "Red Teaming",
     "Ajanın güvenlik bariyerlerini aşmak, mantıksal zafiyetlerini bulmak ve sisteme zararlı işlemler yaptırmak amacıyla bilinçli ve simüle edilmiş saldırılar düzenleyerek zafiyetleri proaktif olarak bulma sürecidir."),
]


def main():
    if os.path.isdir(BASE):
        shutil.rmtree(BASE)
    os.makedirs(BASE)

    by_level = {k: [] for k in LEVELS}
    for level, category, slug, title_tr, title_en, desc in TERMS:
        by_level[level].append((category, slug, title_tr, title_en, desc))

    # Üst dizin README
    lines = ["# Seviyelere Göre Kavramlar\n",
             "Her kavram, seviyesine göre bir klasörde ve kendi alt klasöründe ayrı bir",
             "Markdown dosyası olarak yer alır:\n",
             "```\nseviyeler/<seviye>/<terim>/<terim>.md\n```\n",
             "| Seviye | Klasör | Kavram Sayısı |",
             "|--------|--------|---------------|"]
    for key in ["temel", "orta", "ileri", "uzman"]:
        folder, emoji, label = LEVELS[key]
        lines.append(f"| {emoji} {label} | [`{folder}/`]({folder}/) | {len(by_level[key])} |")
    lines.append("")
    with open(os.path.join(BASE, "README.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    for key in ["temel", "orta", "ileri", "uzman"]:
        folder, emoji, label = LEVELS[key]
        level_dir = os.path.join(BASE, folder)
        os.makedirs(level_dir)
        terms = sorted(by_level[key], key=lambda t: t[1])

        # Seviye README (index)
        idx = [f"# {emoji} {label}\n",
               f"Bu seviyedeki {len(terms)} kavram. Her biri kendi klasöründe ayrı bir",
               "Markdown dosyası olarak bulunur.\n",
               "| Kavram | Kategori |",
               "|--------|----------|"]
        for category, slug, title_tr, title_en, desc in terms:
            idx.append(f"| [{title_tr} ({title_en})]({slug}/{slug}.md) | {category} |")
        idx.append("")
        with open(os.path.join(level_dir, "README.md"), "w", encoding="utf-8") as f:
            f.write("\n".join(idx) + "\n")

        # Terim klasörleri ve dosyaları
        for category, slug, title_tr, title_en, desc in terms:
            term_dir = os.path.join(level_dir, slug)
            os.makedirs(term_dir)
            content = (f"# {title_tr} ({title_en})\n\n"
                       f"> **Seviye:** {emoji} {label}  \n"
                       f"> **Kategori:** {category}\n\n"
                       f"{desc}\n")
            with open(os.path.join(term_dir, f"{slug}.md"), "w", encoding="utf-8") as f:
                f.write(content)

    total = sum(len(v) for v in by_level.values())
    print(f"Oluşturuldu: {total} kavram, 4 seviye klasörü.")


if __name__ == "__main__":
    main()
