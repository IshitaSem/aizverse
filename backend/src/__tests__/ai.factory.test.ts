import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getAiProvider", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("AI_PROVIDER", "gemini");
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.stubEnv("GEMINI_MODEL", "gemini-2.0-flash");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns a fallback provider when no Gemini API key is configured", async () => {
    const { getAiProvider } = await import("../lib/ai/ai.factory.js");

    const provider = getAiProvider();
    const result = await provider.generate([{ role: "user", content: "Hello" }]);

    expect(provider.name).toBe("fallback");
    expect(result.provider).toBe("fallback");
    expect(result.text).toContain("currently unavailable");
  });
});
