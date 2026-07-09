"use client";

import { useCrowdData } from "@/features/crowd-intelligence/hooks/useCrowdData";
import { CrowdHeatmap } from "@/features/crowd-intelligence/components/CrowdHeatmap";
import { OperationalSummaryCard } from "@/features/crowd-intelligence/components/OperationalSummaryCard";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useCrowdData({ stadiumId: "stadium-atl-01" });

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl text-white">Crowd Intelligence</h1>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      )}

      {isError && (
        <Card className="p-5" role="alert">
          <p className="text-sm text-alert">
            Couldn&apos;t load crowd data{error instanceof Error ? `: ${error.message}` : "."}
          </p>
        </Card>
      )}

      {data && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 font-display text-sm uppercase tracking-wide text-white/60">
              Zone density
            </h2>
            <CrowdHeatmap zones={data.zones} />
          </Card>
          <OperationalSummaryCard data={data} />
        </div>
      )}
    </main>
  );
}
