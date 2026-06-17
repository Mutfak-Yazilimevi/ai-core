# 🌐 Danışman Web Arayüzü (GitHub Pages)

Danışman ajanıyla **GitHub Issues ekranına girmeden**, tarayıcıdan sohbet etmenizi
sağlayan statik bir web uygulaması. Sunucu yoktur: sayfa, sizin GitHub token'ınızla
repoda bir Issue açıp yorum atar (bu, [danışman ajanını](../consultant-agent/) çalıştıran
Action'ı tetikler) ve ajanın yanıtlarını yoklayarak (polling) sohbet olarak gösterir.

```
Tarayıcı (web/)  ──Issue/yorum (GitHub API)──▶  GitHub Actions ──▶  Danışman ajanı
      ▲                                                                   │
      └────────────────  yorumları yokla (polling)  ◀──────  ajanın yanıtı ┘
```

## Yayınlama (GitHub Pages)

1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. `web/` altındaki bir değişiklik `main`'e gidince
   [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) otomatik dağıtır.
3. Yayın adresi genelde: `https://<kullanıcı-adınız>.github.io/<repo>/`
   (bu depo için: `https://mutfak-yazilimevi.github.io/ai-core/`).

> Yerelde denemek için: `web/` içinde `python3 -m http.server` çalıştırıp
> `http://localhost:8000` adresini açın.

## Kullanım

1. **Ayarlar** → **Depo** (ör. `Mutfak-Yazilimevi/ai-core`) ve **GitHub Token**'ı girin, kaydedin.
2. **Yeni danışmanlık başlatın**: kısa hedefinizi yazın → ajan Issue'da yanıtlamaya başlar.
3. Sohbet edin; ajan yeterli bilgiyi toplayınca **AI Benimseme Analizi & Yol Haritası**
   raporunu üretir. Dilerseniz pilotu kurmasını isteyin.

## GitHub Token (kendinize ait)

Sayfa, Issue açıp yorum yazmak için bir **fine-grained Personal Access Token** kullanır:

- GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
- İlgili depoya **Repository permissions → Issues: Read and write** izni verin.
- Token'ı Ayarlar'a yapıştırın.

> 🔒 **Güvenlik:** Token yalnızca **bu tarayıcının** `localStorage`'ında saklanır;
> başka hiçbir sunucuya gönderilmez — sadece doğrudan `api.github.com`'a. Ortak/halka
> açık bir bilgisayarda kullandıysanız **"Token'ı temizle"** ile silin. Token'ı
> mümkün olan en dar izinle (yalnızca Issues) ve kısa ömürle oluşturun.

## Sorun giderme

- **Pages deploy ~2 sn'de hatayla bitiyor / `Get Pages site failed`:** Pages henüz
  "GitHub Actions" kaynağıyla açık değildir. Çözüm: **Settings → Pages → Build and
  deployment → Source: GitHub Actions** seçin, sonra Actions sekmesinden workflow'u
  **Re-run** edin (veya `web/`'e küçük bir değişiklik gönderin). Workflow ayrıca
  `configure-pages` adımında `enablement: true` ile otomatik açmayı dener; ancak bazı
  organizasyon repolarında politika gereği bu engellenebilir — o durumda ayarı elle açın.

## Notlar

- Ajanın yanıtı, arka planda GitHub Actions çalıştığı için **~10–60 sn** sürebilir;
  arayüz bu sırada "Ajan yanıt hazırlıyor…" gösterir ve yorumları yoklar.
- Danışmanın çalışması için repoda `LLM_API_KEY` secret'ı tanımlı ve **Issues** açık olmalıdır
  (bkz. [`consultant-agent/README.md`](../consultant-agent/README.md)).
- Markdown render için `marked`, güvenli temizleme için `DOMPurify` CDN'den yüklenir;
  ajan çıktısı görüntülenmeden önce sanitize edilir.
