import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Shift Change" },
      { name: "description", content: "How Shift Change works: same-day pay, trust, portfolio, and getting discovered instantly." },
      { property: "og:title", content: "FAQ — Shift Change" },
      { property: "og:description", content: "Answers about speed, payment, trust, and creative work." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  { q: "How fast can I actually get paid?", a: "Most gigs pay same-day — cash, instant transfer, or same-day payout. You deliver, the client releases, you get paid. No two-week wait, no corporate holdback." },
  { q: "Do I really not need a resume?", a: "Correct. Nothing to submit, nothing to interview for. Your portfolio and completed gigs become your reputation — the only résumé that matters here." },
  { q: "How does trust work?", a: "Trust is a tool, not a gate. Optional ID verification, portfolio links, past-client vouches, and ratings from real completed gigs. You choose which badges to add — each one just helps clients say yes faster." },
  { q: "Is the work local or remote?", a: "Both. Most creative work — design, editing, AI content, code — is remote and global. Some — photography, in-person shoots, local branding — happens in your city. You choose." },
  { q: "What if I'm just starting out as a creator?", a: "Everyone is creative at something. Prompt design. Editing. Illustration. Sound. Warm writing. The first gig is the hardest — your ratings and portfolio build fast from there." },
  { q: "Does Shift Change take a big cut?", a: "No. We take a small, transparent service fee so we can keep the lights on. The vast majority of every dollar stays with the creator — no agency skim, no publisher middleman." },
  { q: "How is this different from Fiverr, Upwork, or 99designs?", a: "Those platforms are freelancer directories built around proposals, quotes, contests, and long waits. Shift Change is a same-day marketplace built around instant discovery, human creativity, and payment on delivery." },
  { q: "How do I post a gig?", a: "In about 60 seconds. Tap Post a Gig, describe what you need, share your budget, and hit publish. A talented creator accepts and starts working — often within minutes." },
  { q: "Can this become recurring work?", a: "Yes — and it often does. Weekly podcast edits, monthly social content, ongoing brand identity. The best matches turn into ongoing creative relationships." },
  { q: "Does AI replace creators here?", a: "No. AI is creating opportunity — not replacing people. Prompt engineering, AI content direction, and custom workflows are some of our fastest-growing categories, and a human is always behind the work." },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell>
      <PageHeader
        kicker="FAQ"
        title="Answers about speed, trust, and creative work."
        subtitle="Missing something? Ask us on the contact page — we add it here."
      />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-white/10 last:border-0">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-base md:text-lg font-light text-white">{f.q}</span>
                  {isOpen ? <Minus className="h-4 w-4 text-white/60" /> : <Plus className="h-4 w-4 text-white/60" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-white/70 leading-relaxed">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
