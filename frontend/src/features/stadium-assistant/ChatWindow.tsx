import { useState, type FormEvent, useRef, useEffect } from "react";
import { Send, Mic, User, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAssistantChat, type ChatTurn, type AssistantLanguage } from "./useAssistantChat";

interface ChatWindowProps {
  language?: AssistantLanguage;
}

const SUGGESTIONS = ["How do I reach Gate B?", "Where's the nearest accessible restroom?", "Shortest food queue?"];

export function ChatWindow({ language = "en" }: ChatWindowProps) {
  const initialMessages: ChatTurn[] = [];
  const { messages, sendMessage, isLoading, error } = useAssistantChat(initialMessages, language);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() || isLoading) return;
    void sendMessage(draft);
    setDraft("");
  }

  return (
    <div className="flex-1 flex flex-col glass-bright rounded-2xl overflow-hidden h-full"
      style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.12), 0 20px 60px rgba(0,0,0,0.4)" }}>
      
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4" role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center py-10">
            <p className="text-sm text-slate-500">Ask anything about the venue — try one of these:</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {SUGGESTIONS.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  whileHover={{ scale: 1.02, y: -1 }}
                  onClick={() => void sendMessage(s)}
                  className="text-xs glass border border-indigo-500/[0.1] hover:border-indigo-500/[0.3] text-slate-500 hover:text-white px-3 py-1.5 rounded-lg transition-all font-mono-code"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${m.role === "assistant" ? "" : "bg-slate-700"}`}
                style={m.role === "assistant" ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : {}}>
                {m.role === "assistant" ? <Zap size={14} className="text-white" /> : <User size={14} className="text-white" />}
              </div>
              <div className={`max-w-[75%] flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "text-white" : "glass text-slate-300 border border-indigo-500/[0.08]"}`}
                  style={m.role === "user" ? { background: "linear-gradient(135deg, #6366f1, #4f46e5)", borderRadius: "16px 16px 4px 16px" } : { borderRadius: "16px 16px 16px 4px" }}>
                  {m.text}
                </div>
                <span className="text-xs text-slate-700 font-mono-code">{m.role === "assistant" ? "AIZA" : "You"}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3" aria-label="Assistant is typing">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Zap size={14} className="text-white" />
            </div>
            <div className="glass border border-indigo-500/[0.08] px-4 py-3 rounded-2xl flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              ))}
            </div>
          </motion.div>
        )}

        {error && (
          <p role="alert" className="text-xs text-rose-400 font-mono-code py-1">
            {error}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-indigo-500/[0.08]">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 glass border border-indigo-500/[0.1] rounded-xl px-4 focus-within:border-indigo-500/[0.4] transition-colors">
            <label htmlFor="assistant-input" className="sr-only">
              Ask the stadium assistant
            </label>
            <input
              id="assistant-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask AIZA about the stadium, events, navigation..."
              className="flex-1 bg-transparent py-3 text-sm text-white placeholder-slate-600 outline-none"
            />
            <motion.button type="button" whileHover={{ scale: 1.1 }} className="text-slate-600 hover:text-indigo-400 transition-colors" aria-label="Voice input">
              <Mic size={15} />
            </motion.button>
          </div>
          <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isLoading || !draft.trim()} aria-label="Send message"
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
            <Send size={16} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
