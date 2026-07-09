import { useCallback, useState } from "react";
import { apiRequest, ApiError } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/AuthContext";

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  landmark?: string;
}

export interface RouteResult {
  routeType: "fastest" | "accessible" | "least_crowded";
  steps: RouteStep[];
  summary: string;
  estimatedMinutes: number;
}

const STADIUM_ID = "stadium-atl-01";
// The schematic stadium map doesn't carry real geo-coordinates for the
// visitor's current position; center-of-venue is used as a stand-in origin
// until the map is backed by real indoor positioning.
const ORIGIN = { lat: 33.7, lng: -84.4 };

/**
 * Backs the "Navigate to" quick links on StadiumMapPage. Mirrors
 * POST /api/v1/navigation/route exactly.
 */
export function useRoute() {
  const { token } = useAuth();
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findRoute = useCallback(
    async (destinationLabel: string, routeType: RouteResult["routeType"] = "fastest") => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiRequest<RouteResult>("/navigation/route", {
          method: "POST",
          token,
          body: {
            stadiumId: STADIUM_ID,
            origin: ORIGIN,
            destination: { label: destinationLabel, coordinates: ORIGIN },
            routeType,
            language: "en",
          },
        });
        setRoute(result);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Couldn't calculate a route right now.");
        setRoute(null);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return { route, findRoute, isLoading, error };
}
