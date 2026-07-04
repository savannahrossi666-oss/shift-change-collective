import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, X, MapPin, Zap } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";
import { OpportunityCard } from "@/components/opportunity-card";
import { CATEGORIES, OPPORTUNITIES } from "@/lib/opportunities";

type SearchParams = { q?: string; cat?: string; sort?: string; today?: string };

export const Route = createFileRoute("/opportunities")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : undefined,
    cat: typeof s.cat === "string" ? s.cat : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
    today: typeof s.today === "string" ? s.today : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Tasks near you — Shift Change" },
      { name: "description", content: "Local tasks posted by neighbors. Same-day work, same-day pay. No resumes." },
      { property: "og:title", content: "Tasks near you — Shift Change" },
      { property: "og:description", content: "Find paid work in your neighborhood right now." },
    ],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const nav = useNavigate({ from: "/opportunities" });
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const cat = search.cat ?? "All";
  const sort = search.sort ?? "newest";
  const todayOnly = search.today === "1";

  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return OPPORTUNITIES.filter((o) =>
      o.title.toLowerCase().includes(needle) || o.company.toLowerCase().includes(needle) || o.category.toLowerCase().includes(needle),
    ).slice(0, 5);
  }, [q]);

  const results = useMemo(() => {
    let list = OPPORTUNITIES.slice();
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(n) ||
          o.company.toLowerCase().includes(n) ||
          o.summary.toLowerCase().includes(n) ||
          o.category.toLowerCase().includes(n) ||
          o.skills.some((s) => s.toLowerCase().includes(n)),
      );
    }
    if (cat !== "All") list = list.filter((o) => o.category === cat);
    if (todayOnly) list = list.filter((o) => /today|same-day/i.test(o.tags.join(" ")) || /today/i.test(o.deadline));
    if (sort === "pay") list.sort((a, b) => b.payMax - a.payMax);
    else if (sort === "trending") list.sort((a, b) => Number(!!b.trending) - Number(!!a.trending));
    else list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    return list;
  }, [q, cat, sort, todayOnly]);

  return (
    <PageShell>
      <PageHeader
        kicker="Tasks near you"
        title="Real work, posted by real neighbors."
        subtitle="No applications. No interviews. Accept a task and get paid the same day."
      />
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Search */}
        <div className="relative">
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 backdrop-blur-md">
            <SearchIcon className="h-4 w-4 text-white/50" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") nav({ search: (s: SearchParams) => ({ ...s, q }) }); }}
              placeholder="Search tasks, categories, neighborhoods…"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear" className="text-white/50 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => nav({ to: "/opportunities/$id", params: { id: s.id } })}
                  className="flex w-full items-center justify-between px-5 py-3 text-left text-sm hover:bg-white/5"
                >
                  <span className="truncate">{s.title}</span>
                  <span className="ml-4 text-xs text-white/50 inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{s.location}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => nav({ search: (s: SearchParams) => ({ ...s, cat: c === "All" ? undefined : c }) })}
                className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition ${
                  active ? "border-white bg-white text-black" : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Meta filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-white/60">
          <button
            onClick={() => nav({ search: (s: SearchParams) => ({ ...s, today: todayOnly ? undefined : "1" }) })}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition ${
              todayOnly ? "border-white bg-white text-black" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
            }`}
          >
            <Zap className="h-3 w-3" /> Same-day only
          </button>
          <div className="flex items-center gap-2">
            Sort
            <select
              value={sort}
              onChange={(e) => nav({ search: (s: SearchParams) => ({ ...s, sort: e.target.value }) })}
              className="rounded-full border border-white/15 bg-black px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-white/80 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="trending">Trending</option>
              <option value="pay">Top pay</option>
            </select>
          </div>
          <div className="ml-auto text-white/50 normal-case tracking-normal">
            {results.length} {results.length === 1 ? "task" : "tasks"} nearby
          </div>
        </div>

        {/* Results */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((o) => (
            <OpportunityCard key={o.id} o={o} />
          ))}
        </div>
        {results.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 p-12 text-center text-sm text-white/50">
            No tasks match those filters yet. Try broadening — or post one yourself and get help today.
          </div>
        )}
      </div>
    </PageShell>
  );
}
