import type { RubricKey } from "@/lib/assessments";
import { RUBRIC } from "@/lib/assessments";

export function RubricBreakdown({ breakdown }: { breakdown: Record<RubricKey, number> }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {RUBRIC.map((k) => {
        const v = breakdown[k];
        return (
          <div key={k} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/70">{k}</div>
              <div className="text-xs tabular-nums text-white/50">{v}</div>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-white/80" style={{ width: `${v}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
