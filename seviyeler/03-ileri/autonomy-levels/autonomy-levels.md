# Otonomi Seviyeleri (Autonomy Levels)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 1. Temeller ve Çalışma Modeli

Bir ajanın insan müdahalesi olmadan ne ölçüde bağımsız karar alıp eylem yapabildiğini tanımlayan kademelendirmedir. Düşük seviyede her adım insana sorulurken, yüksek seviyede ajan baştan sona kendi yürütür.

## Mini Senaryo

> Seviye 1'de ajan her adımı sorar; seviye 4'te tüm satın alma sürecini tek başına tamamlar.

## 📖 Ayrıntılı Açıklama

Otonomi Seviyeleri (Autonomy Levels), bir ajanın insan müdahalesi olmadan ne kadar bağımsız hareket edebileceğini tarif eden bir kademelendirmedir. Otomotivdeki sürüş otomasyonu seviyelerine (L0–L5) benzer şekilde, en düşük seviyede insan her kararı verir, en yüksek seviyede ajan görevi baştan sona kendi yürütür. Tipik bir ölçek; Seviye 0 (yalnızca öneri), Seviye 1 (her adımda onay), Seviye 2 (toplu/kritik adımlarda onay), Seviye 3 (otonom çalışma, istisnada durur) ve Seviye 4 (tam otonomi) biçiminde düşünülebilir.

Bu kavram önemlidir çünkü "ne kadar otonomi?" sorusu doğrudan risk ile verimlilik arasındaki dengeyi belirler. Çok düşük seviye ajanı yavaşlatır ve insanı boğar (onay yorgunluğu / approval fatigue); çok yüksek seviye ise geri döndürülemez hatalara (para transferi, veri silme) yol açabilir. Doğru seviye; eylemin tersine çevrilebilirliği (reversibility), maliyeti ve hata olasılığına göre seçilir.

Nasıl çalışır: Pratikte otonomi seviyesi, kodda bir dallanma (branching) ve onay kapısı (approval gate) olarak uygulanır. Ajan bir eylem önermeden önce o eylemin risk sınıfına ve aktif otonomi seviyesine bakar; gerekiyorsa insana sorar (insan-döngüde / human-in-the-loop), gerekmiyorsa doğrudan yürütür. Seviyeler genellikle eylem türüne göre değişir: "okuma" yüksek otonomiyle, "ödeme" düşük otonomiyle yürütülebilir.

Ne zaman düşük seviye kullanılır: Yüksek riskli, geri alınamaz veya düzenlemeye tabi (regülasyon) işlemlerde. Ne zaman yüksek seviye: Tekrarlayan, düşük riskli, kolay geri alınabilen işlerde. Sistem olgunlaştıkça seviye kademeli yükseltilir; "önce gözlemle, sonra serbest bırak" yaklaşımı yaygındır.

Tuzaklar: Sabit (tek) bir otonomi seviyesini tüm eylemlere uygulamak en yaygın hatadır; seviye eylem bazında ayarlanmalıdır. Ayrıca onay isteyen ama insanın gerçekten incelemediği "sahte onay" mekanizmaları güvenlik yanılsaması yaratır. Otonomi yükseltilirken denetim günlükleri (audit logs) ve geri alma (rollback) yetenekleri mutlaka hazır olmalıdır.

## 🎬 Detaylı Senaryo

"LojiTaş" adlı bir nakliye firmasının operasyon ekibi, satın alma sürecini bir ajana devrediyor.

1. Ekip, ajanı önce Seviye 1'de başlatır: ajan her adımda (tedarikçi seçimi, fiyat, sipariş) insana sorar.
2. İki hafta sonra günlükler incelenir; ajanın tedarikçi seçimi kararlarının %98 isabetli olduğu görülür.
3. Ekip "tedarikçi seçimi" eylemini Seviye 3'e yükseltir; ama "ödeme onayı" Seviye 1'de kalır.
4. Yeni bir sipariş geldiğinde ajan tedarikçiyi otonom seçer, teklifleri toplar ve en uygununu belirler.
5. Sıra ödemeye gelince ajan durur ve insandan onay ister çünkü bu eylem geri alınamaz ve yüksek riskli.
6. Operatör onaylar; ajan siparişi tamamlar ve sonucu panoya yazar.
7. Bir gün ajan beklenmedik bir fiyat artışıyla karşılaşır; tanımlı eşik aşıldığı için otonom seviyeye rağmen durup insana danışır (istisna kuralı).
8. Üç ay sonra güven artınca, küçük tutarlı ödemeler için de Seviye 2 (toplu günlük onay) devreye alınır; büyük tutarlar hâlâ tekil onay ister.

## 💻 Kullanım / Uygulama Örneği

Otonomi seviyesi, eylem riskine göre onay gerekip gerekmediğini belirleyen bir dallanma olarak uygulanır. Aşağıda eylem bazlı seviye eşlemesi gösterilmektedir.

```python
# Eylem bazlı otonomi seviyeleri ve onay kapısı (approval gate)
OTONOMI = {"okuma": 4, "tedarikci_secimi": 3, "odeme": 1}
ONAY_ESIGI = 3  # bu seviyenin altındaki eylemler insan onayı ister

def yurut(eylem: str, insan_onayi_var: bool = False):
    seviye = OTONOMI.get(eylem, 1)  # bilinmeyen eylem en güvenli seviyede
    if seviye < ONAY_ESIGI and not insan_onayi_var:
        return f"BEKLE: '{eylem}' için insan onayı gerekiyor"
    return f"YÜRÜT: '{eylem}' otonom çalıştırıldı"

print(yurut("okuma"))                      # otonom
print(yurut("odeme"))                      # onay bekler
print(yurut("odeme", insan_onayi_var=True))  # onaylı yürütülür
```

```yaml
# Otonomi politikası (kavramsal yapılandırma)
ajan: satin-alma-ajani
varsayilan_seviye: 1
eylem_seviyeleri:
  okuma: 4          # tam otonom
  tedarikci_secimi: 3
  odeme: 1          # her zaman insan onayı
istisna_kurali:
  fiyat_artis_esigi_yuzde: 10   # eşik aşılırsa seviye ne olursa olsun dur
```

## 🔗 İlgili Kavramlar

- [Döngü Üstünde İnsan (HOTL)](../hotl/hotl.md) — yüksek otonomide üstten izleme
- [Ajan Kimliği (Agent Identity)](../agent-identity/agent-identity.md) — yetki sınırlarının kimlikle uygulanması
- [Ajanlar Arası Protokol (A2A Protocol)](../a2a-protocol/a2a-protocol.md) — görev devrinde onay seviyesi
- İnsan-Döngüde (Human-in-the-Loop) — her adımda insan onayı
- Geri Alma (Rollback) — otonom hataların telafisi
