# Değerlendirici-İyileştirici (Evaluator-Optimizer)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Bir ajanın ürettiği çıktının, başka bir ajan tarafından değerlendirilip geri bildirimle iyileştirildiği döngüsel desendir.

## Mini Senaryo

> Bir ajan pazarlama metni yazar, diğeri "çok uzun" der; ilki geri bildirimle kısaltır.

## 📖 Ayrıntılı Açıklama

Değerlendirici-İyileştirici (Evaluator-Optimizer), bir ajanın (üretici / optimizer) bir çıktı ürettiği, ikinci bir ajanın (değerlendirici / evaluator) bu çıktıyı belirli ölçütlere göre eleştirdiği ve bu geri bildirimle çıktının yeniden iyileştirildiği döngüsel bir desendir. "Üret → değerlendir → iyileştir" döngüsü, hedefe ulaşılana veya bir tur sınırına gelinene kadar tekrarlanır. İnsanların yazıp düzeltmen geri bildirimi alıp tekrar yazmasına benzer.

Bu önemlidir çünkü tek seferlik üretim çoğu zaman yetersizdir; karmaşık veya kalite-kritik görevlerde ilk taslak nadiren en iyisidir. Bir değerlendiriciyle eşleştirmek, çıktıyı sistematik olarak iyileştirir ve "kendi kendini düzeltme" (self-correction) sağlar. Özellikle değerlendirme ölçütü net olduğunda (kod testten geçti mi, metin çok mu uzun, çeviri doğru mu) çok etkilidir.

Nasıl çalışır: Üretici bir taslak üretir; değerlendirici onu kriterlere göre puanlar ve somut, eyleme dönük geri bildirim verir ("şu çok uzun", "şu kısım kaynaksız"). Üretici bu geri bildirimi alıp revize eder. Döngü, değerlendirici "yeterli" diyene veya maksimum tur sayısına ulaşılana kadar sürer. Değerlendirici aynı modelin farklı bir rolü, başka bir model veya kural tabanlı bir kontrol olabilir.

Ne zaman kullanılır: Net başarı ölçütü olan, yinelemeyle iyileşen görevlerde — kod üretimi, çeviri, içerik yazımı, plan çıkarma. Ne zaman kullanılmaz: Ölçüt belirsizse değerlendirici güvenilmez olur; ayrıca basit görevlerde döngü gereksiz maliyet ve gecikme katar.

Tuzaklar: Döngü sonsuza dek dönebilir veya çıktı iki durum arasında salınabilir; tur sınırı (max iterations) şarttır. Zayıf bir değerlendirici, üreticiyi yanlış yöne çeker ("kötü öğretmen"). Değerlendiricinin ölçütleri net ve nesnel olmalı; aksi halde her turda farklı, çelişkili geri bildirim çıkar.

## 🎬 Detaylı Senaryo

"MarkaLab" adlı bir reklam ajansının ekibi, kampanya sloganlarını üretmek için iki ajanlı bir döngü kurar.

1. Ekip ölçütleri tanımlar: slogan en fazla 8 kelime, marka tonu "enerjik", klişe içermeyecek.
2. Üretici Ajan ilk slogan taslağını üretir: 14 kelimelik, biraz klişe bir cümle.
3. Değerlendirici Ajan ölçütlere bakar ve geri bildirim verir: "Çok uzun (14>8), 'hayatınızı değiştirin' klişe."
4. Üretici geri bildirimi alıp sloganı 7 kelimeye indirir ve klişeyi çıkarır.
5. Değerlendirici yeni sürümü kontrol eder; uzunluk uygun ama ton yeterince enerjik değil, der.
6. Üretici tonu güçlendirir; üçüncü tur.
7. Değerlendirici tüm ölçütlerin karşılandığını onaylar ve döngü durur (üç turda yakınsadı).
8. Tur sınırı 5'e konmuştu; eğer 5 turda yakınsamasaydı en yüksek puanlı sürüm seçilip insana iletilecekti.

## 💻 Kullanım / Uygulama Örneği

İki rol (üretici ve değerlendirici) bir döngüde çalışır; değerlendirici onaylayınca veya tur sınırı dolunca durur. Aşağıda Anthropic SDK ile kavramsal bir döngü gösterilmektedir.

```python
import anthropic
client = anthropic.Anthropic()

def uret(gorev: str, geri_bildirim: str = "") -> str:
    istem = f"Görev: {gorev}\nGeri bildirim: {geri_bildirim}" if geri_bildirim else gorev
    r = client.messages.create(model="claude-opus-4-8", max_tokens=512,
        messages=[{"role": "user", "content": istem}])
    return r.content[0].text

def degerlendir(cikti: str, olcut: str) -> tuple[bool, str]:
    r = client.messages.create(model="claude-opus-4-8", max_tokens=256,
        messages=[{"role": "user", "content":
            f"Ölçüt: {olcut}\nÇıktı: {cikti}\nUygun mu? 'EVET' veya 'HAYIR: <neden>' yaz."}])
    metin = r.content[0].text
    return metin.startswith("EVET"), metin
```

```python
# Üret → değerlendir → iyileştir döngüsü (tur sınırlı)
def dongu(gorev, olcut, max_tur=5):
    geri_bildirim = ""
    for _ in range(max_tur):
        cikti = uret(gorev, geri_bildirim)
        tamam, geri_bildirim = degerlendir(cikti, olcut)
        if tamam:
            return cikti          # değerlendirici onayladı
    return cikti                  # tur sınırı: en son sürümü döndür
```

## 🔗 İlgili Kavramlar

- [Paralel Yürütme (Parallel Execution)](../parallel-execution/parallel-execution.md) — birden çok aday üretip en iyisini değerlendirme
- [Ajanlar Arası Protokol (A2A Protocol)](../a2a-protocol/a2a-protocol.md) — üretici ve değerlendiricinin iletişimi
- [Döngü Üstünde İnsan (HOTL)](../hotl/hotl.md) — yakınsama olmazsa insana devretme
- Kendi Kendini Düzeltme (Self-Correction) — geri bildirimle iyileşme
- LLM Yargıcı (LLM-as-a-Judge) — model tabanlı değerlendirme
