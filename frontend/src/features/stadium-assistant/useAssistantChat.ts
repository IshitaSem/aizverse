import { useCallback, useState } from "react";
import { apiRequest, ApiError } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/AuthContext";

export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

interface AssistantChatResponse {
  reply: string;
  language: string;
}

const STADIUM_ID = "stadium-atl-01";

/**
 * Backs AIChatPage. Mirrors POST /api/v1/assistant/chat exactly (see
 * backend/src/features/stadium-assistant/assistant.schema.ts) — history is
 * capped to the last 20 turns to match the server-side limit.
 */
export function useAssistantChat(initialMessages: ChatTurn[], language: string = "en") {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatTurn[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setIsLoading(true);
      setError(null);

      try {
        const history = messages.slice(-20).map((m) => ({ role: m.role, content: m.text }));
        const response = await apiRequest<AssistantChatResponse>("/assistant/chat", {
          method: "POST",
          token,
          body: { message: trimmed, history, language: language.toLowerCase(), stadiumId: STADIUM_ID },
        });
        setMessages((prev) => [...prev, { role: "assistant", text: response.reply }]);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "The assistant is unavailable right now.");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, token, isLoading, language]
  );

  return { messages, sendMessage, isLoading, error };
}
