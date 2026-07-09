import clsx from "clsx";
import type { ChatMessage } from "../hooks/useAssistantChat";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx("flex w-full", isUser ? "justify-end" : "justify-start")}
      role="listitem"
      aria-label={`${isUser ? "You" : "Assistant"} said: ${message.content}`}
    >
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser ? "bg-floodlight text-stadium-night" : "bg-stadium-panel text-white border border-stadium-line"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
