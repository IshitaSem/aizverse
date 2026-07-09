"use client";

import clsx from "clsx";
import type { RouteResult } from "../hooks/useRoute";

const ROUTE_TYPES: { value: RouteResult["routeType"]; label: string; hint: string }[] = [
  { value: "fastest", label: "Fastest", hint: "Shortest walking time" },
  { value: "accessible", label: "Accessible", hint: "Elevator & step-free" },
  { value: "least_crowded", label: "Least crowded", hint: "Avoids congestion" },
];

interface RouteSelectorProps {
  value: RouteResult["routeType"];
  onChange: (value: RouteResult["routeType"]) => void;
}

export function RouteSelector({ value, onChange }: RouteSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Route type" className="flex gap-2">
      {ROUTE_TYPES.map((type) => (
        <button
          key={type.value}
          type="button"
          role="radio"
          aria-checked={value === type.value}
          onClick={() => onChange(type.value)}
          className={clsx(
            "flex-1 rounded-lg border px-3 py-2 text-left text-xs transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-floodlight",
            value === type.value
              ? "border-floodlight bg-floodlight/10 text-white"
              : "border-stadium-line text-white/60 hover:border-stadium-line/80"
          )}
        >
          <div className="font-medium">{type.label}</div>
          <div className="text-white/40">{type.hint}</div>
        </button>
      ))}
    </div>
  );
}
