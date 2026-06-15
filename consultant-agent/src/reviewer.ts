/**
 * AI Kod İnceleme Ajanı (Pilot — çalışan sürüm).
 *
 * Pilot iş akışı (.github/workflows/ai-code-reviewer.yml) tarafından,
 * bir Pull Request açıldığında/güncellendiğinde çalıştırılır:
 *   1. PR'ın değişen dosyalarını ve diff'lerini (patch) çeker.
 *   2. Diff'i Claude'a göndererek yapılandırılmış inceleme bulguları ister.
 *   3. Geçerli satırlara SATIR İÇİ (inline) yorum + genel bir özet yorumu yazar.
 */
import Anthropic from "@anthropic-ai/sdk";
import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { MODEL } from "./config.js";

/** Tek istekte modele gönderilecek toplam diff için üst sınır (karakter). */
const MAX_DIFF_CHARS = 12000;
/** En fazla kaç satır içi yorum bırakılsın (gürültüyü önlemek için). */
const MAX_INLINE_COMMENTS = 25;
/** Yorumun sonuna eklenen imza. */
const SIGNATURE = "<!-- ai-code-reviewer -->";

interface Finding {
  file: string;
  /** Yeni dosyadaki (diff'in sağ tarafı) satır numarası. Opsiyonel. */
  line?: number;
  severity: "yüksek" | "orta" | "düşük";
  title: string;
  detail: string;
  suggestion?: string;
}

interface ChangedFile {
  filename: string;
  status: string;
  patch?: string;
}

const client = new Anthropic(); // ANTHROPIC_API_KEY ortamdan okunur.

async function main(): Promise<void> {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN tanımlı değil.");
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY (LLM_API_KEY secret'ı) tanımlı değil.");
  }

  const pr = context.payload.pull_request;
  if (!pr) {
    core.info("Pull request bağlamı yok — atlanıyor.");
    return;
  }

  const octokit = getOctokit(process.env.GITHUB_TOKEN);
  const ref = { owner: context.repo.owner, repo: context.repo.repo };
  const prNumber = pr.number as number;
  const headSha = (pr.head as { sha?: string } | undefined)?.sha;

  // 1) Değişen dosyaları ve patch'leri topla.
  const files = (await octokit.paginate(octokit.rest.pulls.listFiles, {
    ...ref,
    pull_number: prNumber,
    per_page: 100,
  })) as ChangedFile[];

  const diffBundle = buildDiffBundle(files);
  if (!diffBundle.trim()) {
    core.info("İncelenecek metin diff'i yok (ör. yalnızca ikili dosyalar) — atlanıyor.");
    return;
  }

  // 2) Claude'dan yapılandırılmış inceleme iste.
  const findings = await reviewDiff(diffBundle, pr.title as string);

  // 3) Satır içi yorumlara çevrilebilen bulguları, diff'e karşı doğrula.
  const validByFile = new Map<string, Set<number>>();
  for (const f of files) {
    if (f.patch) validByFile.set(f.filename, commentableLines(f.patch));
  }

  const inline: {
    path: string;
    line: number;
    side: "RIGHT";
    body: string;
  }[] = [];
  for (const f of findings) {
    if (inline.length >= MAX_INLINE_COMMENTS) break;
    if (f.line && validByFile.get(f.file)?.has(f.line)) {
      inline.push({
        path: f.file,
        line: f.line,
        side: "RIGHT",
        body: renderInline(f),
      });
    }
  }

  const summary = renderSummary(findings);

  // 4) Tek bir PR incelemesi: özet gövde + satır içi yorumlar.
  try {
    await octokit.rest.pulls.createReview({
      ...ref,
      pull_number: prNumber,
      event: "COMMENT",
      body: summary,
      ...(headSha ? { commit_id: headSha } : {}),
      ...(inline.length > 0 ? { comments: inline } : {}),
    });
    core.info(`İnceleme yazıldı: ${findings.length} bulgu, ${inline.length} satır içi yorum.`);
  } catch (err) {
    // Satır eşleştirme reddedilirse (422) güvenli geri dönüş: tek özet yorumu.
    core.warning(`Satır içi inceleme başarısız, özet yoruma düşülüyor: ${(err as Error).message}`);
    await octokit.rest.issues.createComment({ ...ref, issue_number: prNumber, body: summary });
  }
}

function buildDiffBundle(files: ChangedFile[]): string {
  const parts: string[] = [];
  let total = 0;
  for (const f of files) {
    if (!f.patch) continue; // ikili veya çok büyük dosyalar
    const block = `### ${f.filename} (${f.status})\n\`\`\`diff\n${f.patch}\n\`\`\`\n`;
    if (total + block.length > MAX_DIFF_CHARS) {
      parts.push(`\n_(Diff kırpıldı; kalan dosyalar bu incelemeye dahil edilmedi.)_`);
      break;
    }
    parts.push(block);
    total += block.length;
  }
  return parts.join("\n");
}

/**
 * Bir patch'ten, yorum bırakılabilecek (yeni dosyadaki) satır numaralarını çıkarır:
 * eklenen ('+') ve bağlam (' ') satırları. Silinen ('-') satırlar sayılmaz.
 */
