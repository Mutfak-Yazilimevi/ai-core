# Durum Makinesi / FSM (State Machine / FSM)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 6. İş Akışı ve Yürütme

Ajanın ve alt görevlerin, önceden tanımlı kurallara göre bir durumdan diğerine geçtiği deterministik mimari yapıdır. Karmaşık mikroservis veya saga desenleriyle entegre çalışırken otonom süreçlerin raydan çıkmasını engeller.

## Mini Senaryo

> Sipariş ajanı yalnızca "Onaylandı → Hazırlanıyor → Kargoda" geçişlerine izin verir, atlamayı engeller.
