# Çıkarım Motoru (Reasoning Engine)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 1. Temeller ve Çalışma Modeli

Ajanın salt metin (token) üretmekle kalmayıp; mantıksal çıkarım yaptığı, kuralları uyguladığı ve karar ağaçlarını işlettiği temel bilişsel altyapıdır.

## Mini Senaryo

> Ajan, "bütçe aşıldıysa onay iste" kuralını çıkarım motoruyla değerlendirip karar verir.

## 📖 Ayrıntılı Açıklama

Çıkarım motoru (reasoning engine), bir ajanın yalnızca metin (token) üretmekle kalmayıp; mantıksal adımlar atması, kuralları uygulaması, koşulları değerlendirmesi ve karar vermesi sürecini işleten kavramsal çekirdektir. Klasik anlamda bu, kural tabanlı sistemlerdeki (rule-based system) çıkarım mekanizmasını ifade eder; modern ajan mimarilerinde ise büyük dil modelinin (LLM) muhakeme yeteneği ile dış mantık katmanının birleşiminden oluşur. "Düşünme" eyleminin gerçekleştiği yerdir.

Önemi, bir ajanı basit bir sohbet botundan (chatbot) ayıran şeyin tam da bu olmasından gelir. Soruyu yanıtlamak ile bir hedefe ulaşmak için adımları planlayıp koşulları yoklamak farklı yetkinliklerdir. Çıkarım motoru, "eğer bütçe aşıldıysa onay iste, aksi halde ödemeyi yap" gibi koşullu mantığı güvenilir biçimde işletir. Bu güvenilirlik, finans, sağlık ve hukuk gibi hata toleransı düşük alanlarda kritiktir.

Nasıl çalıştığı iki ana yaklaşımla açıklanabilir. Birincisi sembolik (symbolic) yaklaşımdır: önceden tanımlı kurallar ve gerçekler bir motora verilir, motor ileri zincirleme (forward chaining) veya geri zincirleme (backward chaining) ile sonuç türetir; deterministiktir ve açıklanabilir. İkincisi sinirsel (neural) yaklaşımdır: LLM, doğal dildeki bağlamdan adım adım muhakeme üretir (örneğin düşünce zinciri / chain-of-thought). Pratikte en sağlam sistemler ikisini birleştirir (nöro-sembolik / neuro-symbolic): LLM esnek yorumlama yapar, sembolik katman ise kritik kuralların kesin uygulanmasını garanti eder.

Ne zaman kullanılır: çok adımlı karar, koşullu iş akışı veya kuralların kesinlikle uygulanması gereken her senaryoda. Ne zaman tek başına LLM'e güvenmek riskli olur: sayısal eşikler, yasal zorunluluklar veya tutarlılık gerektiren kararlarda; bu durumlarda kuralları kod/sembolik katmana taşımak gerekir, çünkü LLM olasılıksaldır (probabilistic) ve aynı girdiye farklı yanıt verebilir.

Tuzaklar: LLM'in "muhakeme ediyormuş gibi" görünen ama aslında uydurma (hallucination) gerekçeler üretmesi; karmaşık kural setlerinde modelin adımları atlaması; ve deterministik beklenen kararların olasılıksal modele bırakılması. Bu yüzden kritik mantık ayrı doğrulanmalı, mümkünse sembolik olarak sabitlenmeli ve muhakeme adımları kaydedilip denetlenmelidir.

## 🎬 Detaylı Senaryo

"LojiTakip" adlı bir lojistik şirketi, satın alma taleplerini otonom değerlendiren bir ajan kuruyor. Ajanın görevi, gelen talepleri bütçe, yetki ve tedarikçi kurallarına göre onaylamak veya üst makama yönlendirmek.

