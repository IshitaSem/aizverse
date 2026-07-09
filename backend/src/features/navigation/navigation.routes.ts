import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { aiRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { routeRequestSchema } from "./navigation.schema.js";
import { postRoute } from "./navigation.controller.js";
import { asyncHandler } from "../../lib/asyncHandler.js";

export const navigationRouter = Router();

navigationRouter.post("/route", requireAuth, aiRateLimiter, validate(routeRequestSchema), asyncHandler(postRoute));
