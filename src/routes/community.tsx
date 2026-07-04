import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, HeartHandshake, Sparkles, TrendingUp, Users } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";
import { OPPORTUNITIES } from "@/lib/opportunities";
import { OpportunityCard } from "@/components/opportunity-card";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Creators — Shift Change" },
      { name: "description", content: "Creator stories, featured talent, and the impact of a marketplace where creativity becomes instant income." },
      { property: "og:title", content: "Creators — Shift Change" },
      { property: "og:description", content: "The creators making Shift Change what it is." },
    ],
  }),
  component: CommunityPage,
});

const stories = [
  { name: "Rachel & Malik", role: "Logo → video for a startup", quote: "I posted at 9am. Malik shipped a full brand kit and video by 6pm. Paid on Venmo same night. It felt like the internet used to feel." },
  { name: "Priya's podcast", role: "Weekly audio mixing", quote: "The same editor delivers every Monday. Paid every Wednesday. No invoicing dance, no ghosting. It's an actual creative partnership." },
  { name: "Devon", role: "AI album covers", quote: "Not looking for a virtuoso. Looking for original vision. Shift Change matched us with an AI artist in a day and the work blew us away." },
];

const heroes = [
  { name: "Jonas W.", craft: "Motion + video — Remote", stat: "142 gigs delivered" },
  { name: "Rin T.", craft: "AI content director — Remote", stat: "38 client vouches" },
  { name: "Nadia F.", craft: "Same-Day Creator — Brand identity", stat: "5.0 ★ from 61 gigs" },
];

const impact = [
  { label: "Paid directly to creators this month", value: "$412,830" },
  { label: "Gigs delivered same-day", value: "1,203" },
  { label: "First-time paid creators this week", value: "87" },
  { label: "Average time from post → matched", value: "8 min" },
];

function CommunityPage() {
  const trending = OPPORTUNITIES.filter((o) => o.trending).slice(0, 3);

  return (
    <PageShell>
      <PageHeader
        kicker="Creators"
        title="Creativity, rewarded immediately."
        subtitle="Real creators. Real work. Real pay — today. Money stays with the people making the things."
      />
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
        {/* Impact */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <TrendingUp className="h-3 w-3" /> Creator impact
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {impact.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="text-3xl font-light">{s.value}</div>
                <div className="mt-2 text-xs text-white/60 leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Creator stories */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <Sparkles className="h-3 w-3" /> Creator stories
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {stories.map((s) => (
              <div key={s.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-white/85 leading-relaxed">"{s.quote}"</p>
                <div className="mt-6 text-sm text-white">{s.name}</div>
                <div className="text-xs text-white/50">{s.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured creators */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <HeartHandshake className="h-3 w-3" /> Featured creators
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {heroes.map((c) => (
              <div key={c.name} className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/25 transition">
                <div>
                  <div className="text-lg font-light">{c.name}</div>
                  <div className="text-xs text-white/60">{c.craft}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-[0.25em] text-white/40">{c.stat}</div>
                  <ArrowUpRight className="ml-auto mt-2 h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Invite */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-center">
          <Users className="mx-auto h-6 w-6 text-white/70" />
          <h2 className="mt-6 text-3xl font-light">Every creator makes the whole marketplace better.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Invite a talented friend who could turn their creativity into instant income. Or a founder who needs help shipping the thing they've been putting off.
          </p>
          <Link to="/assessment" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90 transition">
            Invite a creator →
          </Link>
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <TrendingUp className="h-3 w-3" /> Trending gigs
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {trending.map((o) => (
              <OpportunityCard key={o.id} o={o} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
