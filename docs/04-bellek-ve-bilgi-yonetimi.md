# 4. Bellek ve Bilgi Yönetimi

*Amaç: Ajanın nasıl hatırladığı, bilgiye eriştiği ve kalıcı bilgi kazandığı.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 Memory (Bellek)
Ajanın daha önceki sohbetlerini, geçmiş deneyimlerini ve göreviyle ilgili
bilgileri saklayan ve gerektiğinde geri çağıran sistemlerdir. Genellikle kısa
süreli ve uzun süreli bellek olarak ikiye ayrılır.

## 🟢 Working / Short-term Memory (Çalışan / Kısa Süreli Bellek)
Ajanın o anki aktif görevi süresince anlık olarak kullandığı; Context Window
limitiyle doğrudan sınırlı olan ve görev bittiğinde sıfırlanan geçici işlem
hafızasıdır.

## 🔵 RAG (Retrieval-Augmented Generation)
Dil modelinin ürettiği yanıtları sağlam temellere oturtmak için dışarıdan (örn.
şirket veritabanından) dinamik olarak bilgi çekip modele besleme yöntemidir.
Model, eğitiminde olmayan güncel veya özel bilgilere de erişebilir.

## 🔵 Embeddings / Vector Database (Gömme / Vektör Veritabanı)
Metinleri, kodları veya belgeleri anlamsal vektörlere dönüştürüp benzerlik
aramasıyla erişmeyi sağlayan, RAG'in ve uzun vadeli belleğin temel altyapısıdır.

## 🔵 Chunking (Parçalama)
Büyük belgeleri, erişim ve gömme için anlamlı küçük parçalara bölme işlemidir.
Doğru parçalama RAG kalitesini doğrudan etkiler.

## 🟠 Episodic Memory (Bölümsel Bellek)
Ajanın spesifik geçmiş olayları, önceki kullanıcı diyaloglarını ve kendi eylem
geçmişini kronolojik bir dizi olarak hatırlama yeteneğidir. Uzun vadeli belleğin
bir alt türüdür.

## 🟠 Semantic Memory (Anlamsal Bellek)
Ajanın; sistem, iş kuralları veya dünyayla ilgili genel doğruları ve konseptleri
(kronolojik olaylardan bağımsız olarak) sakladığı yapılandırılmış bilgi
hafızasıdır.

## 🟠 Knowledge Graph (Bilgi Grafiği)
Verilerin düz metin olarak değil; nesneler (varlıklar) ve aralarındaki anlamsal
ilişkiler şeklinde yapılandırılarak tutulduğu mimaridir. RAG'in mantıksal
çıkarım doğruluğunu en üst düzeye çıkarır.

## 🔴 Semantic Caching (Semantik Ön Bellekleme)
Sisteme gelen yeni bir talebin, kelimesi kelimesine aynı olmasa bile anlamsal
olarak önceki taleplerle eşleştirilerek; LLM'e tekrar istek atmadan (maliyet ve
zaman tasarrufuyla) önbellekten doğrudan yanıtlanması mimarisidir.

## 🔴 Fine-tuning / RLHF / RLAIF
Modeli özel veriyle yeniden eğitme (fine-tuning) ve insan (RLHF) veya YZ (RLAIF)
geri bildirimiyle pekiştirmeli öğrenme yoluyla kalıcı bilgi/davranış kazandırma
ve hizalama yöntemleridir.
