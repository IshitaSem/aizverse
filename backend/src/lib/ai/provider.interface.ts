/**
 * Provider-agnostic contract for generative AI calls.
 *
 * Every feature module (stadium assistant, navigation, crowd intelligence)
 * depends only on this interface — never on a concrete SDK. Swapping Gemini
 * for OpenAI, Groq, or Claude means writing one new adapter class and
 * changing a single line in `ai.factory.ts`; nothing in the feature layer
 * changes. This is the Dependency Inversion Principle applied to the AI layer.
 */
export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateOptions {
  /** Caps response length to keep latency and cost predictable. */
  maxOutputTokens?: number;
  /** Lower = more deterministic. Useful for operational summaries. */
  temperature?: number;
  /** Optional JSON schema hint for structured generation. */
  responseFormat?: "text" | "json";
}

export interface AiGenerationResult {
  text: string;
  /** Raw provider name, useful for logging/telemetry without leaking types upstream. */
  provider: string;
  /** Approximate token usage, when the provider exposes it. */
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export interface AiProvider {
  readonly name: string;
  generate(messages: AiMessage[], options?: GenerateOptions): Promise<AiGenerationResult>;
}
