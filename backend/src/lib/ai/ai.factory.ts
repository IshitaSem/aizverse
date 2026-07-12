import { env } from "../../config/env.js";
import type { AiProvider } from "./provider.interface.js";
import { GeminiProvider } from "./providers/gemini.provider.js";
import { FallbackProvider } from "./providers/fallback.provider.js";

/**
 * Single place that knows how to construct a concrete AiProvider from
 * config. Adding OpenAI/Groq/Claude later is: write `./providers/openai.provider.ts`
 * implementing AiProvider, add a case below. No other file in the codebase changes.
 */
let cachedProvider: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (cachedProvider) return cachedProvider;

  switch (env.AI_PROVIDER) {
    case "gemini": {
      if (!env.GEMINI_API_KEY) {
        cachedProvider = new FallbackProvider();
        return cachedProvider;
      }

      try {
        cachedProvider = new GeminiProvider();
        return cachedProvider;
      } catch {
        cachedProvider = new FallbackProvider();
        return cachedProvider;
      }
    }
    default:
      cachedProvider = new FallbackProvider();
      return cachedProvider;
  }
}
