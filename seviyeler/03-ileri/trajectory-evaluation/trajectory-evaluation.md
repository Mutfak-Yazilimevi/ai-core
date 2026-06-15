# Yörünge Değerlendirmesi (Trajectory Evaluation)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 10. Değerlendirme ve Kalite

Yalnızca nihai sonucu değil; ajanın hedefe giderken izlediği adımların (araç çağrıları, kararlar) tümünü değerlendirme yaklaşımıdır. Ajanın "doğru yanıta yanlış yoldan" ulaşmasını tespit eder.

## Mini Senaryo

> Ajan doğru cevabı bulsa da 5 gereksiz arama yaptıysa, yörünge değerlendirmesi bunu işaretler.

## 📖 Ayrıntılı Açıklama

Yörünge değerlendirmesi (trajectory evaluation), bir ajanı yalnızca ürettiği nihai sonuca göre değil; hedefe ulaşırken izlediği adımların tümüne (araç çağrıları / tool calls, ara kararlar, muhakeme adımları) bakarak değerlendirme yaklaşımıdır. "Yörünge" (trajectory), ajanın başlangıçtan sona attığı adımların sıralı dizisidir. Bu yaklaşım, "doğru yanıta yanlış yoldan" ulaşan bir ajanı tespit eder; çünkü doğru cevap her zaman iyi bir sürecin kanıtı değildir.

Önemi, ajan kalitesinin yalnızca sonuçla ölçülemeyeceği gerçeğinden gelir. Bir ajan şans eseri doğru cevaba ulaşabilir, ama bunu yaparken 5 gereksiz arama yapmış, pahalı araçları boşuna çağırmış veya tehlikeli bir ara adım denemiş olabilir. Sonuç odaklı değerlendirme bunları gizler; yörünge değerlendirmesi ise verimliliği, güvenliği ve mantıksal tutarlılığı görünür kılar. Bu, üretime alınmadan önce ajanın gerçekten "sağlam akıl yürütüp yürütmediğini" anlamanın tek yoludur.

Nasıl çalışır: Ajanın çalışması sırasında her adım (hangi araç çağrıldı, hangi girdiyle, ne döndü, hangi karar verildi) kaydedilir. Sonra bu yörünge bir değerlendirici tarafından incelenir: adımlar gerekli miydi, sıra mantıklı mıydı, gereksiz/tekrarlı/riskli adım var mıydı, en kısa yol izlendi mi? Değerlendirici kural tabanlı olabilir (örneğin "aynı arama iki kez yapıldıysa işaretle") veya bir LLM-yargıç (LLM-as-judge) yörüngeyi bütünsel olarak puanlayabilir.

Ne zaman kullanılır: Araç kullanan, çok adımlı ajanların geliştirilmesi ve değerlendirilmesinde; özellikle verimlilik (maliyet, gecikme) ve güvenlik kritikse. Ne zaman daha az gerekir: Tek adımlı, araçsız, yalnızca metin üreten basit görevlerde yörünge zaten kısa olduğundan sonuç değerlendirmesi çoğu zaman yeterlidir.

Tuzaklar: "Doğru" yörünge tanımı her zaman net değildir; bazen birden çok geçerli yol vardır, bu yüzden aşırı katı puanlama geçerli çeşitliliği cezalandırır. Yörünge kayıtları hızla devasa boyuta ulaşır; neyin kaydedileceğini seçmek gerekir. LLM-yargıç kullanılırsa, yargıcın kendisi tutarsız puanlayabilir. Yalnızca yörüngeye odaklanıp sonucu göz ardı etmek de hata olur; ikisi birlikte değerlendirilmelidir.

## 🎬 Detaylı Senaryo

"AraştırmaBot" adlı bir şirket, web'de araştırma yapıp özet çıkaran bir ajanı üretime almadan önce değerlendiriyor. İlk testlerde ajan doğru cevaplar veriyor ama maliyet beklenenden yüksek.

1. Değerlendirme ekibi 50 örnek soru için ajanı çalıştırıp her birinin tam yörüngesini (araç çağrıları, kararlar) kaydediyor.
2. Bir soruda ajan doğru cevaba ulaşıyor; sonuç odaklı bakışta "başarılı" görünüyor.
3. Ekip yörüngeyi açıp inceliyor ve ajanın aynı web aramasını farklı kelimelerle 5 kez tekrarladığını fark ediyor.
4. Bu tekrarlar maliyeti ve gecikmeyi artırmış, sonuca hiçbir katkı sağlamamış.
5. Başka bir yörüngede ajan, gerekli olmayan pahalı bir özetleme aracını boş yere çağırmış.
6. Bir diğerinde ajan önce yanlış kaynağa gidip çıkmaza girmiş, sonra doğru yola dönmüş; sonuç doğru ama yol verimsiz.
7. Ekip bir değerlendirici kuruyor: yörüngedeki tekrarlı aramaları, gereksiz araç çağrılarını ve çıkmaz dalları otomatik işaretliyor.
8. Bir LLM-yargıç da her yörüngeyi "verimlilik" ve "mantıksal tutarlılık" boyutlarında puanlıyor.
9. Bulgulara göre ajanın istem ve araç seçim mantığı iyileştiriliyor; tekrarlı aramaları önleyen bir önbellek ekleniyor.
10. Yeniden değerlendirmede sonuç doğruluğu korunurken ortalama adım sayısı ve maliyet belirgin düşüyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, bir yörüngeyi kural tabanlı inceleyip verimsizlikleri işaretler.

```python
def yorunge_degerlendir(yorunge: list[dict]) -> dict:
    """Adımları inceleyip tekrarlı/gereksiz çağrıları işaretler."""
    bayraklar = []
    gorulen_aramalar = set()
    for adim in yorunge:
        if adim["arac"] == "web_arama":
            if adim["sorgu"] in gorulen_aramalar:
                bayraklar.append(f"Tekrarlı arama: {adim['sorgu']}")
            gorulen_aramalar.add(adim["sorgu"])
    return {"adim_sayisi": len(yorunge), "bayraklar": bayraklar}
```

İkinci örnek, yörüngeyi bütünsel olarak puanlamak için bir LLM-yargıç kullanır.

```python
import anthropic
client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=512,
    messages=[{"role": "user", "content":
        "Aşağıdaki ajan yörüngesini (araç çağrıları ve kararlar) verimlilik ve "
        "mantıksal tutarlılık açısından 1-10 puanla ve gereksiz adımları listele:\n"
        "<yörünge buraya>"}])
# Yargıcın puanı ve gerekçesi, ajanın iyileştirilmesi için geri besleme olur.
```

## 🔗 İlgili Kavramlar

- [Durum Makinesi / FSM (State Machine / FSM)](../state-machine-fsm/state-machine-fsm.md) — geçerli adım yollarını kısıtlayan tamamlayıcı yapı.
- [Çıkarım Motoru (Reasoning Engine)](../reasoning-engine/reasoning-engine.md) — değerlendirilen muhakeme adımlarını üreten çekirdek.
- [Öz-Tutarlılık (Self-Consistency)](../self-consistency/self-consistency.md) — sonuç güvenilirliğini artıran akraba değerlendirme fikri.
- LLM-Yargıç (LLM-as-Judge) — yörüngeyi puanlayan değerlendirme yöntemi.
- Gözlemlenebilirlik (Observability) — adımları kaydedip izleme altyapısı.
