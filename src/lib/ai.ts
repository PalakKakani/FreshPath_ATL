// Server-only Lovable AI Gateway helper.
// Do not import from client modules.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type TextPart = { type: "text"; text: string };
export type ImagePart = { type: "image_url"; image_url: { url: string } };
export type MessageContent = string | Array<TextPart | ImagePart>;

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: MessageContent;
};

export interface AiCallOptions {
  model?: string;
  messages: ChatMessage[];
  jsonMode?: boolean;
  temperature?: number;
}

export async function callAi({
  model = "google/gemini-3-flash-preview",
  messages,
  jsonMode = false,
  temperature,
}: AiCallOptions): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");

  const body: Record<string, unknown> = { model, messages };
  if (jsonMode) body.response_format = { type: "json_object" };
  if (typeof temperature === "number") body.temperature = temperature;

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("AI rate limit reached. Please retry shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace Settings.");
    throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

export async function callAiJson<T>(opts: AiCallOptions): Promise<T> {
  const raw = await callAi({ ...opts, jsonMode: true });
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error("Model did not return valid JSON");
  }
}
