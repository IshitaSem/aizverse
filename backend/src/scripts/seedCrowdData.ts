/**
 * Minimal demo/dev seed for the Crowd Intelligence feature.
 *
 * GET /api/v1/crowd/summary reads the latest CrowdReading per zone from
 * MongoDB — with an empty collection it correctly 404s ("no crowd data
 * available"), which is safe behavior but means a fresh environment has
 * nothing to demo. This script inserts one current reading per zone so the
 * Organizer Dashboard and Crowd Intelligence page have real data to
 * summarize on first run.
 *
 * Does not touch application/route logic, does not fake AI output — the
 * AI summary is still generated live from whatever rows exist here.
 *
 * Usage: npm run seed:crowd
 */
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { logger } from "../config/logger.js";
import { CrowdReadingModel } from "../models/CrowdReading.model.js";

const STADIUM_ID = "stadium-atl-01";

// zoneId/label intentionally match StadiumMapPage's six schematic zones
// (A–F) so the map and the AI crowd-intelligence summary describe the same
// physical areas instead of two disconnected naming schemes.
const DEMO_ZONES = [
  { zoneId: "zone-a", zoneLabel: "Zone A — North Concourse", capacity: 500, currentCount: 430 }, // ~86%, high
  { zoneId: "zone-b", zoneLabel: "Zone B — Main Entrance", capacity: 600, currentCount: 330 }, // 55%, medium
  { zoneId: "zone-c", zoneLabel: "Zone C — East Concourse", capacity: 500, currentCount: 465 }, // 93%, critical
  { zoneId: "zone-d", zoneLabel: "Zone D — Food Court", capacity: 800, currentCount: 440 }, // 55%, medium
  { zoneId: "zone-e", zoneLabel: "Zone E — South Concourse", capacity: 500, currentCount: 150 }, // 30%, low
  { zoneId: "zone-f", zoneLabel: "Zone F — Fan Zone Plaza", capacity: 1200, currentCount: 1020 }, // 85%, high
];

async function seedCrowdData(): Promise<void> {
  await connectDatabase();

  const now = new Date();
  const readings = DEMO_ZONES.map((zone) => ({
    stadiumId: STADIUM_ID,
    zoneId: zone.zoneId,
    zoneLabel: zone.zoneLabel,
    capacity: zone.capacity,
    currentCount: zone.currentCount,
    densityPercent: Math.round((zone.currentCount / zone.capacity) * 100),
    recordedAt: now,
  }));

  await CrowdReadingModel.insertMany(readings);
  logger.info(`Seeded ${readings.length} crowd readings for stadium "${STADIUM_ID}"`);

  await disconnectDatabase();
}

seedCrowdData().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Seed failed:", error);
  process.exit(1);
});
