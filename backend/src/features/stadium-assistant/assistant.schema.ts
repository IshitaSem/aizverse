import { z } from "zod";
import { assistantLanguageSchema } from "../../lib/validation/language.schema.js";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

export const assistantChatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long (max 1000 characters)")
    .trim(),
  history: z.array(chatMessageSchema).max(20, "History is limited to the last 20 messages").default([]),
  language: assistantLanguageSchema,
  stadiumId: z.string().min(1).max(64),
});

export type AssistantChatRequest = z.infer<typeof assistantChatRequestSchema>;
