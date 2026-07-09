import { describe, expect, it, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

// These are true integration tests against the Express app (routing,
// middleware, validation, auth) — no real MongoDB or Gemini calls are made
// for the paths exercised here, so they run fast and deterministically in CI.
describe("createApp", () => {
  const app = createApp();

  it("GET /health returns 200 with an ok status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /unknown-route returns 404 with a structured error", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("NotFound");
  });

  it("POST /api/v1/assistant/chat without auth returns 401", async () => {
    const res = await request(app).post("/api/v1/assistant/chat").send({ message: "hi", stadiumId: "s1" });
    expect(res.status).toBe(401);
  });

  it("POST /api/v1/assistant/chat with a bad Authorization header returns 401, not a stack trace", async () => {
    const res = await request(app)
      .post("/api/v1/assistant/chat")
      .set("Authorization", "Bearer not-a-real-token")
      .send({ message: "hi", stadiumId: "s1" });

    expect(res.status).toBe(401);
    expect(res.body).not.toHaveProperty("stack");
  });

  it("rejects an oversized message body before it reaches validation", async () => {
    const res = await request(app)
      .post("/api/v1/assistant/chat")
      .set("Authorization", "Bearer not-a-real-token")
      .send({ message: "x".repeat(100_000), stadiumId: "s1" });

    expect([401, 413]).toContain(res.status);
  });
});

describe("createApp — auth routes", () => {
  const app = createApp();

  it("POST /api/v1/auth/login rejects malformed payloads with 400, not a crash", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "not-an-email" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
  });

  it("POST /api/v1/auth/register rejects a short password with 400", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Ana", email: "ana@example.com", password: "short", role: "fan" });
    expect(res.status).toBe(400);
  });
});
