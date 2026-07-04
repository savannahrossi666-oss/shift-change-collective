import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Shift Change" },
      { name: "description", content: "Shift Change is a community-powered local marketplace built for instant help and immediate income." },
      { property: "og:title", content: "About Shift Change" },
      { property: "og:description", content: "People helping people. Same-day work. Same-day pay. Money that stays local." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <PageHeader
        kicker="About"
        title="People helping people. That's the whole thing."
        subtitle="Shift Change is a community-powered marketplace built around immediate income and immediate help. If you need money today, you should be able to find work today. If you need help today, a trusted neighbor should be at your door in an hour — not a week."
      />
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-12 text-white/80 leading-relaxed">
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Why we exist</div>
          <p className="mt-4 text-lg">
            Life happens fast. Unexpected bills. Unexpected chores. A sink that won't drain the night before family visits. A paycheck that's still two weeks away. The gig economy promised speed but delivered platforms that skim, corporations that own the work, and money that leaves your neighborhood the moment it's earned. We wanted the opposite.
          </p>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">How it works</div>
          <p className="mt-4">
            One person needs money. Another person needs help. We connect them instantly. No resumes, no interviews, no two-week wait. You accept a task, you finish the task, you get paid — usually the same day, often in cash.
          </p>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Who this is for</div>
          <p className="mt-4">
            Everyone has something valuable to offer. Someone strong. Someone patient with kids. Someone who's good with a laptop. Someone who shows up on time. If you live in a neighborhood, you belong here — as an earner, as someone posting a task, or both.
          </p>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Why local matters</div>
          <p className="mt-4">
            Every dollar earned on Shift Change goes to the neighbor down the street, not a distant corporation. Small jobs, big impact. Stronger streets are built one task at a time.
          </p>
        </section>
        <div className="flex flex-wrap gap-3">
          <Link to="/opportunities" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition">
            Find work now →
          </Link>
          <Link to="/assessment" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90 transition">
            Post a task →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
