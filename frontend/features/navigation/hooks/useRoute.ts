"use client";

import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";

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

export interface RouteInput {
  stadiumId: string;
  origin: { lat: number; lng: number };
  destination: { label: string; coordinates: { lat: number; lng: number } };
  routeType: RouteResult["routeType"];
  language: string;
  token?: string;
}

/**
 * TanStack Query's useMutation gives us loading/error state, retry, and
 * cancellation for free instead of hand-rolling it (as the chat hook does),
 * demonstrating both patterns used appropriately for their shape of request.
 */
export function useRoute() {
  return useMutation({
    mutationFn: (input: RouteInput) =>
      apiRequest<RouteResult>("/navigation/route", {
        method: "POST",
        token: input.token,
        body: {
          stadiumId: input.stadiumId,
          origin: input.origin,
          destination: input.destination,
          routeType: input.routeType,
          language: input.language,
        },
      }),
  });
}
