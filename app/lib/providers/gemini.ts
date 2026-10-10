const GEMINI_MODEL = 'gemini-2.5-flash';

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

export async function geminiProvider(
  message: string,
): Promise<string | null> {
  if (process.env.IASEVERO_GEMINI_ENABLED !== 'true') {
    return null;
  }

  const key = process.env.GEMINI_API_KEY;

  if (!key || !message.trim()) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: message.slice(0, 4000) }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 256,
            temperature: 0.2,
          },
        }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GeminiResponse;

    return (
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim() || null
    );
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
