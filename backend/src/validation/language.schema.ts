import { z } from "zod";

/**
 * Single source of truth for the languages the AI features support,
 * previously duplicated as an identical z.enum(...) in both
 * assistant.schema.ts and navigation.schema.ts.
 */
export const assistantLanguageSchema = z.enum(["en", "es", "fr", "ar", "hi", "pt"]).default("en");

export type AssistantLanguage = z.infer<typeof assistantLanguageSchema>;
