import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/page-shell";
import { BookOpen, FileText, Briefcase, Sparkles, Camera, Code2, Palette, Wand2 } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Shift Change" },
      { name: "description", content: "Guides for building a career in the AI economy." },
      { property: "og:title", content: "Resources — Shift Change" },
      { property: "og:description", content: "Career guides, portfolio advice, and learning paths." },
    ],
  }),
  component: ResourcesPage,
});

const guides = [
  { icon: BookOpen, title: "The AI Career Playbook", body: "A field guide to the seven kinds of work AI is opening up — and how to position yourself for each.", read: "18 min" },
  { icon: FileText, title: "Resume Tips for AI-Native Work", body: "How to translate a traditional CV into a resume that lands interviews for RLHF, eval, and prompt roles.", read: "8 min" },
  { icon: Briefcase, title: "Portfolio Advice for the AI Era", body: "Case studies from creators who've turned public builds into paid work — and what to steal.", read: "12 min" },
  { icon: Sparkles, title: "Interview Prep for Frontier Companies", body: "What to expect from Anthropic, OpenAI, Runway, and small-lab interviews. Sample questions, rubrics, prep plan.", read: "22 min" },
  { icon: Wand2, title: "Prompt Engineering Resources", body: "The canon of prompting: papers, playbooks, evals, and libraries — curated, ranked, and dated.", read: "10 min" },
  { icon: Code2, title: "Freelancing in the AI Economy", body: "Pricing, contracts, scope, and payment for AI-adjacent freelance work.", read: "15 min" },
  { icon: Palette, title: "Creative AI Resources", body: "Tools, communities, and residencies for artists, musicians, and filmmakers.", read: "9 min" },
  { icon: Camera, title: "Beginner Learning Paths", body: "Zero-to-hire paths for four common starting points: writer, designer, developer, researcher.", read: "20 min" },
];

function ResourcesPage() {
  return (
    <PageShell>
      <PageHeader
        kicker="Resources"
        title="Everything we wish we'd been handed."
        subtitle="Guides, playbooks, and reading lists for the shift underway."
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
