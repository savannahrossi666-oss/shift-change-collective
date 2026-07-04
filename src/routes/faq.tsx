import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Shift Change" },
      { name: "description", content: "How Shift Change works: same-day pay, trust, safety, and keeping money local." },
      { property: "og:title", content: "FAQ — Shift Change" },
      { property: "og:description", content: "Answers about speed, payment, trust, safety, and community." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  { q: "How fast can I actually get paid?", a: "Most tasks pay same-day — cash, instant transfer, or same-day payout. You finish the task, the neighbor releases payment, and you get paid. No two-week wait, no corporate holdback." },
  { q: "Do I really not need a resume?", a: "Correct. Nothing to submit, nothing to interview for. Your ratings and completed tasks become your reputation — the only résumé that matters here." },
  { q: "How does trust work?", a: "Trust is a tool, not a gate. Optional ID verification, phone verification, background checks, neighbor vouches, and ratings from real completed tasks. You choose how many badges to add — each one just helps neighbors trust you faster." },
  { q: "How safe is it?", a: "We text safety check-ins before, during, and after tasks. Meet at the door. Agree on scope. Release payment when it's done. If anything feels off, tap Report and we're on it. Bigger tasks unlock stronger protections." },
  { q: "How local is 'local'?", a: "As local as your street. You set your radius — walking distance, 2 miles, 5 miles, or anywhere in town — and only see tasks and neighbors that fit." },
  { q: "What if I don't have any special skills?", a: "Everyone is skilled at something. Being strong. Being patient. Being kind. Being on time. The most-posted tasks on Shift Change are 'please help me for an hour' — you're already qualified." },
  { q: "Does Shift Change take a big cut?", a: "No. We take a small, transparent service fee so we can keep the lights on. The vast majority of every dollar stays with the neighbor who earned it, and it stays in your community." },
  { q: "How is this different from TaskRabbit, Thumbtack, or Fiverr?", a: "Those platforms are freelancer directories built around applications, quotes, and long waits. Shift Change is a same-day, hyper-local marketplace built around neighbors helping neighbors — with speed, trust, and community as the whole point." },
  { q: "How do I post a task?", a: "In about 60 seconds. Tap Post a Task, tell us what you need, where you are, and when. A trusted neighbor accepts and heads over — often within minutes." },
  { q: "Can this become a recurring thing?", a: "Yes — and it often does. Weekly dog walks, biweekly mowing, seasonal snow removal. The best matches turn into ongoing relationships." },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell>
      <PageHeader
        kicker="FAQ"
        title="Answers about speed, trust, and community."
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
