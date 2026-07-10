import { z } from "zod";
import "dotenv/config";

function looksLikePlaceholder(value: string): boolean {
  return /(<[^>]+>|replace[-_ ]?(with|me)|your[-_ ]?(key|secret|uri)|changeme|example\.com|example)/i.test(value);
}

const rawEnvSchema = z.object({
  NODE_ENV: z.string().optional(),
  PORT: z.string().optional(),
  CLIENT_ORIGIN: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  AI_PROVIDER: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.string().optional(),
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().url(),

  JWT_SECRET: z.string().default("development-jwt-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("1d"),

  MONGODB_URI: z.string().default(""),

  AI_PROVIDER: z.enum(["gemini", "openai"]).default("gemini"),
  GEMINI_API_KEY: z.string().default(""),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(60),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsedEnv = rawEnvSchema.safeParse(process.env);
  if (!parsedEnv.success) {
    // eslint-disable-next-line no-console
    console.error("Invalid environment configuration:", parsedEnv.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration. See details above.");
  }

  function defaultEnv(value: string | undefined, fallback: string): string {
    return value?.trim() ? value : fallback;
  }

  function normalizePort(value: string | undefined): string {
    const trimmed = value?.trim();
    if (!trimmed) return "4000";
    if (/^\d+$/.test(trimmed)) return trimmed;
    return "4000";
  }

  const envValues = {
  NODE_ENV: parsedEnv.data.NODE_ENV ?? "development",
  PORT: normalizePort(parsedEnv.data.PORT),
  CLIENT_ORIGIN: defaultEnv(
    parsedEnv.data.CLIENT_ORIGIN,
    parsedEnv.data.NODE_ENV === "development" || parsedEnv.data.NODE_ENV === "test"
      ? "http://localhost:3000"
      : ""
  ),

  JWT_SECRET: parsedEnv.data.JWT_SECRET ?? "development-jwt-secret-change-me",
  JWT_EXPIRES_IN: parsedEnv.data.JWT_EXPIRES_IN ?? "1d",
  MONGODB_URI: parsedEnv.data.MONGODB_URI ?? "",
  AI_PROVIDER: parsedEnv.data.AI_PROVIDER ?? "gemini",
  GEMINI_API_KEY: parsedEnv.data.GEMINI_API_KEY ?? "",
  GEMINI_MODEL: parsedEnv.data.GEMINI_MODEL ?? "gemini-2.0-flash",
  RATE_LIMIT_WINDOW_MS: parsedEnv.data.RATE_LIMIT_WINDOW_MS ?? "60000",
  RATE_LIMIT_MAX_REQUESTS: parsedEnv.data.RATE_LIMIT_MAX_REQUESTS ?? "60",
};

  const parsed = envSchema.safeParse(envValues);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration. See details above.");
  }

  const normalized = parsed.data;
  const isProd = normalized.NODE_ENV === "production";
  if (isProd && !normalized.CLIENT_ORIGIN) {
  throw new Error("CLIENT_ORIGIN must be configured in production.");
}
  const warnings: string[] = [];

  if (!normalized.JWT_SECRET || looksLikePlaceholder(normalized.JWT_SECRET)) {
    if (isProd) {
      throw new Error("JWT_SECRET must be configured with a real value in production.");
    }
    warnings.push("JWT_SECRET is not configured; authentication will use the current development fallback.");
  }

  if (!normalized.MONGODB_URI || looksLikePlaceholder(normalized.MONGODB_URI)) {
    if (isProd) {
      throw new Error("MONGODB_URI must be configured with a real value in production.");
    }
    warnings.push("MONGODB_URI is not configured; database-backed routes will be unavailable until a real connection string is provided.");
  }

  if (!normalized.GEMINI_API_KEY || looksLikePlaceholder(normalized.GEMINI_API_KEY)) {
    if (isProd) {
      throw new Error("GEMINI_API_KEY must be configured with a real value in production.");
    }
    warnings.push("GEMINI_API_KEY is not configured; the AI assistant will return a graceful fallback message.");
  }

  if (warnings.length > 0) {
    // eslint-disable-next-line no-console
    console.warn("Environment warning:", warnings.join(" "));
  }

  return normalized;
}

export const env = loadEnv();
