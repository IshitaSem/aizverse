import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OperationalSummaryCard } from "@/features/crowd-intelligence/OperationalSummaryCard";

const baseData = {
  stadiumId: "s1",
  zones: [],
  aiSummary: "Gate B is congested; open Gate D as an overflow.",
  riskZones: [] as string[],
  generatedAt: new Date().toISOString(),
};

describe("OperationalSummaryCard", () => {
  it("renders the AI-generated summary text", () => {
    render(<OperationalSummaryCard data={baseData} />);
    expect(screen.getByText(/open gate d as an overflow/i)).toBeInTheDocument();
  });

  it("shows a congestion warning only when riskZones is non-empty", () => {
    const { rerender } = render(<OperationalSummaryCard data={baseData} />);
    expect(screen.queryByText(/congestion risk/i)).not.toBeInTheDocument();

    rerender(<OperationalSummaryCard data={{ ...baseData, riskZones: ["Gate B Concourse"] }} />);
    expect(screen.getByText(/congestion risk/i)).toBeInTheDocument();
  });
});
