import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Shift Change" },
      { name: "description", content: "Shift Change surfaces emerging ways to work, create, and earn in the age of AI." },
      { property: "og:title", content: "About Shift Change" },
      { property: "og:description", content: "A curated feed for the people building what work becomes next." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <PageHeader
        kicker="About"
        title="Work is shifting. We're where you find out first."
        subtitle="Shift Change is a curated feed of emerging opportunities in the AI economy — training programs, research studies, fellowships, freelance briefs, creator programs, and roles at frontier companies."
      />
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-12 text-white/80 leading-relaxed">
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Why we exist</div>
          <p className="mt-4 text-lg">
            Every big shift in how people work has been won by the people who saw it first. The AI shift is playing out now, and most of it is invisible from where most people are looking. Job boards catch up months late. Newsletters get generic. Aggregators send noise. We built Shift Change because our friends kept forwarding each other links — and we realized the list was the product.
          </p>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">How we curate</div>
          <p className="mt-4">
            A small editorial team reviews every listing before it goes live. We check pay, deadline, and application link. We favor opportunities where AI is creating opportunity, not replacing people. Nothing pay-to-play. No affiliate links. If we wouldn't send it to a friend, it doesn't go in the feed.
          </p>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Who this is for</div>
          <p className="mt-4">
            Writers, designers, developers, researchers, artists, musicians, and career-changers who want to spend less time searching and more time building. Whether you're looking for a $30/hr eval gig, a residency, a full-time role, or a grant — the feed adapts.
          </p>
        </section>
        <div>
          <Link to="/assessment" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90 transition">
            Take the assessment →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
