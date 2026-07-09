"use client";

import type { RouteResult } from "../hooks/useRoute";

interface StadiumMapProps {
  route?: RouteResult;
  destinationLabel: string;
}

/**
 * Simplified schematic route visualization. A production build would swap
 * this for react-leaflet with a real indoor-map GeoJSON layer; the props
 * contract here (`route`, `destinationLabel`) is deliberately map-library
 * agnostic so that swap doesn't touch any calling code.
 */
export function StadiumMap({ route, destinationLabel }: StadiumMapProps) {
  return (
    <div
      className="relative flex h-72 flex-col justify-between rounded-xl border border-stadium-line bg-[radial-gradient(circle_at_30%_20%,rgba(61,220,132,0.08),transparent_60%)] p-4"
      role="img"
      aria-label={route ? `Route to ${destinationLabel}: ${route.summary}` : "Stadium map, no route selected"}
    >
      {!route && <p className="text-sm text-white/40">Choose a destination to see your route.</p>}

      {route && (
        <ol className="space-y-3 text-sm">
          {route.steps.map((step, i) => (
            <li key={`${step.instruction}-${i}`} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pitch/20 font-mono text-[10px] text-pitch">
                {i + 1}
              </span>
              <div>
                <p className="text-white">{step.instruction}</p>
                {step.landmark && <p className="text-xs text-white/40">near {step.landmark}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {route && (
        <p className="mt-4 font-mono text-xs text-pitch">~{route.estimatedMinutes} min walk</p>
      )}
    </div>
  );
}
