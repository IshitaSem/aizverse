"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useAssistantChat } from "../hooks/useAssistantChat";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ChatWindowProps {
  stadiumId: string;
  language?: string;
  token?: string;
}

const SUGGESTIONS = ["How do I reach Gate B?", "Where's the nearest accessible restroom?", "Shortest food queue?"];

/** The AI Stadium Assistant chat surface — the demo's primary feature. */
export function ChatWindow({ stadiumId, language = "en", token }: ChatWindowProps) {
  const { messages, sendMessage, isLoading, error } = useAssistantChat({ stadiumId, language, token });
  const [draft, setDraft] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() || isLoading) return;
    void sendMessage(draft);
    setDraft("");
  }

  return (
    <Card className="flex h-[560px] flex-col overflow-hidden">
      <header className="border-b border-stadium-line px-5 py-4">
        <h2 className="font-display text-lg text-white">Stadium Assistant</h2>
        <p className="text-xs text-white/50">Ask about gates, seating, restrooms, queues, or accessibility.</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4" role="list" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-white/40">Ask anything about the venue — try one of these:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void sendMessage(s)}
                  className="rounded-full border border-stadium-line px-3 py-1.5 text-xs text-white/70 hover:border-floodlight hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-floodlight"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {isLoading && (
          <div className="flex justify-start" aria-label="Assistant is typing">
            <div className="rounded-2xl border border-stadium-line bg-stadium-panel px-4 py-2.5 text-sm text-white/50">
              Thinking…
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-lg border border-alert/40 bg-alert/10 px-3 py-2 text-sm text-alert">
            {error}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-stadium-line p-3">
        <label htmlFor="assistant-input" className="sr-only">
          Ask the stadium assistant
        </label>
        <input
          id="assistant-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question…"
          className="flex-1 rounded-lg border border-stadium-line bg-stadium-night px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-floodlight"
        />
        <Button type="submit" disabled={isLoading || !draft.trim()} aria-label="Send message">
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </Card>
  );
}
