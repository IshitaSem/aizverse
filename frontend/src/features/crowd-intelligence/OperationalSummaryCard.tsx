import { AlertTriangle, Sparkles } from "lucide-react";
import { GlassCard } from "../../shared/primitives";
import type { CrowdIntelligence } from "./useCrowdData";

export function OperationalSummaryCard({ data }: { data: CrowdIntelligence }) {
  return (
    <GlassCard className="p-5" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
      <div className="mb-3 flex items-center gap-2 text-indigo-400">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <h3 className="font-display text-sm uppercase tracking-wide text-white font-semibold">AI operational summary</h3>
      </div>

      <p className="text-sm leading-relaxed text-slate-300">{data.aiSummary}</p>

      {data.riskZones.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
          <p className="text-xs text-amber-400">
            Congestion risk: {data.riskZones.join(", ")}
          </p>
        </div>
      )}

      <p className="mt-3 text-[11px] text-slate-500 font-mono-code">
        Updated {new Date(data.generatedAt).toLocaleTimeString()}
      </p>
    </GlassCard>
  );
}
