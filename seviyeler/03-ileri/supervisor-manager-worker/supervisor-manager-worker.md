# Yönetici-İşçi (Supervisor / Manager-Worker)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Bir yönetici ajanın görevleri parçalayıp işçi ajanlara dağıttığı ve sonuçları birleştirdiği hiyerarşik koordinasyon desenidir.

## Mini Senaryo

> Yönetici ajan bir kitabı bölümlere ayırıp her bölümü farklı işçi ajana yazdırır, sonra birleştirir.

## 📖 Ayrıntılı Açıklama

Yönetici-İşçi (Supervisor / Manager-Worker), bir yönetici ajanın (supervisor) karmaşık bir hedefi alt görevlere bölüp, bu görevleri uzman işçi ajanlara (worker) dağıttığı ve ardından sonuçlarını toplayıp birleştirdiği hiyerarşik bir çoklu ajan koordinasyon desenidir. Yönetici "ne yapılacağına" ve "kimin yapacağına" karar verir; işçiler ise kendilerine verilen dar ve net görevi yürütür. İnsan organizasyonlarındaki proje yöneticisi-ekip ilişkisinin doğrudan bir yansımasıdır.

Önemi, tek bir ajanın baş edemeyeceği büyük ve çok boyutlu görevleri yönetilebilir kılmasıdır. Tek bir ajana her şeyi yaptırmak hem bağlam penceresini zorlar hem de uzmanlaşmayı engeller. Bu desen, işi parçalara ayırarak her parçayı o işe en uygun işçiye verir; işçiler paralel çalışabildiğinden hız artar, sorumluluk netleşir ve her işçi dar görevinde daha yüksek kalite üretir. Yönetici ise bütünü görür ve tutarlılığı sağlar.

Nasıl çalışır: Yönetici hedefi alır, alt görevlere böler (görev parçalama / task decomposition), her alt görevi uygun işçiye atar (gerekirse yönlendirme/routing kullanır). İşçiler görevlerini bağımsız yürütüp sonuçlarını yöneticiye döndürür. Yönetici sonuçları doğrular, birleştirir (synthesis) ve gerekirse eksik/hatalı parçalar için işçilere yeniden görev verir. Sonunda bütünleşik nihai çıktıyı üretir.

Ne zaman kullanılır: Görev birden çok bağımsız alt parçaya ayrılabiliyorsa, farklı uzmanlık alanları gerekiyorsa ve paralellikten fayda sağlanacaksa (rapor üretme, çok bölümlü içerik, çok kaynaklı araştırma). Ne zaman uygun değildir: Görev küçük, tek parça veya adımları birbirine sıkı bağımlıysa; koordinasyon ek yükü (overhead) faydadan büyük olabilir.

Tuzaklar: Yöneticinin işi kötü bölmesi tüm akışı bozar (yanlış parçalama). İşçi sonuçlarını birleştirme adımı zor olabilir; tutarsız parçalar (çelişen üsluplar, mükerrer içerik) ortaya çıkabilir. İşçiler arası bağımlılıklar yönetilmezse kilitlenme veya yanlış sıralama olur. Yönetici darboğaza (bottleneck) dönüşebilir. Maliyet, çalışan ajan sayısıyla artar.

## 🎬 Detaylı Senaryo

"İçerikFabrikası" adlı bir ajans, müşterileri için kapsamlı pazar araştırma raporları üreten bir ajan sistemi kuruyor. Tek bir ajan tüm raporu üretmekte zorlandığı için yönetici-işçi desenine geçiyorlar.

1. Müşteri "elektrikli araç pazarı için kapsamlı bir rapor istiyorum" talebini veriyor.
2. Yönetici ajan hedefi alıp alt görevlere bölüyor: pazar büyüklüğü, rakip analizi, tüketici eğilimleri, düzenleyici ortam, sonuç ve öneriler.
3. Yönetici her alt görevi uygun işçi ajana atıyor; örneğin rakip analizini "rekabet araştırma" işçisine, düzenlemeleri "hukuki araştırma" işçisine veriyor.
4. İşçi ajanlar paralel çalışmaya başlıyor; her biri yalnızca kendi dar bölümüne odaklanıyor.
5. Pazar büyüklüğü işçisi verileri toplayıp özet üretiyor; rakip işçisi başlıca oyuncuları tabloya döküyor.
6. Bir işçi yetersiz veri döndürünce yönetici sonucu reddedip ek kaynak talebiyle görevi yeniden atıyor.
7. Tüm işçiler bölümlerini tamamlayınca sonuçlarını yöneticiye döndürüyor.
8. Yönetici parçaları birleştiriyor; üslubu tekleştiriyor, mükerrer bilgileri ayıklıyor, bölümler arası tutarlılığı sağlıyor.
9. Yönetici bütünleşik raporu son bir kalite kontrolünden geçirip nihai çıktıyı oluşturuyor.
10. Rapor müşteriye teslim ediliyor; her bölümün hangi işçi tarafından üretildiği iz olarak kaydediliyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, desenin kavramsal akışını gösterir: yönetici görevleri böler, işçilere dağıtır ve sonuçları birleştirir.

```python
def yonetici(hedef: str, isciler: dict) -> str:
    """Hedefi alt görevlere bölüp işçilere dağıtır ve sonuçları birleştirir."""
    alt_gorevler = gorev_parcala(hedef)          # ör. {'rakip': ..., 'pazar': ...}
    sonuclar = {}
    for ad, gorev in alt_gorevler.items():
        sonuclar[ad] = isciler[ad].calistir(gorev)  # her işçi kendi görevini yapar
    return birlestir(sonuclar)                    # parçaları tek çıktıda topla

rapor = yonetici("EV pazar raporu", {"rakip": rakip_isci, "pazar": pazar_isci})
```

İkinci örnek, bir işçi ajanın dar görevini bir LLM çağrısıyla yürütmesini gösterir.

```python
import anthropic
client = anthropic.Anthropic()

def rakip_analizi_iscisi(gorev: str) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=2048,
        system="Sen yalnızca rakip analizi yapan bir uzman ajanısın.",
        messages=[{"role": "user", "content": gorev}])
    return resp.content[0].text  # yöneticiye dönecek bölüm çıktısı
```

## 🔗 İlgili Kavramlar

- [Görev Parçalama (Task Decomposition)](../task-decomposition/task-decomposition.md) — yöneticinin hedefi alt görevlere bölme adımı.
- [Yönlendirme (Routing)](../routing/routing.md) — alt görevleri uygun işçiye atama mekanizması.
- [Semantik Yönlendirme (Semantic Routing)](../semantic-routing/semantic-routing.md) — görev atamasını anlamla yapma.
- Orkestrasyon (Orchestration) — çoklu ajanları koordine etmenin genel kavramı.
- Sonuç Birleştirme (Synthesis / Aggregation) — işçi çıktılarını tek sonuçta toplama.
