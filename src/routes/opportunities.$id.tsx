import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { OpportunityCard } from "@/components/opportunity-card";
import { formatPay, getOpportunity, OPPORTUNITIES } from "@/lib/opportunities";
import { store, useStoreVersion } from "@/lib/store";

export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const o = getOpportunity(params.id);
    if (!o) throw notFound();
    return { o };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found — Shift Change" }, { name: "robots", content: "noindex" }] };
    const { o } = loaderData;
    return {
      meta: [
        { title: `${o.title} — Shift Change` },
        { name: "description", content: o.summary },
        { property: "og:title", content: `${o.title} — Shift Change` },
        { property: "og:description", content: o.summary },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="pt-40 pb-24 text-center">
        <h1 className="text-4xl font-light">Opportunity not found</h1>
        <Link to="/opportunities" className="mt-6 inline-block text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
          Back to directory
        </Link>
      </div>
    </PageShell>
  ),
  component: OpportunityDetail,
});

function OpportunityDetail() {
  const { o } = Route.useLoaderData();
  useStoreVersion();

  useEffect(() => { store.pushViewed(o.id); }, [o.id]);
  const saved = store.isSaved(o.id);
  const apps = store.getApplications();
  const currentStatus = apps.find((a) => a.opportunityId === o.id)?.status ?? "Saved";

  const related = OPPORTUNITIES.filter((x) => x.id !== o.id && x.category === o.category).slice(0, 3);
  const similar = OPPORTUNITIES.filter((x) => x.id !== o.id && x.tags.some((t) => o.tags.includes(t))).slice(0, 3);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: o.title, url });
      else await navigator.clipboard.writeText(url);
    } catch { /* ignore */ }
  }

  return (
    <PageShell>
      <div className="pt-28 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <Link to="/opportunities" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
            <ArrowLeft className="h-3 w-3" /> Back to directory
          </Link>

          <div className="mt-10 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">{o.category}</div>
              <h1 className="mt-3 text-4xl md:text-5xl font-light tracking-tight">{o.title}</h1>
              <div className="mt-3 text-white/70">{o.company}</div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={() => store.toggleSaved(o.id)}
                aria-label="Bookmark"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  saved ? "border-white bg-white text-black" : "border-white/20 text-white/60 hover:text-white"
                }`}
              >
                <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
              </button>
              <button
                onClick={share}
                aria-label="Share"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Meta label="Pay" value={formatPay(o)} />
            <Meta label="Hours" value={o.hours} icon={<Clock className="h-3 w-3" />} />
            <Meta label="Location" value={o.remote ? "Remote" : o.location} icon={<MapPin className="h-3 w-3" />} />
            <Meta label="Deadline" value={o.deadline} icon={<Calendar className="h-3 w-3" />} />
          </div>

          <div className="mt-10 space-y-6 text-white/80 leading-relaxed">
            <p className="text-lg text-white/90">{o.summary}</p>
            <p>{o.description}</p>
          </div>

          <div className="mt-10">
            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Required skills</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {o.skills.map((s: string) => (
                <span key={s} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={o.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => store.setApplicationStatus(o.id, "Applied")}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
            >
              Apply on {new URL(o.applyUrl.startsWith("http") ? o.applyUrl : "https://example.com").hostname.replace("www.", "")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <select
              value={currentStatus}
              onChange={(e) => store.setApplicationStatus(o.id, e.target.value as never)}
              className="rounded-full border border-white/20 bg-black px-4 py-4 text-xs uppercase tracking-[0.3em] text-white/80 focus:outline-none"
            >
              {(["Saved", "Applied", "Interview", "Offer", "Archived"] as const).map((s) => (
                <option key={s} value={s}>Track as: {s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 mt-24">
          <h2 className="text-2xl font-light tracking-tight">Related in {o.category}</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {(related.length ? related : similar).map((r) => (
              <OpportunityCard key={r.id} o={r} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
        {icon}{label}
      </div>
      <div className="mt-2 text-sm text-white">{value}</div>
    </div>
  );
}
