# 6. Mimari ve Operasyonel Kavramlar

Kurumsal (enterprise) seviyede otonom sistemler ve dağıtık mimariler
geliştirilirken ihtiyaç duyulan daha teknik, mimari ve operasyonel terimler bu
bölümde toplanmıştır. Bu kavramlar, ajanın "nasıl düşündüğünü", "belleğini nasıl
yönettiğini" ve "operasyonel olarak nasıl ayakta kaldığını" tanımlar.

> Bu bölümdeki bazı kavramlar 5. bölümdeki terimlerin daha derin veya özelleşmiş
> hâlleridir; mümkün olduğunca ilgili temel kavrama atıf yapılmıştır.

## 6.0. Temel Tanım

### Agent (Ajan / Otonom Temsilci)
Belirli bir amaca yönelik çalışan; durumları algılayan, mantıksal çıkarım yapan
ve hedeflerine ulaşmak için dış dünyayla etkileşime giren özerk yapay zekâ
sistemidir. Tüm bu sözlüğün merkezindeki birimdir.

## 6.1. Mimari ve Süreç Desenleri

### ADLC (Agent Development Life Cycle — Ajan Geliştirme Yaşam Döngüsü)
Otonom sistemlerin kavramsal tasarımından geliştirilmesine, test edilip (Evals)
canlı ortama (production) alınmasına ve sürekli izlenmesine (Observability) kadar
geçen uçtan uca yazılım mühendisliği sürecidir.

### Reasoning Engine (Çıkarım Motoru)
Ajanın salt metin (token) üretmekle kalmayıp; mantıksal çıkarım yaptığı,
kuralları uyguladığı ve karar ağaçlarını işlettiği temel bilişsel altyapıdır.

### State Machine / FSM (Durum Makinesi / Sonlu Durum Makinesi)
Ajanın ve alt görevlerin (Task State), önceden tanımlı kurallara göre bir
durumdan diğerine geçtiği deterministik mimari yapıdır. Karmaşık mikroservis veya
saga desenleriyle entegre çalışırken otonom süreçlerin "raydan çıkmasını"
engeller.

### Task Decomposition (Görev Parçalama)
Orkestratör ajanın, kendisine verilen çok bileşenli ve karmaşık hedefi; alt
ajanların (Subagents) çözebileceği bağımsız, yönetilebilir küçük görev
parçacıklarına bölmesi sürecidir.

### Prompt Chaining (İstem Zincirleme)
Karmaşık bir görevin, her birinin çıktısı bir sonrakinin girdisi olacak şekilde
ardışık ve küçük istemlere (prompt) bölünerek sırayla işletilmesidir. (Bkz.
Agentic Pipeline — istem seviyesindeki karşılığıdır.)

### Idempotency (Eşetkisellik)
Ajanın bir aracı kullanırken (Tool Use) bir işlemi (örn. bir veritabanı yazması
veya API çağrısı) ağ hataları nedeniyle veya otonom olarak birden fazla kez
tetiklemesi durumunda bile, sistemde istenmeyen mükerrer değişikliklerin
oluşmamasını sağlayan kritik mimari tasarım prensibidir.

### Semantic Routing (Semantik Yönlendirme)
Gelen bir talebin kelime anlamına veya niyetine bakarak, o iş için en uygun
uzman ajana (Subagent) yönlendirilmesi işlemidir. Akıllı bir API Gateway veya
mesaj kuyruğu yönlendiricisi gibi çalışır; ancak bunu statik if/else
kurallarıyla değil, anlamsal (semantic) bağlamla yapar. Orkestratörlerin en
güçlü araçlarından biridir. (Bkz. Routing.)

## 6.2. Bellek ve Bağlam Mimarisi

### Context Window (Bağlam Penceresi)
Bir dil modelinin tek bir işlemde (istem ve sistemin cevabı dâhil)
işleyebileceği maksimum veri boyutudur. Ajanın kısa vadeli belleğinin
matematiksel/donanımsal sınırını belirler.

