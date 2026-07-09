import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { aiRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { assistantChatRequestSchema } from "./assistant.schema.js";
import { postAssistantChat } from "./assistant.controller.js";
import { asyncHandler } from "../../lib/asyncHandler.js";

export const assistantRouter = Router();

assistantRouter.post(
  "/chat",
  requireAuth,
  aiRateLimiter,
  validate(assistantChatRequestSchema),
  asyncHandler(postAssistantChat)
);
