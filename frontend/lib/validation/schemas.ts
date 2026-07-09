import { z } from "zod";

/**
 * Shared with the backend's contract by convention (kept in sync manually
 * here; in a monorepo this would live in a shared `packages/contracts` module).
 */
export const chatFormSchema = z.object({
  message: z.string().min(1, "Type a question first").max(1000, "Keep it under 1000 characters"),
});

export type ChatFormValues = z.infer<typeof chatFormSchema>;

export const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
  { value: "hi", label: "हिन्दी" },
  { value: "pt", label: "Português" },
] as const;
