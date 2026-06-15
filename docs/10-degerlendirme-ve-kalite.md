# 10. Değerlendirme ve Kalite

*Amaç: Ajanın performansını ve güvenilirliğini ölçmek.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 Evals (Değerlendirmeler)
Ajanların performansını; doğruluk, güvenilirlik ve güvenlik metrikleri üzerinden
ölçüp puanlayan titiz test çerçeveleridir. Bir değişikliğin ajanı iyileştirip
iyileştirmediğini nesnel olarak göstermek için kullanılır.

## 🔵 LLM-as-a-Judge (Yargıç Olarak LLM)
Bir dil modelinin, başka bir modelin veya ajanın çıktısını belirli ölçütlere
göre puanlaması; eval'lerde yaygın bir otomatik değerlendirme yöntemidir.
İnsan değerlendirmesini ölçeklendirmenin pratik yoludur.

## 🟠 Trajectory Evaluation (Yörünge Değerlendirmesi)
Yalnızca nihai sonucu değil; ajanın hedefe giderken izlediği adımların (araç
çağrıları, kararlar) tümünü değerlendirme yaklaşımıdır. Ajanın "doğru yanıta
yanlış yoldan" ulaşmasını tespit eder.
