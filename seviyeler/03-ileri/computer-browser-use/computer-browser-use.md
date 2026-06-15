# Bilgisayar / Tarayıcı Kullanımı (Computer Use / Browser Use)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 5. Araç Kullanımı ve Entegrasyon

Ajanın ekran görüntüsü, fare ve klavye ya da bir tarayıcı üzerinden gerçek arabirimleri kullanarak eylem almasıdır. API'si olmayan sistemlerle etkileşimi mümkün kılar.

## Mini Senaryo

> API'si olmayan eski bir web panelinde ajan, fareyle tıklayıp formu doldurur.

## 📖 Ayrıntılı Açıklama

Bilgisayar / Tarayıcı Kullanımı (Computer Use / Browser Use), bir ajanın bir programlama arabirimi (API) yerine gerçek bir grafiksel arabirimi (GUI) bir insan gibi kullanarak eylem almasıdır. Ajan ekran görüntüsünü "görür", fareyi hareket ettirir, tıklar, klavyeden yazar ve sonucu yeni bir ekran görüntüsüyle değerlendirir. Tarayıcı kullanımı (browser use) bunun web'e özelleşmiş halidir: ajan bir tarayıcıyı sürer, sayfada gezinir, form doldurur.

Bu önemlidir çünkü dünyadaki sistemlerin büyük kısmının temiz bir API'si yoktur: eski (legacy) panonlar, masaüstü uygulamaları, üçüncü taraf web siteleri. Computer use, "API'si olmayan her şeyle çalışabilme" yeteneği kazandırır ve ajanı insan iş akışlarının gerçek bir vekiline dönüştürür. Bu, otomasyonun kapsamını devasa biçimde genişletir.

Nasıl çalışır: Modele bir "bilgisayar kullanımı" aracı tanımlanır. Döngü tipik olarak şöyledir: (1) ekran görüntüsü alınır ve modele verilir, (2) model bir eylem önerir (örn. "(x=420, y=300) noktasına tıkla" veya "şu metni yaz"), (3) bir kontrolör bu eylemi gerçek ortamda uygular, (4) yeni ekran görüntüsü alınıp döngü tekrar eder. Bu, "gör → düşün → eyle" döngüsünün görsel halidir. Anthropic SDK'sında bu, bilgisayar kullanımı aracı (`computer_use`) ile desteklenir.

Ne zaman kullanılır: Sadece GUI üzerinden erişilebilen sistemlerde, API'si olmayan eski uygulamalarda, çapraz uygulama iş akışlarında. Ne zaman kullanılmaz: Bir API mevcutsa, API her zaman daha hızlı, ucuz ve güvenilirdir; computer use son çare olmalıdır.

Tuzaklar: GUI otomasyonu kırılgandır — arayüz değişince koordinatlar kayar. Yavaş ve maliyetlidir (her adımda ekran görüntüsü). En kritik risk güvenliktir: ajan yanlış butona basabilir veya kötü niyetli bir sayfadaki gizli talimatlarla (prompt injection) kandırılabilir; bu yüzden hassas eylemlerde insan onayı ve izole bir ortam (sandbox) şarttır.

## 🎬 Detaylı Senaryo

"SigortaPlus" adlı bir sigorta firmasının operasyon ekibi, 1990'lardan kalma, API'si olmayan bir poliçe panelini kullanıyor.

1. Ekip, gün sonu rapor indirme işini bir ajana devretmek ister; panelin API'si olmadığı için tarayıcı kullanımı seçilir.
2. Ajan izole bir tarayıcı ortamında panonun giriş sayfasını açar ve ekran görüntüsünü alır.
3. Modeli "kullanıcı adı alanı ekranda nerede?" diye düşünür ve ilgili kutuya tıklayıp kimlik bilgisini yazar (kimlik kasadan gelir).
4. "Giriş" butonuna tıklar; yeni ekran görüntüsünde ana menüyü görür.
5. "Raporlar" sekmesine gider, tarih aralığını seçer ve "Oluştur" butonuna basar.
6. Rapor hazırlanırken sayfa yüklenmesini bekler; ekran görüntüsünden "indir" bağlantısının çıktığını anlar.
7. Bağlantıya tıklayıp dosyayı indirir; indirilen dosyanın adını doğrular.
8. Beklenmedik bir hata penceresi çıkarsa ajan durur ve insana ekran görüntüsüyle birlikte danışır (yüksek riskli istisna).

## 💻 Kullanım / Uygulama Örneği

Anthropic SDK'da bilgisayar kullanımı aracıyla model ekran üzerinde eylem önerebilir. Aşağıda kavramsal bir kullanım ve "gör → eyle" döngüsü gösterilmektedir.

```python
import anthropic

client = anthropic.Anthropic()

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    tools=[{
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1280,
        "display_height_px": 800,
    }],
    messages=[{"role": "user", "content": "Panodaki 'Raporlar' sekmesini aç ve günlük raporu indir."}],
)
# Model bir eylem önerir: örn. {"action": "left_click", "coordinate": [420, 120]}
print(resp.content)
```

```python
# "Gör → düşün → eyle" döngüsü (kavramsal kontrolör)
def gör_düşün_eyle(tarayici, hedef):
    for _ in range(20):                  # güvenlik için adım sınırı
        ekran = tarayici.ekran_goruntusu()
        eylem = model_eylem_oner(ekran, hedef)   # model bir eylem döndürür
        if eylem["tip"] == "bitti":
            return "Görev tamamlandı"
        tarayici.uygula(eylem)           # tıkla / yaz / kaydır
    return "Adım sınırına ulaşıldı"
```

## 🔗 İlgili Kavramlar

- [Kod Yorumlayıcı (Code Interpreter)](../code-interpreter/code-interpreter.md) — eylem almanın bir başka biçimi
- [Otonomi Seviyeleri (Autonomy Levels)](../autonomy-levels/autonomy-levels.md) — hassas tıklamalarda onay seviyesi
- [Döngü Üstünde İnsan (HOTL)](../hotl/hotl.md) — riskli GUI eylemlerinde denetim
- Araç Kullanımı (Tool Use) — modele bilgisayar kullanımı yeteneği verme
- İstem Enjeksiyonu (Prompt Injection) — kötü niyetli sayfa içeriği riski
