/**
 * AI Kod İnceleme Ajanı (Pilot — çalışan sürüm).
 *
 * Pilot iş akışı (.github/workflows/ai-code-reviewer.yml) tarafından,
 * bir Pull Request açıldığında/güncellendiğinde çalıştırılır:
 *   1. PR'ın değişen dosyalarını ve diff'lerini (patch) çeker.
 *   2. Diff'i Claude'a göndererek yapılandırılmış inceleme bulguları ister.
 *   3. Bulguları, PR'a tek bir derli toplu Markdown yorumu olarak yazar.
 */
import Anthropic from "@anthropic-ai/sdk";
import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { MODEL } from "./config.js";

/** Tek istekte modele gönderilecek toplam diff için üst sınır (karakter). */
const MAX_DIFF_CHARS = 12000;
/** Yorumun sonuna eklenen imza (kendi yorumlarını ayırt etmek için). */
const SIGNATURE = "<!-- ai-code-reviewer -->";

interface Finding {
  file: string;
  severity: "yüksek" | "orta" | "düşük";
  title: string;
  detail: string;
  suggestion?: string;
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

  // 1) Değişen dosyaları ve patch'leri topla.
  const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
    ...ref,
    pull_number: prNumber,
    per_page: 100,
  });

  const diffBundle = buildDiffBundle(files);
  if (!diffBundle.trim()) {
    core.info("İncelenecek metin diff'i yok (ör. yalnızca ikili dosyalar) — atlanıyor.");
    return;
  }

  // 2) Claude'dan yapılandırılmış inceleme iste.
  const findings = await reviewDiff(diffBundle, pr.title as string);

  // 3) PR'a derli toplu bir yorum yaz.
  const body = renderReview(findings);
  await octokit.rest.issues.createComment({
    ...ref,
    issue_number: prNumber,
    body,
  });
  core.info(`İnceleme yorumu yazıldı (${findings.length} bulgu).`);
}

function buildDiffBundle(
  files: { filename: string; status: string; patch?: string }[],
): string {
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

async function reviewDiff(diff: string, title: string): Promise<Finding[]> {
  const system = `Sen kıdemli bir yazılım mühendisi ve titiz bir kod gözden geçiricisin.
Sana bir Pull Request'in diff'i verilir. Yalnızca DEĞİŞEN satırlara odaklan.
Şunları ara: hatalar (bug), güvenlik açıkları, sızıntılar, hatalı mantık, eksik
hata yönetimi, performans sorunları ve net iyileştirmeler. Stil/biçim nitelemesi yapma.
Emin olmadığın yerde düşük önem ver. Türkçe yaz.

Yanıtını YALNIZCA aşağıdaki şemada bir JSON dizisi olarak ver (başka metin ekleme):
[
  {
    "file": "yol/dosya.ext",
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
    messages: [
      {
        role: "user",
        content: `PR başlığı: ${title}\n\nDiff:\n${diff}`,
      },
    ],
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
      .map((f) => ({
        file: String(f.file),
        severity: normalizeSeverity(f.severity),
        title: String(f.title ?? "Bulgu"),
        detail: String(f.detail),
        suggestion: f.suggestion ? String(f.suggestion) : undefined,
      }));
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

function renderReview(findings: Finding[]): string {
  const header = `## 🤖 AI Kod İnceleme Ajanı (Pilot)\n`;
  if (findings.length === 0) {
    return `${header}\nDeğişikliklerde belirgin bir sorun tespit etmedim. 👍\n\n${SIGNATURE}`;
  }

  const order: Finding["severity"][] = ["yüksek", "orta", "düşük"];
  const icon: Record<Finding["severity"], string> = {
    yüksek: "🔴",
    orta: "🟠",
    düşük: "🟡",
  };

  const counts = order
    .map((s) => `${icon[s]} ${findings.filter((f) => f.severity === s).length} ${s}`)
    .join(" · ");

  const lines: string[] = [header, `**Özet:** ${counts}\n`];
  for (const sev of order) {
    const group = findings.filter((f) => f.severity === sev);
    if (group.length === 0) continue;
    lines.push(`### ${icon[sev]} ${sev.toUpperCase()} öncelik`);
    for (const f of group) {
      lines.push(`- **\`${f.file}\` — ${f.title}**`);
      lines.push(`  ${f.detail}`);
      if (f.suggestion) lines.push(`  > 💡 ${f.suggestion}`);
    }
    lines.push("");
  }
  lines.push(
    `_Bu otomatik bir ön incelemedir; nihai karar gözden geçiren kişiye aittir._`,
  );
  lines.push(`\n${SIGNATURE}`);
  return lines.join("\n");
}

main().catch((err) => {
  core.setFailed(`AI Kod İnceleme Ajanı hatası: ${(err as Error).message}`);
});