function commentableLines(patch: string): Set<number> {
  const valid = new Set<number>();
  let newLine = 0;
  for (const raw of patch.split("\n")) {
    if (raw.startsWith("@@")) {
      const m = raw.match(/\+(\d+)/); // @@ -a,b +c,d @@  → c
      newLine = m ? parseInt(m[1], 10) : newLine;
      continue;
    }
    if (raw.startsWith("\\")) continue; // "\ No newline at end of file"
    if (raw.startsWith("+")) {
      valid.add(newLine);
      newLine++;
    } else if (raw.startsWith("-")) {
      // silinen satır: yeni dosyada karşılığı yok
    } else {
      // bağlam satırı
      valid.add(newLine);
      newLine++;
    }
  }
  return valid;
}

async function reviewDiff(diff: string, title: string): Promise<Finding[]> {
  const system = `Sen kıdemli bir yazılım mühendisi ve titiz bir kod gözden geçiricisin.
Sana bir Pull Request'in diff'i verilir. Yalnızca DEĞİŞEN satırlara odaklan.
Şunları ara: hatalar (bug), güvenlik açıkları, sızıntılar, hatalı mantık, eksik
hata yönetimi, performans sorunları ve net iyileştirmeler. Stil/biçim nitelemesi yapma.
Emin olmadığın yerde düşük önem ver. Türkçe yaz.

Her bulgu için, sorunun olduğu satırın YENİ dosyadaki numarasını "line" alanında ver.
Bu, diff'teki ilgili hunk başlığındaki (@@ -a,b +c,d @@) sağ taraf (+) sayımına göre,
eklenen veya bağlam satırının numarasıdır. Satırı kesin belirleyemiyorsan "line" alanını boş bırak.

Yanıtını YALNIZCA aşağıdaki şemada bir JSON dizisi olarak ver (başka metin ekleme):
[
  {
    "file": "yol/dosya.ext",
    "line": 42,
    "severity": "yüksek" | "orta" | "düşük",
    "title": "kısa başlık",
    "detail": "sorunun net açıklaması",
    "suggestion": "önerilen düzeltme (opsiyonel)"
  }
]
Hiç bulgu yoksa boş dizi [] döndür.`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    thinking: { type: "adaptive" } as unknown as Anthropic.MessageCreateParams["thinking"],
    system,
    messages: [{ role: "user", content: `PR başlığı: ${title}\n\nDiff:\n${diff}` }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return parseFindings(text);
}

/** Modelin metninden JSON bulgu dizisini güvenli biçimde ayıklar. */
function parseFindings(text: string): Finding[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return [];
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((f) => f && typeof f.file === "string" && typeof f.detail === "string")
      .map((f) => {
        const lineNum = Number(f.line);
        return {
          file: String(f.file),
          line: Number.isInteger(lineNum) && lineNum > 0 ? lineNum : undefined,
          severity: normalizeSeverity(f.severity),
          title: String(f.title ?? "Bulgu"),
          detail: String(f.detail),
          suggestion: f.suggestion ? String(f.suggestion) : undefined,
        } satisfies Finding;
      });
  } catch {
    return [];
  }
}

function normalizeSeverity(s: unknown): Finding["severity"] {
  const v = String(s).toLowerCase();
  if (v.startsWith("yük")) return "yüksek";
  if (v.startsWith("düş") || v.startsWith("dus")) return "düşük";
  return "orta";
}

const ICON: Record<Finding["severity"], string> = {
  yüksek: "🔴",
  orta: "🟠",
  düşük: "🟡",
};

/** Tek bir satır içi yorum gövdesi. */
function renderInline(f: Finding): string {
  const lines = [`${ICON[f.severity]} **${f.title}** _(${f.severity})_`, "", f.detail];
  if (f.suggestion) lines.push("", `> 💡 ${f.suggestion}`);
  lines.push("", SIGNATURE);
  return lines.join("\n");
}

/** PR incelemesinin üst gövdesi: tüm bulguların özeti. */
function renderSummary(findings: Finding[]): string {
  const header = `## 🤖 AI Kod İnceleme Ajanı (Pilot)\n`;
  if (findings.length === 0) {
    return `${header}\nDeğişikliklerde belirgin bir sorun tespit etmedim. 👍\n\n${SIGNATURE}`;
  }

  const order: Finding["severity"][] = ["yüksek", "orta", "düşük"];
  const counts = order
    .map((s) => `${ICON[s]} ${findings.filter((f) => f.severity === s).length} ${s}`)
    .join(" · ");

  const lines: string[] = [header, `**Özet:** ${counts}`, ""];
  lines.push("İlgili satırlara ayrıca satır içi yorumlar bırakıldı.", "");
  for (const sev of order) {
    const group = findings.filter((f) => f.severity === sev);
    if (group.length === 0) continue;
    lines.push(`### ${ICON[sev]} ${sev.toUpperCase()} öncelik`);
    for (const f of group) {
      const loc = f.line ? `${f.file}:${f.line}` : f.file;
      lines.push(`- **\`${loc}\` — ${f.title}**`);
      lines.push(`  ${f.detail}`);
      if (f.suggestion) lines.push(`  > 💡 ${f.suggestion}`);
    }
    lines.push("");
  }
  lines.push(`_Bu otomatik bir ön incelemedir; nihai karar gözden geçiren kişiye aittir._`);
  lines.push(`\n${SIGNATURE}`);
  return lines.join("\n");
}

main().catch((err) => {
  core.setFailed(`AI Kod İnceleme Ajanı hatası: ${(err as Error).message}`);
});
