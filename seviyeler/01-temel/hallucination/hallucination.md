# Halüsinasyon / Sanrı (Hallucination)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 9. Güvenlik, Hizalama ve Denetim

Ajanın (veya temel alınan dil modelinin) gerçek dışı, uydurma veya var olmayan bilgileri son derece kendinden emin bir şekilde gerçekmiş gibi üretmesi durumudur. Önlenmesi gereken temel risktir; Grounding ve RAG bu amaçla kullanılır.

## Mini Senaryo

> Ajan var olmayan bir kanun maddesi numarası uydurur; bu bir halüsinasyondur.

## 📖 Ayrıntılı Açıklama

Halüsinasyon (hallucination), bir dil modelinin gerçekte var olmayan, yanlış veya kaynaksız bilgiyi son derece akıcı ve kendinden emin bir dille gerçekmiş gibi üretmesidir. Model uydurduğunu "bilmez"; ürettiği metin dilbilgisel olarak kusursuz ve ikna edici olduğu için yanlışlık çoğu zaman ilk bakışta fark edilmez. Bu, var olmayan bir kaynağa atıf yapmak, yanlış bir tarih vermek, uydurma bir API fonksiyonu çağırmak veya gerçek dışı bir istatistik üretmek biçiminde ortaya çıkabilir.

Halüsinasyonun temel nedeni, dil modellerinin doğası gereği bir sonraki en olası kelimeyi tahmin eden olasılıksal sistemler olmasıdır; gerçek bir "doğruluk veritabanı" sorgulamazlar. Eğitim verisinde bir bilgi yoksa, eksikse veya çelişkiliyse, model boşluğu istatistiksel olarak makul görünen bir uydurmayla doldurabilir. Bu yüzden halüsinasyon tamamen "ortadan kaldırılabilir" bir hata değil, yönetilmesi gereken yapısal bir risktir. Özellikle hukuk, sağlık ve finans gibi alanlarda ciddi sonuçlar doğurabilir.

Halüsinasyonu azaltmanın temel yöntemi temellendirmedir (grounding): modele güvenilir, güncel bağlamı doğrudan vermek. Bunun en yaygın biçimi RAG (Retrieval-Augmented Generation), yani modele soruyla ilgili belgeleri arayıp bağlama ekleyerek "kendi belleğinden uydurmak yerine verilen kaynaktan cevapla" demektir. Ek yöntemler arasında modele atıf/kaynak göstermesini istemek, "bilmiyorum" demesine izin vermek, sıcaklık (temperature) değerini düşürmek ve çıktıyı bir doğrulama adımından geçirmek yer alır.

Halüsinasyon riski, modelin iç bilgisine güvenildiği her durumda vardır; ancak gerçek olgulara, güncel verilere veya kesin sayılara dayanan görevlerde özellikle tehlikelidir. Yaratıcı yazım gibi serbest görevlerde ise "halüsinasyon" zaten istenen şey olabilir, dolayısıyla her bağlamda kötü değildir; kritik olan, olgusal doğruluk gerektiren bağlamlarda kontrol altına alınmasıdır.

Dikkat edilmesi gereken tuzaklar: Modelin kendinden emin tonu, doğruluk göstergesi sanılmamalıdır; emin görünmesi doğru olduğu anlamına gelmez. RAG eklemek tek başına yetmez; getirilen belgeler alakasızsa model yine uydurabilir. Atıf istemek de aldatıcı olabilir, çünkü model var olmayan ama gerçekçi görünen kaynaklar uydurabilir; bu yüzden atıfların gerçekten var olduğunu programatik olarak doğrulamak gerekir.

## 🎬 Detaylı Senaryo

Bir hukuk bürosu olan "Adalet Partners", avukatlara dilekçe taslağı hazırlayan bir ajan kullanmaya başlıyor.

