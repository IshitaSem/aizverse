import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { aiRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { crowdSummaryRequestSchema } from "./crowd.schema.js";
import { getCrowdSummary } from "./crowd.controller.js";
import { asyncHandler } from "../../lib/asyncHandler.js";

export const crowdRouter = Router();

// Restricted to staff/security/organizer roles: crowd analytics are an
// operational tool, not a fan-facing feature.
crowdRouter.get(
  "/summary",
  requireAuth,
  requireRole("staff", "security", "organizer"),
  aiRateLimiter,
  validate(crowdSummaryRequestSchema, "query"),
  asyncHandler(getCrowdSummary)
);