1. Satın alma ekibinden Mehmet, "Yeni depo için 12 adet forklift aküsü, toplam 18.000 TL" talebini sisteme giriyor.
2. Ajan talebi alıyor ve çıkarım motoruna iletiyor; motor önce bağlamı topluyor: departman bütçesi kalanı, talep tutarı, talep edenin yetki seviyesi.
3. Motor ilk kuralı yokluyor: "Tutar departman bütçesinin kalan limitini aşıyor mu?" Kalan limit 15.000 TL olduğu için koşul doğru çıkıyor.
4. Bu koşul tetiklendiğinden ikinci kural devreye giriyor: "Bütçe aşımı varsa finans onayı zorunludur."
5. Motor, üçüncü kuralı da kontrol ediyor: "Talep tutarı 20.000 TL altıysa bölge müdürü yeterli, üstüyse genel müdür gerekir." 18.000 < 20.000 olduğu için onaylayıcı olarak bölge müdürü belirleniyor.
6. Çıkarım motoru nihai kararı veriyor: `onay_iste(makam=bolge_muduru, gerekce="butce_asimi")`.
7. Ajan, bu kararı doğal dile çevirip Mehmet'e açıklıyor: "Talebiniz bütçe limitini aştığı için bölge müdürü onayına gönderildi."
8. Bölge müdürü mobil bildirimle onay verince motor son kuralı işletiyor: "Onay alındıysa siparişi tedarikçiye ilet."
9. Tüm muhakeme adımları (hangi kuralın neden tetiklendiği) bir iz olarak kaydediliyor.
10. Ay sonunda denetimde, her otomatik kararın hangi kurallara dayandığı bu izden adım adım gösterilebiliyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, basit bir kural-temelli çıkarım motorunu Python'da gösterir: gerçekler ve kurallar verilir, motor kararı türetir.

```python
def cikarim_motoru(gercekler: dict, kurallar: list) -> dict:
    """Kuralları sırayla değerlendirip ilk eşleşen kararı döndürür."""
    kararlar = []
    for kural in kurallar:
        if kural["kosul"](gercekler):
            kararlar.append(kural["sonuc"])
    return {"kararlar": kararlar}

kurallar = [
    {"kosul": lambda g: g["tutar"] > g["butce_kalan"], "sonuc": "onay_gerekli"},
    {"kosul": lambda g: g["tutar"] >= 20000, "sonuc": "makam:genel_mudur"},
    {"kosul": lambda g: g["tutar"] < 20000, "sonuc": "makam:bolge_muduru"},
]
print(cikarim_motoru({"tutar": 18000, "butce_kalan": 15000}, kurallar))
# {'kararlar': ['onay_gerekli', 'makam:bolge_muduru']}
```

İkinci örnek, LLM'in muhakemesini sembolik kontrolle birleştirir; modelden adımlarını görünür kılması için adaptif düşünme (adaptive thinking) istenir.

```python
import anthropic
client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    thinking={"type": "adaptive"},
    messages=[{"role": "user", "content":
        "Talep: 18000 TL, bütçe kalanı 15000 TL. Onay gerekli mi? Adım adım açıkla."}])
# Modelin önerisi alınır, ardından kritik 'onay_gerekli' kuralı kodla doğrulanır.
```

## 🔗 İlgili Kavramlar

- [Politika Katmanı (Policy Layer)](../policy-layer/policy-layer.md) — çıkarım motorunun uyguladığı izin/yasak kuralları.
- [Öz-Tutarlılık (Self-Consistency)](../self-consistency/self-consistency.md) — muhakemenin güvenilirliğini artıran teknik.
- [Düşünce Ağacı (Tree of Thoughts)](../tree-of-thoughts/tree-of-thoughts.md) — birden çok muhakeme dalını keşfeden ileri çıkarım.
- Düşünce Zinciri (Chain-of-Thought) — adım adım muhakemenin temel biçimi.
- Nöro-Sembolik Yaklaşım (Neuro-Symbolic) — sinirsel ve sembolik çıkarımın birleşimi.
