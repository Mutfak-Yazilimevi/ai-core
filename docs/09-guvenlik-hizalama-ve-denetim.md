# 9. Güvenlik, Hizalama ve Denetim

*Amaç: Ajanı güvenli, sınırlı ve denetlenebilir tutmak.*

Seviyeler: 🟢 Temel · 🔵 Orta · 🟠 İleri · 🔴 Uzman

## 🟢 Guardrails (Güvenlik Bariyerleri)
Ajanın zararlı, etik dışı veya sisteme hasar verebilecek istenmeyen eylemler
yapmasını engelleyen güvenlik kurallarıdır. Girdi ve çıktıları filtreleyerek
ajanın belirlenen sınırlar içinde kalmasını sağlar.

## 🟢 Hallucination (Halüsinasyon / Sanrı)
Ajanın (veya temel alınan dil modelinin) gerçek dışı, uydurma veya var olmayan
bilgileri son derece kendinden emin bir şekilde gerçekmiş gibi üretmesi
durumudur. Önlenmesi gereken temel risktir; Grounding ve RAG bu amaçla kullanılır.

## 🔵 Sandboxing (Korumalı Alan)
Yetkisiz erişimleri veya sistem hasarını önlemek amacıyla, ajanın veya
kullandığı araçların izole edilmiş, güvenli bir ortamda çalıştırılmasıdır.
Sandbox içindeki bir hata veya kötü niyetli eylem, ana sisteme zarar veremez.

## 🔵 HITL (Human-in-the-Loop — Döngüde İnsan)
Otonom iş akışındaki kritik karar aşamalarında insanın onayını, incelemesini
veya kontrolünü sürece dahil etmektir. Yüksek riskli eylemler (ödeme, silme,
yayınlama) öncesinde bir insanın onayını gerektirebilir; süreç onaya kadar durur.

## 🔵 Least Privilege (En Az Yetki)
Ajana veya araca yalnızca görevini yapması için gereken asgari erişim ve yetkiyi
verme güvenlik ilkesidir. Olası bir zafiyetin etki alanını daraltır.

## 🟠 Policy Layer (Politika Katmanı)
Ajanların daha üst düzey kararlar alırken uyması gereken iş kurallarının ve
prensiplerinin tanımlandığı katmandır. Hangi eylemlere izin verildiğini ve hangi
durumların yasak olduğunu merkezî olarak yönetir.

## 🟠 HOTL (Human-on-the-Loop — Döngü Üstünde İnsan)
Otonom sistemin çalışmaya devam ettiği, ancak insanın süreci dışarıdan/üstten
(Observability üzerinden) izleyerek yalnızca yanlış giden bir durum gördüğünde
müdahale ettiği yüksek otonomi seviyesidir.

## 🟠 Agent Identity (Ajan Kimliği)
Ajanların sistemlere güvenli bir şekilde giriş yapabilmesi ve doğrulanabilmesi
için kullanılan benzersiz kimlik bilgileri ve şifreleme anahtarlarıdır. Yetki ve
erişim denetimini (kim, neye, ne zaman erişebilir) mümkün kılar.

## 🔴 Alignment & Constitutional AI (Hizalama ve Anayasal YZ)
Ajanın davranışını insan değerleriyle uyumlu kılma; Constitutional AI ise bir
ilkeler dizisine (anayasa) göre ajanın kendini denetlemesi yaklaşımıdır.

## 🔴 Prompt Injection / Jailbreak (İstem Enjeksiyonu / Kısıt Aşımı)
Ajanları kötü niyetli girdilerle yönlendirme (prompt injection) veya güvenlik
kısıtlarını atlatma (jailbreak) saldırı türleridir. Savunması, ajan güvenliğinin
en kritik başlıklarından biridir.

## 🔴 Red Teaming (Kırmızı Takım)
Ajanın güvenlik bariyerlerini aşmak, mantıksal zafiyetlerini bulmak ve sisteme
zararlı işlemler yaptırmak amacıyla bilinçli ve simüle edilmiş saldırılar
düzenleyerek zafiyetleri proaktif olarak bulma sürecidir.
