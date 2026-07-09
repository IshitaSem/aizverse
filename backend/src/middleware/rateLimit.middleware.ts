import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

/**
 * Applied per-router so AI-heavy endpoints (expensive, latency-sensitive)
 * can have a tighter budget than lightweight read endpoints if needed.
 */
export const defaultRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "TooManyRequests", message: "Rate limit exceeded. Please slow down." },
});

export const aiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: Math.max(10, Math.floor(env.RATE_LIMIT_MAX_REQUESTS / 3)),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "TooManyRequests", message: "AI request rate limit exceeded. Please slow down." },
});
