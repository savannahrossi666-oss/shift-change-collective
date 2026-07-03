import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { formatPay, type Opportunity } from "@/lib/opportunities";
import { store, useStoreVersion } from "@/lib/store";

export function OpportunityCard({ o }: { o: Opportunity }) {
  useStoreVersion();
  const saved = store.isSaved(o.id);
  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">
            {o.category}
          </div>
          <Link
            to="/opportunities/$id"
            params={{ id: o.id }}
            className="mt-2 block truncate text-lg font-light tracking-tight text-white group-hover:text-white"
          >
            {o.title}
          </Link>
          <div className="mt-1 text-sm text-white/60">{o.company}</div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            store.toggleSaved(o.id);
          }}
          aria-label={saved ? "Remove bookmark" : "Save opportunity"}
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
        <div className="flex items-center gap-4">
          <span className="text-white/80">{formatPay(o)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{o.hours}</span>
          <span className="hidden sm:inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{o.remote ? "Remote" : o.location}</span>
        </div>
        <Link
          to="/opportunities/$id"
          params={{ id: o.id }}
          className="inline-flex items-center gap-1 text-white/70 hover:text-white"
        >
          View <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
