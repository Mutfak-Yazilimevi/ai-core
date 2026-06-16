# Bilgi Grafiği (Knowledge Graph)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Verilerin düz metin olarak değil; nesneler (varlıklar) ve aralarındaki anlamsal ilişkiler şeklinde yapılandırılarak tutulduğu mimaridir. RAG'in mantıksal çıkarım doğruluğunu en üst düzeye çıkarır.

## Mini Senaryo

> "Ali → yönetir → Proje X → bağlı → Departman Y" ilişkileri ajanın doğru kişiyi bulmasını sağlar.

## 📖 Ayrıntılı Açıklama

Bilgi Grafiği (Knowledge Graph), verileri düz metin parçaları olarak değil; varlıklar (entities — kişiler, projeler, ürünler) ve aralarındaki anlamsal ilişkiler (relationships) olarak yapılandıran bir bilgi temsili mimarisidir. Yapı genellikle "özne → yüklem → nesne" (örn. "Ali → yönetir → Proje X") biçiminde üçlüler (triples) halindedir. Bu, bilgiyi bir ağ/graf olarak modeller ve makinenin üzerinde mantıksal çıkarım (reasoning) yapmasını sağlar.

Bu önemlidir çünkü düz metne dayalı geri getirme (vektör tabanlı RAG) "anlamca benzer" parçaları bulur ama çok adımlı ilişkisel soruları ("Proje X'in bağlı olduğu departmanın yöneticisi kim?") zayıf yanıtlar. Bilgi grafiği, ilişkileri açıkça tuttuğu için bu tür "bağlantıları izleyerek" çıkarım yapmayı mümkün kılar ve RAG'in doğruluğunu artırır (GraphRAG). Tutarlılık ve denetlenebilirlik de yüksektir.

Nasıl çalışır: Varlıklar düğüm (node), ilişkiler kenar (edge) olarak saklanır; genellikle bir graf veritabanında (graph database, örn. Neo4j) veya RDF üçlü deposunda tutulur. Sorgular bir graf sorgu diliyle (örn. Cypher, SPARQL) yazılır ve "şu düğümden başlayıp şu ilişkiyi izle" biçiminde gezinti yapar. Ajan, doğal dildeki soruyu bir graf sorgusuna çevirip kesin yanıt alabilir.

Ne zaman kullanılır: İlişkilerin ve çok adımlı çıkarımın kritik olduğu alanlarda — kurumsal bilgi, kimlik/erişim, tedarik zinciri, dolandırıcılık tespiti. Ne zaman kullanılmaz: Bilgi büyük ölçüde serbest metinse ve ilişkisel yapı zayıfsa, graf kurmanın maliyeti karşılığını vermeyebilir; orada vektör tabanlı RAG daha pratiktir.

Tuzaklar: Grafı kurmak ve güncel tutmak emek ister; varlık çözümleme (entity resolution — aynı kişinin farklı yazımları) zordur. Eksik veya yanlış kenarlar sessizce hatalı çıkarıma yol açar. Aşırı karmaşık şema (ontology) bakımı zorlaştırır; şema sade ve amaca yönelik tutulmalıdır.

## 🎬 Detaylı Senaryo

"KurumBilgi" adlı büyük bir holdingin BT ekibi, "kim neye erişebilir ve neden?" sorularını yanıtlamak için bir bilgi grafiği kurar.

1. Ekip varlıkları tanımlar: çalışanlar, projeler, departmanlar, sistemler ve roller.
2. İlişkiler graf olarak girilir: "Ali → yönetir → Proje X", "Proje X → bağlı → Departman Y", "Departman Y → erişir → Finans Sistemi".
3. Bir denetçi sorar: "Finans Sistemi'ne dolaylı erişimi olan proje yöneticileri kimler?"
4. Ajan bu doğal dil sorusunu bir graf sorgusuna (Cypher) çevirir.
5. Sorgu, Finans Sistemi düğümünden başlayıp erişim ve bağlılık kenarlarını geriye doğru izler.
6. Graf, Departman Y üzerinden Proje X'e, oradan yönetici Ali'ye ulaşır — vektör araması bu zinciri kuramazdı.
7. Ajan, çıkarımın izlediği yolu ("Ali → Proje X → Departman Y → Finans Sistemi") kanıt olarak gösterir; sonuç denetlenebilirdir.
8. Yeni bir çalışan eklenince graf güncellenir ve gelecekteki sorgular otomatik olarak doğru yanıt verir.

## 💻 Kullanım / Uygulama Örneği

Bilgi, varlık-ilişki üçlüleri olarak saklanır ve ilişki izlenerek sorgulanır. Aşağıda kavramsal bir graf ve gezinti gösterilmektedir.

```python
# Üçlü (triple) tabanlı kavramsal bilgi grafiği
graf = [
    ("Ali", "yonetir", "Proje X"),
    ("Proje X", "bagli", "Departman Y"),
    ("Departman Y", "erisir", "Finans Sistemi"),
]

def izle(graf, baslangic, iliski):
    return [o for (s, p, o) in graf if s == baslangic and p == iliski]

# "Ali kimi/neyi yönetir?" -> ilişkiyi izle
print(izle(graf, "Ali", "yonetir"))   # ['Proje X']
```

```yaml
# Graf veritabanı sorgusu (kavramsal, Cypher benzeri)
# Finans Sistemi'ne dolaylı erişimi olan proje yöneticilerini bul
sorgu: |
  MATCH (kisi)-[:yonetir]->(proje)-[:bagli]->(dept)-[:erisir]->(sistem {ad: "Finans Sistemi"})
  RETURN kisi.ad
```

## 🔗 İlgili Kavramlar

- [Bölümsel Bellek (Episodic Memory)](../episodic-memory/episodic-memory.md) — olaylar arası ilişkilerin yapılandırılması
- [Bağlam Mühendisliği (Context Engineering)](../context-engineering/context-engineering.md) — graf çıktısını bağlama getirme
- [Bağlam Sıkıştırma (Context Compression)](../context-compression/context-compression.md) — bilgiyi yoğun biçimde saklama
- Geri Getirmeli Üretim (RAG) — graf ile birleşince GraphRAG
- Graf Veritabanı (Graph Database) — düğüm-kenar depolama altyapısı
