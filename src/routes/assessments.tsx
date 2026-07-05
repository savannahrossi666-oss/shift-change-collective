import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, PageHeader } from "@/components/page-shell";
import { AssessmentCard } from "@/components/assessment-card";
import { AssessmentBadge } from "@/components/assessment-badge";
import { ASSESSMENTS, submissions, LEVELS } from "@/lib/assessments";
import { useStoreVersion } from "@/lib/store";

export const Route = createFileRoute("/assessments")({
  head: () => ({
    meta: [
      { title: "Craft Assessments — Prove Your Craft | Shift Change" },
      {
        name: "description",
        content:
          "Optional, practical creative challenges that let clients hire with confidence. Earn verified level badges on your Shift Change profile.",
      },
      { property: "og:title", content: "Craft Assessments — Shift Change" },
      {
        property: "og:description",
        content: "Demonstrate real ability. Earn verified badges. No exams — creative challenges only.",
      },
    ],
  }),
  component: AssessmentsLibrary,
});

type Filter = "all" | "in-progress" | "verified" | "not-started";

function AssessmentsLibrary() {
  useStoreVersion();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const all = submissions.all();

  const list = useMemo(() => {
    return ASSESSMENTS.filter((a) => {
      const sub = all[a.id];
      if (filter === "in-progress" && sub?.status !== "draft") return false;
      if (filter === "verified" && sub?.status !== "scored") return false;
      if (filter === "not-started" && sub) return false;
      if (q) {
        const hay = (a.title + a.category + a.tagline + a.skills.join(" ")).toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [filter, q, all]);

  const earned = Object.values(all).filter((s) => s.score).length;

  return (
    <PageShell>
      <PageHeader
        kicker="Craft Assessments"
        title="Prove your craft."
        subtitle="Optional, hands-on creative challenges. No exams, no gatekeeping — just a way for clients to hire with confidence and for talented creators to become visible."
      />

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Levels intro */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Verification levels</div>
              <div className="mt-2 text-sm text-white/60">
                Every submission earns a level. Badges display on your profile, search results, and applications.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <AssessmentBadge key={l} level={l} />
              ))}
            </div>
          </div>
          {earned > 0 && (
            <div className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40">
              You've earned {earned} {earned === 1 ? "badge" : "badges"} so far.
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {(["all", "not-started", "in-progress", "verified"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] transition ${
                filter === f ? "bg-white text-black" : "border border-white/15 text-white/60 hover:text-white"
              }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search categories, skills…"
            className="ml-auto w-full max-w-xs rounded-full border border-white/15 bg-white/[0.02] px-4 py-2 text-xs text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
          />
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <AssessmentCard key={a.id} assessment={a} submission={all[a.id]} />
          ))}
          {list.length === 0 && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-sm text-white/50">
              No assessments match those filters.
            </div>
          )}
        </div>

        <p className="mt-16 max-w-2xl text-sm text-white/50">
          More disciplines are added every week. Craft Assessments are always free, always optional,
          and always designed to reflect real work — not exam questions.
        </p>
      </section>
    </PageShell>
  );
}