### Working Memory / Short-term Memory (Çalışan / Kısa Süreli Bellek)
Ajanın o anki aktif görevi süresince anlık olarak kullandığı; Context Window
limitiyle doğrudan sınırlı olan ve görev bittiğinde sıfırlanan geçici işlem
hafızasıdır.

### Episodic Memory (Bölümsel Bellek)
Ajanın spesifik geçmiş olayları, önceki kullanıcı diyaloglarını ve kendi eylem
geçmişini kronolojik bir dizi olarak hatırlama yeteneğidir. Uzun vadeli belleğin
bir alt türüdür.

### Semantic Memory (Anlamsal Bellek)
Ajanın; sistem, iş kuralları veya dünyayla ilgili genel doğruları, konseptleri ve
gerçekleri (kronolojik olaylardan bağımsız olarak) sakladığı yapılandırılmış
bilgi hafızasıdır.

### Semantic Caching (Semantik Ön Bellekleme)
Sisteme gelen yeni bir talebin, kelimesi kelimesine aynı olmasa bile *anlamsal
olarak* önceki taleplerle eşleştirilerek; LLM'e tekrar istek atmadan (maliyet ve
zaman tasarrufuyla) önbellekten doğrudan yanıtlanması mimarisidir.

## 6.3. Otonomi ve İnsan Denetimi

### HOTL (Human-on-the-Loop — Döngü Üstünde İnsan)
HITL'in alternatifidir. HITL'de sistem kritik bir adım için insan onayı
beklerken süreç durur; HOTL'de ise otonom sistem çalışmaya devam eder, insan
süreci dışarıdan/üstten (Observability üzerinden) izler ve yalnızca yanlış giden
bir durum gördüğünde müdahale eder. Daha yüksek bir otonomi seviyesidir.

## 6.4. Operasyon ve Gözlemlenebilirlik

### LLMOps / AgentOps (Büyük Dil Modeli / Ajan Operasyonları)
Otonom ajanların ve yapay zekâ modellerinin geliştirme, test, dağıtım, izleme
(Observability) ve sürekli entegrasyon (CI/CD) süreçlerinin uçtan uca
yönetildiği modern operasyonel disiplindir.

### Telemetry (Telemetri)
Ajanın karar mekanizmalarından, API çağrılarından, token tüketiminden ve sistem
performansından otomatik olarak toplanan yapılandırılmış log, metrik ve izleme
(trace) verilerinin bütünüdür. Observability'nin ham veri kaynağıdır.

## 6.5. Model Parametreleri ve İşleme Temelleri

### Foundation Model (Temel Model)
Geniş ve genel veriyle önceden eğitilmiş; üzerine ince ayar (fine-tuning) veya
istem mühendisliği uygulanarak çeşitli görevlere uyarlanabilen büyük taban
modeldir.

### Tokens / Tokenization (Jetonlar / Jetonlaştırma)
Yapay zekâ modellerinin metinleri, kodları veya verileri işlemek ve üretmek için
böldüğü en küçük yapı taşlarıdır. Ajanların işlem maliyeti, hızı ve bağlam sınırı
(Context Window) bu metrik üzerinden hesaplanır.

### Top-P / Top-K (Örnekleme Parametreleri)
Ajanın bir sonraki jetonu (token) belirlerken değerlendireceği olasılık havuzunu
daraltan; modelin odaklanmasını ve tutarlılığını yöneten matematiksel örnekleme
parametreleridir. (Bkz. Temperature.)

## 6.6. Güvenilirlik ve Riskler

### Hallucination (Halüsinasyon / Sanrı)
Ajanın (veya temel alınan dil modelinin) gerçek dışı, uydurma, mantıksız veya
var olmayan bilgileri son derece kendinden emin bir şekilde gerçekmiş gibi
üretmesi durumudur. Bunu önlemek için Grounding (Temellendirme) ve RAG kullanılır.
