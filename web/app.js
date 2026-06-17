/*
 * AI Benimseme Danışmanı — statik web arayüzü.
 *
 * Mimari (sunucusuz): Tarayıcı, kullanıcının kendi GitHub token'ıyla repoda bir
 * Issue açar ve yorum atar. Bu, danışman ajanını (GitHub Actions) tetikler. Sayfa,
 * Issue yorumlarını periyodik olarak yoklayarak (polling) ajanın yanıtlarını
 * sohbet olarak gösterir.
 *
 * Token yalnızca bu tarayıcının localStorage'ında saklanır; başka hiçbir yere
 * gönderilmez — sadece doğrudan api.github.com'a.
 */

const API = "https://api.github.com";
const POLL_MS = 5000;
const BOT_LOGIN = "github-actions[bot]";
const DEFAULT_REPO = "Mutfak-Yazilimevi/ai-core";

const LS = {
  repo: "consultant:repo",
  token: "consultant:token",
  issue: (repo) => `consultant:issue:${repo}`,
};

const $ = (id) => document.getElementById(id);
const el = {
  settings: $("settings"), settingsBtn: $("settingsBtn"),
  repoInput: $("repoInput"), tokenInput: $("tokenInput"),
  saveSettings: $("saveSettings"), clearToken: $("clearToken"),
  start: $("start"), firstMessage: $("firstMessage"), startBtn: $("startBtn"), startError: $("startError"),
  chat: $("chat"), issueMeta: $("issueMeta"), newBtn: $("newBtn"),
  messages: $("messages"), typing: $("typing"),
  composer: $("composer"), composerInput: $("composerInput"), sendBtn: $("sendBtn"), chatError: $("chatError"),
};

let cfg = { repo: "", token: "" };
let issueNo = null;
let pollTimer = null;
let lastCount = -1;     // bilinen yorum sayısı (issue gövdesi dahil)
let waitingBot = false; // kullanıcı mesaj attı, bot yanıtı bekleniyor

/* ---------- Yardımcılar ---------- */

function loadCfg() {
  cfg.repo = localStorage.getItem(LS.repo) || DEFAULT_REPO;
  cfg.token = localStorage.getItem(LS.token) || "";
  el.repoInput.value = cfg.repo;
  el.tokenInput.value = cfg.token;
  issueNo = Number(localStorage.getItem(LS.issue(cfg.repo))) || null;
}

function md(text) {
  // Ajan çıktısı Markdown; XSS'e karşı sanitize edilir.
  return DOMPurify.sanitize(marked.parse(text || ""));
}

function esc(text) {
  const d = document.createElement("div");
  d.textContent = text || "";
  return d.innerHTML.replace(/\n/g, "<br>");
}

async function gh(path, options = {}) {
  if (!cfg.token) throw new Error("Önce Ayarlar'dan GitHub token girin.");
  const res = await fetch(API + path, {
    ...options,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).message || ""; } catch { /* yok */ }
    if (res.status === 401) throw new Error("Token geçersiz veya süresi dolmuş (401).");
    if (res.status === 403) throw new Error("Erişim reddedildi / oran sınırı (403). " + detail);
    if (res.status === 404) throw new Error("Depo veya kayıt bulunamadı (404). Repo adını ve token iznini kontrol edin.");
    throw new Error(`GitHub API hatası ${res.status}. ${detail}`);
  }
  return res.status === 204 ? null : res.json();
}

function ownerRepo() {
  const [owner, repo] = cfg.repo.split("/");
  return { owner: (owner || "").trim(), repo: (repo || "").trim() };
}

/* ---------- Görünüm yönetimi ---------- */

function show(view) {
  el.start.classList.toggle("hidden", view !== "start");
  el.chat.classList.toggle("hidden", view !== "chat");
}

function setTyping(on) {
  el.typing.classList.toggle("hidden", !on);
}

/* ---------- Sohbet ---------- */

function bubble(role, html, who) {
  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "bot" ? "🤖" : "🧑";
  avatar.title = who || "";
  const b = document.createElement("div");
  b.className = "bubble";
  b.innerHTML = html;
  wrap.append(avatar, b);
  return wrap;
}

function renderConversation(issue, comments) {
  el.messages.innerHTML = "";

  // Issue gövdesi = ilk kullanıcı mesajı
  if (issue.body && issue.body.trim()) {
    el.messages.appendChild(bubble("user", esc(issue.body), issue.user?.login));
  }
  for (const c of comments) {
    const isBot = c.user?.login === BOT_LOGIN || c.user?.type === "Bot";
    el.messages.appendChild(
      isBot ? bubble("bot", md(c.body), c.user?.login) : bubble("user", esc(c.body), c.user?.login),
    );
  }

  if (issue.state === "closed") {
    const banner = document.createElement("div");
    banner.className = "banner";
    banner.textContent = "✅ Rapor teslim edildi. Pilotu kurmak için yine de yazabilirsiniz.";
    el.messages.appendChild(banner);
  }

  el.messages.scrollTop = el.messages.scrollHeight;
  el.issueMeta.textContent = `#${issue.number} · ${issue.state === "closed" ? "kapandı (rapor hazır)" : "açık"}`;

  // Bot yanıtı geldi mi? (typing göstergesini kapat)
  const count = (issue.body?.trim() ? 1 : 0) + comments.length;
  const lastIsBot = comments.length && (comments[comments.length - 1].user?.login === BOT_LOGIN);
  if (waitingBot && lastIsBot && count !== lastCount) {
    waitingBot = false;
    setTyping(false);
  }
  lastCount = count;
}

