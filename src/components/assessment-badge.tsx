import type { Level } from "@/lib/assessments";
import { LEVEL_META } from "@/lib/assessments";

export function AssessmentBadge({
  level,
  category,
  size = "sm",
}: {
  level: Level;
  category?: string;
  size?: "xs" | "sm" | "md";
}) {
  const meta = LEVEL_META[level];
  const sz =
    size === "xs"
      ? "px-2 py-0.5 text-[9px]"
      : size === "md"
      ? "px-3 py-1.5 text-[11px]"
      : "px-2.5 py-1 text-[10px]";
  return (
    <span
      title={category ? `${category} — ${level}` : level}
      className={`inline-flex items-center gap-1.5 rounded-full ring-1 ${meta.ring} bg-white/[0.03] uppercase tracking-[0.25em] ${meta.color} ${sz}`}
    >
      <span aria-hidden>{meta.icon}</span>
      {level}
    </span>
  );
}
