# Medical Chatbot

A simple chatbot for general health information, built with Streamlit and the Anthropic API.
It gives plain-language answers, asks follow-up questions, and flags emergencies.

> **Disclaimer:** Informational only. Not a substitute for professional medical advice, diagnosis, or treatment.

## Web version (Vercel)

`web/` is a Next.js port built for Vercel (Streamlit can't run there). Import this repo in Vercel with **Root Directory** `web`:

- no environment variables: demo with recorded sample conversations
- `ANTHROPIC_API_KEY`: live streaming chat with Claude

See [`web/README.md`](web/README.md).

## Run (Streamlit)

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                 # then add your ANTHROPIC_API_KEY
streamlit run app.py
```

## Files
- `app.py` – the whole app (chat UI, streaming, safety system prompt)
- `requirements.txt` – dependencies
- `.env.example` – config template

## License
MIT
