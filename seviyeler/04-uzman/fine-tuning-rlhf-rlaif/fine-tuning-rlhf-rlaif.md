# İnce Ayar / Pekiştirmeli Hizalama (Fine-tuning / RLHF / RLAIF)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Modeli özel veriyle yeniden eğitme (fine-tuning) ve insan (RLHF) veya YZ (RLAIF) geri bildirimiyle pekiştirmeli öğrenme yoluyla kalıcı bilgi/davranış kazandırma ve hizalama yöntemleridir.

## Mini Senaryo

> Modele 5.000 kurumsal e-posta örneğiyle ince ayar yapılır; artık şirket üslubuyla yazar.

## 📖 Ayrıntılı Açıklama

İnce Ayar (Fine-tuning), önceden eğitilmiş (pre-trained) bir modeli, alana özgü veya göreve özgü bir veri setiyle ek bir eğitim turundan geçirerek davranışını ve bilgisini kalıcı olarak şekillendirme yöntemidir. RLHF (Reinforcement Learning from Human Feedback - İnsan Geri Bildiriminden Pekiştirmeli Öğrenme) ve RLAIF (Reinforcement Learning from AI Feedback - YZ Geri Bildiriminden Pekiştirmeli Öğrenme), modeli "doğru" yanıtları taklit etmenin ötesinde, tercih edilen davranışları ödül sinyaliyle hizalayan ileri tekniklerdir.

Bu kavramlar önemlidir çünkü istem mühendisliği (prompt engineering) ve bağlam (context) ile sağlanan davranış geçicidir ve her çağrıda token harcar; ince ayar ise istenen üslubu, formatı veya alan bilgisini modelin "ağırlıklarına" gömerek kalıcı kılar. RLHF, ChatGPT ve Claude gibi modellerin "yardımcı, dürüst ve zararsız" olmasını sağlayan temel hizalama mekanizmasıdır; RLAIF ise insan etiketleme maliyetini azaltmak için geri bildirimi bir YZ modelinden alır.

Nasıl çalışır? (1) İnce ayar: Etiketli girdi-çıktı çiftlerinden oluşan bir veri setiyle model denetimli olarak (supervised fine-tuning) eğitilir. (2) RLHF: Önce model birkaç yanıt üretir, insanlar bunları en iyiden en kötüye sıralar; bu sıralamalardan bir ödül modeli (reward model) eğitilir; sonra ana model, bu ödül modelini maksimize edecek şekilde pekiştirmeli öğrenmeyle (örn. PPO) ince ayarlanır. (3) RLAIF: Aynı akış, ama yanıtları sıralayan insan yerine bir YZ modeli ve bir ilkeler dizisidir (Anayasal YZ ile yakından ilişkili).

Ne zaman kullanılır? Tutarlı bir kurumsal üslup, sabit bir çıktı formatı, dar bir alanda yoğun jargon veya çok sayıda örneğin istemde yer kaplaması durumunda ince ayar mantıklıdır. Ne zaman kullanılmaz? Hızlı değişen bilgi (orada RAG/temellendirme daha iyidir), az veri olduğunda veya birkaç örnekle (few-shot) zaten yeterli sonuç alındığında ince ayar gereksiz maliyettir.

Tuzaklar: Az veya kalitesiz veriyle ince ayar, modeli aşırı uyduran (overfitting) ve genel yeteneğini bozan bir sonuç doğurur (catastrophic forgetting). İnce ayar, güncel bilgi sorununu çözmez; eğitildiği ana kadarki bilgiyi gömer. Ayrıca her model güncellemesinde ince ayarı yenilemek gerekebilir; bu bir bakım yüküdür. Çoğu pratik ihtiyaç için istem + RAG, ince ayardan daha hızlı ve ucuzdur.

## 🎬 Detaylı Senaryo

"HukukYazar" adlı bir şirket, avukatların sözleşme taslaklarını standart kurumsal üslupla hazırlayan bir asistan istiyor; istem mühendisliği üslubu tam tutturamayınca ekip ince ayar yolunu değerlendiriyor.

1. **Sorun tespiti:** İstemle yönlendirilen model, sözleşmeleri doğru yazıyor ama firmanın resmî, madde-numaralı üslubunu tutarlı tutturamıyor.
2. **Karar:** Ekip, kavramsal olarak üslubun ince ayarla kalıcı kazandırılmasına karar verir (bu örnekte akış kavramsal anlatılır).
3. **Veri toplama:** Geçmiş 5.000 onaylı sözleşmeden girdi (istek) ve çıktı (sözleşme) çiftleri derlenir.
4. **Veri temizleme:** Kişisel veriler maskelenir, hatalı/eski şablonlar ayıklanır; kalite veriden önemlidir vurgusu yapılır.
5. **İnce ayar:** Bu veriyle bir denetimli ince ayar turu yapılır; model artık istemde örnek olmadan da firma üslubunu üretir.
6. **RLHF turu:** Avukatlar, modelin ürettiği taslakları "tercih ederim/etmem" diye sıralar; bu tercihlerden bir ödül modeli eğitilir.
7. **Hizalama:** Ödül modeline göre pekiştirmeli öğrenmeyle model, avukatların tercih ettiği netlik ve ton yönünde ayarlanır.
8. **Değerlendirme:** Bir eval setinde üslup tutarlılığı ölçülür; istem-token başına maliyet de düşmüştür çünkü artık uzun örnekler istemde taşınmaz.
9. **Bakım planı:** Ekip, model sağlayıcı sürüm güncellediğinde ince ayarın yenilenmesi gerektiğini not eder.

## 💻 Kullanım / Uygulama Örneği

İnce ayar veri seti tipik olarak JSONL formatında girdi-çıktı çiftlerinden oluşur; aşağıda kavramsal bir örnek var.

```yaml
# ince_ayar_verisi.jsonl (kavramsal gösterim)
- girdi: "Kira sözleşmesi taslağı hazırla, süre 12 ay."
  cikti: "MADDE 1 - TARAFLAR... MADDE 2 - SÜRE: İşbu sözleşme 12 (on iki) ay..."
- girdi: "Gizlilik sözleşmesi hazırla, taraflar A ve B."
  cikti: "MADDE 1 - TANIMLAR... MADDE 2 - GİZLİ BİLGİ..."
```

İnce ayar kurulana kadar veya alternatif olarak, aynı davranış istemle de yaklaştırılabilir; aşağıdaki Anthropic SDK örneği üslubu sistem istemiyle yönlendirir:

```python
import anthropic

client = anthropic.Anthropic()

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="Sözleşmeleri firma üslubuyla yaz: resmî dil, numaralı maddeler (MADDE 1, MADDE 2...).",
    messages=[{"role": "user", "content": "12 aylık bir kira sözleşmesi taslağı hazırla."}],
)
print("".join(b.text for b in resp.content if b.type == "text"))
```

## 🔗 İlgili Kavramlar

- [Hizalama ve Anayasal YZ (Alignment & Constitutional AI)](../alignment-constitutional-ai/alignment-constitutional-ai.md) — RLAIF'in dayandığı hizalama yaklaşımı
- [Temellendirme (Grounding)](../grounding/grounding.md) — güncel bilgi için ince ayara alternatif
- [Değerlendirme Setleri (Evals)](../../01-temel/evals/evals.md) — ince ayar kalitesini ölçme
- Erişimle Artırılmış Üretim (RAG) — bilgi katmak için ince ayar alternatifi
- İstem Mühendisliği (Prompt Engineering) — daha hafif davranış yönlendirme
