# Çalışan / Kısa Süreli Bellek (Working / Short-term Memory)

> **Seviye:** 🟢 Temel (Basic)  
> **Kategori:** 4. Bellek ve Bilgi Yönetimi

Ajanın o anki aktif görevi süresince anlık olarak kullandığı; Context Window limitiyle doğrudan sınırlı olan ve görev bittiğinde sıfırlanan geçici işlem hafızasıdır.

## Mini Senaryo

> Ajan, tek bir form doldurma görevi boyunca girilen alanları tutar; görev bitince bu bilgi silinir.

## 📖 Ayrıntılı Açıklama

Çalışan / Kısa Süreli Bellek (Working / Short-term Memory), bir ajanın o anki aktif görevi ya da konuşması süresince anlık olarak kullandığı geçici işlem hafızasıdır. İnsanların bir telefon numarasını çevirene kadar akılda tutması gibi, ajan da mevcut görevin ara verilerini, son mesajları ve henüz tamamlanmamış adımları burada saklar. Görev bittiğinde bu bellek sıfırlanır.

Bu belleğin en belirleyici özelliği, modelin bağlam penceresi (context window) limitiyle doğrudan sınırlı olmasıdır. Dil modeli tek bir istekte yalnızca belirli sayıda jetonu (token) bağlamında tutabilir; çalışan bellek de fiziksel olarak bu pencerenin içinde yaşar. Pencere dolduğunda en eski içerik kırpılır (truncation) ya da özetlenir. Yani kısa süreli bellek "ücretsiz ve sonsuz" değildir; jeton bütçesiyle yönetilir.

Çalışan bellek önemlidir çünkü çok adımlı bir görevin tutarlı ilerlemesini sağlar. Bir ajan form doldururken hangi alanların girildiğini, bir hesaplama yaparken ara sonuçları, bir konuşmada kullanıcının az önce ne dediğini bu sayede izler. Bu olmadan ajan her adımda "amneziye" uğrar ve görevi bitiremez.

Çalışma biçimi pratikte bağlam yönetimidir: Mevcut konuşma geçmişi ve ara durum, her API çağrısında modele yeniden gönderilir (API durumsuz olduğu için). Görev devam ettikçe bu birikir; görev bitince ya da yeni bir göreve geçilince temizlenir. Uzun görevlerde bağlamı taze tutmak için bağlam düzenleme (context editing) veya sıkıştırma (compaction) gibi teknikler eski, gereksiz kısımları budar ya da özetler.

Dikkat edilmesi gereken tuzaklar: Çalışan belleğin sınırı bağlam penceresidir; uzun konuşmalarda en eski bilgiler sessizce kırpılıp bilgi kaybına yol açabilir. Görev sonunda temizlenmediği için biriken eski durum, sonraki görevlere "sızabilir" ve kafa karışıklığı yaratır. Ayrıca her şeyi bağlamda tutmak hem maliyeti hem gecikmeyi artırır; çalışan bellek ile kalıcı uzun süreli belleği karıştırmamak gerekir.

## 🎬 Detaylı Senaryo

"SigortaKolay" adlı bir firma, çevrim içi poliçe başvurusunu yöneten bir ajan kurar; ajan tek bir başvuru görevi boyunca çalışan belleği kullanır:

1. Kullanıcı başvuruyu başlatır; ajan boş bir çalışan bellek (form durumu) ile işe koyulur.
2. Ajan "Adınız?" diye sorar; kullanıcı yanıtlar, ajan bu alanı çalışan belleğe yazar.
3. Sırasıyla doğum tarihi, araç bilgisi ve adres alır; her yanıt bağlamda birikir.
4. Kullanıcı "Az önce verdiğim plakayı düzelt" der; ajan çalışan bellekteki ilgili alanı bulup günceller.
5. Tüm alanlar dolunca ajan, çalışan bellekteki verilerle bir prim hesaplaması yapar ve özeti kullanıcıya gösterir.
6. Kullanıcı onaylar; ajan başvuruyu kalıcı sisteme (uzun süreli depo) kaydeder.
7. Görev biter ve çalışan bellek sıfırlanır; girilen ara form verileri bağlamdan silinir.
8. Yeni bir kullanıcı geldiğinde ajan tertemiz bir çalışan bellekle başlar; önceki başvurunun verisi sızmaz.

Sonuç: Ajan tek görev boyunca tutarlı kalır, görevler arasında ise temizlenerek karışıklık önlenir.

## 💻 Kullanım / Uygulama Örneği

API durumsuz olduğundan, çalışan bellek pratikte konuşma geçmişini her çağrıda yeniden göndermekle sağlanır.

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY ortamdan okunur

# Çalışan bellek = mevcut görev boyunca taşınan mesaj listesi
calisan_bellek = [
    {"role": "user", "content": "Adım Ayşe."},
    {"role": "assistant", "content": "Teşekkürler Ayşe. Doğum tarihiniz?"},
    {"role": "user", "content": "1990. Az önce verdiğim adı doğru aldınız mı?"},
]

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=512,
    system="Sen bir sigorta başvuru asistanısın. Mevcut görevdeki alanları takip et.",
    messages=calisan_bellek,
)
print(resp.content[0].text)  # Model "Ayşe" adını bağlamdan hatırlar
# Görev bitince calisan_bellek temizlenir (yeni görev için sıfırlanır)
```

Görev tamamlandığında belleği sıfırlamak basittir:

```python
calisan_bellek = []  # görev bitti: kısa süreli bellek sıfırlandı
```

## 🔗 İlgili Kavramlar

- [Bellek (Memory)](../memory/memory.md) — kısa ve uzun süreli belleği kapsayan üst kavram
- [Jetonlar / Jetonlaştırma (Tokens / Tokenization)](../tokens-tokenization/tokens-tokenization.md) — çalışan belleğin sınırını belirleyen birimler
- [Ajan (Agent)](../agent/agent.md) — görev boyunca çalışan belleği yöneten sistem
- [Temel Model (Foundation Model)](../foundation-model/foundation-model.md) — durumsuz olduğu için belleğin dışarıdan taşınmasını gerektiren model
- Bağlam Penceresi (Context Window) — çalışan belleğin fiziksel sınırı
- Bağlam Sıkıştırma (Compaction) — uzun görevlerde belleği özetleyip yer açma tekniği
