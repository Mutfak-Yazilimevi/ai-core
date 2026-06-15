# 6. İş Akışı ve Yürütme

*Amaç: Görevlerin nasıl yürütüldüğü, durumunun nasıl tutulduğu ve dayanıklılığı.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 Task State (Görev Durumu)
Belirli bir görevin veya ana hedefin dinamik ilerleyişini, geçmişini ve o anki
aşamasını anlık olarak takip etmektir. Ajanın nerede kaldığını bilmesini ve
kesinti sonrası kaldığı yerden devam etmesini sağlar.

## 🔵 Agentic Pipeline (Ajan Boru Hattı)
Bir ajanın çıktısının, bir sonraki ajanın girdisi olduğu yapılandırılmış,
ardışık operasyonlar dizisidir. Her aşama belirli bir işlemi yapar ve sonucu
zincirdeki bir sonraki aşamaya iletir.

## 🔵 Handoffs (Devir İşlemleri)
Bir görevin bağlamının ve kontrolünün, bir ajandan diğer bir uzman ajana
kesintisiz ve sorunsuz bir şekilde aktarılmasıdır. Devir sırasında ilgili tüm
bilgi (görev durumu, geçmiş, hedef) yeni ajana taşınır.

## 🟠 Parallel Execution (Paralel Yürütme)
Hız ve verimlilik kazanmak için, bir problemin birbirinden bağımsız parçalarını
çözmek üzere birden fazla ajanı aynı anda çalıştırmaktır. Bağımsız alt görevler
eşzamanlı işlenerek toplam süre kısaltılır.

## 🟠 State Machine / FSM (Durum Makinesi / Sonlu Durum Makinesi)
Ajanın ve alt görevlerin, önceden tanımlı kurallara göre bir durumdan diğerine
geçtiği deterministik mimari yapıdır. Karmaşık mikroservis veya saga
desenleriyle entegre çalışırken otonom süreçlerin raydan çıkmasını engeller.

## 🔴 Caching / Retry / Circuit Breaker (Dayanıklılık Desenleri)
Önbellekleme (tekrarlı işleri hızlandırma), yeniden deneme/yedeğe geçme ve
arızada devreyi kesme gibi sistem dayanıklılığı desenleridir. Üretim
ortamındaki ajanların kararlı çalışmasını sağlar.

## 🔴 Budget / Loop Limits (Bütçe / Döngü Sınırı)
Maliyeti ve sonsuz döngüleri kontrol altında tutmak için token, süre veya adım
sayısına konan üst sınırlardır. Ajanın kontrolden çıkmasını ve aşırı maliyeti
önler.
