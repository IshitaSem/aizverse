import { describe, expect, it } from "vitest";
import type { AiProvider } from "../lib/ai/provider.interface.js";
import { generateAssistantReply } from "../features/stadium-assistant/assistant.service.js";
import type { AssistantChatRequest } from "../features/stadium-assistant/assistant.schema.js";

function makeFakeProvider(reply: string): AiProvider {
  return {
    name: "fake",
    generate: async () => ({ text: reply, provider: "fake" }),
  };
}

describe("generateAssistantReply", () => {
  const baseInput: AssistantChatRequest = {
    message: "How do I reach Gate B?",
    history: [],
    language: "en",
    stadiumId: "stadium-atl-01",
  };

  it("returns the AI provider's reply trimmed", async () => {
    const provider = makeFakeProvider("  Head to the east concourse, Gate B is 50m ahead.  ");
    const result = await generateAssistantReply(baseInput, provider);

    expect(result.reply).toBe("Head to the east concourse, Gate B is 50m ahead.");
    expect(result.language).toBe("en");
  });

  it("propagates the requested language through to the result", async () => {
    const provider = makeFakeProvider("Diríjase a la puerta B.");
    const result = await generateAssistantReply({ ...baseInput, language: "es" }, provider);

    expect(result.language).toBe("es");
  });

  it("includes prior conversation history when calling the provider", async () => {
    let capturedMessages: unknown;
    const provider: AiProvider = {
      name: "fake",
      generate: async (messages) => {
        capturedMessages = messages;
        return { text: "ok", provider: "fake" };
      },
    };

    await generateAssistantReply(
      {
        ...baseInput,
        history: [{ role: "user", content: "Where is my seat?" }],
      },
      provider
    );

    expect(capturedMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ role: "user", content: "Where is my seat?" })])
    );
  });

  it("propagates provider errors instead of swallowing them", async () => {
    const provider: AiProvider = {
      name: "fake",
      generate: async () => {
        throw new Error("upstream AI failure");
      },
    };

    await expect(generateAssistantReply(baseInput, provider)).rejects.toThrow("upstream AI failure");
  });
});
