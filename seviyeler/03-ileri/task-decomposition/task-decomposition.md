# Görev Parçalama (Task Decomposition)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 2. Muhakeme ve Planlama

Orkestratör ajanın, kendisine verilen çok bileşenli ve karmaşık hedefi; alt ajanların çözebileceği bağımsız, yönetilebilir küçük görev parçacıklarına bölmesi sürecidir.

## Mini Senaryo

> "Ürün lansmanı yap" hedefi; içerik, e-posta, sosyal medya ve basın alt görevlerine bölünür.

## 📖 Ayrıntılı Açıklama

Görev parçalama (task decomposition), bir orkestratör (orchestrator) ajanın kendisine verilen çok bileşenli ve karmaşık hedefi; daha küçük, bağımsız ve yönetilebilir alt görev parçacıklarına bölmesi sürecidir. "Bütünü tek seferde çözmek yerine, parçalara ayırıp her birini ayrı çözmek" ilkesine dayanır. Bu, hem klasik problem çözmenin hem de modern ajan mimarilerinin temel taşıdır: büyük ve bulanık bir hedef ("ürün lansmanı yap"), somut ve çözülebilir adımlara indirgenir.

Önemi, dil modellerinin ve ajanların büyük, çok yönlü görevlerde tek hamlede zorlanmasından gelir. Karmaşık bir hedef tek bir istemde verildiğinde model adımları atlayabilir, bazı boyutları ihmal edebilir veya tutarsız çıktı üretebilir. Görev parçalama, her parçaya tam odaklanma imkânı tanır; ayrıca parçalar paralelleştirilebilir, ayrı ayrı doğrulanabilir ve gerektiğinde farklı uzman ajanlara dağıtılabilir. Bu, hem kaliteyi hem ölçeklenebilirliği artırır.

Nasıl çalışır: Orkestratör hedefi alır ve onu mantıksal alt görevlere böler. Bu bölme planlı (önceden tüm parçaları çıkarmak) veya kademeli (bir adımı çözüp sonucuna göre sonrakini belirlemek) olabilir. Alt görevler arasındaki bağımlılıklar (hangisi hangisinden önce gelmeli) belirlenir; bağımsız olanlar paralel, bağımlı olanlar sıralı yürütülür. Her alt görev çözüldükten sonra sonuçlar nihai hedefe ulaşmak için birleştirilir.

Ne zaman kullanılır: Hedef çok adımlı, çok boyutlu veya tek bir bağlam penceresine sığmayacak kadar büyükse (rapor üretme, proje planlama, çok aşamalı analiz). Ne zaman uygun değildir: Görev zaten atomik ve tek adımlıysa; gereksiz parçalama yönetim yükü ve gecikme ekler.

Tuzaklar: Hatalı parçalama tüm akışı bozar; parçalar eksik veya örtüşürse sonuç tutarsız olur. Bağımlılıkların yanlış belirlenmesi sıralama hatalarına veya kilitlenmeye yol açar. Aşırı ince parçalama (over-decomposition) koordinasyon maliyetini şişirir. Parçaları birleştirme adımı ihmal edilirse, doğru çözülmüş parçalar bütünleşik bir sonuca dönüşemez.

## 🎬 Detaylı Senaryo

"YeniÜrünA.Ş." adlı bir teknoloji firması, yeni akıllı saatinin lansmanını yönetmek için bir orkestratör ajan kullanıyor. Hedef tek cümle ama içi çok dolu: "30 gün içinde ürün lansmanını gerçekleştir."

1. Orkestratör ajan bu geniş hedefi alıp parçalamaya başlıyor.
2. Hedefi ana alt görevlere bölüyor: içerik üretimi, e-posta kampanyası, sosyal medya planı, basın bülteni ve lansman etkinliği.
3. Her ana alt görevi gerekiyorsa daha küçük parçalara ayırıyor; örneğin "içerik üretimi" → blog yazısı, ürün sayfası metni, tanıtım videosu senaryosu.
4. Alt görevler arası bağımlılıkları belirliyor: basın bülteni, ürün sayfası metni hazır olmadan yazılamaz.
5. Bağımsız görevleri (sosyal medya planı ile e-posta taslağı) paralel başlatıyor.
6. Bağımlı görevleri sıraya koyuyor: önce ürün sayfası, sonra ona dayanan basın bülteni.
7. Her alt görevi uygun bir işçi ajana veya araca atıyor.
8. Bir alt görev (video senaryosu) gecikince orkestratör bağımlı adımları yeniden zamanlıyor.
9. Tüm parçalar tamamlanınca orkestratör sonuçları birleştirip tutarlı bir lansman planına dönüştürüyor.
10. Nihai plan onaya sunuluyor; her parçanın durumu ve sorumlusu izlenebilir bir tabloda görünüyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, bir hedefin alt görevlere bölünüp bağımlılık sırasına göre yürütülmesini gösterir.

```python
def parcalayip_yurut(hedef: str) -> dict:
    """Hedefi alt görevlere böler ve bağımlılık sırasına göre çözer."""
    alt_gorevler = [
        {"ad": "urun_sayfasi", "bagimli": []},
        {"ad": "basin_bulteni", "bagimli": ["urun_sayfasi"]},  # sayfaya bağlı
        {"ad": "sosyal_medya", "bagimli": []},                  # bağımsız
    ]
    sonuc = {}
    for g in topolojik_sirala(alt_gorevler):       # bağımlılıkları sırala
        sonuc[g["ad"]] = coz(g, sonuc)             # gerekirse önceki sonuçları kullan
    return sonuc
```

İkinci örnek, parçalamanın kendisini bir LLM'e yaptırır; model karmaşık hedefi alt görevlere böler.

```python
import anthropic
client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    thinking={"type": "adaptive"},
    messages=[{"role": "user", "content":
        "Şu hedefi bağımsız, yürütülebilir alt görevlere böl ve aralarındaki "
        "bağımlılıkları belirt: 'Yeni akıllı saatin lansmanını yap.'"}])
# Modelin ürettiği alt görev listesi, orkestratör tarafından işçilere dağıtılır.
```

## 🔗 İlgili Kavramlar

- [Yönetici-İşçi (Supervisor / Manager-Worker)](../supervisor-manager-worker/supervisor-manager-worker.md) — parçalanan görevleri işçilere dağıtan desen.
- [Yönlendirme (Routing)](../routing/routing.md) — alt görevleri uygun ajana iletme.
- [Çıkarım Motoru (Reasoning Engine)](../reasoning-engine/reasoning-engine.md) — parçalama kararlarını işleten muhakeme.
- [Düşünce Ağacı (Tree of Thoughts)](../tree-of-thoughts/tree-of-thoughts.md) — alt problemleri dallandırarak keşfetme.
- Planlama (Planning) — alt görevleri sıraya ve zamana yerleştirme.
