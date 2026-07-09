import { ChatWindow } from "@/features/stadium-assistant/components/ChatWindow";

export default function AssistantPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl text-white">Stadium Assistant</h1>
      <ChatWindow stadiumId="stadium-atl-01" language="en" />
    </main>
  );
}
