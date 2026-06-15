# Çoklu Ajan (Multi-Agent)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Karmaşık ve çok katmanlı sorunları çözmek için birden fazla otonom ajanın birlikte çalıştığı işbirlikçi sistemlerdir. Her ajan kendi uzmanlığına odaklanırken sistem bütünü tek bir ajanın kapasitesini aşan görevleri başarır.

## Mini Senaryo

> Bir araştırmada bir ajan kaynak toplar, biri özetler, biri de doğruluğu kontrol eder.

## 📖 Ayrıntılı Açıklama

Çoklu ajan (multi-agent) sistemleri, tek bir büyük dil modeli (large language model) örneğinin tüm görevi tek başına üstlenmesi yerine, her biri belirli bir role veya uzmanlığa sahip birden fazla otonom ajanın işbirliği yaptığı mimarilerdir. Tıpkı bir insan ekibinde proje yöneticisi, araştırmacı ve editörün farklı sorumluluklar taşıması gibi, burada da her ajanın kendi sistem istemi (system prompt), araç seti (tool set) ve hedefi vardır. Bu ajanlar birbirleriyle mesajlaşarak veya bir koordinatör (orchestrator) üzerinden ortak bir hedefe doğru ilerler.

Bu yaklaşım önemlidir çünkü tek bir ajana çok sayıda araç, çok geniş bir bağlam ve birbirinden farklı sorumluluklar yüklemek hem doğruluğu düşürür hem de bakımı zorlaştırır. Görevleri uzmanlaşmış ajanlara bölmek; her ajanın bağlam penceresini (context window) odaklı tutar, istemleri sade tutar ve hata ayıklamayı kolaylaştırır. Ayrıca paralelleştirme (parallelization) sayesinde birbirinden bağımsız alt görevler aynı anda yürütülebilir, bu da gecikmeyi (latency) azaltır.

Çalışma mantığı genellikle iki desende toplanır. Birincisi "orkestratör-işçi" (orchestrator-worker) desenidir: bir yönetici ajan görevi alt parçalara böler, her parçayı bir işçi ajana atar ve sonuçları birleştirir. İkincisi ise eşler arası (peer-to-peer) ya da boru hattı (pipeline) desenidir: ajanlar bir zincir hâlinde çıktıyı birbirine devreder. Hangi deseni seçeceğiniz görevin paralelleşebilir mi yoksa sıralı mı olduğuna bağlıdır.

Çoklu ajan mimarisi; geniş kapsamlı araştırma, kod üretimi gibi çok aşamalı işler ve farklı uzmanlık alanları gerektiren görevlerde tercih edilir. Buna karşılık basit, tek adımlı sorularda gereksizdir; ek ajanlar ek model çağrısı, ek maliyet ve ek gecikme demektir. "Önce tek ajanla dene, ancak gerçekten gerekiyorsa böl" yaklaşımı sağlıklıdır.

Dikkat edilmesi gereken tuzaklar: Ajanlar arası iletişim kontrolden çıkarsa sonsuz mesaj döngüleri ve maliyet patlaması yaşanabilir; bu yüzden adım/bütçe sınırları koyun. Sorumlulukların net ayrılmaması ajanların aynı işi tekrar yapmasına yol açar. Ayrıca hata yayılımı (error propagation) riski vardır: zincirin başındaki bir ajanın halüsinasyonu (hallucination) sonraki ajanlar tarafından doğru kabul edilebilir; bu nedenle bir doğrulayıcı ajan eklemek faydalıdır.

## 🎬 Detaylı Senaryo

Bir hukuk teknolojisi firması olan "LexAjanT", müvekkilleri için içtihat araştırması yapan bir çoklu ajan sistemi kuruyor.

1. Kullanıcı, "Uzaktan çalışan bir personelin haksız feshine dair son emsal kararları araştır" görevini sisteme verir.
2. Koordinatör ajan (orchestrator) görevi üç alt göreve böler: kaynak toplama, özetleme ve doğrulama.
3. Araştırmacı ajan, hukuk veritabanı araçlarını çağırarak ilgili 12 kararı toplar ve ham metinleri ortak duruma yazar.
4. Koordinatör, toplanan kararları üç ayrı özetleyici işçi ajana paralel olarak dağıtır; her ajan kendi grubundaki kararları özetler. Bu paralelleştirme sayesinde işlem süresi belirgin biçimde kısalır.
5. Özetler birleştirildikten sonra koordinatör, çıktıyı bir doğrulayıcı (verifier) ajana gönderir.
6. Doğrulayıcı ajan her atıfı orijinal metinle karşılaştırır ve bir özetin var olmayan bir karar numarasına atıf yaptığını (halüsinasyon) tespit eder.
7. Bu hatalı bölüm araştırmacı ajana geri gönderilir; doğru karar yeniden çekilir ve özetlenir.
8. Koordinatör nihai, doğrulanmış raporu derler ve kullanıcıya tek bir belge olarak sunar.
9. Tüm ajan etkileşimleri ve mesajlar gözlemlenebilirlik (observability) sistemine kaydedilir; böylece hangi ajanın ne zaman ne yaptığı sonradan denetlenebilir.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki Python örneği, bir koordinatörün iki uzman ajanı (araştırmacı ve özetleyici) ardışık olarak çağırdığı minimal bir orkestrasyon desenini gösterir.

```python
import anthropic

client = anthropic.Anthropic()

def ajan_calistir(sistem_istemi: str, gorev: str) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        system=sistem_istemi,
        messages=[{"role": "user", "content": gorev}],
    )
    return resp.content[0].text

# Araştırmacı ajan ham bulguları toplar
bulgular = ajan_calistir(
    "Sen bir araştırmacı ajansın. Verilen konuda anahtar noktaları madde madde çıkar.",
    "Uzaktan çalışmanın verimlilik üzerindeki etkileri nelerdir?",
)

# Özetleyici ajan bulguları kısa bir özete dönüştürür
ozet = ajan_calistir(
    "Sen bir editör ajansın. Verilen notları 3 cümlelik özete dönüştür.",
    bulgular,
)
print(ozet)
```

Aşağıdaki YAML ise bir orkestratör-işçi yapılandırmasının bildirimsel (declarative) biçimini gösterir.

```yaml
orkestrator:
  hedef: "icithat_arastirmasi"
  isciler:
    - ad: arastirmaci
      rol: "kaynak_topla"
      araclar: [veritabani_sorgu]
    - ad: ozetleyici
      rol: "metinleri_ozetle"
    - ad: dogrulayici
      rol: "atiflari_kontrol_et"
  akis: [arastirmaci, ozetleyici, dogrulayici]
```

## 🔗 İlgili Kavramlar

- [Ajan Protokolleri (Agent Protocols)](../agent-protocols/agent-protocols.md) — ajanların standart biçimde iletişim kurmasını sağlar.
- [Görev Durumu (Task State)](../task-state/task-state.md) — ajanların paylaşılan ilerlemeyi takip etmesini sağlar.
- [Araç Kullanımı (Tool Use)](../tool-use/tool-use.md) — her ajanın dış sistemlerle etkileşmesini sağlar.
- [Halüsinasyon (Hallucination)](../hallucination/hallucination.md) — doğrulayıcı ajanların önlemeye çalıştığı temel risktir.
- [Gözlemlenebilirlik (Observability)](../observability/observability.md) — ajanlar arası akışı izlemek için gereklidir.
- Orkestrasyon (orchestration) — ajanları koordine eden üst düzey desen.
