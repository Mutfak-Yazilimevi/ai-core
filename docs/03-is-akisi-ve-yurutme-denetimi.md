# 3. İş Akışı ve Yürütme Denetimi

Bu bölüm, ajanların görevleri nasıl yürüttüğünü ve bu yürütmenin nasıl
denetlendiğini tanımlayan altı kavramı kapsar.

## 13. Policy Layer (Politika Katmanı)

Ajanların daha üst düzey kararlar alırken uyması gereken iş kurallarının ve
prensiplerinin tanımlandığı katmandır. Hangi eylemlere izin verildiğini, hangi
koşulların gerektiğini ve hangi durumların yasak olduğunu merkezî olarak
yönetir.

## 14. Sandboxing (Korumalı Alan)

Yetkisiz erişimleri veya sistem hasarını önlemek amacıyla, ajanın veya
kullandığı araçların izole edilmiş, güvenli bir ortamda çalıştırılmasıdır.
Sandbox içindeki bir hata veya kötü niyetli eylem, ana sisteme zarar veremez.

## 15. HITL (Human-in-the-Loop — Döngüde İnsan)

Otonom iş akışındaki kritik karar aşamalarında insanın onayını, incelemesini
veya kontrolünü sürece dahil etmektir. Yüksek riskli eylemler (ödeme, silme,
yayınlama vb.) öncesinde bir insanın "onayla" demesini gerektirebilir.

## 16. Handoffs (Devir İşlemleri)

Bir görevin bağlamının ve kontrolünün, bir ajandan diğer bir uzman ajana
kesintisiz ve sorunsuz bir şekilde aktarılmasıdır. Devir sırasında ilgili tüm
bilgi (görev durumu, geçmiş, hedef) yeni ajana taşınır.

## 17. Agentic Pipeline (Ajan Boru Hattı)

Bir ajanın çıktısının, bir sonraki ajanın girdisi olduğu yapılandırılmış,
ardışık operasyonlar dizisidir. Her aşama belirli bir işlemi yapar ve sonucu
zincirdeki bir sonraki aşamaya iletir.

## 18. Task State (Görev Durumu)

Belirli bir görevin veya ana hedefin dinamik ilerleyişini, geçmişini ve o anki
aşamasını anlık olarak takip etmektir. Görev durumu, ajanın nerede kaldığını
bilmesini ve kesinti sonrası kaldığı yerden devam etmesini sağlar.
