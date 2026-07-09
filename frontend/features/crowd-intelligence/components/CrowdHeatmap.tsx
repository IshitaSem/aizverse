"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { CrowdZone } from "../hooks/useCrowdData";

function densityColor(percent: number): string {
  if (percent >= 80) return "#E5484D"; // alert
  if (percent >= 55) return "#F2A93B"; // floodlight
  return "#3DDC84"; // pitch
}

export function CrowdHeatmap({ zones }: { zones: CrowdZone[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label="Bar chart of crowd density percentage by stadium zone">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={zones} layout="vertical" margin={{ left: 24, right: 16, top: 8, bottom: 8 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#ffffff66", fontSize: 11 }} unit="%" />
          <YAxis
            type="category"
            dataKey="zoneLabel"
            width={110}
            tick={{ fill: "#ffffff99", fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Density"]}
            contentStyle={{ background: "#121B2E", border: "1px solid #233047", borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="densityPercent" radius={[0, 4, 4, 0]}>
            {zones.map((zone) => (
              <Cell key={zone.zoneId} fill={densityColor(zone.densityPercent)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
