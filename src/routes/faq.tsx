import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Shift Change" },
      { name: "description", content: "Answers to common questions about Shift Change." },
      { property: "og:title", content: "FAQ — Shift Change" },
      { property: "og:description", content: "How Shift Change works, who it's for, and how opportunities are curated." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  { q: "What is Shift Change?", a: "Shift Change is a curated feed of emerging ways to work, create, and earn in the age of AI. Think of it as a small editorial team's private list — published." },
  { q: "How are opportunities selected?", a: "A small editorial team reviews every listing. We favor opportunities where AI is creating income and creative surface area rather than replacing people. Everything gets a real read." },
  { q: "Is everything verified?", a: "Yes. We verify the company, the pay range, the application link, and the deadline before publishing. Broken links get flagged fast." },
  { q: "How often are listings updated?", a: "Continuously. New listings are added throughout the week, and expired ones are archived within 24 hours of their deadline." },
  { q: "Is Shift Change free?", a: "Yes — browsing, the assessment, saved opportunities, and the dashboard are free. A future paid tier will unlock earlier access to select opportunities and deeper filters. Free members will always have full access to the core directory." },
  { q: "Who is Shift Change for?", a: "Writers, designers, developers, researchers, artists, musicians, and career-changers looking for real ways to earn in the AI economy — from $30/hr eval gigs to $250k+ frontier roles and grants." },
  { q: "Do you take a cut when I get hired?", a: "No. We never take a placement fee, referral fee, or affiliate commission from listings." },
  { q: "Can I suggest an opportunity?", a: "Please do. Use the Contact form or email hello@shiftchange.co with a link." },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell>
      <PageHeader
        kicker="FAQ"
        title="Answers to what people ask most."
        subtitle="Missing something? Ask on the contact page — we'll add it here."
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
