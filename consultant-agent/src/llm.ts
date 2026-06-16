/**
 * LLM (Claude) çağrısı ve araç (tool use) döngüsü.
 *
 * Resmi Anthropic SDK'sı kullanılır. Model varsayılanı Claude Opus 4.8'dir ve
 * adaptif düşünme (adaptive thinking) etkindir.
 */
import Anthropic from "@anthropic-ai/sdk";
import { MAX_TOKENS, MODEL } from "./config.js";

const client = new Anthropic(); // ANTHROPIC_API_KEY ortam değişkeninden okunur.

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Modelin çağırabileceği bir aracı temsil eder. */
export interface ToolHandler {
  tool: Anthropic.Tool;
  run: (input: Record<string, unknown>) => Promise<string>;
}

export interface RunOptions {
  system: string;
  messages: ChatMessage[];
  tools?: ToolHandler[];
  /**
   * Bu araçlardan biri çağrıldığında, sonucu işlenip döngü HEMEN sonlandırılır
   * (modelin ek bir tur üretmesi beklenmez). Nihai çıktıyı bir araçla teslim
   * eden akışlar (ör. submit_report) için kullanılır.
   */
  terminalTools?: string[];
}

/**
 * Verilen sistem istemi ve sohbet geçmişiyle modeli çalıştırır.
 * Araç çağrılarını otomatik yürütür (manuel agentic döngü, en fazla 4 tur).
 * Modelin nihai metin yanıtını döndürür.
 */
export async function runConsultant(opts: RunOptions): Promise<string> {
  const handlers = new Map((opts.tools ?? []).map((t) => [t.tool.name, t]));
  const toolDefs = (opts.tools ?? []).map((t) => t.tool);
  const terminalSet = new Set(opts.terminalTools ?? []);

  const messages: Anthropic.MessageParam[] = opts.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  for (let turn = 0; turn < 4; turn++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // Adaptif düşünme: Claude 4.6+ için önerilen mod. (SDK tip tanımları bu
      // değeri henüz içermeyebildiğinden tek alanda cast uygulanıyor; API destekler.)
      thinking: { type: "adaptive" } as unknown as Anthropic.MessageCreateParams["thinking"],
      system: opts.system,
      messages,
      ...(toolDefs.length > 0 ? { tools: toolDefs } : {}),
    });

    if (res.stop_reason === "tool_use" && handlers.size > 0) {
      // Asistan yanıtını (düşünme blokları dahil) aynen geri ekle.
      messages.push({ role: "assistant", content: res.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      let terminal = false;
      for (const block of res.content) {
        if (block.type === "tool_use") {
          const handler = handlers.get(block.name);
          let output: string;
          try {
            output = handler
              ? await handler.run(block.input as Record<string, unknown>)
              : `Bilinmeyen araç: ${block.name}`;
          } catch (err) {
            output = `Araç çalıştırılamadı: ${(err as Error).message}`;
          }
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: output,
          });
          if (terminalSet.has(block.name)) terminal = true;
        }
      }
      // Terminal araç çağrıldıysa çıktı bir yan etkiyle (handler) yakalandı;
      // döngüyü hemen bitir.
      if (terminal) return extractText(res);
      messages.push({ role: "user", content: toolResults });
      continue;
    }

    return extractText(res) || "Üzgünüm, şu an bir yanıt üretemedim. Lütfen tekrar deneyin.";
  }

  return "İşlem beklenenden uzun sürdü. Lütfen mesajınızı tekrar gönderin.";
}

function extractText(res: Anthropic.Message): string {
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}
