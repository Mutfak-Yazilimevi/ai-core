/**
 * AI Benimseme & SDLC→ADLC Dönüşüm Danışmanı — giriş noktası.
 *
 * Bir GitHub Action runner'ı içinde, her yeni Issue veya yorumda anlık çalışır:
 *   1. Issue'nun bu ajana ait olup olmadığını ve gönderenin bot olmadığını doğrular.
 *   2. Mevcut durum etiketini (state machine) okur.
 *   3. Yorum geçmişini (memory) çekip LLM'e bağlam olarak verir.
 *   4. Faza uygun sistem istemiyle modeli çalıştırır:
 *      - discovery: karşılama + ilk sorular.
 *      - assessing: uyarlanabilir değerlendirme; yeterli bilgi toplanınca
 *        `submit_report` aracıyla nihai yol haritası raporu üretilir.
 *      - report_ready: pilot kurulumu / sorular.
 *   5. Yanıtı yorum olarak yazar, durumu ilerletir, rapor teslim edilince kapatır.
 */
import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import {
  closeIssue,
  createPilotWorkflow,
  currentState,
  fetchHistory,
  isConsultantIssue,
  postComment,
  setState,
  type Octokit,
  type RepoRef,
} from "./github.js";
import { runConsultant, type ToolHandler } from "./llm.js";
import { ASSESS, DISCOVERY, FOLLOWUP } from "./states.js";

const BOT_LOGIN = "github-actions[bot]";

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN tanımlı değil.");
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY (LLM_API_KEY secret'ı) tanımlı değil.");
  }

  const octokit = getOctokit(token);
  const ref: RepoRef = { owner: context.repo.owner, repo: context.repo.repo };

  const issue = context.payload.issue;
  if (!issue) {
    core.info("Issue bağlamı yok — atlanıyor.");
    return;
  }

  // Sonsuz döngü koruması: bot kendi yorumuna tepki vermesin.
  const sender = context.payload.sender?.login ?? context.actor;
  if (sender === BOT_LOGIN || context.payload.comment?.user?.type === "Bot") {
    core.info("Tetikleyen bot — atlanıyor.");
    return;
  }

  const labels: string[] = (issue.labels ?? [])
    .map((l: unknown) => (typeof l === "string" ? l : (l as { name?: string }).name))
    .filter((n: unknown): n is string => typeof n === "string");

  if (!isConsultantIssue(labels)) {
    core.info("Danışman kapsamında olmayan Issue — atlanıyor.");
    return;
  }

  const issueNumber = issue.number as number;
  const isOpen = context.eventName === "issues" && context.payload.action === "opened";
  const state = isOpen ? "opened" : currentState(labels);

  const history = await fetchHistory(
    octokit,
    ref,
    issueNumber,
    (issue.body as string | null) ?? null,
    BOT_LOGIN,
  );

  if (state === "opened" || state == null) {
    // AŞAMA 1 — Karşılama + ilk sorular.
    const reply = await runConsultant({ system: DISCOVERY, messages: history });
    await postComment(octokit, ref, issueNumber, reply);
    await setState(octokit, ref, issueNumber, labels, "discovery");
    core.info("Karşılama gönderildi (discovery).");
    return;
  }

  if (state === "report_ready") {
    // AŞAMA 3 — Pilot kurulumu / sorular.
    const reply = await runConsultant({
      system: FOLLOWUP,
      messages: history,
      tools: [pilotTool(octokit, ref)],
    });
    await postComment(octokit, ref, issueNumber, reply);
    core.info("Pilot/soru yanıtı gönderildi.");
    return;
  }

  // AŞAMA 2 — Uyarlanabilir değerlendirme (discovery veya assessing etiketinden gelen yorum).
  let report: string | null = null;
  const reply = await runConsultant({
    system: ASSESS,
    messages: history,
    tools: [reportTool((r) => (report = r))],
    terminalTools: ["submit_report"],
  });

  if (report) {
    // Yeterli bilgi toplandı: raporu yaz, durumu kapat.
    await postComment(octokit, ref, issueNumber, report);
    await setState(octokit, ref, issueNumber, labels, "report_ready");
    await closeIssue(octokit, ref, issueNumber);
    core.info("Yol haritası raporu teslim edildi (report_ready).");
  } else {
    // Daha fazla soru gerekiyor.
    await postComment(octokit, ref, issueNumber, reply);
    await setState(octokit, ref, issueNumber, labels, "assessing");
    core.info("Ek değerlendirme soruları gönderildi (assessing).");
  }
}

/** Nihai raporu teslim eden araç (terminal). */
function reportTool(onReport: (report: string) => void): ToolHandler {
  return {
    tool: {
      name: "submit_report",
      description:
        "Tüm ana boyutlarda yeterli bilgi toplandığında, nihai 'AI Benimseme " +
        "Analizi & Yol Haritası' raporunu teslim eder. report alanına tam Markdown raporu konur.",
      input_schema: {
        type: "object",
        properties: {
          report: {
            type: "string",
            description: "İstenen yapıya uygun, tam rapor (Markdown).",
          },
        },
        required: ["report"],
      },
    },
    run: async (input) => {
      onReport(String(input.report ?? "").trim());
      return "Rapor alındı ve müşteriye iletilecek.";
    },
  };
}

/** Pilot AI Kod İnceleme Ajanı oluşturma aracı (tool use / skill). */
function pilotTool(octokit: Octokit, ref: RepoRef): ToolHandler {
  return {
    tool: {
      name: "create_pilot_workflow",
      description:
        "Müşteri pilot 'AI Kod İnceleme Ajanı'nı kurmayı açıkça onayladığında, " +
        "repoya örnek bir GitHub Actions iş akışı (.github/workflows/ai-code-reviewer.yml) ekler.",
      input_schema: {
        type: "object",
        properties: {
          focus: {
            type: "string",
            description:
              "İncelemenin odak alanı (ör. 'güvenlik açıkları', 'performans'). Opsiyonel.",
          },
        },
      },
    },
    run: async (input) => createPilotWorkflow(octokit, ref, input.focus as string | undefined),
  };
}

main().catch((err) => {
  core.setFailed(`Danışman ajanı hatası: ${(err as Error).message}`);
});
