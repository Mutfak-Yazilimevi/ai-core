/**
 * AI SDLC Dönüşüm Danışmanı — giriş noktası.
 *
 * Bir GitHub Action runner'ı içinde, her yeni Issue veya yorumda anlık çalışır:
 *   1. Issue'nun bu ajana ait olup olmadığını ve gönderenin bot olmadığını doğrular.
 *   2. Mevcut durum etiketini (state machine) okur.
 *   3. Yorum geçmişini (memory) çekip LLM'e bağlam olarak verir.
 *   4. O faza uygun sistem istemiyle modeli çalıştırır.
 *   5. Yanıtı yorum olarak yazar, durumu ilerletir, gerekirse Issue'yu kapatır.
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
import { planStep } from "./states.js";

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
  const step = planStep(state);

  core.info(`Issue #${issueNumber} | durum: ${state ?? "yok"} → ${step.next}`);

  // Hafıza: geçmişi çek.
  const history = await fetchHistory(
    octokit,
    ref,
    issueNumber,
    (issue.body as string | null) ?? null,
    BOT_LOGIN,
  );

  // Araçlar (skill): yalnızca izin verilen adımda.
  const tools: ToolHandler[] | undefined = step.tools
    ? [pilotTool(octokit, ref)]
    : undefined;

  const reply = await runConsultant({ system: step.system, messages: history, tools });

  await postComment(octokit, ref, issueNumber, reply);
  await setState(octokit, ref, issueNumber, labels, step.next);
  if (step.close) await closeIssue(octokit, ref, issueNumber);

  core.info("Yanıt gönderildi.");
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
