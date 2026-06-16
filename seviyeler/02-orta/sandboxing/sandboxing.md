# Korumalı Alan (Sandboxing)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 9. Güvenlik, Hizalama ve Denetim

Yetkisiz erişimleri veya sistem hasarını önlemek amacıyla, ajanın veya kullandığı araçların izole edilmiş, güvenli bir ortamda çalıştırılmasıdır. Sandbox içindeki bir hata veya kötü niyetli eylem, ana sisteme zarar veremez.

## Mini Senaryo

> Ajanın yazdığı kod, ana sunucuyu etkileyemeyen izole bir konteynerde çalıştırılır.

## 📖 Ayrıntılı Açıklama

Korumalı alan (sandboxing), bir ajanın ürettiği kodun veya kullandığı araçların, ana sisteme zarar veremeyecek şekilde izole, sınırlandırılmış bir ortamda çalıştırılmasıdır. Sandbox; dosya sistemi, ağ erişimi, bellek ve CPU gibi kaynaklara erişimi kısıtlar. Böylece ajanın hatalı veya kötü niyetli bir eylemi, yalnızca bu kapalı kutu içinde etkili olur; dışarı sızamaz.

Bu yaklaşım önemlidir çünkü ajanlar giderek daha fazla "eylem alma" yetkisi kazanıyor: kod çalıştırma, dosya yazma, komut çalıştırma. Bu güçlü yetenekler aynı zamanda büyük risktir; modelin uydurduğu (hallucination) bir `rm -rf` komutu ya da kötü niyetli bir istem enjeksiyonu (prompt injection) sistemleri tehlikeye atabilir. Sandboxing, "en az ayrıcalık" (least privilege) ilkesini uygulayarak hasar yarıçapını (blast radius) sınırlandırır ve güvenli deney yapma alanı sağlar.

Çalışma biçimi katmanlıdır. En yaygın yöntem konteynerleştirmedir (containerization, örn. Docker): kod, ana makineden izole bir konteynerde, kısıtlı kaynaklarla ve ağ erişimi kapalı/sınırlı olarak çalışır. Daha hafif yöntemler arasında ayrı bir alt süreç (subprocess) içinde zaman aşımı ve kaynak sınırlarıyla çalıştırma, sanal makineler veya WebAssembly tabanlı izolasyon vardır. Çıktı ve hatalar yakalanıp ajana geri bildirilir; ortam her çalıştırmadan sonra temizlenir (ephemeral).

Sandboxing'i, ajan güvenilmeyen veya dinamik üretilmiş kod çalıştırıyorsa, dış komutlar veya araçlar tetikliyorsa daima kullanın: kod yorumlayıcı (code interpreter) araçları, otomatik test çalıştırma, kullanıcıdan gelen betikler gibi. Buna karşılık, ajan yalnızca metin üretiyor ve hiçbir yan etkili eylem almıyorsa sandbox gereksiz işletim yükü (overhead) ekler.

Tuzaklar: izolasyonun tam olmaması (konteyner kaçışı), kaynak sınırlarının konmaması nedeniyle bir döngünün CPU/bellek tüketmesi, ve ağ erişiminin gereğinden fazla açık bırakılarak veri sızıntısına yol açmasıdır. İyi bir sandbox; zaman aşımı (timeout), bellek/CPU kotaları, salt okunur dosya sistemi, ağ izolasyonu ve her çalıştırmada sıfırlanan geçici ortam içerir.

## 🎬 Detaylı Senaryo

"KodLab" adlı bir eğitim platformunun ajanı, öğrencilerin Python ödevlerini otomatik çalıştırıp değerlendiriyor.

1. Öğrenci bir Python çözümü gönderir; bu kod güvenilmez kabul edilir.
2. Ajan kodu doğrudan sunucuda değil, izole bir konteynerde çalıştırmaya karar verir.
3. Konteyner; ağ erişimi kapalı, 256 MB bellek ve 5 saniye zaman aşımı ile başlatılır.
4. Dosya sistemi salt okunur; yalnızca geçici bir `/tmp` dizini yazılabilir.
5. Kod çalışırken sonsuz döngüye girerse zaman aşımı süreci sonlandırır.
6. Standart çıktı ve hata akışı yakalanır; ana sisteme hiçbir kalıcı etki olmaz.
7. Ajan, yakalanan çıktıyı beklenen sonuçla karşılaştırıp not verir.
8. Bir öğrencinin kötü niyetli `os.system("rm -rf /")` denemesi konteyner içinde kalır, ana sistem etkilenmez.
9. Konteyner çalıştırma sonrası tamamen yok edilir (ephemeral).
10. Telemetri, her çalıştırmanın süresini ve kaynak kullanımını kaydeder.

## 💻 Kullanım / Uygulama Örneği

Aşağıdaki örnek, güvenilmez kodu zaman aşımı ve kaynak sınırlarıyla bir alt süreçte (subprocess) izole çalıştırır.

```python
import subprocess

def guvenli_calistir(kod: str) -> str:
    try:
        sonuc = subprocess.run(
            ["python3", "-c", kod],
            capture_output=True, text=True,
            timeout=5,                 # zaman aşımı: sonsuz döngüyü kes
            # Üretimde: ayrı kullanıcı, ağ kapalı, salt okunur FS, konteyner
        )
        return sonuc.stdout or sonuc.stderr
    except subprocess.TimeoutExpired:
        return "Hata: zaman aşımı (izolasyon korudu)."

print(guvenli_calistir("print(2 + 2)"))
```

Üretim ortamında Docker ile konteyner tabanlı izolasyon tercih edilir (kaynaklar ve ağ kısıtlanır).

```yaml
# docker-compose: izole, kısıtlı ajan kod çalıştırıcı
services:
  kod-calistirici:
    image: python:3.12-slim
    network_mode: none          # ağ erişimi kapalı
    read_only: true             # salt okunur dosya sistemi
    mem_limit: 256m             # bellek sınırı
    cpus: "0.5"                 # CPU sınırı
    tmpfs:
      - /tmp                    # yalnızca geçici yazılabilir alan
```

## 🔗 İlgili Kavramlar

- [ReAct (Reasoning + Acting)](../react/react.md) — eylem (araç çağrısı) alan ajanlar
- [Subagent (Alt Ajan)](../subagent/subagent.md) — izole çalıştırılan uzman ajanlar
- [Telemetry (Telemetri)](../telemetry/telemetry.md) — çalıştırma kaynaklarını izleme
- En az ayrıcalık (least privilege) — minimum yetkiyle çalışma
- İstem enjeksiyonu (prompt injection) — sandbox'ın azalttığı bir tehdit
