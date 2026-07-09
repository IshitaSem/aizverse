import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { defaultRateLimiter } from "./middleware/rateLimit.middleware.js";
import { errorHandlerMiddleware, notFoundMiddleware } from "./middleware/errorHandler.middleware.js";
import { assistantRouter } from "./features/stadium-assistant/assistant.routes.js";
import { navigationRouter } from "./features/navigation/navigation.routes.js";
import { crowdRouter } from "./features/crowd-intelligence/crowd.routes.js";
import { authRouter } from "./features/auth/auth.routes.js";

/**
 * Express app factory. Kept separate from server.ts (which binds the port
 * and connects to MongoDB) so integration tests can import `createApp()`
 * and exercise real HTTP requests via supertest without a live network/DB.
 */
export function createApp(): Express {
  const app = express();

  // --- Security ---
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    })
  );
  app.disable("x-powered-by");

  // --- Observability ---
  app.use(pinoHttp({ logger }));

  // --- Parsing ---
  app.use(express.json({ limit: "50kb" })); // small limit: this API never needs large bodies

  // --- Rate limiting (global floor; individual routers may add stricter limits) ---
  app.use(defaultRateLimiter);

  // --- Health check (unauthenticated, for uptime monitors / load balancers) ---
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });

  // --- Feature routers ---
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/assistant", assistantRouter);
  app.use("/api/v1/navigation", navigationRouter);
  app.use("/api/v1/crowd", crowdRouter);

  // --- Fallbacks ---
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
