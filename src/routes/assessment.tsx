import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { QUESTIONS } from "@/lib/assessment";
import { computeProfile, store, type AssessmentAnswers } from "@/lib/store";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Join the neighborhood — Shift Change" },
      { name: "description", content: "Tell us a little about you so neighbors can trust you faster. Takes 3 minutes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const progress = Math.round(((step + (done ? 1 : 0)) / total) * 100);
  const current = answers[q?.id];

  const canProceed = useMemo(() => {
    if (!q) return false;
    if (q.type === "text") return true;
    if (q.type === "single") return typeof current === "string" && current.length > 0;
    const arr = (current as string[]) ?? [];
    const min = q.min ?? 1;
    return arr.length >= min;
  }, [q, current]);

  function setSingle(v: string) {
    setAnswers((a) => ({ ...a, [q.id]: v }));
  }
  function toggleMulti(v: string) {
    setAnswers((a) => {
      const cur = ((a[q.id] as string[]) ?? []).slice();
      const i = cur.indexOf(v);
      if (i >= 0) cur.splice(i, 1);
      else if (!q.max || cur.length < q.max) cur.push(v);
      return { ...a, [q.id]: cur };
    });
  }

  function next() {
    if (step + 1 >= total) {
      const profile = computeProfile(answers);
      store.setAssessment(profile);
      store.setAuthed(true);
      setDone(true);
      setTimeout(() => nav({ to: "/dashboard" }), 1800);
      return;
    }
    setStep((s) => s + 1);
  }

  if (done) {
    const profile = computeProfile(answers);
    return (
      <PageShell hideFooter>
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="mt-6 text-[10px] uppercase tracking-[0.4em] text-white/50">
            Welcome to the neighborhood
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-light tracking-tight">{profile.archetype}</h1>
          <p className="mt-4 max-w-xl text-white/60">{profile.tagline}</p>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-white/40">
            Opening your feed…
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell hideFooter>
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-24">
        {/* Progress */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-white/50">
          <span>{q.section}</span>
          <span>
            {step + 1} / {total}
          </span>
        </div>
        <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div key={q.id} className="mt-16 animate-[fade-in_0.5s_ease-out]">
          <h1 className="text-3xl md:text-5xl font-light leading-tight tracking-tight">
            {q.prompt}
          </h1>
          {q.helper && <p className="mt-3 text-sm text-white/50">{q.helper}</p>}

          <div className="mt-10">
            {q.type === "text" && (
              <textarea
                value={(current as string) ?? ""}
                onChange={(e) => setSingle(e.target.value)}
                placeholder="A few words…"
                rows={4}
                className="w-full rounded-2xl border border-white/15 bg-white/[0.02] px-5 py-4 text-base text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
              />
            )}
            {q.type !== "text" && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {q.options!.map((opt) => {
                  const selected =
                    q.type === "single"
                      ? current === opt
                      : ((current as string[]) ?? []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        q.type === "single" ? setSingle(opt) : toggleMulti(opt)
                      }
                      className={`group flex items-center justify-between rounded-xl border px-5 py-4 text-left text-sm transition ${
                        selected
                          ? "border-white bg-white text-black"
                          : "border-white/15 bg-white/[0.02] text-white/80 hover:border-white/40 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span>{opt}</span>
                      {selected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <div className="mt-16 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {step + 1 === total ? "Finish" : "Continue"}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </PageShell>
  );
}
