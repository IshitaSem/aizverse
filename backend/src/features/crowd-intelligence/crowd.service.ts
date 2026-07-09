import type { AiProvider } from "../../lib/ai/provider.interface.js";
import { getAiProvider } from "../../lib/ai/ai.factory.js";
import { CrowdReadingModel } from "../../models/CrowdReading.model.js";
import type { CrowdZoneReading } from "./crowd.schema.js";

export interface CrowdIntelligenceResult {
  stadiumId: string;
  zones: CrowdZoneReading[];
  aiSummary: string;
  riskZones: string[];
  generatedAt: string;
}

const CONGESTION_THRESHOLD = 80;

/**
 * Fetches the latest reading per zone for a stadium. Kept as its own
 * function so it can be unit-tested independently of the AI summary step.
 */
export async function getLatestZoneReadings(stadiumId: string): Promise<CrowdZoneReading[]> {
  const readings = await CrowdReadingModel.aggregate<CrowdZoneReading & { _id: string }>([
    { $match: { stadiumId } },
    { $sort: { recordedAt: -1 } },
    {
      $group: {
        _id: "$zoneId",
        zoneId: { $first: "$zoneId" },
        zoneLabel: { $first: "$zoneLabel" },
        densityPercent: { $first: "$densityPercent" },
        capacity: { $first: "$capacity" },
        currentCount: { $first: "$currentCount" },
      },
    },
  ]);

  return readings.map(({ _id, ...rest }) => rest);
}

function buildZoneSummaryLine(zone: CrowdZoneReading): string {
  return `${zone.zoneLabel}: ${zone.densityPercent}% capacity (${zone.currentCount}/${zone.capacity})`;
}

export async function generateCrowdIntelligence(
  stadiumId: string,
  zones: CrowdZoneReading[],
  provider: AiProvider = getAiProvider()
): Promise<CrowdIntelligenceResult> {
  const riskZones = zones.filter((z) => z.densityPercent >= CONGESTION_THRESHOLD).map((z) => z.zoneLabel);

  const zoneLines = zones.map(buildZoneSummaryLine).join("\n");

  const result = await provider.generate(
    [
      {
        role: "system",
        content:
          "You are an operations analyst for a FIFA World Cup stadium. Given zone-by-zone crowd density " +
          "data, write a concise operational summary (max 4 sentences) for organizers: call out congestion " +
          "risks, suggest concrete actions (e.g. open an alternate gate, deploy volunteers), and stay factual " +
          "— never invent data not present in the input.",
      },
      { role: "user", content: `Stadium: ${stadiumId}\nZone readings:\n${zoneLines}` },
    ],
    { temperature: 0.2, maxOutputTokens: 300 }
  );

  return {
    stadiumId,
    zones,
    aiSummary: result.text.trim(),
    riskZones,
    generatedAt: new Date().toISOString(),
  };
}
