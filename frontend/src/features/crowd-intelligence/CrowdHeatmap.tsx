import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { CrowdZone } from "./useCrowdData";
import { chartTooltipStyle } from "../../shared/chartTheme";

function densityColor(percent: number): string {
  if (percent >= 80) return "#ef4444"; // alert (red)
  if (percent >= 55) return "#f59e0b"; // warning (orange/amber)
  return "#10b981"; // pitch (green)
}

export function CrowdHeatmap({ zones }: { zones: CrowdZone[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label="Bar chart of crowd density percentage by stadium zone">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={zones} layout="vertical" margin={{ left: 24, right: 16, top: 8, bottom: 8 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} unit="%" />
          <YAxis
            type="category"
            dataKey="zoneLabel"
            width={110}
            tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Density"]}
            contentStyle={chartTooltipStyle}
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
