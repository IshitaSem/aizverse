import { z } from "zod";

export const crowdSummaryRequestSchema = z.object({
  stadiumId: z.string().min(1).max(64),
});

export type CrowdSummaryRequest = z.infer<typeof crowdSummaryRequestSchema>;

export const crowdZoneReadingSchema = z.object({
  zoneId: z.string(),
  zoneLabel: z.string(),
  densityPercent: z.number().min(0).max(100),
  capacity: z.number().nonnegative(),
  currentCount: z.number().nonnegative(),
});

export type CrowdZoneReading = z.infer<typeof crowdZoneReadingSchema>;
