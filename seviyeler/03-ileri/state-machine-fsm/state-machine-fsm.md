# Durum Makinesi / FSM (State Machine / FSM)

> **Seviye:** 🟠 İleri (Advanced)  
> **Kategori:** 6. İş Akışı ve Yürütme

Ajanın ve alt görevlerin, önceden tanımlı kurallara göre bir durumdan diğerine geçtiği deterministik mimari yapıdır. Karmaşık mikroservis veya saga desenleriyle entegre çalışırken otonom süreçlerin raydan çıkmasını engeller.

## Mini Senaryo

> Sipariş ajanı yalnızca "Onaylandı → Hazırlanıyor → Kargoda" geçişlerine izin verir, atlamayı engeller.

## 📖 Ayrıntılı Açıklama

Durum makinesi / FSM (State Machine / Finite State Machine), bir sistemin sonlu sayıda belirli durumdan (state) birinde bulunabildiği ve durumlar arası geçişlerin (transition) önceden tanımlı kurallarla kısıtlandığı deterministik bir modeldir. Ajan bağlamında FSM, ajanın ve alt görevlerin yalnızca izin verilen sıralı adımları izlemesini sağlar; "hangi durumdayım ve buradan nereye gidebilirim?" sorusunu kesin biçimde yanıtlar. Geçerli olmayan geçişler (örneğin "Onaylandı"dan doğrudan "Teslim Edildi"ye atlamak) baştan engellenir.

Önemi, otonom süreçlere güvenilir bir iskelet ve korkuluk (guardrail) sağlamasıdır. Tamamen serbest bırakılan bir LLM ajanı, mantıksal sırayı bozabilir, adım atlayabilir veya geçersiz bir eylemi deneyebilir. FSM, sürecin "raydan çıkmasını" yapısal olarak imkânsız kılar; olasılıksal bir modelin kararlarını deterministik bir çerçeve içine yerleştirir. Bu, özellikle sipariş, ödeme, onay akışı gibi sıranın kritik olduğu iş süreçlerinde önemlidir ve karmaşık mikroservis veya saga desenleriyle uyumlu çalışır.

Nasıl çalışır: Sistem bir başlangıç durumunda (initial state) başlar. Her durumda hangi olayların (event) hangi hedef duruma geçişi tetiklediği bir geçiş tablosunda (transition table) tanımlıdır. Bir olay geldiğinde, makine yalnızca mevcut durumdan tanımlı bir geçiş varsa durumu değiştirir; tanımsız bir geçiş reddedilir. Bazı durumlar nihai (terminal) olabilir, oradan çıkış yoktur.

Ne zaman kullanılır: Adımların sırası katı, geçişlerin denetlenmesi gereken ve geçersiz durumların kabul edilemez olduğu iş akışlarında (sipariş yaşam döngüsü, abonelik durumları, onay süreçleri). Ne zaman uygun değildir: Akışın çok dinamik, dallanmalı ve önceden tüm yolların tanımlanamadığı, esnekliğin kısıtlamadan daha değerli olduğu açık uçlu görevlerde FSM fazla katı kalır.

Tuzaklar: Durum patlaması (state explosion) — çok fazla durum ve geçiş tanımlandığında makine yönetilemez hâle gelir. Eksik tanımlı geçişler ajanı kilitleyebilir (hiçbir geçiş yoksa süreç ilerleyemez). Hata/iptal gibi istisnai durumların unutulması sık görülür; her duruma bir "hata" veya "geri al" çıkışı düşünmek gerekir. FSM'yi yalnızca prompt'ta tarif etmek yetmez; geçiş kuralları kod seviyesinde zorlanmalıdır.

## 🎬 Detaylı Senaryo

"HızlıKargo" adlı bir e-ticaret platformu, sipariş yaşam döngüsünü yöneten bir ajanı FSM ile kısıtlıyor. Amaç, siparişlerin yalnızca geçerli sırayla ilerlemesi.

