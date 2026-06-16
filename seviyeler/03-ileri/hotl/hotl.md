# Döngü Üstünde İnsan (HOTL (Human-on-the-Loop))

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 9. Güvenlik, Hizalama ve Denetim

Otonom sistemin çalışmaya devam ettiği, ancak insanın süreci dışarıdan/üstten (Observability üzerinden) izleyerek yalnızca yanlış giden bir durum gördüğünde müdahale ettiği yüksek otonomi seviyesidir.

## Mini Senaryo

> Ajan gece boyunca otonom rapor üretir; insan sabah panoyu izleyip yalnızca anormalliğe müdahale eder.

## 📖 Ayrıntılı Açıklama

Döngü Üstünde İnsan (Human-on-the-Loop, HOTL), otonom sistemin kesintisiz çalışmaya devam ettiği, insanın ise süreci dışarıdan/üstten gözlemleyerek (genellikle bir gözlemlenebilirlik / observability panosu üzerinden) yalnızca bir şey ters gittiğinde müdahale ettiği yüksek otonomi modelidir. "İnsan-döngüde" (human-in-the-loop, HITL) modelinden farklıdır: HITL'de insan her kritik adımı onaylar; HOTL'de insan akışı durdurmaz, sadece denetler ve istisnada araya girer.

Bu önemlidir çünkü ölçeklenme ile denetim arasında denge kurar. İnsanın her adımı onaylaması (HITL) güvenlidir ama yavaş ve ölçeklenmez; tam otonomi hızlıdır ama denetimsizdir. HOTL ortayı bulur: ajan hızla çalışır, insan ise "nöbetçi" konumundadır — gözünü panoda tutar, alarm çalınca devreye girer. Bu, çok sayıda otonom görevi az sayıda insanla yönetmeyi mümkün kılar.

Nasıl çalışır: Ajan otonom çalışırken her eylemini ve durumunu canlı bir panoya/günlüğe yazar. Anormallik tespiti (anomaly detection), eşik alarmları ve "durdurma düğmesi" (kill switch / pause) bulunur. İnsan müdahale ederse ajanı duraklatabilir, geri alabilir (rollback) veya yön verebilir. Müdahale gerektirmeyen durumlarda ajan kendi kendine devam eder.

Ne zaman kullanılır: Yüksek hacimli, çoğunlukla güvenli ama nadiren riskli olabilen süreçlerde — gece toplu işler, içerik moderasyonu, izleme/uyarı sistemleri. Ne zaman kullanılmaz: Her bireysel eylemin yüksek ve geri alınamaz risk taşıdığı durumlarda; orada HITL (adım adım onay) daha uygundur.

Tuzaklar: "İzliyoruz" yanılsaması tehlikelidir — pano varsa ama kimse bakmıyorsa HOTL fiilen tam otonomidir. Etkili olması için iyi alarmlar, net eşikler ve hızlı bir durdurma mekanizması gerekir. Ayrıca insan müdahale ettiğinde ajanı güvenle duraklatabilmek (graceful pause) ve geri alabilmek tasarıma baştan konmalıdır.

## 🎬 Detaylı Senaryo

"VeriGece" adlı bir analitik firmasının ekibi, gece boyunca rapor üreten bir ajan çalıştırıyor.

1. Ajan her gece 02:00'de tetiklenir; 200 müşteri için otomatik performans raporu üretir.
2. Ekip uyurken ajan otonom çalışır; her raporu üretip durumunu canlı bir panoya yazar.
3. Eşik alarmları tanımlıdır: bir rapor 3 kez başarısız olursa veya çıktı beklenenden %50 sapma gösterirse alarm çalar.
4. 04:00'te bir müşterinin veri kaynağı bozulur; ajan üç kez dener, başarısız olur ve panoya kırmızı bir alarm düşer.
5. Nöbetçi mühendisin telefonu öter; panoya bakar ve sorunun tek bir müşteriyle sınırlı olduğunu görür.
6. Mühendis o müşterinin işini duraklatır (pause) ama diğer 199 raporun otonom akışını kesmez.
7. Bozuk kaynağı düzeltip işi yeniden başlatır; ajan kaldığı yerden devam eder.
8. Sabah ekip panoda gecenin özetini görür: 199 rapor otonom tamamlandı, 1 işe insan müdahalesi gerekti.

## 💻 Kullanım / Uygulama Örneği

Ajan otonom çalışır, durumu panoya yazar ve yalnızca eşik aşılınca insanı uyarır. Aşağıda kavramsal bir HOTL döngüsü gösterilmektedir.

```python
def hotl_dongu(isler: list, calistir, alarm_gonder, esik_basarisizlik: int = 3):
    for is_ in isler:
        basarisiz = 0
        while basarisiz < esik_basarisizlik:
            sonuc = calistir(is_)
            pano_yaz(is_, sonuc)                 # canlı gözlemlenebilirlik (observability)
            if sonuc["durum"] == "ok":
                break
            basarisiz += 1
        else:
            # Eşik aşıldı: insanı uyar ama diğer işleri durdurma
            alarm_gonder(f"'{is_}' {esik_basarisizlik} kez başarısız — insan müdahalesi gerekli")
```

```yaml
# HOTL izleme politikası (kavramsal)
ajan: gece-rapor-ajani
otonomi: yuksek          # insan her adımı onaylamaz
gozlem:
  pano: canli
  durdurma_dugmesi: etkin   # kill switch / pause
alarmlar:
  ardisik_basarisizlik: 3
  cikti_sapma_yuzde: 50
  bildirim: nobetci-muhendis
```

## 🔗 İlgili Kavramlar

- [Otonomi Seviyeleri (Autonomy Levels)](../autonomy-levels/autonomy-levels.md) — HOTL yüksek bir otonomi seviyesidir
- [Ajan Kimliği (Agent Identity)](../agent-identity/agent-identity.md) — kim hangi işi yaptı izlenebilirliği
- [LLMOps / AgentOps](../llmops-agentops/llmops-agentops.md) — izleme ve alarm altyapısı
- İnsan-Döngüde (Human-in-the-Loop, HITL) — her adımda onay modeli
- Gözlemlenebilirlik (Observability) — durum panosu ve günlükler
