/**
 * Genel yapılandırma sabitleri.
 */

/** Kullanılacak Claude modeli. Gerekirse LLM_MODEL ortam değişkeniyle ezilebilir. */
export const MODEL = process.env.LLM_MODEL ?? "claude-opus-4-8";

/** Bağlam (hafıza) için okunacak en fazla yorum sayısı. */
export const MAX_HISTORY_COMMENTS = 10;

/** Durum (state) etiketlerinin ön eki. */
export const STATE_PREFIX = "state:";

/** Bu ajanın yöneteceği konuları işaretleyen etiket. */
export const CONSULTANT_LABEL = "consultant";

/** Tek bir LLM yanıtı için üst sınır (jeton). */
export const MAX_TOKENS = 8000;
