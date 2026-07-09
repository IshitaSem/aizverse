import type { Request, Response } from "express";
import { AppError } from "../../middleware/errorHandler.middleware.js";
import { getLatestZoneReadings, generateCrowdIntelligence } from "./crowd.service.js";
import type { CrowdSummaryRequest } from "./crowd.schema.js";

export async function getCrowdSummary(req: Request, res: Response): Promise<void> {
  const { stadiumId } = req.query as unknown as CrowdSummaryRequest;

  const zones = await getLatestZoneReadings(stadiumId);
  if (zones.length === 0) {
    throw new AppError(`No crowd data available for stadium "${stadiumId}"`, 404);
  }

  const result = await generateCrowdIntelligence(stadiumId, zones);
  res.status(200).json(result);
}
