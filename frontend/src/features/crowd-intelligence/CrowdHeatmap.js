import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { chartTooltipStyle } from "../../shared/chartTheme";
function densityColor(percent) {
    if (percent >= 80)
        return "#ef4444"; // alert (red)
    if (percent >= 55)
        return "#f59e0b"; // warning (orange/amber)
    return "#10b981"; // pitch (green)
}
export function CrowdHeatmap({ zones }) {
    return (_jsx("div", { className: "h-64 w-full", role: "img", "aria-label": "Bar chart of crowd density percentage by stadium zone", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: zones, layout: "vertical", margin: { left: 24, right: 16, top: 8, bottom: 8 }, children: [_jsx(XAxis, { type: "number", domain: [0, 100], tick: { fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }, axisLine: false, tickLine: false, unit: "%" }), _jsx(YAxis, { type: "category", dataKey: "zoneLabel", width: 110, tick: { fill: "#94a3b8", fontSize: 10, fontFamily: "JetBrains Mono" }, axisLine: false, tickLine: false }), _jsx(Tooltip, { formatter: (value) => [`${value}%`, "Density"], contentStyle: chartTooltipStyle }), _jsx(Bar, { dataKey: "densityPercent", radius: [0, 4, 4, 0], children: zones.map((zone) => (_jsx(Cell, { fill: densityColor(zone.densityPercent) }, zone.zoneId))) })] }) }) }));
}
