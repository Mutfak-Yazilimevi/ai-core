/**
 * GitHub (Octokit) yardımcıları: durum yönetimi (etiketler), hafıza (yorum geçmişi),
 * yanıt yazma, Issue kapatma ve pilot iş akışı (skill) oluşturma.
 */
import { getOctokit } from "@actions/github";
import { CONSULTANT_LABEL, MAX_HISTORY_COMMENTS, STATE_PREFIX } from "./config.js";
import type { ChatMessage } from "./llm.js";

export type Octokit = ReturnType<typeof getOctokit>;

export interface RepoRef {
  owner: string;
  repo: string;
}

/** Etiket listesinden mevcut state değerini (state: öneki olmadan) çıkarır. */
export function currentState(labels: string[]): string | null {
  const label = labels.find((l) => l.startsWith(STATE_PREFIX));
  return label ? label.slice(STATE_PREFIX.length) : null;
}

/** Bir Issue'nun bu ajan tarafından yönetilip yönetilmeyeceğini belirler. */
export function isConsultantIssue(labels: string[]): boolean {
  return labels.includes(CONSULTANT_LABEL) || labels.some((l) => l.startsWith(STATE_PREFIX));
}

/** Issue üzerindeki state etiketini günceller (eskisini kaldırır, yenisini ekler). */
export async function setState(
  octokit: Octokit,
  ref: RepoRef,
  issueNumber: number,
  currentLabels: string[],
  next: string,
): Promise<void> {
  const nextLabel = `${STATE_PREFIX}${next}`;
  for (const label of currentLabels) {
    if (label.startsWith(STATE_PREFIX) && label !== nextLabel) {
      await octokit.rest.issues
        .removeLabel({ ...ref, issue_number: issueNumber, name: label })
        .catch(() => undefined);
    }
  }
  if (!currentLabels.includes(nextLabel)) {
    await octokit.rest.issues.addLabels({
      ...ref,
      issue_number: issueNumber,
      labels: [nextLabel],
    });
  }
}

/**
 * Hafıza (Memory): Issue gövdesi + son N yorumu okuyup LLM için sohbet geçmişine çevirir.
 * Ajanın (bot) kendi yorumları "assistant", diğerleri "user" olarak işaretlenir.
 */
export async function fetchHistory(
  octokit: Octokit,
  ref: RepoRef,
  issueNumber: number,
  issueBody: string | null,
  botLogin: string,
): Promise<ChatMessage[]> {
  const { data: comments } = await octokit.rest.issues.listComments({
    ...ref,
    issue_number: issueNumber,
    per_page: 100,
  });

  const recent = comments.slice(-MAX_HISTORY_COMMENTS);
  const messages: ChatMessage[] = [];

  const body = (issueBody ?? "").trim();
  if (body) {
    messages.push({ role: "user", content: `[Danışmanlık Talebi]\n${body}` });
  }

  for (const c of recent) {
    const isBot = c.user?.type === "Bot" || c.user?.login === botLogin;
    const text = (c.body ?? "").trim();
    if (!text) continue;
    messages.push({ role: isBot ? "assistant" : "user", content: text });
  }

  // İlk mesaj user olmalı; değilse başa kısa bir bağlam ekle.
  if (messages.length === 0 || messages[0].role !== "user") {
    messages.unshift({ role: "user", content: "Merhaba, danışmanlık almak istiyorum." });
  }
  return messages;
}

/** Issue'ya yorum (yanıt) yazar. */
export async function postComment(
  octokit: Octokit,
  ref: RepoRef,
  issueNumber: number,
  body: string,
): Promise<void> {
  await octokit.rest.issues.createComment({ ...ref, issue_number: issueNumber, body });
}

/** Issue'yu kapatır. */
export async function closeIssue(
  octokit: Octokit,
  ref: RepoRef,
  issueNumber: number,
): Promise<void> {
  await octokit.rest.issues
    .update({ ...ref, issue_number: issueNumber, state: "closed" })
    .catch(() => undefined);
}

/**
 * Skill (Otonom Yetenek): Repoya örnek bir "AI Kod İnceleme Ajanı" iş akışı ekler.
 * Dosya zaten varsa günceller.
 */
export async function createPilotWorkflow(
  octokit: Octokit,
  ref: RepoRef,
  focus: string | undefined,
): Promise<string> {
  const path = ".github/workflows/ai-code-reviewer.yml";
  const content = pilotWorkflowYaml(focus);
  const encoded = Buffer.from(content, "utf-8").toString("base64");

  let sha: string | undefined;
  try {
    const { data } = await octokit.rest.repos.getContent({ ...ref, path });
    if (!Array.isArray(data) && "sha" in data) sha = data.sha;
  } catch {
    // Dosya yok — yeni oluşturulacak.
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    ...ref,
    path,
    message: "chore: pilot AI kod inceleme ajanı iş akışı eklendi",
    content: encoded,
    sha,
  });

  return `Pilot iş akışı '${path}' başarıyla eklendi. Odak: ${focus ?? "genel kod inceleme"}.`;
}

function pilotWorkflowYaml(focus: string | undefined): string {
  const focusNote = focus
    ? `# Pilot odağı: ${focus}\n`
    : "# Pilot odağı: genel kod inceleme kalitesi ve riskli değişikliklerin tespiti\n";
  return `${focusNote}name: AI Kod İnceleme Ajanı (Pilot)

# Bu iş akışı, AI SDLC Dönüşüm Danışmanı tarafından pilot olarak eklenmiştir.
# Açılan/güncellenen Pull Request'lere otomatik bir AI ön incelemesi ekler.

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - name: PR'ı incele (yer tutucu)
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          LLM_API_KEY: \${{ secrets.LLM_API_KEY }}
        run: |
          echo "AI Kod İnceleme Ajanı pilotu çalıştı."
          echo "Sonraki adım: PR diff'ini LLM_API_KEY ile bir LLM'e gönderip"
          echo "yapılandırılmış inceleme yorumları üreten betiği bağlamak."
`;
}
