import { secret } from "@/lib/env";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ live: Boolean(secret("ANTHROPIC_API_KEY")) });
}
