# Devir İşlemleri (Handoffs)

> **Seviye:** 🔵 Orta (Intermediate)  
> **Kategori:** 6. İş Akışı ve Yürütme

Bir görevin bağlamının ve kontrolünün, bir ajandan diğer bir uzman ajana kesintisiz ve sorunsuz bir şekilde aktarılmasıdır. Devir sırasında ilgili tüm bilgi (görev durumu, geçmiş, hedef) yeni ajana taşınır.

## Mini Senaryo

> Genel destek ajanı, teknik bir soruyu tüm sohbet geçmişiyle birlikte uzman teknik ajana devreder.

## 📖 Ayrıntılı Açıklama

Devir işlemi (handoff), bir görevin kontrolünün ve bağlamının (context) bir ajandan başka, genelde daha uzman bir ajana kesintisiz aktarılmasıdır. Devirde sadece "topu atmak" yeterli değildir; görev durumu, sohbet geçmişi, hedef ve toplanmış ara bulgular yeni ajana taşınır ki kullanıcı baştan anlatmak zorunda kalmasın ve süreç kaldığı yerden devam etsin.

Bu kavram önemlidir; çünkü çok ajanlı sistemlerde (multi-agent systems) tek bir ajanın her konuda uzman olması beklenemez. Uzmanlaşmış ajanlar (yönlendirme/triage, faturalama, teknik destek) daha küçük, odaklı sistem istemleri (system prompts) ve daha dar araç setleriyle çalışır; bu da hem doğruluğu hem güvenliği (least privilege) artırır. Devir mekanizması, bu uzman ajanları sorunsuz bir kullanıcı deneyimine bağlayan tutkaldır.

Nasıl çalışır? Genellikle bir yönlendirici (orchestrator/router) ajan veya "handoff aracı" vardır. Mevcut ajan, görevin kendi uzmanlık alanı dışına çıktığını fark edince bir devir aracını (örn. `teknik_ajana_devret`) çağırır; bu çağrının argümanı, devredilen bağlamın özeti ve hedeftir. Sistem, ilgili geçmişi yeni ajanın bağlam penceresine yükler ve kontrolü ona verir. Bazı tasarımlarda devir geri de gelebilir (uzman işi bitince genel ajana iade eder).

Ne zaman kullanılır? Farklı uzmanlık veya farklı yetki gerektiren çok adımlı iş akışlarında, müşteri destek yönlendirmesinde, karmaşık görevlerin alt uzmanlara dağıtımında. Ne zaman gerekmez? Tek bir ajan tüm görevi yeterli doğrulukla yapabiliyorsa, devir gereksiz karmaşıklık ve gecikme (latency) ekler.

Tuzaklar: Birincisi, bağlam kaybı; devir sırasında kritik bilgi taşınmazsa kullanıcı kendini tekrarlar. İkincisi, "ping-pong" — ajanlar görevi birbirine sürekli devredip kimse çözmez; bir devir sayısı sınırı şarttır. Üçüncüsü, tüm geçmişi körlemesine aktarmak; bağlam penceresini şişirir, ilgili özeti taşımak daha iyidir.

## 🎬 Detaylı Senaryo

Bir telekom firması ("BağlantıNet") müşteri desteğinde üç uzman ajan kullanır: genel, faturalama ve teknik.

1. Müşteri genel ajana yazar: "İnternetim 2 gündür çok yavaş ve son faturam da yüksek geldi."
2. Genel ajan iki ayrı konu olduğunu anlar; önce teknik konuyu ele almaya karar verir.
3. Genel ajan `teknik_ajana_devret` aracını çağırır; argüman olarak sorun özeti ("2 gündür yavaş internet, müşteri no M-77") ve sohbet geçmişini taşır.
4. Sistem teknik ajanı, bu bağlamla başlatır; teknik ajan baştan soru sormaz, doğrudan hat testini başlatır.
5. Teknik ajan sorunu çözüp ("modem firmware güncellendi") kontrolü genel ajana iade eder.
6. Genel ajan şimdi faturalama konusunu görür ve `faturalama_ajanina_devret` aracını çağırır.
7. Faturalama ajanı fazla ücreti tespit edip iade başlatır.
8. Ekip, devir sayısına 4 sınırı koyar ve her devirde taşınan bağlamı loglar; böylece ping-pong ve bağlam kaybı önlenir.

## 💻 Kullanım / Uygulama Örneği

Aşağıda bir devir aracıyla bağlamın başka bir ajana aktarılması görülür: ilk ajan devre karar verir, kod bağlamı ikinci ajanın sistem istemine ve mesajlarına taşır.

```python
import anthropic

client = anthropic.Anthropic()

UZMAN_ISTEMLERI = {
    "teknik": "Sen kıdemli bir teknik destek uzmanısın. Bağlantı sorunlarını çözersin.",
    "faturalama": "Sen bir faturalama uzmanısın. Ücret ve iade işlemlerini yönetirsin.",
}

def ajan_calistir(rol: str, devredilen_baglam: str, gecmis: list) -> str:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024,
        system=UZMAN_ISTEMLERI[rol],
        # Devredilen bağlam ilk mesaj olarak yeni ajana taşınır
        messages=[{"role": "user", "content": f"[Devralınan bağlam]\n{devredilen_baglam}"}] + gecmis)
    return next(b.text for b in resp.content if b.type == "text")

# Genel ajan teknik konuya devreder; özet + geçmiş aktarılır
ozet = "Müşteri M-77: 2 gündür internet yavaş. Genel ajandan teknik ajana devir."
cevap = ajan_calistir("teknik", ozet, gecmis=[{"role": "user", "content": "İnternetim çok yavaş."}])
print(cevap)
```

İkinci olarak, devri bir araç (tool) olarak modelin kendisine bırakmak yaygındır: `devret(hedef_ajan, baglam_ozeti)` aracı tanımlanır ve model uzmanlık dışına çıkınca bunu çağırır.

## 🔗 İlgili Kavramlar

- [Ajan Döngüsü (Agent Loop)](../agent-loop/agent-loop.md) — bir ajan çıkmaza girince devir tetiklenir
- [Ajan Boru Hattı (Agentic Pipeline)](../agentic-pipeline/agentic-pipeline.md) — aşamadan aşamaya yapısal kontrol aktarımı
- [Bağlam Penceresi (Context Window)](../context-window/context-window.md) — devirde taşınan bağlamın sığması gereken sınır
- [En Az Yetki (Least Privilege)](../least-privilege/least-privilege.md) — uzman ajanların dar yetkili olması
- Çok Ajanlı Sistem (Multi-agent System) — devirlerin bağladığı uzman ajan topluluğu
