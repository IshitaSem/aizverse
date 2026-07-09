import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  if (!env.MONGODB_URI) {
    logger.warn("MongoDB connection string is not configured; skipping database connection");
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("MongoDB connected");
  } catch (err) {
    if (env.NODE_ENV === "production") {
      throw err;
    }
    logger.warn({ err }, "MongoDB unavailable; continuing without database connection");
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
