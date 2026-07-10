import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin, Clock, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { formatPay, postedLabel, urgencyOf, urgencyLabel, type Opportunity } from "@/lib/opportunities";
import { store, useStoreVersion } from "@/lib/store";

/**
 * ShiftCard — used everywhere we surface a shift.
 * Component name stays "OpportunityCard" to keep imports stable.
 */
export function OpportunityCard({ o }: { o: Opportunity }) {
  useStoreVersion();
  const saved = store.isSaved(o.id);
  const claimed = store.getClaimedShifts().includes(o.id);
  const u = urgencyOf(o);
  const verified = /verified|trust|vetted/i.test(o.tags.join(" "));

  const urgencyChipClass =
    u === "now"
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
      : u === "today"
      ? "border-amber-300/40 bg-amber-300/10 text-amber-200"
      : "border-white/15 text-white/60";

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/40">
            <span className="truncate">{o.category}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${urgencyChipClass}`}
            >
              {u === "now" && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </span>
              )}
              {urgencyLabel(u)}
            </span>
          </div>
          <Link
            to="/opportunities/$id"
            params={{ id: o.id }}
            className="mt-2 block text-lg font-light leading-snug tracking-tight text-white group-hover:text-white"
          >
            {o.title}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
            <span>Posted by {o.company}</span>
            {verified && <ShieldCheck className="h-3.5 w-3.5 text-white/60" aria-label="Trust verified" />}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            store.toggleSaved(o.id);
          }}
          aria-label={saved ? "Remove bookmark" : "Save shift"}
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
            saved
              ? "border-white bg-white text-black"
              : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
          }`}
        >
          <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-white/60">
        {o.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {o.tags.slice(0, 3).map((t) => (
          <span key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/50">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-medium text-white/85">{formatPay(o)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{o.hours}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{o.location}</span>
          <span className="text-white/40">{postedLabel(o.postedDaysAgo)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          to="/opportunities/$id"
          params={{ id: o.id }}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs uppercase tracking-[0.25em] transition ${
            claimed
              ? "border border-white/20 bg-white/5 text-white/60"
              : "bg-white text-black hover:bg-white/90"
          }`}
        >
          {claimed ? "Claimed" : "Claim shift"}
          {!claimed && <ArrowUpRight className="h-3 w-3" />}
        </Link>
      </div>
    </div>
  );
}
