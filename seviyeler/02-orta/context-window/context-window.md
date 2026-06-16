# Bağlam Penceresi (Context Window)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 3. Bağlam ve İstem Mühendisliği

Bir dil modelinin tek bir işlemde (istem ve cevap dâhil) işleyebileceği maksimum veri boyutudur. Ajanın kısa vadeli belleğinin matematiksel sınırını belirler.

## Mini Senaryo

> 32K jetonluk pencereye 40 sayfalık belge sığmaz; ajan ya özetler ya parçalara böler.

## 📖 Ayrıntılı Açıklama

Bağlam penceresi (context window), bir dil modelinin tek bir çağrıda işleyebileceği toplam token (jeton) sayısının üst sınırıdır. Bu sınır hem girdiyi (sistem istemi, sohbet geçmişi, araç tanımları, kullanıcı mesajı) hem de modelin üreteceği çıktıyı kapsar. Yani pencere, "modelin aynı anda görebildiği her şeyin" sığması gereken sabit bir kutudur ve ajanın kısa vadeli belleğinin (short-term memory) matematiksel sınırını belirler.

Bu kavram önemlidir; çünkü bir ajan döngüsü (agent loop) ilerledikçe sohbet geçmişi, araç sonuçları ve düşünme (thinking) blokları birikir; bunların toplamı pencereyi doldurabilir. Sınır aşılırsa istek hata verir veya eski bağlam kesilir (truncation) ve ajan kritik bilgiyi "unutur". Bu nedenle uzun süren ajanlarda token bütçesini yönetmek temel bir mühendislik görevidir.

Nasıl çalışır? Token, modelin metni böldüğü alt-kelime birimidir; kabaca İngilizce bir kelime ~1,3 token, Türkçe genelde biraz daha fazladır. Geliştirici, isteği göndermeden önce token sayımı (token counting) yaparak pencereye sığıp sığmadığını kestirir. Sığmıyorsa stratejiler devreye girer: belgeyi parçalara bölmek (chunking) ve sadece alakalı parçaları getirmek (RAG), eski mesajları özetlemek (summarization/compaction) veya gereksiz içeriği budamak.

Ne zaman önemlidir? Uzun belgelerle çalışırken, uzun ajan oturumlarında ve çok turlu sohbetlerde kritiktir. Ne zaman önemsizdir? Kısa, tek seferlik istemlerde pencere sınırına yaklaşmak zordur, bu durumda aktif yönetim gerekmez.

Tuzaklar: Birincisi, çıktı için yer ayırmayı unutmak — `max_tokens` artı girdi, toplam pencereyi aşmamalıdır. İkincisi, "pencere büyük, her şeyi atalım" yaklaşımı; alakasız bağlam hem maliyeti hem gecikmeyi (latency) artırır ve modelin dikkatini dağıtarak doğruluğu düşürür ("lost in the middle" etkisi). Üçüncüsü, token sayımını kelime sayımıyla karıştırmak.

## 🎬 Detaylı Senaryo

Bir araştırma ekibi ("VeriLab"), 40 sayfalık teknik raporu özetleyen bir ajan kurar ama pencere sınırına takılır:

1. Ekip raporu doğrudan modele yapıştırır ve istek "girdi çok uzun" hatası verir.
2. Token sayımı yapar; raporun ~60K token olduğunu, oysa bütçenin yetersiz kaldığını görür.
3. Raporu 500 kelimelik parçalara böler (chunking).
4. Her parçayı ayrı ayrı modele özetletir (haritalama/map aşaması).
5. Parça özetlerini birleştirip tek bir nihai özet çıkarır (indirgeme/reduce aşaması).
6. Uzun bir sohbet ajanında eski turların pencereyi doldurduğunu fark eder.
7. Belirli bir token eşiği aşıldığında eski mesajları otomatik özetleyip sıkıştıran (compaction) bir mekanizma ekler.
8. Böylece ajan, pencereye sığarken de görevin özünü hatırlamayı sürdürür.

## 💻 Kullanım / Uygulama Örneği

Aşağıda Anthropic SDK'nın token sayımı (count tokens) ucuyla, isteği göndermeden önce pencereye sığıp sığmadığını kontrol eden bir mantık yer alır.

```python
import anthropic

client = anthropic.Anthropic()
messages = [{"role": "user", "content": uzun_belge}]

# Göndermeden önce girdi token sayısını ölç
sayim = client.messages.count_tokens(model="claude-opus-4-8", messages=messages)
girdi_token = sayim.input_tokens

max_cikti = 1024
if girdi_token + max_cikti > 200_000:   # pencereye sığmıyorsa
    print("Belge çok büyük: önce parçalama/özetleme gerekli")
else:
    resp = client.messages.create(model="claude-opus-4-8", max_tokens=max_cikti, messages=messages)
    print(next(b.text for b in resp.content if b.type == "text"))
```

İkinci olarak, sığmayan durumlarda belgeyi parçalayıp her parçayı ayrı özetlemek (map-reduce) klasik bir "pencereye sığdırma" yöntemidir.

## 🔗 İlgili Kavramlar

- [Parçalama (Chunking)](../chunking/chunking.md) — belgeyi pencereye sığacak parçalara bölme
- [Ajan Döngüsü (Agent Loop)](../agent-loop/agent-loop.md) — turlar ilerledikçe pencereyi dolduran çevrim
- [RAG (Retrieval-Augmented Generation)](../rag/rag.md) — pencereye sadece alakalı bağlamı getirme
- Token (Jeton) — pencerenin ölçüldüğü temel birim
- Bellek Sıkıştırma (Compaction) — eski bağlamı özetleyerek pencerede yer açma
