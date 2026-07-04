import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/page-shell";
import { BookOpen, Zap, ShieldCheck, HeartHandshake, DollarSign, Plus, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "How it works — Shift Change" },
      { name: "description", content: "Step-by-step guides for earning from your creativity today, posting a gig, and building a portfolio-based reputation." },
      { property: "og:title", content: "How it works — Shift Change" },
      { property: "og:description", content: "Everything a creator needs to earn, get discovered, and build trust." },
    ],
  }),
  component: ResourcesPage,
});

const guides = [
  { icon: DollarSign, title: "Earn your first $100 today", body: "How to open the feed, accept your first creative gig, and get paid same-day. Written for total first-timers.", read: "5 min" },
  { icon: Plus, title: "Post a great gig in 60 seconds", body: "The three details that get you matched fastest — and the ones that scare creators off.", read: "4 min" },
  { icon: Zap, title: "Getting paid: same-day options", body: "Cash, instant transfer, or same-day payout — pick what fits and how it protects both sides.", read: "6 min" },
  { icon: ShieldCheck, title: "Building a portfolio-based reputation", body: "Which optional badges to add first, and why they help clients say yes faster.", read: "5 min" },
  { icon: HeartHandshake, title: "Delivering work clients love", body: "The small habits that turn one gig into three, and one-off clients into monthly retainers.", read: "7 min" },
  { icon: BookOpen, title: "Pricing your creativity fairly", body: "What creators charge for common gigs in each category — and when to charge more.", read: "6 min" },
  { icon: Users, title: "Turning one gig into a regular", body: "The friendly follow-ups that convert one-off projects into weekly, reliable income.", read: "4 min" },
  { icon: Sparkles, title: "AI tools that expand what you can offer", body: "Prompt engineering, AI workflows, and hybrid human/AI services — done right.", read: "8 min" },
];

function ResourcesPage() {
  return (
    <PageShell>
      <PageHeader
        kicker="How it works"
        title="Everything a creator needs to get started."
        subtitle="Simple guides for earning today, posting a gig, and building trust."
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <div key={g.title} className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/25 transition">
              <g.icon className="h-5 w-5 text-white/70" />
              <h3 className="mt-6 text-lg font-light tracking-tight text-white">{g.title}</h3>
              <p className="mt-3 flex-1 text-sm text-white/60 leading-relaxed">{g.body}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs uppercase tracking-[0.25em] text-white/50">
                <span>{g.read} read</span>
                <span className="text-white/70 group-hover:text-white">Read →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
