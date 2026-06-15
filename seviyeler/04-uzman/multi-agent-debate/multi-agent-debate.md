# Ajan Münazarası (Multi-Agent Debate)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 7. Çoklu Ajan ve Koordinasyon

Birden çok ajanın aynı problem üzerinde tartışarak, birbirinin argümanlarını sınayarak daha doğru bir sonuca yakınsamasıdır.

## Mini Senaryo

> İki ajan bir yatırım kararını savunup eleştirir; tartışma sonunda daha sağlam bir öneri çıkar.

## 📖 Ayrıntılı Açıklama

Ajan Münazarası (Multi-Agent Debate), aynı problem üzerinde çalışan birden çok ajanın (veya aynı modelin farklı kişiliklerinin) sırayla argüman üretip birbirinin gerekçelerini sınadığı ve eleştirdiği, böylece tek bir ajanın ulaşacağından daha doğru ve sağlam bir sonuca yakınsadığı bir koordinasyon desenidir. Fikir, insan münazarasından gelir: karşıt görüşlerin çarpışması zayıf akıl yürütmeleri (reasoning) ortaya çıkarır.

Bu kavram önemlidir çünkü tek bir ajan kendi ilk akıl yürütmesine fazla güvenip hatalı bir varsayımı sonuna kadar taşıyabilir (anchoring/aşırı güven). Münazara, bir ajanın iddiasını başka bir ajanın eleştirmesini zorunlu kılarak körlemesine kabulü kırar; özellikle muhakeme gerektiren, tek doğru cevabı olan ama tuzaklı problemlerde (matematik, mantık, karmaşık karar) doğruluğu artırdığı gösterilmiştir.

Nasıl çalışır? Tipik akış: (1) Her ajan probleme kendi bağımsız yanıtını ve gerekçesini üretir; (2) Ajanlara diğerlerinin yanıtları gösterilir ve "katılıyor musun, neden, yoksa düzeltir misin?" diye sorulur; (3) Bu tur birkaç kez yinelenir (rounds); ajanlar argümanları gördükçe pozisyonlarını günceller; (4) Sonunda ya bir uzlaşıya (consensus) varılır ya da bir hakem (judge) ajan/oylama nihai yanıtı seçer. Tartışma, ajanların eleştiriyle birbirini düzeltmesini sağlar.

Ne zaman kullanılır? Yüksek riskli, doğruluk kritik ve tek bir çağrının hata yapma olasılığının yüksek olduğu kararlarda (yatırım analizi, teşhis, karmaşık plan onayı). Ne zaman kullanılmaz? Basit, tek adımlı veya öznel görevlerde münazara sadece gecikme ve maliyeti katlar; orada tek çağrı yeterlidir.

Tuzaklar: Münazara N ajan × M tur kadar çağrı demektir; maliyet ve gecikme hızla büyür, bir döngü/bütçe sınırı şarttır. Ajanlar aynı modelden geliyorsa aynı kör noktayı paylaşıp yanlışta "uzlaşabilirler" (yankı odası - echo chamber); rolleri farklılaştırmak (örn. "savunan" vs "şüpheci") bunu azaltır. Ayrıca uzlaşı her zaman doğruluk anlamına gelmez; bir doğrulama adımı yararlıdır.

## 🎬 Detaylı Senaryo

"VarlıkYönet" adlı bir yatırım danışmanlığı şirketi, bir hisseye yatırım önerisini tek bir ajana bırakmak yerine, karşıt rollerde iki ajanın münazara etmesini ve bir hakemin karar vermesini istiyor.

1. **Soru:** Sisteme "X teknoloji hissesine şimdi girilmeli mi?" sorusu verilir.
2. **Savunan ajan:** "Boğa" rolündeki ajan, güçlü büyüme ve pazar payına dayanarak "evet, girilmeli" der ve gerekçelerini sıralar.
3. **Eleştiren ajan:** "Ayı" rolündeki ajan bu gerekçeleri inceler; yüksek fiyat/kazanç oranına ve düzenleyici riske işaret ederek itiraz eder.
4. **İkinci tur:** Savunan ajan, eleştiriyi görüp argümanını rafine eder: riski kabul eder ama kademeli giriş önerir.
5. **Karşı yanıt:** Eleştiren ajan kademeli giriş fikrini makul bulur ama zamanlama riskini vurgular.
6. **Yakınsama:** İki ajan, "tam pozisyon yerine kademeli ve stop-loss'lu giriş" noktasında büyük ölçüde uzlaşır.
7. **Hakem ajan:** Üçüncü bir "hakem" ajan tüm tartışmayı okur ve dengeli nihai öneriyi özetler.
8. **Gerekçe kaydı:** Sistem, münazaranın tüm turlarını denetim için loglar; danışman kararın nasıl oluştuğunu görebilir.
9. **Sunum:** Müşteriye hem öneri hem de "lehte/aleyhte" argümanlar şeffaf biçimde sunulur.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, karşıt rollerde iki ajanın birkaç tur tartışıp bir hakemin karar verdiği basit bir münazara döngüsünü gösterir.

```python
import anthropic

client = anthropic.Anthropic()

def ajan(rol: str, baglam: str) -> str:
    yanit = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        system=rol,
        messages=[{"role": "user", "content": baglam}],
    )
    return "".join(b.text for b in yanit.content if b.type == "text")

soru = "X hissesine şimdi girilmeli mi?"
savunan = ajan("Sen iyimser bir yatırım analistisin; lehte argüman üret.", soru)
elestiren = ajan("Sen şüpheci bir risk analistisin; aşağıdaki görüşü eleştir.",
                 f"Soru: {soru}\nSavunma: {savunan}")

hakem = ajan(
    "Sen tarafsız bir hakemsin; iki görüşü tartıp dengeli nihai kararı ver.",
    f"Soru: {soru}\nLehte: {savunan}\nAleyhte: {elestiren}",
)
print(hakem)
```

İkinci örnek, münazarayı maliyet için sınırlı turla yönetir:

```python
MAKS_TUR = 2  # bütçe/döngü sınırı: gecikme ve maliyeti kontrol et
gecmis = soru
for tur in range(MAKS_TUR):
    a = ajan("Lehte argüman üret ve karşı görüşe yanıt ver.", gecmis)
    b = ajan("Aleyhte argüman üret ve son savunmayı eleştir.", gecmis + "\n" + a)
    gecmis += f"\n[Tur {tur+1}] Lehte: {a}\nAleyhte: {b}"
```

## 🔗 İlgili Kavramlar

- [Sürü (Swarm)](../swarm/swarm.md) — merkeziyetsiz çoklu ajan koordinasyonu
- [Kara Tahta Mimarisi (Blackboard)](../blackboard/blackboard.md) — paylaşılan alan üzerinden işbirliği
- [Öz-Yansıma / Kendi Kendini Düzeltme (Reflexion)](../reflexion-self-correction/reflexion-self-correction.md) — tek ajanda öz-eleştiri
- [Bütçe / Döngü Sınırı (Budget / Loop Limits)](../budget-loop-limits/budget-loop-limits.md) — tur sayısını sınırlama
- Uzlaşı / Oylama (Consensus / Voting) — nihai kararı belirleme
