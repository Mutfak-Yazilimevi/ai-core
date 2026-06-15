# Ajan Boru Hattı (Agentic Pipeline)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 6. İş Akışı ve Yürütme

Bir ajanın çıktısının, bir sonraki ajanın girdisi olduğu yapılandırılmış, ardışık operasyonlar dizisidir. Her aşama belirli bir işlemi yapar ve sonucu zincirdeki bir sonraki aşamaya iletir.

## Mini Senaryo

> Belge → OCR ajanı → çıkarım ajanı → doğrulama ajanı; her aşamanın çıktısı diğerine girer.

## 📖 Ayrıntılı Açıklama

Ajan boru hattı (agentic pipeline), bir görevi önceden tanımlanmış, sıralı aşamalara bölüp her aşamanın çıktısını bir sonraki aşamanın girdisi yapan yapılandırılmış bir iş akışıdır. İstem zincirleme (prompt chaining) kavramının ajanlara genelleştirilmiş hâlidir: her aşama özel bir göreve odaklanır (örneğin biri çıkarır, biri doğrular) ve aralarındaki veri akışı kod tarafından kontrol edilir.

Bu yaklaşım önemlidir; çünkü tek bir devasa istemle (prompt) karmaşık çok adımlı bir işi yaptırmak hem hata oranını artırır hem de hata ayıklamayı (debugging) zorlaştırır. Boru hattı, işi küçük ve denetlenebilir parçalara ayırarak her aşamada doğrulama, loglama ve yeniden deneme imkânı verir. Açık uçlu ajan döngüsünün (agent loop) aksine, boru hattının akışı önceden bellidir; bu da öngörülebilirlik ve maliyet kontrolü sağlar.

Nasıl çalışır? Geliştirici aşamaları ve aralarındaki sözleşmeyi (her aşamanın hangi formatta veri alıp vereceğini) tanımlar. Her aşama tipik olarak bir model çağrısıdır; bir aşamanın çıktısı (genellikle yapılandırılmış JSON) doğrudan sonraki çağrının mesajına yerleştirilir. Aşamalar arası dönüşüm, filtreleme veya zenginleştirme kodda yapılır.

Ne zaman kullanılır? Akışın adımları önceden bilindiğinde ve her adım net bir alt görevi temsil ettiğinde (belge işleme, içerik üretim hattı, ETL benzeri akışlar) idealdir. Ne zaman kullanılmaz? Adımların sırası veya gerekliliği çalışma anında belirleniyorsa (modelin kendi kararıyla araç seçmesi gerekiyorsa) açık uçlu ajan döngüsü daha uygundur.

Tuzaklar: Birinci tuzak hata yayılımıdır (error propagation) — erken bir aşamadaki hatalı çıktı tüm hattı bozar; bu yüzden aşamalar arası doğrulama şarttır. İkincisi, aşamalar arası format uyumsuzluğudur; yapısal çıktı (structured output) ile sözleşmeyi sıkı tutmak gerekir. Üçüncüsü, gereğinden fazla aşama eklemek gecikmeyi (latency) ve maliyeti çığ gibi büyütür.

## 🎬 Detaylı Senaryo

Bir sigorta şirketinin ("GüvenSigorta") hasar ekibi, müşteri tarafından yüklenen hasar belgelerini otomatik işlemek için üç aşamalı bir boru hattı kurar:

1. Müşteri, kaza tutanağının fotoğrafını yükler.
2. **Aşama 1 — OCR/Okuma ajanı:** Görüntüden ham metni çıkarır ve düz metin döndürür.
3. **Aşama 2 — Çıkarım ajanı:** Ham metinden yapılandırılmış alanları (`{"plaka": "...", "tarih": "...", "hasar_tipi": "..."}`) JSON olarak çıkarır.
4. Kod, JSON'un zorunlu alanlarını kontrol eder; eksik alan varsa hattı durdurup insana yönlendirir.
5. **Aşama 3 — Doğrulama ajanı:** Çıkarılan plakayı poliçe veritabanıyla karşılaştırır ve tutarlılık puanı üretir.
6. Doğrulama puanı eşiğin altındaysa talep "manuel inceleme" kuyruğuna düşer (HITL).
7. Puan yeterliyse hasar dosyası otomatik açılır ve müşteriye dosya numarası döner.
8. Ekip, her aşamanın girdi-çıktısını loglar; böylece bir hata olduğunda hangi aşamanın hatalı olduğu kolayca tespit edilir.

## 💻 Kullanım / Uygulama Örneği

Aşağıda iki aşamalı bir boru hattı görülmektedir: ilk çağrının çıktısı, ikinci çağrının girdisi olur (çıktı → girdi zinciri).

```python
import anthropic

client = anthropic.Anthropic()

def cagir(istem: str) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        thinking={"type": "adaptive"},
        messages=[{"role": "user", "content": istem}])
    return next(b.text for b in resp.content if b.type == "text")

ham_metin = "Kaza tutanağı: 34 ABC 123 plakalı araç, 12.06.2026'da hafif hasar."

# Aşama 1: çıkarım — çıktı bir sonraki aşamanın girdisi olacak
cikarim = cagir(f"Şu metinden plaka, tarih ve hasar tipini JSON olarak çıkar:\n{ham_metin}")

# Aşama 2: doğrulama — önceki aşamanın çıktısını girdi alır
dogrulama = cagir(f"Şu çıkarılan veriyi tutarlılık açısından değerlendir ve 0-100 puan ver:\n{cikarim}")

print(dogrulama)
```

İkinci olarak, aşamalar arasında kodla bir kontrol noktası eklemek (örn. `if "plaka" not in cikarim: insana_yonlendir()`) hata yayılımını erken keser.

## 🔗 İlgili Kavramlar

- [Prompt Chaining (İstem Zincirleme)](../../01-temel/prompt-chaining/prompt-chaining.md) — boru hattının temelindeki çıktı-girdi zinciri
- [Ajan Döngüsü (Agent Loop)](../agent-loop/agent-loop.md) — boru hattının açık uçlu, dinamik karşıtı
- [Fonksiyon Çağırma (Function Calling)](../function-calling/function-calling.md) — aşamalar arası yapısal veri üretimi
- [Devir İşlemleri (Handoffs)](../handoffs/handoffs.md) — aşamadan aşamaya kontrol aktarımı
- [Döngüde İnsan (HITL)](../hitl/hitl.md) — bir aşama eşiği geçemezse insana yönlendirme
