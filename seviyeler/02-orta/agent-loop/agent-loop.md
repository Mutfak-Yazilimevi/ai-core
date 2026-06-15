# Ajan Döngüsü (Agent Loop)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 1. Temeller ve Çalışma Modeli

Bir ajanın hedeflerine ulaşmak için izlediği algılama → mantıksal çıkarım → eylem → sonuçları değerlendirme döngüsüdür. Ajan, her tur sonunda elde ettiği sonuca göre bir sonraki adımını planlar ve hedefe ulaşana (veya bir durdurma koşulu sağlanana) kadar bu döngüyü tekrarlar.

## Mini Senaryo

> Ajan: kullanıcıyı dinler → cevabı düşünür → araç çağırır → sonucu görür → tekrar düşünür, hedefe ulaşana dek.

## 📖 Ayrıntılı Açıklama

Ajan döngüsü (agent loop), bir yapay zekâ ajanının tek bir istem-cevap alışverişinin ötesine geçerek, çok adımlı görevleri özerk biçimde yürütmesini sağlayan temel çalışma modelidir. Klasik bir dil modeli çağrısı "girdi → çıktı" şeklinde tek seferliktir; ajan döngüsü ise bunu "algıla → düşün → eyleme geç → gözlemle → tekrar düşün" biçiminde tekrarlayan bir çevrime dönüştürür. Bu çevrim, modelin her turda elde ettiği yeni bilgiyle (araç sonuçları, hata mesajları, kullanıcı geri bildirimi) planını güncellemesine olanak tanır.

Bu yapı önemlidir; çünkü gerçek dünya görevlerinin çoğu önceden tam olarak planlanamaz (örneğin "şu hatayı bul ve düzelt"). Ajan, bir sonraki adımı ancak mevcut adımın sonucunu gördükten sonra bilebilir. Döngü, bu belirsizliği "deneme-gözlem-uyarlama" mantığıyla yönetir. Anthropic SDK'sında bu, `tool_use` durdurma nedeni (stop reason) döndüğünde aracı çalıştırıp sonucu `tool_result` olarak geri besleyen ve model `end_turn` diyene kadar süren bir `while` döngüsüyle gerçekleştirilir.

Döngü nasıl çalışır? Her tur şu sırayı izler: (1) model mevcut bağlamı (conversation context) okur, (2) düşünme (thinking) yaparak bir sonraki eylemi planlar, (3) bir araç çağırır veya nihai cevabı üretir, (4) harness aracı çalıştırıp sonucu geçmişe ekler, (5) döngü başa döner. Durdurma koşulu genelde hedefin tamamlanması (`end_turn`), maksimum tur sayısına ulaşılması veya bir hata eşiğinin aşılmasıdır.

Ne zaman kullanılır? Çok adımlı, araç gerektiren, sonucu önceden kestirilemeyen görevlerde (kod yazma, araştırma, veri analizi) idealdir. Ne zaman kullanılmamalı? Tek seferlik sınıflandırma, özetleme veya basit soru-cevapta gereksizdir; düz bir API çağrısı yeterlidir. Gereksiz yere döngü kurmak maliyet ve gecikme (latency) artırır.

Tuzaklar: En yaygın tuzak sonsuz döngüdür (model aynı aracı tekrar tekrar çağırır); bunun için bir maksimum iterasyon sınırı şarttır. İkinci tuzak, asistan cevabının (tool_use blokları dâhil) geçmişe tam olarak eklenmemesidir; sadece metni eklemek bağlamı bozar. Üçüncüsü, her tur bağlam penceresini (context window) büyüttüğü için uzun döngülerde belleğin (memory) sıkıştırılması (compaction) gerekebilir.

## 🎬 Detaylı Senaryo

Bir e-ticaret firmasının ("TrendSepet") müşteri operasyon ekibi, iade taleplerini otomatikleştirmek için bir ajan kuruyor. Senaryo adım adım şöyle ilerler:

1. Müşteri yazar: "3 gün önce aldığım ayakkabı dar geldi, iade etmek istiyorum."
2. Ajan döngünün ilk turunda mesajı **algılar** ve düşünür: "Önce sipariş bilgisini bulmalıyım."
3. Ajan `siparis_sorgula` aracını müşteri kimliğiyle **çağırır** (eylem).
4. Harness aracı çalıştırır, sonucu (`{"siparis_id": "TS-9981", "tarih": "3 gün önce", "durum": "teslim edildi"}`) ajana geri besler (**gözlem**).
5. Ajan tekrar **düşünür**: "İade penceresi 14 gün; uygun. Şimdi iade kaydı oluşturmalıyım."
6. Ajan `iade_baslat` aracını çağırır.
7. Araç bir kargo kodu döndürür; ajan bunu gözlemler.
8. Ajan son turda artık araç çağırmaz, kullanıcıya nihai cevabı (`end_turn`) yazar: "İade talebiniz oluşturuldu, kargo kodunuz K-4471. Ücret 2 iş günü içinde iade edilecektir."
9. Operasyon ekibi, döngüye bir maksimum 6 tur sınırı koyar; böylece bir araç sürekli hata verirse ajan takılıp kalmaz, sorunu insana (HITL) devreder.

## 💻 Kullanım / Uygulama Örneği

Aşağıda manuel ajan döngüsünün Anthropic SDK ile en yalın hâli yer alır. Model `tool_use` ile durduğunda araç çalıştırılır, sonucu geri beslenir; `end_turn` gelince döngü biter.

```python
import anthropic

client = anthropic.Anthropic()
tools = [{
    "name": "siparis_sorgula",
    "description": "Müşterinin son siparişini getirir. Kullanıcı iade/sipariş sorduğunda çağır.",
    "input_schema": {"type": "object", "properties": {"musteri_id": {"type": "string"}}, "required": ["musteri_id"]},
}]
messages = [{"role": "user", "content": "Son siparişimi iade etmek istiyorum. Müşteri no: M-100"}]

while True:  # ajan döngüsü
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        thinking={"type": "adaptive"}, tools=tools, messages=messages)
    if resp.stop_reason == "end_turn":
        print(next(b.text for b in resp.content if b.type == "text"))
        break
    messages.append({"role": "assistant", "content": resp.content})  # tool_use dâhil tüm içerik
    results = []
    for b in resp.content:
        if b.type == "tool_use":
            sonuc = "{'siparis_id': 'TS-9981', 'durum': 'teslim edildi'}"  # aracı burada gerçekten çalıştırın
            results.append({"type": "tool_result", "tool_use_id": b.id, "content": sonuc})
    messages.append({"role": "user", "content": results})
```

İkinci olarak, maksimum tur sınırını eklemek sonsuz döngüyü engeller: `for tur in range(6):` ile döngüyü sınırlayıp, sınır aşılırsa insana devretmek (handoff) iyi bir uygulamadır.

## 🔗 İlgili Kavramlar

- [Fonksiyon Çağırma (Function Calling)](../function-calling/function-calling.md) — döngü içindeki "eylem" adımının yapısal temeli
- [Ajan Boru Hattı (Agentic Pipeline)](../agentic-pipeline/agentic-pipeline.md) — döngünün önceden tanımlı, ardışık varyantı
- [Bağlam Penceresi (Context Window)](../context-window/context-window.md) — döngü uzadıkça dolan kısa vadeli bellek sınırı
- [Döngüde İnsan (HITL)](../hitl/hitl.md) — kritik turlarda insan onayını döngüye katma
- [Devir İşlemleri (Handoffs)](../handoffs/handoffs.md) — döngü çıkmaza girince başka ajana aktarım
