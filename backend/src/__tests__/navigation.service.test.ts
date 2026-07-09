import { describe, expect, it } from "vitest";
import type { AiProvider } from "../lib/ai/provider.interface.js";
import { generateRoute } from "../features/navigation/navigation.service.js";
import type { RouteRequest } from "../features/navigation/navigation.schema.js";

const fakeProvider: AiProvider = {
  name: "fake",
  generate: async () => ({ text: "Walk toward the concourse, then take Gate B.", provider: "fake" }),
};

const baseRequest: RouteRequest = {
  stadiumId: "stadium-atl-01",
  origin: { lat: 33.7, lng: -84.4 },
  destination: { label: "Gate B", coordinates: { lat: 33.701, lng: -84.401 } },
  routeType: "fastest",
  language: "en",
};

describe("generateRoute", () => {
  it("produces a non-empty ordered list of steps ending at the destination", async () => {
    const result = await generateRoute(baseRequest, fakeProvider);

    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps.at(-1)?.instruction).toContain("Gate B");
  });

  it("swaps in an accessible step when routeType is 'accessible'", async () => {
    const result = await generateRoute({ ...baseRequest, routeType: "accessible" }, fakeProvider);

    expect(result.steps.some((s) => s.instruction.toLowerCase().includes("elevator"))).toBe(true);
  });

  it("estimates a positive, finite walking time", async () => {
    const result = await generateRoute(baseRequest, fakeProvider);

    expect(result.estimatedMinutes).toBeGreaterThan(0);
    expect(Number.isFinite(result.estimatedMinutes)).toBe(true);
  });

  it("never lets the AI layer invent distances not present in the computed path", async () => {
    const distances = new Set<number>();
    const spyProvider: AiProvider = {
      name: "fake",
      generate: async (messages) => {
        const userMsg = messages.find((m) => m.role === "user")?.content ?? "";
        const matches = [...userMsg.matchAll(/(\d+)m/g)];
        matches.forEach((m) => distances.add(Number(m[1])));
        return { text: "summary", provider: "fake" };
      },
    };

    const result = await generateRoute(baseRequest, spyProvider);
    const stepDistances = new Set(result.steps.map((s) => s.distanceMeters));

    distances.forEach((d) => expect(stepDistances.has(d)).toBe(true));
  });
});
