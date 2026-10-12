import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-14 md:pt-20">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">jinxbuilds · Unsaid Spaces</p>
      <h1 className="mt-5 font-serif text-6xl leading-[0.9] tracking-tight text-white md:text-7xl">
        Medical <em className="text-emerald-400">Chatbot</em>
      </h1>
      <p className="mt-5 text-lg leading-8 text-zinc-400">
        Plain-language answers to general health questions, with follow-up questions and clear emergency guidance.
      </p>
      <p className="mb-8 mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-400">
        ⚠️ For general information only. Not medical advice, diagnosis, or treatment. In an emergency, call your local
        emergency number.
      </p>
      <Chat />
      <footer className="mt-16 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 font-mono text-xs text-zinc-600">
        <span>Next.js · Claude API · streaming</span>
        <span>
          <a className="text-zinc-400 hover:text-white" href="https://github.com/jinxbuilds/Medical-Chatbot" target="_blank" rel="noopener noreferrer">Source ↗</a>
          {" · "}
          <a className="text-zinc-400 hover:text-white" href="https://unsaidspaces.com" target="_blank" rel="noopener noreferrer">Unsaid Spaces ↗</a>
        </span>
      </footer>
    </main>
  );
}
