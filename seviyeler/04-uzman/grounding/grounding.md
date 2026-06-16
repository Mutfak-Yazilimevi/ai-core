# Temellendirme (Grounding)

> **Seviye:** 🔴 Uzman (Master)  
> **Kategori:** 3. Bağlam ve İstem Mühendisliği

Ajanın kararlarının ve eylemlerinin halüsinasyonlara değil, doğrulanabilir gerçek verilere dayanmasını sağlama işlemidir. Yanıtların kaynaklarla ilişkilendirilmesini ve denetlenebilir olmasını sağlar.

## Mini Senaryo

> Ajan "iade süresi 14 gün" derken yanına kaynak belgenin ilgili maddesini ekler.

## 📖 Ayrıntılı Açıklama

Temellendirme (Grounding), bir ajanın ürettiği yanıtların kendi "ezberinden" (parametrik bilgi) veya uydurmasından (halüsinasyon - hallucination) değil, doğrulanabilir, dış kaynaklardan gelen gerçek verilere dayandırılması işlemidir. Temellendirilmiş bir yanıt, hangi belgeden veya kayıttan geldiğini gösteren bir alıntı (citation) ile birlikte sunulur; böylece kullanıcı veya bir denetçi iddiayı kaynağına kadar izleyebilir.

Bu kavram önemlidir çünkü LLM'ler akıcı ama yanlış (plausible but false) cümleler üretebilir; özellikle politika, fiyat, yasal süre gibi kesin bilgi gerektiren alanlarda bu kabul edilemez. Temellendirme, modeli kendi bildiğini söylemek yerine "sana verdiğim belgelere dayan ve nereden aldığını göster" diye kısıtlayarak güvenilirliği ve denetlenebilirliği (auditability) sağlar. Bu, kurumsal ve düzenlemeye tabi alanlarda ajan güveninin temelidir.

Nasıl çalışır? Genellikle Erişimle Artırılmış Üretim (RAG - Retrieval-Augmented Generation) ile birlikte: önce sorguyla ilgili belgeler bir bilgi tabanından çekilir, sonra bu belgeler istemin içine konur ve modelden "yalnızca verilen bağlama dayanarak yanıtla ve her iddianın yanına kaynak numarası ekle" istenir. Model yanıtını üretirken hangi parçayı kullandığını işaretler; sistem bu işaretleri kullanıcıya görünür alıntılara dönüştürür. Bağlamda cevap yoksa modelin "bilmiyorum" demesi beklenir.

Ne zaman kullanılır? Doğruluğun kritik olduğu her senaryoda: müşteri destek (politika yanıtları), hukuk, sağlık, finans, kurumsal bilgi tabanı sorgulama. Ne zaman daha az gerekir? Yaratıcı yazım, beyin fırtınası veya öznel görüş gibi "doğru kaynak" kavramının olmadığı görevlerde temellendirme anlamsızdır.

Tuzaklar: Modele kaynak vermek tek başına yetmez; "yalnızca bu kaynaklara dayan" talimatı zayıfsa model yine kendi bilgisini karıştırabilir. Alıntıları üretip doğrulamamak, modelin var olmayan bir kaynağa atıf yapmasına (uydurma alıntı) yol açabilir. Ayrıca çekilen belgeler alakasızsa (kötü erişim), temellendirilmiş ama yanlış bir yanıt çıkar; bu yüzden erişim kalitesi en az üretim kadar önemlidir.

## 🎬 Detaylı Senaryo

"AlışverişNet" adlı bir e-ticaret şirketi, müşterilere iade ve kargo politikalarını yanıtlayan bir destek ajanı kuruyor; ajanın asla politika "uydurmaması", her yanıtı resmî belgeye dayandırması isteniyor.

1. **Bilgi tabanı:** Şirketin tüm politika belgeleri (iade, kargo, garanti) maddelere bölünüp bir vektör veritabanına (vector database) eklenir.
2. **Kullanıcı sorusu:** Müşteri "Ürünü kaç gün içinde iade edebilirim?" diye sorar.
3. **Erişim (retrieval):** Sistem soruya en yakın politika maddelerini çeker; "İade Politikası, Madde 4: 14 gün" maddesi bulunur.
4. **Bağlam oluşturma:** Çekilen madde, numaralı bir kaynak olarak istemin içine yerleştirilir.
5. **Kısıtlı üretim:** Ajana "yalnızca verilen kaynaklara dayanarak yanıtla ve kaynak numarasını belirt" talimatı verilir.
6. **Temellendirilmiş yanıt:** Ajan "Ürünü teslim tarihinden itibaren 14 gün içinde iade edebilirsiniz [Kaynak 1: İade Politikası Madde 4]" der.
7. **Alıntı gösterimi:** Arayüz, kaynağı tıklanabilir bir bağlantı olarak gösterir; müşteri belgeyi görebilir.
8. **Kapsam dışı soru:** Müşteri politikada olmayan bir şey sorunca, ajan kaynak bulamadığı için "Bu konuda elimde belge yok, bir temsilciye yönlendiriyorum" der; uydurmaz.
9. **Denetim:** Destek ekibi, her yanıtın hangi kaynağa dayandığını loglardan inceleyerek doğruluğu denetler.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, modele kaynak belgeleri verip yanıtı yalnızca bunlara dayandırmasını ve alıntı eklemesini ister.

```python
import anthropic

client = anthropic.Anthropic()

kaynaklar = [
    "[Kaynak 1] İade Politikası, Madde 4: Ürünler teslimden itibaren 14 gün içinde iade edilebilir.",
    "[Kaynak 2] Kargo Politikası, Madde 2: Standart teslimat 2-4 iş günüdür.",
]

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system=("Yalnızca aşağıdaki kaynaklara dayanarak yanıtla. Her iddianın yanına "
            "[Kaynak N] biçiminde atıf ekle. Kaynaklarda yoksa 'bilgi yok' de.\n\n"
            + "\n".join(kaynaklar)),
    messages=[{"role": "user", "content": "Ürünü kaç gün içinde iade edebilirim?"}],
)
print("".join(b.text for b in resp.content if b.type == "text"))
```

İkinci örnek, yanıttaki atıfların gerçekten var olan kaynaklara işaret ettiğini doğrular:

```python
import re

def alintilari_dogrula(yanit: str, gecerli_kaynaklar: set[int]) -> bool:
    atiflar = {int(n) for n in re.findall(r"\[Kaynak (\d+)\]", yanit)}
    # Yanıtta en az bir atıf olmalı ve hepsi geçerli olmalı (uydurma atıf yok)
    return bool(atiflar) and atiflar.issubset(gecerli_kaynaklar)
```

## 🔗 İlgili Kavramlar

- [Hizalama ve Anayasal YZ (Alignment & Constitutional AI)](../alignment-constitutional-ai/alignment-constitutional-ai.md) — doğruluk ve dürüstlük ilkesi
- [İnce Ayar / Pekiştirmeli Hizalama (RLHF / RLAIF)](../fine-tuning-rlhf-rlaif/fine-tuning-rlhf-rlaif.md) — bilgi katmaya alternatif yöntem
- Erişimle Artırılmış Üretim (RAG) — temellendirmenin en yaygın uygulaması
- Halüsinasyon (Hallucination) — temellendirmenin önlediği temel sorun
- Alıntı / Atıf (Citation) — temellendirmenin görünür çıktısı
