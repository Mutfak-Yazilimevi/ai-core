# 2. Muhakeme ve Planlama

*Amaç: Ajanın nasıl düşündüğü, plan yaptığı ve karar verdiği.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 Chain-of-Thought (CoT — Düşünce Zinciri)
Modelin bir sonuca varmadan önce adım adım, açık şekilde akıl yürütmesidir.
Karmaşık problemlerde doğruluğu belirgin biçimde artıran en temel muhakeme
tekniğidir.

## 🔵 ReAct (Reasoning + Acting — Muhakeme + Eylem)
Düşünme (reasoning) ile eylemi (acting) iç içe yürüten temel ajan
paradigmasıdır. Döngü genellikle "Düşünce → Eylem → Gözlem" biçiminde işler;
ajan her gözlemden sonra düşüncesini günceller.

## 🔵 Plan-and-Execute (Planla-ve-Yürüt)
Ajanın önce yüksek seviyeli bir plan çıkarması, ardından bu planın adımlarını
sırayla uygulamasıdır. Planlama ve yürütmeyi ayırarak uzun görevlerde
tutarlılığı artırır.

## 🟠 Tree of Thoughts (ToT — Düşünce Ağacı)
Birden çok muhakeme dalını paralel olarak keşfedip en umut verici yolu seçerek
ilerleme yöntemidir. CoT'nin ağaç biçiminde genelleştirilmiş hâlidir.

## 🟠 Self-Consistency (Öz-Tutarlılık)
Aynı soru için birden çok bağımsız muhakeme üretip, sonuçlar arasında çoğunluk
oyuyla en tutarlı yanıtı seçme tekniğidir.

## 🟠 Task Decomposition (Görev Parçalama)
Orkestratör ajanın, kendisine verilen çok bileşenli ve karmaşık hedefi; alt
ajanların çözebileceği bağımsız, yönetilebilir küçük görev parçacıklarına
bölmesi sürecidir.

## 🔴 Reflexion / Self-Correction (Öz-Yansıma / Kendi Kendini Düzeltme)
Ajanın ürettiği bir kodu, metni veya kararı dışarıya (veya bir sonraki adıma)
iletmeden önce kendi kendine eleştirmesi sürecidir. Ajan "Burada hata yaptım mı?"
veya "Bu çıktı asıl hedefle uyuşuyor mu?" diye sorarak hatalı çıktıları otonom
olarak revize eder.
