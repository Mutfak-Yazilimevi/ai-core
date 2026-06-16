# Düşünce Ağacı (Tree of Thoughts (ToT))

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 2. Muhakeme ve Planlama

Birden çok muhakeme dalını paralel olarak keşfedip en umut verici yolu seçerek ilerleme yöntemidir. CoT'nin ağaç biçiminde genelleştirilmiş hâlidir.

## Mini Senaryo

> Bir bulmacada ajan 3 farklı başlangıç hamlesini dener, çıkmaza gireni bırakıp en iyisini seçer.

## 📖 Ayrıntılı Açıklama

Düşünce Ağacı (Tree of Thoughts, ToT), bir problemi çözerken tek bir düşünce zinciri yerine birden çok muhakeme dalını (branch) bir ağaç yapısında keşfedip, en umut verici yolu seçerek ilerleyen bir muhakeme yöntemidir. Düşünce Zinciri'nin (Chain-of-Thought, CoT) ağaç biçiminde genelleştirilmiş hâlidir: CoT tek bir doğrusal yol izlerken, ToT her adımda birden çok olası "düşünce" üretir, bunları değerlendirir ve umut vermeyen dalları budayarak (pruning) en iyi dalda derinleşir. Böylece model, geri dönüş (backtracking) ve keşif (exploration) yeteneği kazanır.

Önemi, tek yönlü muhakemenin tıkandığı problemlerde ortaya çıkar. CoT bir adımda yanlış bir yöne saparsa, geri dönemez ve hatalı sonuca kilitlenir. ToT ise birden çok başlangıç ve ara hamleyi paralel değerlendirdiği için, çıkmaza giren dalı bırakıp daha iyi bir dala geçebilir. Bu, planlama, bulmaca çözme, oyun benzeri arama ve birden çok geçerli yolun olduğu yaratıcı görevlerde belirgin avantaj sağlar.

Nasıl çalışır: Problem bir ağaç olarak ele alınır; kök başlangıç durumudur. Her düğümde model birkaç olası sonraki adım ("düşünce") üretir (genişletme / expansion). Bir değerlendirme fonksiyonu her dalı puanlar (bu dal çözüme ne kadar yakın?). Arama stratejisi (genişlik öncelikli / BFS veya derinlik öncelikli / DFS) en umut verici dalları seçip ilerletir, zayıf dalları budar. Bir dal çözüme ulaşınca veya bütçe dolunca en iyi yol seçilir.

Ne zaman kullanılır: Çözümün araştırma, deneme-yanılma ve geri dönüş gerektirdiği, tek doğrusal muhakemenin yetersiz kaldığı karmaşık problemlerde. Ne zaman uygun değildir: Basit, tek adımlı veya doğrusal görevlerde; ToT'nin getirdiği çoklu üretim ve değerlendirme maliyeti (token ve gecikme) gereksiz olur.

Tuzaklar: Maliyet hızla artar; her düğümde birden çok dal üretmek üstel (exponential) büyümeye yol açabilir, bu yüzden budama ve dal/derinlik sınırı şarttır. Değerlendirme fonksiyonunun kalitesi kritiktir; dalları yanlış puanlarsa iyi yol budanır, kötü yol derinleştirilir. Aşırı keşif yavaşlatır, az keşif ToT'nin avantajını yok eder; dengeyi kurmak gerekir.

## 🎬 Detaylı Senaryo

"OyunZekası" adlı bir ekip, sayı yerleştirme bulmacalarını (örneğin "24 oyunu": dört sayıyla 24'e ulaşma) çözen bir ajan geliştiriyor. Tek yönlü muhakeme sık sık çıkmaza girdiği için ToT'ye geçiyorlar.

1. Ajana "4, 6, 8, 2 sayılarıyla 24 elde et" problemi veriliyor.
2. Ajan kök düğümde üç farklı başlangıç hamlesi üretiyor: (4×6), (8−2), (6+2).
3. Bir değerlendirici her dalı "24'e ulaşma umudu" açısından puanlıyor; (4×6=24) en yüksek puanı alıyor çünkü hedefe çok yakın.
4. (8−2=6) dalı düşük puan alıyor ama tümüyle elenmiyor; çünkü kalan sayılarla hâlâ yol olabilir.
5. Ajan en umut verici daldan ilerliyor: (4×6=24) sonrası kalan 8 ve 2'yi nötrlemesi gerekiyor.
6. Bu dalda (8−2=6) gibi denemeler 24'ü bozuyor; dal çıkmaza giriyor ve budanıyor.
7. Ajan geri dönüp ikinci en iyi dala geçiyor: (6+2=8), ardından (8−4)... çeşitli kombinasyonları deniyor.
8. Sonunda bir dal geçerli bir çözüme ulaşıyor: (8−6)×... gibi adımlarla 24'e varan tam ifade bulunuyor.
9. Ajan keşfedilen tüm dallar arasından çözüme ulaşan en kısa/temiz yolu nihai cevap olarak seçiyor.
10. Ekip, ToT öncesi (tek zincir) ve sonrası başarı oranını karşılaştırıp belirgin artışı doğruluyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, ToT'nin kavramsal arama akışını gösterir: dallar üretilir, puanlanır ve en iyileri genişletilir.

```python
def dusunce_agaci(durum, genislet, degerlendir, k=2, derinlik=3):
    """Her adımda dallar üretip puanlayarak en iyi k dalı genişletir."""
    sinir = [durum]
    for _ in range(derinlik):
        adaylar = [yeni for d in sinir for yeni in genislet(d)]   # genişletme
        adaylar.sort(key=degerlendir, reverse=True)               # puanla
        sinir = adaylar[:k]                                       # zayıf dalları buda
        for d in sinir:
            if cozuldu(d):
                return d
    return max(sinir, key=degerlendir)  # en umut verici yolu döndür
```

İkinci örnek, dal üretme ve değerlendirme için bir LLM kullanır; modelden adaptif düşünme istenir.

```python
import anthropic
client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    thinking={"type": "adaptive"},
    messages=[{"role": "user", "content":
        "'4, 6, 8, 2 ile 24 yap' problemi için 3 farklı başlangıç hamlesi öner, "
        "her birinin çözüme yakınlığını puanla ve en umut vereni seç."}])
# Modelin önerdiği dallar değerlendirilip en iyisi derinleştirilir.
```

## 🔗 İlgili Kavramlar

- [Öz-Tutarlılık (Self-Consistency)](../self-consistency/self-consistency.md) — birden çok muhakemeyi toplulaştıran akraba teknik.
- [Çıkarım Motoru (Reasoning Engine)](../reasoning-engine/reasoning-engine.md) — dalların değerlendirildiği muhakeme çekirdeği.
- [Görev Parçalama (Task Decomposition)](../task-decomposition/task-decomposition.md) — problemi alt adımlara bölme.
- Düşünce Zinciri (Chain-of-Thought) — ToT'nin doğrusal, tek dallı temeli.
- Budama (Pruning) — umut vermeyen dalları eleme stratejisi.
