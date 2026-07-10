import { useCallback, useState } from "react";
import { apiRequest, ApiError } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/AuthContext";
const STADIUM_ID = "stadium-atl-01";
// The schematic stadium map doesn't carry real geo-coordinates for the
// visitor's current position; center-of-venue is used as a stand-in origin
// until the map is backed by real indoor positioning.
const ORIGIN = { lat: 33.7, lng: -84.4 };
/**
 * Backs the "Navigate to" quick links on StadiumMapPage. Mirrors
 * POST /api/v1/navigation/route exactly.
 */
export function useRoute(language = "en") {
    const { token } = useAuth();
    const [route, setRoute] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const findRoute = useCallback(async (destinationLabel, routeType = "fastest") => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiRequest("/navigation/route", {
                method: "POST",
                token,
                body: {
                    stadiumId: STADIUM_ID,
                    origin: ORIGIN,
                    destination: { label: destinationLabel, coordinates: ORIGIN },
                    routeType,
                    language: language.toLowerCase(),
                },
            });
            setRoute(result);
        }
        catch (err) {
            setError(err instanceof ApiError ? err.message : "Couldn't calculate a route right now.");
            setRoute(null);
        }
        finally {
            setIsLoading(false);
        }
    }, [token, language]);
    return { route, findRoute, isLoading, error };
}
