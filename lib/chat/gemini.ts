// =============================================================================
// FloodWatch Semarang — Gemini API Client
// =============================================================================

const GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';

/** Ordered by preference — falls back if quota/model unavailable */
const MODEL_FALLBACK_CHAIN = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-lite',
].filter((m): m is string => Boolean(m));

export interface ChatHistoryItem {
  role: 'user' | 'model';
  content: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  error?: { message?: string; code?: number };
}

async function callGeminiModel(
  model: string,
  apiKey: string,
  systemPrompt: string,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  const res = await fetch(`${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 1200,
        topP: 0.9,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  });

  const data = (await res.json()) as GeminiResponse;

  if (!res.ok) {
    const msg = data.error?.message ?? `Gemini API error (${res.status})`;
    const err = new Error(msg) as Error & { retryable?: boolean };
    err.retryable =
      res.status === 429 ||
      res.status === 503 ||
      msg.toLowerCase().includes('not found') ||
      msg.toLowerCase().includes('high demand');
    throw err;
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Tidak ada respons dari model AI. Coba lagi.');
  }

  return text.trim();
}

export async function generateChatReply(
  systemPrompt: string,
  history: ChatHistoryItem[],
  userMessage: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY tidak dikonfigurasi. Tambahkan ke file .env.local');
  }

  const contents = [
    ...history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
    {
      role: 'user' as const,
      parts: [{ text: userMessage }],
    },
  ];

  let lastError: Error | null = null;

  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      return await callGeminiModel(model, apiKey, systemPrompt, contents);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const retryable = (err as Error & { retryable?: boolean }).retryable;
      if (!retryable) throw lastError;
      console.warn(`[Gemini] Model ${model} gagal, mencoba fallback...`, lastError.message);
    }
  }

  throw lastError ?? new Error('Semua model Gemini tidak tersedia. Coba lagi nanti.');
}
