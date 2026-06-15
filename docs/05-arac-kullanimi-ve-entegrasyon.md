# 5. Araç Kullanımı ve Entegrasyon

*Amaç: Ajanın dış dünyada (API, sistem, arayüz) nasıl eylem aldığı.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 Tool Use (Araç Kullanımı)
Bir ajanın görevleri tamamlayabilmek için dış dünyadaki yazılımlara, API'lere
veya fonksiyonlara erişip onları çalıştırabilme yeteneğidir. Ajanı yalnızca
metin üreten bir modelden gerçek dünyada eylem alabilen bir sisteme dönüştüren
temel yetenektir.

## 🔵 Function Calling (Fonksiyon Çağırma)
Bir dil modelinin harici bir API'yi tetiklemek için gerekli yapılandırılmış
veriyi (örn. JSON parametreleri) doğru formatta üretebilme yeteneğidir. Tool
Use'un yapısal ve kesin biçimidir.

## 🟠 Code Interpreter (Kod Yorumlayıcı)
Ajanın görevi çözmek için kod yazıp güvenli bir ortamda çalıştırabilmesidir.
Hesaplama, veri analizi ve dosya işleme gibi görevlerde güçlüdür.

## 🟠 Computer Use / Browser Use (Bilgisayar / Tarayıcı Kullanımı)
Ajanın ekran görüntüsü, fare ve klavye ya da bir tarayıcı üzerinden gerçek
arabirimleri kullanarak eylem almasıdır. API'si olmayan sistemlerle etkileşimi
mümkün kılar.

## 🔴 Idempotency (Eşetkisellik)
Ajanın bir aracı kullanırken bir işlemi (örn. bir veritabanı yazması veya API
çağrısı) ağ hataları nedeniyle veya otonom olarak birden fazla kez tetiklemesi
durumunda bile, sistemde istenmeyen mükerrer değişikliklerin oluşmamasını
sağlayan kritik mimari tasarım prensibidir.
