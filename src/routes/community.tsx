import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";
import { OPPORTUNITIES } from "@/lib/opportunities";
import { OpportunityCard } from "@/components/opportunity-card";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Shift Change" },
      { name: "description", content: "Success stories, featured creators, discussions, and weekly highlights." },
      { property: "og:title", content: "Community — Shift Change" },
      { property: "og:description", content: "The people making Shift Change what it is." },
    ],
  }),
  component: CommunityPage,
});

const stories = [
  { name: "Maya Chen", role: "Composer → Suno resident", quote: "Six weeks in, I released the first thing I've made in years that felt actually mine." },
  { name: "Ade Ogunleye", role: "Copywriter → RLHF trainer", quote: "I doubled my income before I finished the paperwork on my old job." },
  { name: "Priya Raman", role: "PhD candidate → Hugging Face fellow", quote: "The fellowship funded the dataset my whole thesis rests on." },
];

const creators = [
  { name: "Jonas Weller", craft: "AI-native filmmaker", stat: "12 shorts / yr" },
  { name: "Rin Takeda", craft: "Prompt archaeologist", stat: "8k+ subscribers" },
  { name: "Nadia Ford", craft: "Editorial illustrator", stat: "3 covers this year" },
];

const discussions = [
  { title: "Best pricing for model-eval contracts?", replies: 42 },
  { title: "How do you structure a Runway pitch?", replies: 28 },
  { title: "Fellowships that actually pay a living wage", replies: 61 },
  { title: "Show your assessment archetype", replies: 118 },
];

function CommunityPage() {
  const trending = OPPORTUNITIES.filter((o) => o.trending).slice(0, 3);

  return (
    <PageShell>
      <PageHeader
        kicker="Community"
        title="The people making this real."
        subtitle="Members trading playbooks, stories, and unreleased opportunities."
      />
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
        {/* Success stories */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <Sparkles className="h-3 w-3" /> Success stories
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
            Featured creators
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {creators.map((c) => (
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

        {/* Discussions */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <MessageCircle className="h-3 w-3" /> Weekly discussions
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            {discussions.map((d) => (
              <div key={d.title} className="flex items-center justify-between border-b border-white/10 px-5 py-4 last:border-0 hover:bg-white/[0.03]">
                <div className="text-sm text-white">{d.title}</div>
                <div className="text-xs text-white/50">{d.replies} replies</div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <TrendingUp className="h-3 w-3" /> Trending opportunities
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {trending.map((o) => (
              <OpportunityCard key={o.id} o={o} />
            ))}
          </div>
          <div className="mt-6">
            <Link to="/opportunities" className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
              See the full directory →
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
