# 5. İleri Düzey ve İlgili Kavramlar

İlk dört bölümdeki 24 temel kavramın yanı sıra, Agentic AI literatüründe sık
geçen ileri düzey ve ilgili kavramlar bu bölümde tematik gruplar altında
toplanmıştır.

## 5.1. Muhakeme ve Planlama (Reasoning & Planning)

### ReAct (Reasoning + Acting — Muhakeme + Eylem)
Düşünme (reasoning) ile eylemi (acting) iç içe yürüten temel ajan
paradigmasıdır. Ajan, "düşün → araç çağır → gözlemle" adımlarını döngüsel
olarak tekrarlayarak hedefe ilerler.

### Chain-of-Thought (CoT — Düşünce Zinciri)
Modelin bir sonuca varmadan önce adım adım, açık şekilde akıl yürütmesidir.
Karmaşık problemlerde doğruluğu artırır.

### Tree of Thoughts (ToT — Düşünce Ağacı)
Birden çok muhakeme dalını paralel olarak keşfedip, en umut verici yolu seçerek
ilerleme yöntemidir. CoT'nin ağaç biçiminde genelleştirilmiş hâlidir.

### Reflexion / Self-Reflection (Öz-Yansıma)
Ajanın kendi çıktısını veya eylem sonucunu eleştirel biçimde değerlendirip
hatalarından ders çıkararak bir sonraki denemesini düzeltmesidir.

### Plan-and-Execute (Planla-ve-Yürüt)
Ajanın önce yüksek seviyeli bir plan çıkarması, ardından bu planın adımlarını
sırayla uygulamasıdır. Planlama ve yürütmeyi birbirinden ayırır.

### Self-Consistency (Öz-Tutarlılık)
Aynı soru için birden çok bağımsız muhakeme üretip, sonuçlar arasında çoğunluk
oyuyla en tutarlı yanıtı seçme tekniğidir.

## 5.2. Çoklu Ajan Mimari Desenleri

### Supervisor / Manager-Worker (Yönetici-İşçi)
Bir yönetici ajanın görevleri parçalayıp işçi ajanlara dağıttığı ve sonuçları
birleştirdiği hiyerarşik koordinasyon desenidir.

### Multi-Agent Debate (Ajan Münazarası)
Birden çok ajanın aynı problem üzerinde tartışarak, birbirinin argümanlarını
sınayarak daha doğru bir sonuca yakınsamasıdır.

### Swarm (Sürü)
Merkezî bir yönetici olmadan, eşler arası etkileşimle ortak bir hedefe ulaşan
merkeziyetsiz ajan topluluklarıdır.

### Routing (Yönlendirme)
Gelen girdiyi, onu en iyi işleyecek uzman ajana, modele veya araca yönlendiren
karar mekanizmasıdır.

### Evaluator-Optimizer (Değerlendirici-İyileştirici)
Bir ajanın ürettiği çıktının, başka bir ajan tarafından değerlendirilip geri
bildirimle iyileştirildiği döngüsel desendir.

### Blackboard (Kara Tahta) Mimarisi
Ajanların ortak ve paylaşılan bir bellek alanı ("kara tahta") üzerinden dolaylı
olarak işbirliği yaptığı klasik mimaridir.

## 5.3. Bilgi ve Bağlam

### Embeddings / Vector Database (Gömme / Vektör Veritabanı)
Metinleri anlamsal vektörlere dönüştürüp benzerlik aramasıyla erişmeyi sağlayan,
RAG'in temel altyapısıdır.

### Chunking (Parçalama)
Büyük belgeleri, erişim ve gömme için anlamlı küçük parçalara bölme işlemidir.

### Knowledge Graph (Bilgi Grafiği)
Varlıkları ve aralarındaki ilişkileri yapılandırılmış biçimde tutan, ilişkisel
bellek ve temellendirme kaynağıdır.

### Semantic / Episodic / Procedural Memory (Bellek Türleri)
Bellek alt türleridir: anlamsal (genel gerçekler), epizodik (yaşanmış olaylar)
ve prosedürel (nasıl yapılır bilgisi).

