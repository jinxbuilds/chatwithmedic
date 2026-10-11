"""Simple medical information chatbot (Streamlit + Anthropic API)."""
import os

import streamlit as st
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-5-5")

SYSTEM_PROMPT = """You are a careful, friendly medical information assistant.

- Give clear, accurate, plain-language general health information.
- You are not a doctor and cannot diagnose or prescribe. Never present a
  diagnosis as certain; describe possible causes and what usually helps.
- Ask a brief follow-up question when key details (age, duration, severity,
  medications, allergies) would change your answer.
- For emergency signs (chest pain, trouble breathing, stroke symptoms, severe
  bleeding, suicidal thoughts, overdose, etc.) tell the person to call their
  local emergency number or go to the nearest ER immediately.
- Suggest seeing a healthcare professional when appropriate.
- Keep answers concise and well organised. Don't invent facts or sources."""

DISCLAIMER = (
    "⚠️ For general information only. Not medical advice, diagnosis, or treatment. "
    "In an emergency, call your local emergency number."
)

st.set_page_config(page_title="Medical Chatbot", page_icon="🩺")
st.title("🩺 Medical Chatbot")
st.caption(DISCLAIMER)

api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    st.error("Set ANTHROPIC_API_KEY in a `.env` file (see `.env.example`).")
    st.stop()

client = Anthropic(api_key=api_key)

if "messages" not in st.session_state:
    st.session_state.messages = []

with st.sidebar:
    if st.button("Clear chat"):
        st.session_state.messages = []
        st.rerun()

for m in st.session_state.messages:
    with st.chat_message(m["role"]):
        st.markdown(m["content"])

if prompt := st.chat_input("Describe your symptoms or ask a health question..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        try:
            with client.messages.stream(
                model=MODEL,
                max_tokens=1000,
                system=SYSTEM_PROMPT,
                messages=st.session_state.messages,
            ) as stream:
                reply = st.write_stream(stream.text_stream)
        except Exception as e:
            reply = f"Sorry, something went wrong: {e}"
            st.error(reply)
    st.session_state.messages.append({"role": "assistant", "content": reply})
