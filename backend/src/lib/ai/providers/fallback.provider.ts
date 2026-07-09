import type { AiGenerationResult, AiMessage, AiProvider, GenerateOptions } from "../provider.interface.js";

/**
 * Graceful fallback used when no AI provider is configured. Keeps the API
 * responsive and returns a deterministic, user-safe message instead of
 * crashing request handlers.
 */
export class FallbackProvider implements AiProvider {
  public readonly name = "fallback";

  async generate(messages: AiMessage[], _options: GenerateOptions = {}): Promise<AiGenerationResult> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "your request";

    return {
      text: `AI assistance is currently unavailable. The request for "${lastUserMessage}" could not be processed because no AI provider is configured.`,
      provider: this.name,
    };
  }
}