1. Sipariş durumları tanımlanıyor: Oluşturuldu → Onaylandı → Hazırlanıyor → Kargoda → Teslim Edildi; ayrıca herhangi bir noktadan İptal.
2. Geçiş tablosu yazılıyor: her durumdan yalnızca belirli sonraki durumlara izin var (örneğin "Onaylandı"dan "Hazırlanıyor"a veya "İptal"e).
3. Yeni bir sipariş "Oluşturuldu" durumunda başlıyor.
4. Ödeme onayı gelince ajan "onayla" olayını tetikliyor; makine durumu "Onaylandı"ya geçiriyor.
5. Depo siparişi toplamaya başlayınca "hazirla" olayıyla "Hazırlanıyor"a geçiliyor.
6. Ajan bir hata sonucu doğrudan "Teslim Edildi"ye atlamayı deniyor; makine bu geçişi geçiş tablosunda bulamayıp reddediyor ve uyarı kaydı düşürüyor.
7. Kargo firması paketi alınca "kargola" olayıyla "Kargoda" durumuna geçiliyor.
8. Teslimat tamamlanınca "teslim_et" olayı "Teslim Edildi" nihai durumuna ulaştırıyor; buradan başka geçiş yok.
9. Başka bir siparişte müşteri "Hazırlanıyor" aşamasında iptal istiyor; makine bu geçişe izin verdiği için "İptal" durumuna geçiliyor.
10. Tüm geçişler zaman damgalı kaydediliyor; denetimde her siparişin hangi yoldan ilerlediği eksiksiz gösterilebiliyor.

## 💻 Kullanım / Uygulama Örneği

İlk örnek, geçiş tablosuyla çalışan basit bir durum makinesini gösterir; tanımsız geçişler reddedilir.

```python
GECISLER = {
    "Olusturuldu": {"onayla": "Onaylandi", "iptal": "Iptal"},
    "Onaylandi":   {"hazirla": "Hazirlaniyor", "iptal": "Iptal"},
    "Hazirlaniyor":{"kargola": "Kargoda", "iptal": "Iptal"},
    "Kargoda":     {"teslim_et": "TeslimEdildi"},
    "TeslimEdildi":{},  # nihai durum
    "Iptal":       {},  # nihai durum
}

def gecis_yap(durum: str, olay: str) -> str:
    """Yalnızca tanımlı geçişlere izin verir; aksi halde hata fırlatır."""
    if olay not in GECISLER[durum]:
        raise ValueError(f"Geçersiz geçiş: {durum} --{olay}--> ?")
    return GECISLER[durum][olay]

d = "Onaylandi"
d = gecis_yap(d, "hazirla")   # 'Hazirlaniyor'
# gecis_yap("Onaylandi", "teslim_et")  -> ValueError (atlamaya izin yok)
```

İkinci örnek, LLM ajanının önerdiği eylemi yürütmeden önce FSM ile doğrular; model raydan çıkamaz.

```python
import anthropic
client = anthropic.Anthropic()

resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=64,
    messages=[{"role": "user", "content":
        "Sipariş 'Onaylandi' durumunda. Sıradaki uygun olay nedir? "
        "Yalnızca olay adını yaz."}])
onerilen_olay = resp.content[0].text.strip()
yeni_durum = gecis_yap("Onaylandi", onerilen_olay)  # FSM geçerliliği zorlar
```

## 🔗 İlgili Kavramlar

- [Politika Katmanı (Policy Layer)](../policy-layer/policy-layer.md) — izin verilen eylemleri kısıtlayan tamamlayıcı katman.
- [Çıkarım Motoru (Reasoning Engine)](../reasoning-engine/reasoning-engine.md) — geçiş kararlarını işleten mantık.
- [Yörünge Değerlendirmesi (Trajectory Evaluation)](../trajectory-evaluation/trajectory-evaluation.md) — durum geçiş yolunu değerlendirme.
- Saga Deseni (Saga Pattern) — dağıtık işlemlerde durum yönetimi için akraba desen.
- Korkuluklar (Guardrails) — sürecin raydan çıkmasını engelleyen genel kavram.
