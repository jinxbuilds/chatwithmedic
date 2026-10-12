import Anthropic from "@anthropic-ai/sdk";
import { secret } from "@/lib/env";
import { clientIp, rateLimited, sameOrigin, sanitizeMessages } from "@/lib/guard";
import { SYSTEM_PROMPT } from "@/lib/prompt";

export const maxDuration = 60;

const error = (message: string, status: number, headers?: HeadersInit) =>
  Response.json({ error: message }, { status, headers });

export async function POST(req: Request) {
  const apiKey = secret("ANTHROPIC_API_KEY");
  if (!apiKey) return error("Live chat isn't enabled on this deployment.", 503);
  if (!sameOrigin(req)) return error("Requests must come from this site.", 403);

  const body = (await req.json().catch(() => null)) as { messages?: unknown } | null;
  const messages = sanitizeMessages(body?.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return error("Send a question to start.", 400);
  }
  const wait = rateLimited(clientIp(req));
  if (wait !== null) return error(`You're sending messages quickly. Try again in ${wait}s.`, 429, { "Retry-After": String(wait) });

  const client = new Anthropic({ apiKey });
  const stream = client.messages.stream({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages,
  });

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (e) {
        console.error("chat stream failed", e instanceof Error ? e.message : e);
        controller.enqueue(encoder.encode("\n\nSorry, something went wrong. Please try again."));
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}
