import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

export const registerRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(120).trim(),
  email: z.string().email("Enter a valid email address").toLowerCase().trim(),
  password: passwordSchema,
  role: z.enum(["fan", "organizer", "volunteer", "security"]).default("fan"),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
  email: z.string().email("Enter a valid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
