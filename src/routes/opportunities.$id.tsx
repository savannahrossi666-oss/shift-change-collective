import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, Calendar, Clock, MapPin, Share2, ShieldCheck, Zap, HeartHandshake } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { OpportunityCard } from "@/components/opportunity-card";
import { formatPay, getOpportunity, OPPORTUNITIES, postedLabel } from "@/lib/opportunities";
import { store, useStoreVersion } from "@/lib/store";

export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const o = getOpportunity(params.id);
    if (!o) throw notFound();
    return { o };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Task not found — Shift Change" }, { name: "robots", content: "noindex" }] };
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
        <h1 className="text-4xl font-light">Task not found</h1>
        <p className="mt-3 text-white/60">It may have been accepted already.</p>
        <Link to="/opportunities" className="mt-6 inline-block text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
          Back to nearby tasks
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
  const initials = o.company.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const sameDay = /today|same-day/i.test(o.tags.join(" ")) || /today/i.test(o.deadline);

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
            <ArrowLeft className="h-3 w-3" /> Back to nearby tasks
          </Link>

          <div className="mt-10 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/50">
                <span>{o.category}</span>
                {sameDay && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2 py-0.5 text-white/80">
                    <Zap className="h-2.5 w-2.5" /> Same-day
                  </span>
                )}
                <span className="text-white/40 normal-case tracking-normal">{postedLabel(o.postedDaysAgo)}</span>
              </div>
              <h1 className="mt-3 text-4xl md:text-5xl font-light tracking-tight">{o.title}</h1>
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

          {/* Poster */}
          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-black text-sm font-medium">
              {initials || "N"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-white">Posted by {o.company}</div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> ID verified</span>
                <span className="inline-flex items-center gap-1"><HeartHandshake className="h-3 w-3" /> 4.9 ★ from 12 neighbors</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Meta label="Pay" value={formatPay(o)} />
            <Meta label="Duration" value={o.hours} icon={<Clock className="h-3 w-3" />} />
            <Meta label="Where" value={o.location} icon={<MapPin className="h-3 w-3" />} />
            <Meta label="When" value={o.deadline} icon={<Calendar className="h-3 w-3" />} />
          </div>

          <div className="mt-10 space-y-6 text-white/80 leading-relaxed">
            <p className="text-lg text-white/90">{o.summary}</p>
            <p>{o.description}</p>
          </div>

          <div className="mt-10">
            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">What helps</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {o.skills.map((s: string) => (
                <span key={s} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => store.setApplicationStatus(o.id, "Applied")}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
            >
              Accept & Earn {formatPay(o).split(" ")[0]}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <select
              value={currentStatus}
              onChange={(e) => store.setApplicationStatus(o.id, e.target.value as never)}
              className="rounded-full border border-white/20 bg-black px-4 py-4 text-xs uppercase tracking-[0.3em] text-white/80 focus:outline-none"
            >
              {(["Saved", "Applied", "Interview", "Offer", "Archived"] as const).map((s) => {
                const label = ({ Saved: "Saved for later", Applied: "Accepted", Interview: "Chatting", Offer: "Matched", Archived: "Archived" } as const)[s];
                return <option key={s} value={s}>Track as: {label}</option>;
              })}
            </select>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/70 leading-relaxed">
            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Safety first</div>
            <p className="mt-3">
              We'll text you before, during, and after this task. Meet at the door, agree on the scope, and release payment when it's done. If anything feels off, tap Report and we're on it.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 mt-24">
          <h2 className="text-2xl font-light tracking-tight">More tasks in {o.category} near you</h2>
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
