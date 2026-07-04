import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, HeartHandshake, Sparkles, TrendingUp, Users } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";
import { OPPORTUNITIES } from "@/lib/opportunities";
import { OpportunityCard } from "@/components/opportunity-card";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Shift Change" },
      { name: "description", content: "Neighbor stories, local heroes, and the impact of money that stays in your community." },
      { property: "og:title", content: "Community — Shift Change" },
      { property: "og:description", content: "The neighbors making Shift Change what it is." },
    ],
  }),
  component: CommunityPage,
});

const stories = [
  { name: "Rachel & Malik", role: "Furniture move • Riverside", quote: "I posted a task at 9am. Malik was at my door by 10:15. Cash paid before lunch. It felt like the internet used to feel." },
  { name: "Linda's family", role: "Weekly grocery pickup", quote: "The same neighbor drops off my mom's groceries every Thursday. She knows him by name now. That means everything." },
  { name: "Devon", role: "Guitar lessons for his 10-year-old", quote: "Not looking for a virtuoso. Looking for kindness. Shift Change matched us with the perfect person in a day." },
];

const heroes = [
  { name: "Jonas W.", craft: "Handy Helper — Northside", stat: "142 tasks completed" },
  { name: "Rin T.", craft: "Community Connector — Downtown", stat: "38 neighbor vouches" },
  { name: "Nadia F.", craft: "Same-Day Earner — Southbank", stat: "5.0 ★ from 61 tasks" },
];

const impact = [
  { label: "Dollars kept in-neighborhood this month", value: "$284,110" },
  { label: "Tasks completed same-day", value: "1,203" },
  { label: "First-time earners this week", value: "87" },
  { label: "Average time from post → matched", value: "8 min" },
];

function CommunityPage() {
  const trending = OPPORTUNITIES.filter((o) => o.trending).slice(0, 3);

  return (
    <PageShell>
      <PageHeader
        kicker="Community"
        title="Neighbors helping neighbors, one task at a time."
        subtitle="Small jobs. Big impact. Money that stays right where it was earned."
      />
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
        {/* Impact */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <TrendingUp className="h-3 w-3" /> Local impact
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

        {/* Neighbor stories */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <Sparkles className="h-3 w-3" /> Neighbor stories
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

        {/* Local heroes */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <HeartHandshake className="h-3 w-3" /> Local heroes
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
          <h2 className="mt-6 text-3xl font-light">Your neighborhood is stronger with more of you in it.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Invite a neighbor who could use a hand — or use the extra income. Every new person makes the whole thing better.
          </p>
          <Link to="/assessment" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90 transition">
            Invite a neighbor →
          </Link>
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <TrendingUp className="h-3 w-3" /> Trending near you
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
