# Medical Chatbot (web)

Next.js version of the Streamlit app in the repo root, built to run on Vercel.

- **Demo** (no key): recorded sample conversations, no API calls.
- **Live** (`ANTHROPIC_API_KEY` set): streaming chat with Claude using the same safety system prompt.

Every user message also runs through a local red-flag check (`lib/emergency.ts`), so emergency guidance appears even before the model answers.

```bash
npm install
cp .env.example .env.local
npm run dev
npm test
```

The key stays on the server (`app/api/chat`). The route accepts same-origin requests only, keeps the last 20 turns (2,000 characters each), caps replies at 1,000 tokens, and rate limits per IP. Limits are per serverless instance, so also set a monthly spend limit in the Anthropic console.

> Informational only. Not a substitute for professional medical advice, diagnosis, or treatment.
