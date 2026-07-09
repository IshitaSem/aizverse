import type { AiProvider } from "../../lib/ai/provider.interface.js";
import { getAiProvider } from "../../lib/ai/ai.factory.js";
import type { RouteRequest, RouteStep } from "./navigation.schema.js";

export interface RouteResult {
  routeType: RouteRequest["routeType"];
  steps: RouteStep[];
  summary: string;
  estimatedMinutes: number;
}

/**
 * Deterministic geometry (step distances, turn sequence) comes from the
 * routing/pathfinding layer — represented here by `computeRawPath`, a stand-in
 * for a real indoor-routing graph (A-star or Dijkstra over a stadium graph). The AI
 * layer's job is narrower and safer: turn the raw path into a clear,
 * human-readable, localized explanation — never to invent the geometry itself.
 */
function computeRawPath(input: RouteRequest): { steps: RouteStep[]; estimatedMinutes: number } {
  const baseSteps: RouteStep[] = [
    { instruction: "Head toward the main concourse", distanceMeters: 80, landmark: "Fan Zone entrance" },
    { instruction: "Turn toward the east stairwell", distanceMeters: 45, landmark: "East stairwell" },
    { instruction: `Arrive at ${input.destination.label}`, distanceMeters: 30 },
  ];

  const accessibleSteps: RouteStep[] =
    input.routeType === "accessible"
      ? [
          baseSteps[0]!,
          { instruction: "Take the accessible elevator to Level 2", distanceMeters: 20, landmark: "Elevator B" },
          baseSteps[2]!,
        ]
      : baseSteps;

  const totalDistance = accessibleSteps.reduce((sum, s) => sum + s.distanceMeters, 0);
  const estimatedMinutes = Math.max(1, Math.round(totalDistance / 70));

  return { steps: accessibleSteps, estimatedMinutes };
}

export async function generateRoute(
  input: RouteRequest,
  provider: AiProvider = getAiProvider()
): Promise<RouteResult> {
  const { steps, estimatedMinutes } = computeRawPath(input);

  const stepsDescription = steps
    .map((s, i) => `${i + 1}. ${s.instruction}${s.landmark ? ` (near ${s.landmark})` : ""} — ${s.distanceMeters}m`)
    .join("\n");

  const result = await provider.generate(
    [
      {
        role: "system",
        content:
          "You are a wayfinding narrator for a FIFA World Cup stadium app. Given a raw list of route " +
          "steps, write a short, warm, easy-to-follow walking summary (2-3 sentences) in the requested " +
          "language. Do not invent distances or landmarks beyond what is given.",
      },
      {
        role: "user",
        content: `Language: ${input.language}\nRoute type: ${input.routeType}\nSteps:\n${stepsDescription}`,
      },
    ],
    { temperature: 0.3, maxOutputTokens: 200 }
  );

  return {
    routeType: input.routeType,
    steps,
    summary: result.text.trim(),
    estimatedMinutes,
  };
}
