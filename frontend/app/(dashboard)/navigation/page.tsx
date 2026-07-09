"use client";

import { useState } from "react";
import { useRoute, type RouteResult } from "@/features/navigation/hooks/useRoute";
import { RouteSelector } from "@/features/navigation/components/RouteSelector";
import { StadiumMap } from "@/features/navigation/components/StadiumMap";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const DESTINATIONS = [
  { label: "Gate B", coordinates: { lat: 33.701, lng: -84.401 } },
  { label: "Section 214 Seating", coordinates: { lat: 33.702, lng: -84.402 } },
  { label: "Accessible Restroom — Level 2", coordinates: { lat: 33.7015, lng: -84.4015 } },
];

export default function NavigationPage() {
  const [routeType, setRouteType] = useState<RouteResult["routeType"]>("fastest");
  const [destination, setDestination] = useState(DESTINATIONS[0]!);
  const { mutate, data, isPending } = useRoute();

  function handleFindRoute() {
    mutate({
      stadiumId: "stadium-atl-01",
      origin: { lat: 33.7, lng: -84.4 },
      destination,
      routeType,
      language: "en",
    });
  }

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl text-white">AI Navigation</h1>

      <Card className="space-y-4 p-5">
        <div>
          <label htmlFor="destination" className="mb-1.5 block text-xs text-white/50">
            Destination
          </label>
          <select
            id="destination"
            value={destination.label}
            onChange={(e) => setDestination(DESTINATIONS.find((d) => d.label === e.target.value) ?? DESTINATIONS[0]!)}
            className="w-full rounded-lg border border-stadium-line bg-stadium-night px-3 py-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-floodlight"
          >
            {DESTINATIONS.map((d) => (
              <option key={d.label} value={d.label}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <RouteSelector value={routeType} onChange={setRouteType} />

        <Button onClick={handleFindRoute} disabled={isPending} className="w-full">
          {isPending ? "Finding route…" : "Find route"}
        </Button>
      </Card>

      <div className="mt-4">
        <StadiumMap route={data} destinationLabel={destination.label} />
      </div>

      {data && <p className="mt-3 text-sm text-white/70">{data.summary}</p>}
    </main>
  );
}
