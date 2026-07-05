import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Sparkles, RotateCcw, Share2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SubmissionUploader } from "@/components/submission-uploader";
import { AssessmentBadge } from "@/components/assessment-badge";
import { RubricBreakdown } from "@/components/rubric-breakdown";
import {
  getAssessment,
  submissions,
  scoreSubmission,
  type Assessment,
  type SubmissionAnswer,
} from "@/lib/assessments";
import { useStoreVersion } from "@/lib/store";

export const Route = createFileRoute("/assessments/$id")({
  loader: ({ params }) => {
    const a = getAssessment(params.id);
    if (!a) throw notFound();
    return { assessment: a };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.assessment.title} — Shift Change` : "Assessment" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: NotFound,
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-white/60">
        <div className="text-xs uppercase tracking-[0.3em] text-white/40">Something broke</div>
        <p className="mt-3">{String(error?.message ?? error)}</p>
      </div>
    </PageShell>
  ),
  component: AssessmentTake,
});

function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-white/60">
        <div className="text-xs uppercase tracking-[0.3em] text-white/40">Not found</div>
        <p className="mt-3">That assessment doesn't exist yet.</p>
        <Link to="/assessments" className="mt-6 inline-flex text-xs uppercase tracking-[0.3em] text-white underline">
          Back to library
        </Link>
      </div>
    </PageShell>
  );
}

type Phase = "intro" | "taking" | "review" | "results";

function AssessmentTake() {
  useStoreVersion();
  const { assessment } = Route.useLoaderData();
  const navigate = useNavigate();

  const existing = submissions.get(assessment.id);
  const [phase, setPhase] = useState<Phase>(
    existing?.status === "scored" ? "results" : existing ? "taking" : "intro",
  );
  const [practice, setPractice] = useState(false);
  const [taskIdx, setTaskIdx] = useState(0);

  const [answers, setAnswers] = useState<Record<string, SubmissionAnswer>>(existing?.answers ?? {});

  // Autosave — writes on every change (throttled implicitly by React batching).
  useEffect(() => {
    if (phase === "intro" || practice) return;
    submissions.upsert(assessment.id, { assessmentId: assessment.id, status: "draft", answers, practice: false });
  }, [answers, assessment.id, phase, practice]);

  const task = assessment.tasks[taskIdx];
  const ans = answers[task?.id ?? ""] ?? {};

  function setAnswer(patch: SubmissionAnswer) {
    setAnswers((prev) => ({ ...prev, [task.id]: { ...prev[task.id], ...patch } }));
  }

  function begin(practiceMode: boolean) {
    setPractice(practiceMode);
    setPhase("taking");
    setTaskIdx(0);
    if (!practiceMode) {
      submissions.upsert(assessment.id, { assessmentId: assessment.id, status: "draft", answers: existing?.answers ?? {} });
    }
  }

  function next() {
    if (taskIdx < assessment.tasks.length - 1) setTaskIdx((i) => i + 1);
    else setPhase("review");
  }
  function prev() {
    if (taskIdx > 0) setTaskIdx((i) => i - 1);
  }

  function submit() {
    const sub = submissions.upsert(assessment.id, {
      assessmentId: assessment.id,
      status: "submitted",
      answers,
    });
    const score = scoreSubmission(assessment, sub);
    submissions.upsert(assessment.id, { status: "scored", score });
    setPhase("results");
  }

  function reset() {
    submissions.reset(assessment.id);
    setAnswers({});
    setPhase("intro");
    setTaskIdx(0);
  }

  const completedCount = useMemo(
    () => assessment.tasks.filter((t) => isTaskDone(t, answers[t.id])).length,
    [answers, assessment.tasks],
  );
  const progress = Math.round((completedCount / assessment.tasks.length) * 100);
  const canSubmit = completedCount >= Math.ceil(assessment.tasks.length * 0.6);

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <button
          onClick={() => navigate({ to: "/assessments" })}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white/70"
        >
          <ArrowLeft className="h-3 w-3" /> Library
        </button>

        {phase === "intro" && (
          <div className="mt-8">
            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">{assessment.category}</div>
            <h1 className="mt-3 text-4xl md:text-5xl font-light tracking-tight">{assessment.title}</h1>
            <p className="mt-4 text-white/60">{assessment.tagline}</p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Stat label="Estimated time" value={`~${assessment.estMinutes} min`} icon={<Clock className="h-3 w-3" />} />
              <Stat label="Tasks" value={String(assessment.tasks.length)} />
              <Stat label="Skills covered" value={String(assessment.skills.length)} />
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">What you'll do</div>
              <ol className="mt-3 space-y-2 text-sm text-white/70">
                {assessment.tasks.map((t, i) => (
                  <li key={t.id}>
                    <span className="text-white/40">{String(i + 1).padStart(2, "0")}.</span>{" "}
                    {t.title}
                  </li>
                ))}
              </ol>
              <div className="mt-6 text-[10px] uppercase tracking-[0.35em] text-white/40">Skills evaluated</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {assessment.skills.map((s) => (
                  <span key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-6 text-sm text-white/60">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="h-4 w-4" /> How scoring works
              </div>
              <p className="mt-2">
                Your submission is evaluated across seven rubric dimensions. You'll receive a level badge
                (Emerging → Master), specific strengths, and suggested improvements. Assessments can be re-taken.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => begin(false)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90"
              >
                {existing ? "Resume" : "Begin"} <ArrowRight className="h-3 w-3" />
              </button>
              <button
                onClick={() => begin(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white"
              >
                Try in practice mode
              </button>
            </div>
          </div>
        )}

        {phase === "taking" && task && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                Task {taskIdx + 1} of {assessment.tasks.length}
                {practice && <span className="ml-3 rounded-full bg-white/10 px-2 py-0.5 text-white/70">Practice</span>}
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">{progress}% complete</div>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
            </div>

            <h2 className="mt-8 text-2xl md:text-3xl font-light">{task.title}</h2>
            <p className="mt-3 whitespace-pre-line text-white/70">{task.brief}</p>

            <ul className="mt-5 space-y-1 text-xs text-white/50">
              {task.deliverables.map((d) => (
                <li key={d}>· {d}</li>
              ))}
              {task.timeLimitMin && <li>· Timed: {task.timeLimitMin} min</li>}
            </ul>

            <div className="mt-8 space-y-5">
              {(task.kind === "prompt" || task.kind === "timed") && (
                <textarea
                  value={ans.text ?? ""}
                  onChange={(e) => setAnswer({ text: e.target.value })}
                  rows={8}
                  placeholder={task.minChars ? `At least ${task.minChars} characters…` : "Your response…"}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
                />
              )}
              {(task.kind === "upload" || task.kind === "portfolio" || task.kind === "link") && (
                <SubmissionUploader
                  accepts={task.accepts ?? (task.kind === "link" ? ["link"] : ["image"])}
                  value={ans}
                  onChange={setAnswer}
                />
              )}

              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">How confident do you feel about this?</div>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setAnswer({ confidence: n })}
                      className={`h-9 w-9 rounded-full text-xs ${
                        ans.confidence === n ? "bg-white text-black" : "border border-white/15 text-white/60 hover:text-white"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={prev}
                disabled={taskIdx === 0}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/70 disabled:opacity-30"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/30">Autosaved</div>
              <button
                onClick={next}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90"
              >
                {taskIdx === assessment.tasks.length - 1 ? "Review" : "Next"} <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {phase === "review" && (
          <div className="mt-8">
            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Review & submit</div>
            <h2 className="mt-3 text-3xl font-light">Ready to submit?</h2>
            <p className="mt-3 text-white/60">
              You've completed {completedCount} of {assessment.tasks.length} tasks. You can go back to any task, or submit for scoring now.
            </p>

            <ul className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
              {assessment.tasks.map((t, i) => {
                const done = isTaskDone(t, answers[t.id]);
                return (
                  <li key={t.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className={done ? "text-white" : "text-white/50"}>
                      <span className="text-white/40 mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {t.title}
                    </span>
                    <button
                      onClick={() => {
                        setTaskIdx(i);
                        setPhase("taking");
                      }}
                      className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white"
                    >
                      {done ? "Edit" : "Complete"}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={submit}
                disabled={!canSubmit || practice}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90 disabled:opacity-40"
                title={practice ? "Practice mode — start a real attempt from the intro to submit." : undefined}
              >
                Submit for scoring <ArrowRight className="h-3 w-3" />
              </button>
              <button
                onClick={() => setPhase("taking")}
                className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white"
              >
                Back to tasks
              </button>
              {!canSubmit && (
                <div className="text-xs text-white/50">Complete at least 60% of tasks to submit.</div>
              )}
            </div>
          </div>
        )}

        {phase === "results" && existing?.score && (
          <div className="mt-8">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Result</div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="text-5xl font-light tabular-nums">{existing.score.overall}</div>
                    <AssessmentBadge level={existing.score.level} category={assessment.category} size="md" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/70 hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" /> Retake
                  </button>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black hover:bg-white/90"
                  >
                    <Share2 className="h-3 w-3" /> Show on profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Breakdown</div>
              <div className="mt-3">
                <RubricBreakdown breakdown={existing.score.breakdown} />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Strengths</div>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  {existing.score.strengths.map((s, i) => (
                    <li key={i}>· {s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Grow next</div>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  {existing.score.improve.map((s, i) => (
                    <li key={i}>· {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <Link
                to="/assessments"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-3 w-3" /> Back to library
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">{label}</div>
      <div className="mt-2 inline-flex items-center gap-2 text-lg font-light">
        {icon}
        {value}
      </div>
    </div>
  );
}

function isTaskDone(
  t: { kind: string; minChars?: number },
  a: SubmissionAnswer | undefined,
): boolean {
  if (!a) return false;
  const hasText = (a.text ?? "").trim().length >= (t.minChars ?? 40);
  const hasFile = (a.files?.length ?? 0) > 0;
  const hasLink = (a.links?.filter(Boolean).length ?? 0) > 0;
  if (t.kind === "prompt" || t.kind === "timed") return hasText;
  if (t.kind === "upload") return hasFile;
  if (t.kind === "link") return hasLink || hasText;
  return hasText || hasFile || hasLink;
}
