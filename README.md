# Medical Chatbot

A simple chatbot for general health information, built with Streamlit and the Anthropic API.
It gives plain-language answers, asks follow-up questions, and flags emergencies.

> **Disclaimer:** Informational only. Not a substitute for professional medical advice, diagnosis, or treatment.

## Run

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
