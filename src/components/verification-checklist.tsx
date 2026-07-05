import { Check, Minus } from "lucide-react";

export type VerificationItem = { label: string; done: boolean; hint?: string };

export function VerificationChecklist({ items }: { items: VerificationItem[] }) {
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Trust profile</div>
        <div className="text-[10px] uppercase tracking-[0.35em] text-white/60">{done}/{items.length}</div>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-white transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-5 space-y-2.5">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-3 text-sm">
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                i.done ? "bg-white text-black" : "border border-white/20 text-white/40"
              }`}
            >
              {i.done ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </span>
            <span className={i.done ? "text-white" : "text-white/50"}>{i.label}</span>
            {i.hint && <span className="ml-auto text-[10px] uppercase tracking-[0.3em] text-white/30">{i.hint}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
