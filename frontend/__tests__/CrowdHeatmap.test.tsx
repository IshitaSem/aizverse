import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CrowdHeatmap } from "@/features/crowd-intelligence/components/CrowdHeatmap";

const zones = [
  { zoneId: "gate-b", zoneLabel: "Gate B Concourse", densityPercent: 92, capacity: 500, currentCount: 460 },
  { zoneId: "gate-d", zoneLabel: "Gate D Concourse", densityPercent: 35, capacity: 500, currentCount: 175 },
];

describe("CrowdHeatmap", () => {
  it("renders an accessible chart region describing its purpose", () => {
    render(<CrowdHeatmap zones={zones} />);
    expect(screen.getByRole("img", { name: /crowd density/i })).toBeInTheDocument();
  });
});
