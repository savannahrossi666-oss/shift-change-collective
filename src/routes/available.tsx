import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Zap } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";
import { OpportunityCard } from "@/components/opportunity-card";
import { OPPORTUNITIES, urgencyOf } from "@/lib/opportunities";
import { store, useStoreVersion } from "@/lib/store";
import { listOpenShifts } from "@/lib/shifts.functions";


export const Route = createFileRoute("/available")({
  head: () => ({
    meta: [
      { title: "Available Now — Shift Change" },
      { name: "description", content: "Flip on Available Now and start claiming shifts happening in real time. Get paid the day you deliver." },
      { property: "og:title", content: "Available Now — Shift Change" },
      { property: "og:description", content: "Turn on your availability and see shifts opening in real time." },
    ],
  }),
  component: AvailablePage,
});

function AvailablePage() {
  useStoreVersion();
  const available = store.isAvailableNow();
  const travel = store.getTravelMi();
  const [q, setQ] = useState("");

  const liveShifts = OPPORTUNITIES.filter((o) => urgencyOf(o) !== "this_week");
  const filtered = q.trim()
    ? liveShifts.filter((o) =>
        (o.title + o.category + o.skills.join(" ")).toLowerCase().includes(q.toLowerCase()),
      )
    : liveShifts;

  return (
    <PageShell>
      <PageHeader
        kicker="I want to work"
        title="Flip on Available. Claim a shift right now."
        subtitle="When Available Now is on, requesters can see you and matched shifts get pushed to the top."
      />
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Toggle */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => store.setAvailableNow(!available)}
                aria-pressed={available}
                aria-label="Toggle available now"
                className={`relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border transition ${
                  available ? "border-emerald-400/40 bg-emerald-400/30" : "border-white/20 bg-white/5"
                }`}
              >
                <span
                  className={`inline-block h-7 w-7 transform rounded-full bg-white transition ${
                    available ? "translate-x-8" : "translate-x-1"
                  }`}
                />
              </button>
              <div>
                <div className="text-lg font-light">
                  {available ? "You're available now" : "You're offline"}
                </div>
                <div className="text-xs text-white/50">
                  {available
                    ? "Requesters can see you and matched shifts push to the top."
                    : "Flip it on to appear in the live shifters feed."}
                </div>
              </div>
            </div>
            <div className="flex-1 md:max-w-xs">
              <label className="block text-[10px] uppercase tracking-[0.3em] text-white/40">
                Travel radius
              </label>
              <div className="mt-2 flex items-center gap-3">
                <MapPin className="h-4 w-4 text-white/50" />
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={travel}
                  onChange={(e) => store.setTravelMi(Number(e.target.value))}
                  className="flex-1 accent-white"
                />
                <span className="w-14 text-right text-sm text-white/70">{travel} mi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-10 flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 backdrop-blur-md">
          <Zap className="h-4 w-4 text-white/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter live shifts by skill or category…"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/40 inline-flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
              Live shifts
            </div>
            <h2 className="mt-3 text-2xl font-light">{filtered.length} open right now</h2>
          </div>
          <Link to="/opportunities" className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
            See all <ArrowRight className="inline h-3 w-3" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <OpportunityCard key={o.id} o={o} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