### Context Compression / Summarization (Bağlam Sıkıştırma / Özetleme)
Bağlam penceresine sığması için geçmiş bilgiyi özetleyerek veya filtreleyerek
sıkıştırma tekniğidir.

## 5.4. Araç ve Yürütme

### Function Calling (Fonksiyon Çağırma)
Modelin, tanımlı fonksiyonları yapılandırılmış argümanlarla çağırmasını sağlayan
mekanizmadır; Tool Use'un yapısal biçimidir.

### Computer Use / Browser Use (Bilgisayar / Tarayıcı Kullanımı)
Ajanın ekran görüntüsü, fare ve klavye ya da bir tarayıcı üzerinden gerçek
arabirimleri kullanarak eylem almasıdır.

### Code Interpreter (Kod Yorumlayıcı)
Ajanın görevi çözmek için kod yazıp güvenli bir ortamda çalıştırabilmesidir.

### Caching, Retry/Fallback, Circuit Breaker (Dayanıklılık Desenleri)
Önbellekleme (tekrarlı işleri hızlandırma), yeniden deneme/yedeğe geçme ve
arızada devreyi kesme gibi sistem dayanıklılığı desenleridir.

### Budget / Loop Limits (Bütçe / Döngü Sınırı)
Maliyeti ve sonsuz döngüleri kontrol altında tutmak için token, süre veya adım
sayısına konan üst sınırlardır.

## 5.5. Güvenlik ve Hizalama

### Prompt Injection / Jailbreak (İstem Enjeksiyonu / Kısıt Aşımı)
Ajanları kötü niyetli girdilerle yönlendirme (prompt injection) veya güvenlik
kısıtlarını atlatma (jailbreak) saldırı türleridir.

### Alignment & Constitutional AI (Hizalama ve Anayasal YZ)
Ajanın davranışını insan değerleriyle uyumlu kılma; Constitutional AI ise bir
ilkeler dizisine (anayasa) göre kendini denetleme yaklaşımıdır.

### Red Teaming (Kırmızı Takım)
Sistemi saldırgan bir bakışla test ederek zafiyetlerini ve güvenlik açıklarını
proaktif olarak bulma pratiğidir.

### Least Privilege (En Az Yetki)
Ajana veya araca yalnızca görevini yapması için gereken asgari erişim ve yetkiyi
verme güvenlik ilkesidir.

## 5.6. Değerlendirme ve Öğrenme

### LLM-as-a-Judge (Yargıç Olarak LLM)
Bir dil modelinin, başka bir modelin veya ajanın çıktısını belirli ölçütlere
göre puanlaması; eval'lerde yaygın bir otomatik değerlendirme yöntemidir.

### Trajectory Evaluation (Yörünge Değerlendirmesi)
Yalnızca nihai sonucu değil, ajanın hedefe giderken izlediği adımların (araç
çağrıları, kararlar) tümünü değerlendirme yaklaşımıdır.

### In-context Learning, Few-shot / Zero-shot
Modele örnek vererek (few-shot) veya hiç örnek vermeden (zero-shot), eğitimini
değiştirmeden istem içinde öğretme yöntemleridir.

### Fine-tuning, RLHF / RLAIF
Modeli özel veriyle yeniden eğitme (fine-tuning) ve insan (RLHF) veya YZ (RLAIF)
geri bildirimiyle pekiştirmeli öğrenme yoluyla hizalama yöntemleridir.

## 5.7. Kavramsal Çerçeve

### Workflow vs Agent Ayrımı
Sabit kodlanmış, önceden tanımlı yollarla ilerleyen iş akışları (workflow) ile
kendi adımlarına dinamik olarak karar veren gerçek otonom ajanlar (agent)
arasındaki temel ayrımdır.

### Autonomy Levels (Otonomi Seviyeleri)
Bir ajanın insan müdahalesi olmadan ne ölçüde bağımsız karar alıp eylem
yapabildiğini tanımlayan kademelendirmedir.

### Determinism / Temperature (Belirlenircilik / Sıcaklık)
Modelin çıktısının ne kadar kararlı/tekrarlanabilir olacağını belirleyen
ayardır; düşük sıcaklık daha belirlenirci, yüksek sıcaklık daha çeşitli sonuç
üretir.
