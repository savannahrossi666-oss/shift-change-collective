import { Link } from "@tanstack/react-router";
import { Clock, ArrowRight } from "lucide-react";
import type { Assessment, Submission } from "@/lib/assessments";
import { AssessmentBadge } from "./assessment-badge";

export function AssessmentCard({
  assessment,
  submission,
}: {
  assessment: Assessment;
  submission?: Submission;
}) {
  const status = submission?.status ?? "not-started";
  const progress =
    submission
      ? Math.round(
          (Object.keys(submission.answers).length / assessment.tasks.length) * 100,
        )
      : 0;

  return (
    <Link
      to="/assessments/$id"
      params={{ id: assessment.id }}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/25 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">
            {assessment.category}
          </div>
          <h3 className="mt-2 text-lg font-light leading-snug text-white">
            {assessment.title}
          </h3>
        </div>
        {submission?.score && (
          <AssessmentBadge level={submission.score.level} category={assessment.category} />
        )}
      </div>
      <p className="mt-3 text-sm text-white/60">{assessment.tagline}</p>

      <div className="mt-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> ~{assessment.estMinutes} min
        </span>
        <span>·</span>
        <span>{assessment.tasks.length} tasks</span>
      </div>

      {status !== "not-started" && status !== "scored" && (
        <div className="mt-4">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-white/70 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1.5 text-[10px] uppercase tracking-[0.3em] text-white/40">
            In progress · {progress}%
          </div>
        </div>
      )}

      <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70 group-hover:text-white">
        {status === "scored" ? "Review" : status === "draft" ? "Resume" : "Begin"}
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
