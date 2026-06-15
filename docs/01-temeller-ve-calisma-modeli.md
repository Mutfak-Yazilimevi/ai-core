# 1. Temeller ve Çalışma Modeli

*Amaç: Ajanın ne olduğu, neyden oluştuğu ve nasıl çalıştığı.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 Agent (Ajan / Otonom Temsilci)
Belirli bir amaca yönelik çalışan; durumları algılayan, mantıksal çıkarım yapan
ve hedeflerine ulaşmak için dış dünyayla etkileşime giren özerk yapay zekâ
sistemidir. Tüm bu kılavuzun merkezindeki birimdir.

## 🟢 Foundation Model (Temel Model)
Geniş ve genel veriyle önceden eğitilmiş; üzerine ince ayar (fine-tuning) veya
istem mühendisliği uygulanarak çeşitli görevlere uyarlanabilen büyük taban
modeldir. Ajanın "beyni" bu modeldir.

## 🟢 Tokens / Tokenization (Jetonlar / Jetonlaştırma)
Modellerin metni, kodu veya veriyi işlemek ve üretmek için böldüğü en küçük
yapı taşlarıdır. Ajanların işlem maliyeti, hızı ve bağlam sınırı bu metrik
üzerinden hesaplanır.

## 🔵 Agent Loop (Ajan Döngüsü)
Bir ajanın hedeflerine ulaşmak için izlediği **algılama → mantıksal çıkarım →
eylem → sonuçları değerlendirme** döngüsüdür. Ajan, her tur sonunda elde ettiği
sonuca göre bir sonraki adımını planlar ve hedefe ulaşana (veya bir durdurma
koşulu sağlanana) kadar bu döngüyü tekrarlar.

## 🔵 Workflow vs Agent (İş Akışı / Ajan Ayrımı)
Sabit kodlanmış, önceden tanımlı yollarla ilerleyen iş akışları (workflow) ile
kendi adımlarına dinamik olarak karar veren gerçek otonom ajanlar (agent)
arasındaki temel ayrımdır. Hangi problemin hangisini gerektirdiğini bilmek
mimari kararların temelidir.

## 🟠 Autonomy Levels (Otonomi Seviyeleri)
Bir ajanın insan müdahalesi olmadan ne ölçüde bağımsız karar alıp eylem
yapabildiğini tanımlayan kademelendirmedir. Düşük seviyede her adım insana
sorulurken, yüksek seviyede ajan baştan sona kendi yürütür.

## 🟠 Reasoning Engine (Çıkarım Motoru)
Ajanın salt metin (token) üretmekle kalmayıp; mantıksal çıkarım yaptığı,
kuralları uyguladığı ve karar ağaçlarını işlettiği temel bilişsel altyapıdır.

## 🔴 ADLC (Agent Development Life Cycle — Ajan Geliştirme Yaşam Döngüsü)
Otonom sistemlerin kavramsal tasarımından geliştirilmesine, test edilip (Evals)
canlı ortama (production) alınmasına ve sürekli izlenmesine (Observability) kadar
geçen uçtan uca yazılım mühendisliği sürecidir.
