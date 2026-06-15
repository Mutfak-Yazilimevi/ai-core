# Eşetkisellik (Idempotency)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 5. Araç Kullanımı ve Entegrasyon

Ajanın bir aracı kullanırken bir işlemi (örn. bir veritabanı yazması veya API çağrısı) ağ hataları nedeniyle veya otonom olarak birden fazla kez tetiklemesi durumunda bile, sistemde istenmeyen mükerrer değişikliklerin oluşmamasını sağlayan kritik mimari tasarım prensibidir.

## Mini Senaryo

> Ağ hatası yüzünden "ödeme yap" iki kez tetiklenir ama eşetkisellik sayesinde müşteri tek kez ödenir.
