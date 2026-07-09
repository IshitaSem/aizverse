import { AlertTriangle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CrowdIntelligence } from "../hooks/useCrowdData";

export function OperationalSummaryCard({ data }: { data: CrowdIntelligence }) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2 text-pitch">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <h3 className="font-display text-sm uppercase tracking-wide">AI operational summary</h3>
      </div>

      <p className="text-sm leading-relaxed text-white/80">{data.aiSummary}</p>

      {data.riskZones.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-alert/30 bg-alert/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-alert" aria-hidden="true" />
          <p className="text-xs text-alert">
            Congestion risk: {data.riskZones.join(", ")}
          </p>
        </div>
      )}

      <p className="mt-3 text-[11px] text-white/30">
        Updated {new Date(data.generatedAt).toLocaleTimeString()}
      </p>
    </Card>
  );
}
