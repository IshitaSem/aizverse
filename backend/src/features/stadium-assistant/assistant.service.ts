import type { AiProvider } from "../../lib/ai/provider.interface.js";
import { getAiProvider } from "../../lib/ai/ai.factory.js";
import { logger } from "../../config/logger.js";
import type { AssistantChatRequest } from "./assistant.schema.js";

const LANGUAGE_NAMES: Record<AssistantChatRequest["language"], string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  ar: "Arabic",
  hi: "Hindi",
  pt: "Portuguese",
};

function buildSystemPrompt(language: AssistantChatRequest["language"], stadiumId: string): string {
  return [
    "You are the AIZVerse Stadium Assistant, an in-venue guide for FIFA World Cup 2026 attendees.",
    `Venue context: stadium id "${stadiumId}".`,
    `Always respond in ${LANGUAGE_NAMES[language]}, regardless of the language the user writes in.`,
    "Give short, specific, actionable answers about navigation, seating, accessibility, restrooms,",
    "food queues, transportation, and safety. Prefer concrete directions (gate, level, landmark) over",
    "generic advice. If you are unsure of a specific real-time detail (like current queue length),",
    "say so plainly and suggest the nearest staff point or app feature instead of inventing a number.",
    "Never provide medical, legal, or emergency-dispatch instructions beyond directing the user to the",
    "nearest staff/medical point — always defer real emergencies to on-site security or medical staff.",
  ].join(" ");
}

export interface AssistantReply {
  reply: string;
  language: AssistantChatRequest["language"];
}

/**
 * Pure-ish service function: takes validated input + an injected AiProvider,
 * returns a reply. Provider is injected (not imported directly) so tests can
 * substitute a fake provider without hitting the network.
 */
export async function generateAssistantReply(
  input: AssistantChatRequest,
  provider: AiProvider = getAiProvider()
): Promise<AssistantReply> {
  const systemPrompt = buildSystemPrompt(input.language, input.stadiumId);

  try {
    const result = await provider.generate(
      [
        { role: "system", content: systemPrompt },
        ...input.history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: input.message },
      ],
      { temperature: 0.4, maxOutputTokens: 400 }
    );

    return { reply: result.text.trim(), language: input.language };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
  {
    error: errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    provider: provider.name,
    stadiumId: input.stadiumId,
  },
  "AI provider call failed"
);
    throw error;
  }
}
