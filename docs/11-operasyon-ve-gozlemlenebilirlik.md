# 11. Operasyon ve Gözlemlenebilirlik

*Amaç: Ajanı canlı ortamda ayakta tutmak, izlemek ve hata ayıklamak.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 Observability (Gözlemlenebilirlik)
Hata ayıklama ve optimizasyon yapabilmek için ajanın arka plandaki düşünce
süreçlerini, kullandığı araçları ve durum değişikliklerini izleme yeteneğidir.
İzler (traces), günlükler (logs) ve metrikler ile ajanın "neyi neden yaptığı"
şeffaf hâle gelir.

## 🔵 Telemetry (Telemetri)
Ajanın karar mekanizmalarından, API çağrılarından, token tüketiminden ve sistem
performansından otomatik olarak toplanan yapılandırılmış log, metrik ve izleme
(trace) verilerinin bütünüdür. Observability'nin ham veri kaynağıdır.

## 🔵 Streaming (Akış)
Modelin yanıtını tamamı bitene kadar beklemeden, üretildikçe jeton jeton
ileterek kullanıcıya anlık akış hâlinde sunmasıdır. Algılanan gecikmeyi (latency)
azaltır ve etkileşimi canlı tutar.

## 🟠 LLMOps / AgentOps (Büyük Dil Modeli / Ajan Operasyonları)
Otonom ajanların ve yapay zekâ modellerinin geliştirme, test, dağıtım, izleme ve
sürekli entegrasyon (CI/CD) süreçlerinin uçtan uca yönetildiği modern
operasyonel disiplindir.
