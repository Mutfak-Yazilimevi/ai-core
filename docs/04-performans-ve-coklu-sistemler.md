# 4. Performans ve Çoklu Sistemler

Bu bölüm, ajan sistemlerinin ölçeklenmesini, ölçülmesini ve birlikte
çalışmasını sağlayan altı kavramı kapsar.

## 19. Parallel Execution (Paralel Yürütme)

Hız ve verimlilik kazanmak için, bir problemin birbirinden bağımsız parçalarını
çözmek üzere birden fazla ajanı aynı anda çalıştırmaktır. Bağımsız alt görevler
eşzamanlı işlenerek toplam süre kısaltılır.

## 20. Evals (Değerlendirmeler)

Ajanların performansını; doğruluk, güvenilirlik ve güvenlik metrikleri
üzerinden ölçüp puanlayan test sistemleridir. Eval'ler, bir değişikliğin
ajanı iyileştirip iyileştirmediğini nesnel olarak göstermek için kullanılır.

## 21. Observability (Gözlemlenebilirlik)

Hata ayıklama ve optimizasyon yapabilmek için ajanın arka plandaki düşünce
süreçlerini, kullandığı araçları ve durum değişikliklerini izleme yeteneğidir.
İzler (traces), günlükler (logs) ve metrikler ile ajanın "neyi neden yaptığı"
şeffaf hale gelir.

## 22. Agent Identity (Ajan Kimliği)

Ajanların sistemlere güvenli bir şekilde giriş yapabilmesi ve doğrulanabilmesi
için kullanılan benzersiz kimlik bilgileri ve şifreleme anahtarlarıdır. Her
ajanın kendi kimliği, yetki ve erişim denetimini (kim, neye, ne zaman
erişebilir) mümkün kılar.

## 23. Multi-Agent (Çoklu Ajan)

Karmaşık ve çok katmanlı sorunları çözmek için birden fazla otonom ajanın
birlikte çalıştığı işbirlikçi sistemlerdir. Her ajan kendi uzmanlığına
odaklanırken sistem bütünü tek bir ajanın kapasitesini aşan görevleri başarır.

## 24. Agent Protocols (Ajan Protokolleri)

Ajan sistemleri arasında veri paylaşımı, koordinasyon, etkileşim ve hata
yönetimini düzenleyen genel standart prosedürlerdir. MCP ve A2A gibi belirli
protokolleri kapsayan üst başlıktır.
