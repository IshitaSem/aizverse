import { describe, expect, it } from "vitest";
import type { AiProvider } from "../lib/ai/provider.interface.js";
import { generateCrowdIntelligence } from "../features/crowd-intelligence/crowd.service.js";
import type { CrowdZoneReading } from "../features/crowd-intelligence/crowd.schema.js";

const fakeProvider: AiProvider = {
  name: "fake",
  generate: async () => ({ text: "Gate B is congested; open Gate D as an overflow.", provider: "fake" }),
};

const zones: CrowdZoneReading[] = [
  { zoneId: "gate-b", zoneLabel: "Gate B Concourse", densityPercent: 92, capacity: 500, currentCount: 460 },
  { zoneId: "gate-d", zoneLabel: "Gate D Concourse", densityPercent: 35, capacity: 500, currentCount: 175 },
];

describe("generateCrowdIntelligence", () => {
  it("flags zones at or above the congestion threshold as risk zones", async () => {
    const result = await generateCrowdIntelligence("stadium-atl-01", zones, fakeProvider);

    expect(result.riskZones).toContain("Gate B Concourse");
    expect(result.riskZones).not.toContain("Gate D Concourse");
  });

  it("returns an ISO timestamp for generatedAt", async () => {
    const result = await generateCrowdIntelligence("stadium-atl-01", zones, fakeProvider);
    expect(() => new Date(result.generatedAt).toISOString()).not.toThrow();
  });

  it("passes through all zone data unmodified", async () => {
    const result = await generateCrowdIntelligence("stadium-atl-01", zones, fakeProvider);
    expect(result.zones).toEqual(zones);
  });

  it("returns an empty riskZones array when no zone exceeds the threshold", async () => {
    const calmZones: CrowdZoneReading[] = zones.map((z) => ({ ...z, densityPercent: 20 }));
    const result = await generateCrowdIntelligence("stadium-atl-01", calmZones, fakeProvider);
    expect(result.riskZones).toEqual([]);
  });
});