async function refresh() {
  if (!issueNo) return;
  const { owner, repo } = ownerRepo();
  try {
    const [issue, comments] = await Promise.all([
      gh(`/repos/${owner}/${repo}/issues/${issueNo}`),
      gh(`/repos/${owner}/${repo}/issues/${issueNo}/comments?per_page=100`),
    ]);
    el.chatError.textContent = "";
    renderConversation(issue, comments);
  } catch (e) {
    el.chatError.textContent = e.message;
  }
}

function startPolling() {
  stopPolling();
  pollTimer = setInterval(refresh, POLL_MS);
}
function stopPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
}

/* ---------- Eylemler ---------- */

async function startConsult() {
  el.startError.textContent = "";
  const msg = el.firstMessage.value.trim();
  if (!msg) { el.startError.textContent = "Lütfen kısa bir mesaj yazın."; return; }
  const { owner, repo } = ownerRepo();
  if (!owner || !repo) { el.startError.textContent = "Geçerli bir depo girin (owner/repo)."; return; }

  el.startBtn.disabled = true;
  el.startBtn.textContent = "Başlatılıyor…";
  try {
    const issue = await gh(`/repos/${owner}/${repo}/issues`, {
      method: "POST",
      body: JSON.stringify({
        title: "[Danışmanlık] AI Benimseme Analizi (Web)",
        body: msg,
        labels: ["consultant"],
      }),
    });
    issueNo = issue.number;
    localStorage.setItem(LS.issue(cfg.repo), String(issueNo));
    lastCount = -1;
    waitingBot = true;
    setTyping(true);
    show("chat");
    await refresh();
    startPolling();
  } catch (e) {
    el.startError.textContent = e.message;
  } finally {
    el.startBtn.disabled = false;
    el.startBtn.textContent = "Danışmanlığı Başlat";
  }
}

async function sendMessage(text) {
  const { owner, repo } = ownerRepo();
  el.chatError.textContent = "";
  el.sendBtn.disabled = true;
  try {
    await gh(`/repos/${owner}/${repo}/issues/${issueNo}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: text }),
    });
    waitingBot = true;
    setTyping(true);
    await refresh();
  } catch (e) {
    el.chatError.textContent = e.message;
  } finally {
    el.sendBtn.disabled = false;
  }
}

function newConsult() {
  stopPolling();
  issueNo = null;
  localStorage.removeItem(LS.issue(cfg.repo));
  el.firstMessage.value = "";
  el.messages.innerHTML = "";
  setTyping(false);
  show("start");
}

/* ---------- Başlatma & olaylar ---------- */

function openSettings(force) {
  el.settings.classList.toggle("hidden", !force && !el.settings.classList.contains("hidden"));
  if (force) el.settings.classList.remove("hidden");
}

el.settingsBtn.addEventListener("click", () => el.settings.classList.toggle("hidden"));

el.saveSettings.addEventListener("click", () => {
  cfg.repo = (el.repoInput.value.trim() || DEFAULT_REPO);
  cfg.token = el.tokenInput.value.trim();
  localStorage.setItem(LS.repo, cfg.repo);
  localStorage.setItem(LS.token, cfg.token);
  el.settings.classList.add("hidden");
  // Repo değişmiş olabilir → o repoya ait kayıtlı issue'yu yükle
  issueNo = Number(localStorage.getItem(LS.issue(cfg.repo))) || null;
  boot();
});

el.clearToken.addEventListener("click", () => {
  localStorage.removeItem(LS.token);
  cfg.token = "";
  el.tokenInput.value = "";
});

el.startBtn.addEventListener("click", startConsult);
el.newBtn.addEventListener("click", newConsult);

el.composer.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = el.composerInput.value.trim();
  if (!text) return;
  el.composerInput.value = "";
  sendMessage(text);
});
// Enter ile gönder (Shift+Enter = yeni satır)
el.composerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    el.composer.requestSubmit();
  }
});

function boot() {
  stopPolling();
  if (!cfg.token) {
    el.settings.classList.remove("hidden");
    show("start");
    return;
  }
  if (issueNo) {
    show("chat");
    lastCount = -1;
    refresh();
    startPolling();
  } else {
    show("start");
  }
}

loadCfg();
boot();
