"use client";

import { useCallback, useState } from "react";
import { apiRequest, ApiError } from "@/lib/api/client";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AssistantChatResponse {
  reply: string;
  language: string;
}

interface UseAssistantChatOptions {
  stadiumId: string;
  language: string;
  token?: string;
}

/**
 * Owns all chat state and the request lifecycle (loading/error/optimistic
 * append) so `ChatWindow` stays a presentational component. Keeping only
 * the last 20 turns mirrors the backend's history cap.
 */
export function useAssistantChat({ stadiumId, language, token }: UseAssistantChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const history = messages.slice(-20).map(({ role, content: c }) => ({ role, content: c }));
        const response = await apiRequest<AssistantChatResponse>("/assistant/chat", {
          method: "POST",
          token,
          body: { message: trimmed, history, language, stadiumId },
        });

        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: response.reply }]);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, stadiumId, language, token]
  );

  return { messages, sendMessage, isLoading, error };
}
