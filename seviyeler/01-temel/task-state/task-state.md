# Görev Durumu (Task State)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 6. İş Akışı ve Yürütme

Belirli bir görevin veya ana hedefin dinamik ilerleyişini, geçmişini ve o anki aşamasını anlık olarak takip etmektir. Ajanın nerede kaldığını bilmesini ve kesinti sonrası kaldığı yerden devam etmesini sağlar.

## Mini Senaryo

> Uzun bir rapor üretimi yarıda kesilirse, ajan "3/5 bölüm tamam" durumundan devam eder.

## 📖 Ayrıntılı Açıklama

Görev durumu (task state), bir ajanın o anda üzerinde çalıştığı görevin ilerleyişini, geçmiş adımlarını ve mevcut aşamasını temsil eden yapılandırılmış veridir. Bir görevi "tamamlandı / devam ediyor / başarısız" gibi makro düzeyde izlemenin yanı sıra, hangi alt adımların bitirildiğini, hangi ara çıktıların üretildiğini ve sıradaki eylemin ne olduğunu da kapsar. Bu durum, modelin bağlam penceresinden (context window) bağımsız olarak kalıcı bir yerde (bellek, veritabanı, dosya) tutulur.

Bu kavram önemlidir çünkü ajanlar genellikle tek bir model çağrısıyla bitmeyen, çok adımlı ve uzun soluklu görevleri yürütür. Süreç ortasında bir araç hatası, bir zaman aşımı veya sistem yeniden başlatması olabilir. Eğer görev durumu kalıcı şekilde saklanmıyorsa, ajan baştan başlamak zorunda kalır; bu hem maliyetli hem de hata kaynağıdır. Durum yönetimi, kesintiye dayanıklılık (resilience) ve idempotentlik (aynı adımı tekrar çalıştırınca yan etkinin tekrarlanmaması) için zorunludur.

Çalışma mantığı şöyledir: Görev başlatıldığında bir durum nesnesi oluşturulur. Her anlamlı adımdan sonra bu nesne güncellenir ve kalıcı depoya yazılır (checkpoint). Bir kesinti olursa, ajan en son kaydedilen durumu yükler, nereye kaldığını anlar ve oradan devam eder. Durum genellikle hedef, tamamlanan adımlar listesi, ara sonuçlar ve sıradaki adım gibi alanlardan oluşur.

Görev durumu, uzun süren iş akışlarında, insan onayı bekleyen süreçlerde ve birden fazla araç çağrısının zincirlendiği görevlerde kritiktir. Tek bir hızlı soru-cevapta ise genellikle gerekmez; durumu tutmanın getirdiği karmaşıklık fayda sağlamaz.

Dikkat edilmesi gereken tuzaklar: Durumu çok sık veya çok seyrek kaydetmek arasında denge kurmak gerekir. Durum nesnesini şişirmek (tüm ham çıktıları içine koymak) hem depolama hem de yeniden yükleme maliyetini artırır. Ayrıca yan etkili adımların idempotent tasarlanması şarttır; aksi halde "kaldığı yerden devam" sırasında bir e-posta iki kez gönderilebilir.

## 🎬 Detaylı Senaryo

Bir pazarlama ajansı olan "Marka Lab", müşterileri için aylık performans raporlarını otomatik üreten bir ajan kuruyor.

1. Ajan, "Mayıs raporu" görevini alır ve durum nesnesini `{"hedef": "mayis_raporu", "tamamlanan": [], "sirada": "veri_topla"}` olarak oluşturup veritabanına yazar.
2. Ajan reklam platformlarından verileri toplar; bu adım bitince durumu `tamamlanan: ["veri_topla"]`, `sirada: "grafik_uret"` olarak günceller.
3. Grafikleri üretir ve bir nesne deposuna kaydeder; durumu yeniden günceller.
4. Tam metin yazımı sırasında bir API zaman aşımı yaşanır ve süreç çöker.
5. Zamanlanmış bir izleyici, görevin "devam ediyor" durumunda takıldığını fark eder ve ajanı yeniden tetikler.
6. Ajan, kayıtlı son durumu yükler ve veri toplama ile grafik üretiminin zaten tamamlandığını görür; bu adımları tekrarlamaz.
7. Doğrudan "metin yazımı" adımından devam eder, raporu tamamlar ve durumu `tamamlandi` olarak işaretler.
8. Müşteriye yalnızca tek bir nihai rapor ulaşır; tekrar eden grafik üretimi veya çift gönderim yaşanmaz.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki Python örneği, basit bir görev durumu yönetimini gösterir; durum bir dosyaya kaydedilir ve kesinti sonrası yüklenir.

```python
import json, os

STATE_FILE = "gorev_durumu.json"

def durum_yukle():
    if os.path.exists(STATE_FILE):
        return json.load(open(STATE_FILE))
    return {"hedef": "rapor", "tamamlanan": [], "sirada": "veri_topla"}

def durum_kaydet(state):
    json.dump(state, open(STATE_FILE, "w"), ensure_ascii=False)

adimlar = ["veri_topla", "grafik_uret", "metin_yaz", "yayinla"]
state = durum_yukle()
for adim in adimlar:
    if adim in state["tamamlanan"]:
        continue  # idempotentlik: zaten yapılmış adımı atla
    # ... adımı çalıştır ...
    state["tamamlanan"].append(adim)
    durum_kaydet(state)  # her adımdan sonra checkpoint
```

YAML ile bir durum nesnesinin şeması şöyle modellenebilir:

```yaml
gorev:
  id: mayis_raporu
  durum: devam_ediyor      # bekliyor | devam_ediyor | tamamlandi | basarisiz
  tamamlanan: [veri_topla, grafik_uret]
  sirada: metin_yaz
  ara_ciktilar:
    grafik_url: s3://raporlar/mayis/grafik.png
```

## 🔗 İlgili Kavramlar

- [Araç Kullanımı (Tool Use)](../tool-use/tool-use.md) — çok adımlı araç döngülerinde durum izlenir.
- [Gözlemlenebilirlik (Observability)](../observability/observability.md) — durum geçişlerinin izlenmesini sağlar.
- [Çoklu Ajan (Multi-Agent)](../multi-agent/multi-agent.md) — paylaşılan durum üzerinden koordinasyon kurar.
- Checkpoint / kalıcılık (persistence) — durumun kaydedilip yüklenmesi.
- İdempotentlik (idempotency) — tekrarlanan adımların yan etkisini önler.
