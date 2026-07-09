"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";

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

interface UseCrowdDataOptions {
  stadiumId: string;
  token?: string;
  /** Polling interval in ms; defaults to 30s to keep the dashboard "live" without hammering the API. */
  refetchIntervalMs?: number;
}

export function useCrowdData({ stadiumId, token, refetchIntervalMs = 30_000 }: UseCrowdDataOptions) {
  return useQuery({
    queryKey: ["crowd-intelligence", stadiumId],
    queryFn: () => apiRequest<CrowdIntelligence>(`/crowd/summary?stadiumId=${encodeURIComponent(stadiumId)}`, { token }),
    refetchInterval: refetchIntervalMs,
    staleTime: 15_000,
  });
}
