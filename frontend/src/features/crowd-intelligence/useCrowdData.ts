import { useCallback, useEffect, useState } from "react";
import { apiRequest, ApiError } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/AuthContext";

export interface CrowdZone {
  zoneId: string;
  zoneLabel: string;
  densityPercent: number;
  capacity: number;
  currentCount: number;
}

export interface CrowdIntelligence {
  stadiumId: string;
  zones: CrowdZone[];
  aiSummary: string;
  riskZones: string[];
  generatedAt: string;
}

const STADIUM_ID = "stadium-atl-01";
const REFRESH_MS = 30_000;

/**
 * Backs the "AI Operational Summary" panel on CrowdAnalyticsPage. Mirrors
 * GET /api/v1/crowd/summary exactly. Restricted server-side to
 * staff/security/organizer roles — a 403 here just means the logged-in
 * fan/volunteer account isn't allowed to see it, which the hook surfaces
 * as a normal error rather than a crash.
 */
export function useCrowdData() {
  const { token } = useAuth();
  const [data, setData] = useState<CrowdIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiRequest<CrowdIntelligence>(
        `/crowd/summary?stadiumId=${encodeURIComponent(STADIUM_ID)}`,
        { token }
      );
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load crowd intelligence.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refetch();
    const interval = setInterval(() => void refetch(), REFRESH_MS);
    return () => clearInterval(interval);
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
