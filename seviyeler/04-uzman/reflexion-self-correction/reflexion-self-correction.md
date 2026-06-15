# Öz-Yansıma / Kendi Kendini Düzeltme (Reflexion / Self-Correction)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 2. Muhakeme ve Planlama

Ajanın ürettiği bir kodu, metni veya kararı dışarıya (veya bir sonraki adıma) iletmeden önce kendi kendine eleştirmesi sürecidir. Ajan "Burada hata yaptım mı?" veya "Bu çıktı asıl hedefle uyuşuyor mu?" diye sorarak hatalı çıktıları otonom olarak revize eder.

## Mini Senaryo

> Ajan yazdığı kodu çalıştırmadan önce "bu döngü sonsuza gider" diye fark edip düzeltir.

## 📖 Ayrıntılı Açıklama

Öz-Yansıma / Kendi Kendini Düzeltme (Reflexion / Self-Correction), bir ajanın ürettiği çıktıyı (kod, metin, plan veya karar) dışarıya iletmeden önce kendi kendine eleştirip (critique) gerekirse düzelttiği bir muhakeme döngüsüdür. Ajan, ilk taslağını ürettikten sonra "Bunda hata var mı? Hedefle uyuşuyor mu? Daha iyisini yapabilir miyim?" diye sorar ve aldığı yanıta göre çıktıyı revize eder.

Bu kavram önemlidir çünkü LLM'lerin ilk denemesi (first pass) çoğu zaman makul ama kusurludur; küçük mantık hataları, eksik durum kontrolleri veya hedeften sapmalar içerir. Tek bir ileri geçişte (single forward pass) modelin yakaladığı her şeyi düzeltmesi zordur; ama üretilen çıktıyı ayrı bir "eleştirmen" adımında incelemek, modelin kendi hatalarını fark edip düzeltmesine olanak tanır ve doğruluğu belirgin biçimde artırır.

Nasıl çalışır? Tipik döngü: (1) Üretim — ajan göreve bir ilk yanıt üretir; (2) Yansıma/eleştiri — aynı veya başka bir model çıktıyı belirli kriterlere göre eleştirir; mümkünse dış geri bildirim (testleri çalıştırma, derleyici hatası, araç sonucu) kullanır; (3) Düzeltme — ajan eleştiriyi dikkate alarak çıktıyı yeniden yazar; (4) Bu döngü, çıktı kabul edilebilir olana ya da bir tur sınırına ulaşana kadar yinelenir. En güçlü hali, eleştirinin somut bir dış sinyale (örn. başarısız test) dayandığı durumdur.

Ne zaman kullanılır? Doğruluğun önemli olduğu ve hataların ilk bakışta gözden kaçabildiği görevlerde: kod üretimi, matematik, karmaşık akıl yürütme, çok adımlı plan oluşturma. Ne zaman kullanılmaz? Basit, hata payı düşük veya gerçek zamanlı (düşük gecikme şart) görevlerde; her ek tur gecikme ve maliyet ekler.

Tuzaklar: Sınırsız bir öz-düzeltme döngüsü hem maliyeti patlatır hem de bazen iyi bir çıktıyı "düzeltirken" bozar; bir tur sınırı (loop limit) gerekir. Model, dış geri bildirim olmadan kendi hatasını göremeyebilir (kör nokta); mümkünse eleştiriyi gerçek bir sinyale (test, derleyici, doğrulayıcı) bağlamak çok daha etkilidir. Ayrıca aşırı eleştiri, gereksiz değişiklik ve kararsızlık (oscillation) yaratabilir.

## 🎬 Detaylı Senaryo

"KodÜret" adlı bir geliştirici araçları şirketi, doğal dil isteklerinden Python fonksiyonu üreten bir ajan yapıyor; ilk üretilen kod sık sık küçük hatalar içerdiği için bir öz-düzeltme döngüsü ekliyorlar.

1. **İstek:** Kullanıcı "verilen listedeki en büyük ikinci sayıyı döndüren bir fonksiyon yaz" der.
2. **İlk üretim:** Ajan bir fonksiyon üretir, ancak liste tek elemanlıysa hata vereceğini gözden kaçırır.
3. **Test çalıştırma:** Sistem, üretilen kodu hazır birim testleriyle (unit tests) çalıştırır; tek elemanlı liste testi başarısız olur.
4. **Yansıma:** Ajana başarısız test çıktısı geri verilir ve "bu hatayı analiz et" denir.
5. **Hata teşhisi:** Ajan, "kenar durumu (edge case) eksik: liste 2'den az eleman içeriyorsa kontrol yok" tespitini yapar.
6. **Düzeltme:** Ajan fonksiyonu yeniden yazar, eksik kenar durumu için bir kontrol ekler.
7. **Yeniden test:** Testler tekrar çalıştırılır; bu kez hepsi geçer.
8. **Tur sınırı kontrolü:** Sistem en fazla 3 düzeltme turu izin verir; burada 1 turda çözülür.
9. **Teslim:** Doğrulanmış kod kullanıcıya sunulur; tüm yansıma adımları loglanır.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, dış geri bildirime (test sonucu) dayalı bir üret-eleştir-düzelt döngüsünü gösterir.

```python
import anthropic

client = anthropic.Anthropic()

def uret_ve_duzelt(istek: str, test_sonucu_al, maks_tur=3) -> str:
    mesajlar = [{"role": "user", "content": istek}]
    for tur in range(maks_tur):  # döngü sınırı
        yanit = client.messages.create(
            model="claude-opus-4-8", max_tokens=1024, messages=mesajlar,
        )
        kod = "".join(b.text for b in yanit.content if b.type == "text")
        gecti, geri_bildirim = test_sonucu_al(kod)  # dış sinyal (testler)
        if gecti:
            return kod
        # Yansıma: başarısız sonucu geri besle
        mesajlar += [
            {"role": "assistant", "content": kod},
            {"role": "user", "content": f"Testler başarısız: {geri_bildirim}. Hatayı düzelt."},
        ]
    return kod  # tur sınırına ulaşıldı
```

İkinci örnek, dış sinyal olmadan modele kendi çıktısını eleştirtir:

```python
def oz_elestir(taslak: str) -> str:
    yanit = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        system="Aşağıdaki çıktıyı kenar durumları ve mantık hataları açısından eleştir, sonra düzeltilmiş halini ver.",
        messages=[{"role": "user", "content": taslak}],
    )
    return "".join(b.text for b in yanit.content if b.type == "text")
```

## 🔗 İlgili Kavramlar

- [Hizalama ve Anayasal YZ (Alignment & Constitutional AI)](../alignment-constitutional-ai/alignment-constitutional-ai.md) — ilkelere göre öz-eleştiri varyantı
- [Ajan Münazarası (Multi-Agent Debate)](../multi-agent-debate/multi-agent-debate.md) — çok ajanlı eleştiri alternatifi
- [Bütçe / Döngü Sınırı (Budget / Loop Limits)](../budget-loop-limits/budget-loop-limits.md) — düzeltme turlarını sınırlama
- [Değerlendirme Setleri (Evals)](../../01-temel/evals/evals.md) — eleştiriye dış sinyal sağlama
- Düşünce Zinciri (Chain-of-Thought) — adım adım akıl yürütme
