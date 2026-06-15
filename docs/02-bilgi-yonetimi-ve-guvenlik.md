# 2. Bilgi Yönetimi ve Güvenlik

Bu bölüm, ajanın doğru bilgiye dayanmasını ve sınırlar içinde güvenle
çalışmasını sağlayan altı kavramı kapsar.

## 7. Memory (Bellek)

Ajanın daha önceki sohbetlerini, geçmiş deneyimlerini ve göreviyle ilgili
bilgileri saklayan ve gerektiğinde geri çağıran sistemlerdir. Genellikle
**kısa süreli** (mevcut görev bağlamı) ve **uzun süreli** (kalıcı bilgi,
kullanıcı tercihleri) bellek olarak ikiye ayrılır.

## 8. RAG (Retrieval-Augmented Generation)

Dil modelinin ürettiği yanıtları sağlam temellere oturtmak için dışarıdan
(örn. şirket veritabanından veya belge deposundan) dinamik olarak bilgi çekip
modele besleme yöntemidir. Böylece model, eğitiminde olmayan güncel veya özel
bilgilere de erişebilir.

## 9. Grounding (Temellendirme)

Ajanın kararlarının ve eylemlerinin halüsinasyonlara (uydurma bilgilere) değil,
doğrulanabilir gerçek verilere dayanmasını sağlama işlemidir. Temellendirme,
yanıtların kaynaklarla ilişkilendirilmesini ve denetlenebilir olmasını sağlar.

## 10. Context Engineering (Bağlam Mühendisliği)

Ajanın doğruluğunu artırmak için ona verilen bilgi setlerini ve istemleri
(prompt) en stratejik şekilde tasarlama pratiğidir. Hangi bilginin, hangi
sırayla ve ne kadarının bağlam penceresine konacağını optimize etmeyi içerir.

## 11. System Prompt (Sistem İstemi)

Bir ajanın rolünü, karakterini, sınırlarını ve temel çalışma kurallarını
belirleyen ana talimatlardır. Ajanın tüm davranışına zemin oluşturan, kullanıcı
mesajlarının üzerinde önceliğe sahip kalıcı yönergedir.

## 12. Guardrails (Güvenlik Bariyerleri)

Ajanın zararlı, etik dışı veya sisteme hasar verebilecek istenmeyen eylemler
yapmasını engelleyen güvenlik kurallarıdır. Girdi ve çıktıları filtreleyerek
ajanın belirlenen sınırlar içinde kalmasını sağlar.
