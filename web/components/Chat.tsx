"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_SCENARIOS } from "@/lib/demo";
import { isEmergency, isSelfHarm } from "@/lib/emergency";
import RichText from "./RichText";

type Message = { role: "user" | "assistant"; content: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Chat() {
  const [live, setLive] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [emergency, setEmergency] = useState<"none" | "medical" | "selfharm">("none");
  const abort = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d.live)))
      .catch(() => setLive(false));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function flag(text: string) {
    if (isSelfHarm(text)) setEmergency("selfharm");
    else if (isEmergency(text)) setEmergency("medical");
  }

  const appendToLast = (chunk: string) =>
    setMessages((m) => {
      const copy = m.slice();
      copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + chunk };
      return copy;
    });

  async function playDemo(prompt: string, reply: string) {
    if (busy) return;
    flag(prompt);
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: prompt }, { role: "assistant", content: "" }]);
    await wait(400);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) appendToLast(reply);
    else for (const word of reply.split(/(\s+)/)) {
      appendToLast(word);
      await wait(12);
    }
    setBusy(false);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    flag(content);
    setError("");
    setInput("");
    const history: Message[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    const controller = new AbortController();
    abort.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        appendToLast(decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
        setMessages((m) => (m[m.length - 1]?.content ? m : m.slice(0, -1)));
      }
    } finally {
      setBusy(false);
      abort.current = null;
    }
  }

  function clear() {
    abort.current?.abort();
    setMessages([]);
    setEmergency("none");
    setError("");
  }

  const demo = live === false;

  return (
    <div className="flex min-h-[60vh] flex-col rounded-3xl border border-white/10 bg-white/[0.02]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${live ? "text-emerald-400" : "text-amber-300"}`}>
          {live === null ? "Loading…" : live ? "● Live · Claude" : "● Demo · sample conversations"}
        </span>
        {messages.length > 0 && (
          <button type="button" onClick={clear} className="rounded-full px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white">
            Clear chat
          </button>
        )}
      </div>

      {emergency !== "none" && (
        <div role="alert" className="mx-5 mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
          {emergency === "selfharm" ? (
            <>
              <strong className="font-medium text-white">You don&apos;t have to go through this alone.</strong> If you might act on
              thoughts of harming yourself, call your local emergency number now (112 in India, 911 in the US). You can also reach
              out to a crisis line in your country or someone you trust.
            </>
          ) : (
            <>
              <strong className="font-medium text-white">This may be an emergency.</strong> Call your local emergency number now
              (112 in India, 911 in the US, 999 in the UK) or go to the nearest emergency department.
            </>
          )}
        </div>
      )}

      <div className="flex-1 space-y-5 px-5 py-6" aria-live="polite">
        {messages.length === 0 && (
          <div className="py-6 text-center">
            <p className="font-serif text-3xl text-white">How can I help today?</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              {demo
                ? "This deployment shows recorded sample conversations. Pick one to see how the assistant answers."
                : "Describe your symptoms or ask a general health question."}
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-3xl rounded-br-lg bg-emerald-400 px-5 py-3 text-[15px] leading-7 text-black"
                  : "max-w-[92%] rounded-3xl rounded-bl-lg border border-white/10 bg-[#121212] px-5 py-3 text-[15px] leading-7 text-zinc-200"
              }
            >
              {m.role === "assistant" ? (
                m.content ? <RichText text={m.content} /> : <span className="inline-flex gap-1 py-2" aria-label="Thinking"><Dot /><Dot d={150} /><Dot d={300} /></span>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {error && <p role="alert" className="mx-5 mb-3 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">{error}</p>}

      <div className="border-t border-white/10 p-4">
        {(demo || messages.length === 0) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {DEMO_SCENARIOS.map((s) => (
              <button
                key={s.label}
                type="button"
                disabled={busy || live === null}
                onClick={() => (demo ? playDemo(s.prompt, s.reply) : send(s.prompt))}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-400/60 hover:text-white disabled:opacity-40"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
        {demo ? (
          <p className="text-xs text-zinc-500">Typing is turned off in the demo. The live version answers any question with Claude.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <label htmlFor="msg" className="sr-only">Your message</label>
            <textarea
              id="msg"
              rows={1}
              value={input}
              maxLength={2000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Describe your symptoms or ask a health question…"
              className="max-h-40 min-h-12 flex-1 resize-none rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 focus:border-emerald-400/60 focus:outline-none"
            />
            {busy ? (
              <button type="button" onClick={() => abort.current?.abort()} className="min-h-12 rounded-2xl border border-white/15 px-5 text-sm text-zinc-200">
                Stop
              </button>
            ) : (
              <button type="submit" disabled={!input.trim() || !live} className="min-h-12 rounded-2xl bg-emerald-400 px-5 font-medium text-black transition hover:bg-emerald-300 disabled:opacity-40">
                Send
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: `${d}ms` }} />;
}
