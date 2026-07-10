import { useCallback, useEffect, useState, useRef } from "react";
import { apiRequest, ApiError } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/AuthContext";
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
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const refetch = useCallback(async () => {
        // Abort any in‑flight request before starting a new one
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiRequest(`/crowd/summary?stadiumId=${encodeURIComponent(STADIUM_ID)}`, { token, signal: controller.signal });
            setData(result);
        }
        catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // Silently ignore aborts
                return;
            }
            setError(err instanceof ApiError ? err.message : "Couldn't load crowd intelligence.");
        }
        finally {
            setIsLoading(false);
        }
    }, [token]);
    // Initial load
    useEffect(() => {
        void refetch();
    }, [refetch]);
    // Visibility‑aware polling – only refresh when the page is visible
    useEffect(() => {
        let intervalId = null;
        const start = () => {
            if (intervalId === null) {
                intervalId = window.setInterval(() => {
                    void refetch();
                }, REFRESH_MS);
            }
        };
        const stop = () => {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                start();
            }
            else {
                stop();
            }
        };
        // Start immediately if page is visible
        if (document.visibilityState === "visible") {
            start();
        }
        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            stop();
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [refetch]);
    return { data, isLoading, error, refetch };
}
