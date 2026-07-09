import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { defaultRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { registerRequestSchema, loginRequestSchema } from "./auth.schema.js";
import { postRegister, postLogin } from "./auth.controller.js";
import { asyncHandler } from "../../lib/asyncHandler.js";

export const authRouter = Router();

// Auth endpoints get the platform's default rate limit (not the stricter
// AI limit) — login/register are cheap, non-AI operations, but still
// benefit from brute-force protection via the global limiter in app.ts.
authRouter.post("/register", defaultRateLimiter, validate(registerRequestSchema), asyncHandler(postRegister));
authRouter.post("/login", defaultRateLimiter, validate(loginRequestSchema), asyncHandler(postLogin));
