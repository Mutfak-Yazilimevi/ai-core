# 7. Çoklu Ajan ve Koordinasyon

*Amaç: Birden fazla ajanın birlikte nasıl çalıştığı ve koordine edildiği.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 Multi-Agent (Çoklu Ajan)
Karmaşık ve çok katmanlı sorunları çözmek için birden fazla otonom ajanın
birlikte çalıştığı işbirlikçi sistemlerdir. Her ajan kendi uzmanlığına
odaklanırken sistem bütünü tek bir ajanın kapasitesini aşan görevleri başarır.

## 🔵 Orchestrator (Orkestratör)
Birden fazla uzmanlaşmış ajanı yöneten; onların görevlerini ve aralarındaki
bilgi akışını koordine eden merkezî sistemdir. Hangi alt ajanın ne zaman
çalışacağına karar verir, çıktıları toplar ve nihai sonucu birleştirir.

## 🔵 Subagent (Alt Ajan)
Daha büyük bir otonom sistem veya orkestratör içinde, çok daha dar ve spesifik
bir işlevi yerine getirmekle görevlendirilmiş uzman ajandır.

## 🟠 Routing (Yönlendirme)
Gelen girdiyi, onu en iyi işleyecek uzman ajana, modele veya araca yönlendiren
karar mekanizmasıdır.

## 🟠 Semantic Routing (Semantik Yönlendirme)
Gelen bir talebin kelime anlamına veya niyetine bakarak, o iş için en uygun
uzman ajana yönlendirilmesi işlemidir. Akıllı bir API Gateway gibi çalışır;
ancak bunu statik if/else kurallarıyla değil, anlamsal bağlamla yapar.

## 🟠 Supervisor / Manager-Worker (Yönetici-İşçi)
Bir yönetici ajanın görevleri parçalayıp işçi ajanlara dağıttığı ve sonuçları
birleştirdiği hiyerarşik koordinasyon desenidir.

## 🟠 Evaluator-Optimizer (Değerlendirici-İyileştirici)
Bir ajanın ürettiği çıktının, başka bir ajan tarafından değerlendirilip geri
bildirimle iyileştirildiği döngüsel desendir.

## 🔴 Multi-Agent Debate (Ajan Münazarası)
Birden çok ajanın aynı problem üzerinde tartışarak, birbirinin argümanlarını
sınayarak daha doğru bir sonuca yakınsamasıdır.

## 🔴 Swarm (Sürü)
Katı bir hiyerarşi veya merkezî bir orkestratör olmadan, çok sayıda spesifik
ajanın bir arı sürüsü gibi birbiriyle doğrudan haberleşerek büyük bir problemi
çözdüğü merkeziyetsiz mimaridir.

## 🔴 Blackboard (Kara Tahta) Mimarisi
Ajanların ortak ve paylaşılan bir bellek alanı ("kara tahta") üzerinden dolaylı
olarak işbirliği yaptığı klasik mimaridir.
