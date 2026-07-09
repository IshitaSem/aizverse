import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../../config/env.js";
import type { AiGenerationResult, AiMessage, AiProvider, GenerateOptions } from "../provider.interface.js";

/**
 * Gemini implementation of AiProvider. Contains all Gemini-specific SDK
 * details (message role mapping, generationConfig shape) so the rest of the
 * codebase never has to know it exists.
 */
export class GeminiProvider implements AiProvider {
  public readonly name = "gemini";

  private readonly client: GoogleGenerativeAI;
  private readonly modelName: string;

  constructor(apiKey: string = env.GEMINI_API_KEY, modelName: string = env.GEMINI_MODEL) {
    if (!apiKey) {
      throw new Error("GeminiProvider requires an API key");
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  async generate(messages: AiMessage[], options: GenerateOptions = {}): Promise<AiGenerationResult> {
    const systemInstruction = messages.find((m) => m.role === "system")?.content;
    const conversational = messages.filter((m) => m.role !== "system");

    const model = this.client.getGenerativeModel({
      model: this.modelName,
      ...(systemInstruction ? { systemInstruction } : {}),
      generationConfig: {
        maxOutputTokens: options.maxOutputTokens ?? 512,
        temperature: options.temperature ?? 0.4,
        ...(options.responseFormat === "json" ? { responseMimeType: "application/json" } : {}),
      },
    });

    const history = conversational.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

    const lastMessage = conversational.at(-1);
    if (!lastMessage) {
      throw new Error("At least one user/assistant message is required");
    }

    try {
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      const response = result.response;

      const usage = response.usageMetadata
        ? {
            inputTokens: response.usageMetadata.promptTokenCount ?? undefined,
            outputTokens: response.usageMetadata.candidatesTokenCount ?? undefined,
          }
        : undefined;

      return {
        text: response.text(),
        provider: this.name,
        ...(usage ? { usage } : {}),
      };
   } catch (error) {
  console.error("Gemini raw error:", error);

  const errorMessage =
    error instanceof Error ? error.message : JSON.stringify(error);

  throw new Error(`Gemini API call failed: ${errorMessage}`);
}
  }
}
