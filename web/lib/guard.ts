import { MAX_CHARS, MAX_MESSAGES } from "./prompt";

/**
 * Best-effort, per-instance limits for the paid chat endpoint. Serverless
 * instances don't share memory, so also set a spend limit in the Anthropic console.
 * CHAT_RATE_PER_MINUTE (default 8) and CHAT_RATE_PER_DAY (default 60) per IP.
 */
const perMinute = Number(process.env.CHAT_RATE_PER_MINUTE ?? 8);
const perDay = Number(process.env.CHAT_RATE_PER_DAY ?? 60);
const hits = new Map<string, number[]>();

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export function rateLimited(ip: string, now = Date.now()): number | null {
  const day = 86_400_000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < day);
  const lastMinute = list.filter((t) => now - t < 60_000);
  if (lastMinute.length >= perMinute) return Math.ceil((lastMinute[0] + 60_000 - now) / 1000);
  if (list.length >= perDay) return Math.ceil((list[0] + day - now) / 1000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < day)) hits.delete(k);
  return null;
}

/** Same-origin check so other sites can't use this deployment as a free AI proxy. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Keeps the last MAX_MESSAGES turns, trims each one, drops anything malformed,
 * and makes sure the conversation starts with a user turn and alternates roles.
 */
export function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  const clean: ChatMessage[] = [];
  for (const m of input.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== "object") continue;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const text = content.slice(0, MAX_CHARS).trim();
    if (!text) continue;
    const last = clean[clean.length - 1];
    if (last && last.role === role) last.content += `\n\n${text}`;
    else clean.push({ role, content: text });
  }
  while (clean.length && clean[0].role !== "user") clean.shift();
  return clean;
}
