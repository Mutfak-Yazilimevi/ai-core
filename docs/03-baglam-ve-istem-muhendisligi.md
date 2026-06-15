# 3. Bağlam ve İstem Mühendisliği

*Amaç: Modele doğru bilgiyi, doğru biçimde ve doğru parametrelerle vermek.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 System Prompt (Sistem İstemi)
Bir ajanın rolünü, karakterini, sınırlarını ve temel çalışma kurallarını
belirleyen ana talimatlardır. Ajanın tüm davranışına zemin oluşturan, kullanıcı
mesajlarının üzerinde önceliğe sahip kalıcı yönergedir.

## 🟢 Temperature (Sıcaklık)
Modelin çıktısındaki rastgelelik/yaratıcılık seviyesini belirleyen
hiperparametredir. Düşük değerler daha deterministik ve tutarlı (kod, analiz),
yüksek değerler daha çeşitli ve yaratıcı sonuç üretir.

## 🟢 Top-P / Top-K (Örnekleme Parametreleri)
Modelin bir sonraki jetonu belirlerken değerlendireceği olasılık havuzunu
daraltan; odaklanmayı ve tutarlılığı yöneten matematiksel örnekleme
parametreleridir.

## 🔵 Context Window (Bağlam Penceresi)
Bir dil modelinin tek bir işlemde (istem ve cevap dâhil) işleyebileceği maksimum
veri boyutudur. Ajanın kısa vadeli belleğinin matematiksel sınırını belirler.

## 🔵 In-context Learning — Few-shot / Zero-shot (Bağlam İçi Öğrenme)
Modele örnek vererek (few-shot) veya hiç örnek vermeden (zero-shot), eğitimini
değiştirmeden istem içinde görev öğretme yöntemleridir.

## 🔵 Prompt Chaining (İstem Zincirleme)
Karmaşık bir görevin, her birinin çıktısı bir sonrakinin girdisi olacak şekilde
ardışık ve küçük istemlere bölünerek sırayla işletilmesidir.

## 🟠 Context Engineering (Bağlam Mühendisliği)
Ajanın doğruluğunu artırmak için ona verilen bilgi setlerini ve istemleri en
stratejik şekilde tasarlama pratiğidir. Hangi bilginin, hangi sırayla ve ne
kadarının bağlam penceresine konacağını optimize etmeyi içerir.

## 🟠 Context Compression / Summarization (Bağlam Sıkıştırma / Özetleme)
Bağlam penceresine sığması için geçmiş bilgiyi özetleyerek veya filtreleyerek
sıkıştırma tekniğidir.

## 🔴 Grounding (Temellendirme)
Ajanın kararlarının ve eylemlerinin halüsinasyonlara değil, doğrulanabilir
gerçek verilere dayanmasını sağlama işlemidir. Yanıtların kaynaklarla
ilişkilendirilmesini ve denetlenebilir olmasını sağlar.
