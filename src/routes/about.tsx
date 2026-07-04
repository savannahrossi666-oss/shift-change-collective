import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Shift Change" },
      { name: "description", content: "Shift Change is a creative marketplace built around immediate income, instant discovery, and human creativity." },
      { property: "og:title", content: "About Shift Change" },
      { property: "og:description", content: "Sell your creativity. Get paid today. AI is creating opportunity — not replacing people." },
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
        subtitle="Shift Change is a creative marketplace built around immediate opportunity. If you need money today, your creativity should let you earn it today. If you need creative help today, a talented person should be answering within minutes — not weeks."
      />
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-12 text-white/80 leading-relaxed">
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Why we exist</div>
          <p className="mt-4 text-lg">
            Talent shouldn't have to wait weeks to earn money, and ideas shouldn't have to wait weeks to find the right person. The freelance economy promised speed but delivered platforms that skim, agencies that gatekeep, and hiring cycles that waste creativity. We wanted the opposite: creativity that becomes instant income.
          </p>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">How it works</div>
          <p className="mt-4">
            One person needs money. Another person needs creativity. We connect them instantly. No resumes, no interviews, no two-week wait. You deliver the work, you get paid — often the same day, often in cash.
          </p>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Who this is for</div>
          <p className="mt-4">
            Everyone has a creative skill. Designers. Editors. Illustrators. Prompt engineers. Musicians. Photographers. Writers. If you make things people need, you belong here — as a creator, as someone posting a gig, or both.
          </p>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Why community matters</div>
          <p className="mt-4">
            Every dollar earned on Shift Change goes to the creator doing the work, not a distant corporation. Human creativity is rewarded immediately, and communities grow by investing in one another. AI is creating opportunity — not replacing people.
          </p>
        </section>
        <div className="flex flex-wrap gap-3">
          <Link to="/opportunities" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition">
            Find work now →
          </Link>
          <Link to="/assessment" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90 transition">
            Post a gig →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
