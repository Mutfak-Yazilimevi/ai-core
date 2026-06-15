# 1. Temel Ajan ve İletişim Kavramları

Bu bölüm, bir otonom ajanın çalışma mantığını ve ajanların birbiriyle nasıl
konuştuğunu tanımlayan altı temel kavramı kapsar.

## 1. Agent Loop (Ajan Döngüsü)

Bir ajanın hedeflerine ulaşmak için izlediği **algılama → mantıksal çıkarım →
eylem → sonuçları değerlendirme** döngüsüdür. Ajan, her tur sonunda elde ettiği
sonuca göre bir sonraki adımını planlar ve hedefe ulaşana (veya bir durdurma
koşulu sağlanana) kadar bu döngüyü tekrarlar.

- **Algılama:** Girdiyi, bağlamı ve araç çıktılarını okur.
- **Çıkarım:** Bir sonraki en uygun adıma karar verir.
- **Eylem:** Bir aracı çağırır veya yanıt üretir.
- **Değerlendirme:** Sonucu hedefle karşılaştırır, gerekirse yeniden dener.

## 2. Orchestrator (Orkestratör)

Birden fazla uzmanlaşmış ajanı yöneten; onların görevlerini ve aralarındaki
bilgi akışını koordine eden merkezî sistemdir. Hangi alt ajanın ne zaman
çalışacağına karar verir, çıktıları toplar ve nihai sonucu birleştirir.

## 3. Subagent (Alt Ajan)

Daha büyük bir otonom sistem veya ekip içinde, çok daha dar ve spesifik bir
işlevi yerine getirmekle görevlendirilmiş ajandır. Örneğin yalnızca veri
çekmek, yalnızca kod yazmak veya yalnızca özetlemek için uzmanlaşabilir.

## 4. MCP (Model Context Protocol)

Ajanların bağlam bilgilerini (context) kendi aralarında ve dış araçlarla
verimli ve güvenli bir şekilde paylaşmasını sağlayan standartlaştırılmış
protokoldür. Modelin dış kaynaklara (dosyalar, veritabanları, API'ler) tek tip
bir arabirim üzerinden erişmesini mümkün kılar.

## 5. Tool Use (Araç Kullanımı)

Bir ajanın görevleri tamamlayabilmek için dış dünyadaki yazılımlara, API'lere
veya fonksiyonlara erişip onları çalıştırabilme yeteneğidir. Araç kullanımı,
ajanı yalnızca metin üreten bir modelden gerçek dünyada eylem alabilen bir
sisteme dönüştüren temel yetenektir.

## 6. A2A Protocol (Ajanlar Arası Protokol)

Farklı otonom birimlerin (ajanların) nasıl iletişim kuracağını ve işbirliği
yapacağını belirleyen standart kurallar bütünüdür. Ajanların birbirini
keşfetmesi, görev devretmesi ve sonuç paylaşması için ortak bir dil sağlar.