1. Bir avukat, ajandan "işten haksız çıkarılma ile ilgili emsal kararlara atıfla bir dilekçe yaz" ister.
2. İlk sürümde ajan yalnızca modelin iç bilgisine dayanır ve "Yargıtay 9. HD, 2019/1234 E." gibi gerçekçi görünen bir karar numarası üretir.
3. Avukat numarayı resmi veritabanında aratır ve böyle bir kararın hiç var olmadığını fark eder; bu tipik bir halüsinasyondur ve mahkemeye sunulsaydı ciddi sorun olurdu.
4. Ekip sorunu çözmek için sisteme bir RAG katmanı ekler: ajan artık önce resmi içtihat veritabanında arama yapar.
5. Yeni akışta ajan, soruyla ilgili gerçek kararların tam metinlerini bağlama ekler ve yalnızca verilen bu belgelerden alıntı yapması talimatıyla yönlendirilir.
6. Ajan, kaynaklarda karşılığı olmayan bir bilgi için artık "Bu konuda elimdeki kaynaklarda bir emsal bulunmuyor" der; uydurmak yerine boşluğu kabul eder.
7. Son olarak bir doğrulayıcı adım, dilekçedeki her karar numarasını veritabanıyla otomatik karşılaştırır ve eşleşmeyen atıf varsa uyarı verir.
8. Avukat artık ajanın çıktısına güvenle başlayabilir; her atıfın gerçek bir kaynağa dayandığı denetlenebilir hâle gelir.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki Python örneği, halüsinasyonu azaltmak için temellendirme (grounding) uygular: modele bir bağlam verir ve yalnızca o bağlamdan cevap vermesini, bilmiyorsa "Bilmiyorum" demesini ister.

```python
import anthropic

client = anthropic.Anthropic()

baglam = "Şirketin yıllık izin politikası: tüm tam zamanlı çalışanlar 14 gün izne sahiptir."

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=512,
    system=(
        "Yalnızca aşağıda verilen BAĞLAM'a dayanarak cevap ver. "
        "Bağlamda yoksa 'Bilmiyorum' de, asla tahmin yürütme."
    ),
    messages=[{
        "role": "user",
        "content": f"BAĞLAM:\n{baglam}\n\nSORU: Yarı zamanlı çalışanların izin hakkı kaç gündür?",
    }],
)
print(resp.content[0].text)  # Beklenen: "Bilmiyorum" (bağlamda yarı zamanlı bilgisi yok)
```

Aşağıdaki örnek ise üretilen atıfların gerçekten var olup olmadığını programatik olarak doğrulayan basit bir kontrol gösterir.

```python
def atiflari_dogrula(uretilen_atiflar: list[str], gercek_kaynaklar: set[str]) -> list[str]:
    # Gerçek kaynak kümesinde bulunmayan atıflar olası halüsinasyondur
    return [a for a in uretilen_atiflar if a not in gercek_kaynaklar]

supheli = atiflari_dogrula(["2019/1234 E.", "2021/567 E."], {"2021/567 E."})
print("Olası halüsinasyon:", supheli)  # ['2019/1234 E.']
```

## 🔗 İlgili Kavramlar

- Temellendirme (grounding) — modeli güvenilir bağlama dayandırarak halüsinasyonu azaltır.
- RAG (Retrieval-Augmented Generation) — ilgili belgeleri getirip bağlama ekleyen ana yöntem.
- [Güvenlik Bariyerleri (Guardrails)](../guardrails/guardrails.md) — uydurma çıktıları yakalayan bir denetim katmanı.
- [Değerlendirmeler (Evals)](../evals/evals.md) — halüsinasyon oranını ölçmek için kullanılır.
- [Çoklu Ajan (Multi-Agent)](../multi-agent/multi-agent.md) — doğrulayıcı ajanlarla halüsinasyon tespit edilebilir.
- [Gözlemlenebilirlik (Observability)](../observability/observability.md) — hatalı çıktıların kaynağını izlemeyi sağlar.
