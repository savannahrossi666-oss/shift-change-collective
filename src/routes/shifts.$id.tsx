import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, MapPin, ShieldCheck, Zap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { getShiftById, claimShift, completeShift, cancelShift } from "@/lib/shifts.functions";
import { useAuth } from "@/hooks/use-auth";

function shiftQuery(id: string) {
  return queryOptions({
    queryKey: ["shift", id],
    queryFn: () => getShiftById({ data: { id } }),
  });
}

export const Route = createFileRoute("/shifts/$id")({
  loader: async ({ params, context }) => {
    const shift = await context.queryClient.ensureQueryData(shiftQuery(params.id));
    if (!shift) throw notFound();
    return { shift };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Shift not found — Shift Change" }, { name: "robots", content: "noindex" }] };
    const s = loaderData.shift;
    const desc = s.description.slice(0, 155);
    return {
      meta: [
        { title: `${s.title} — Shift Change` },
        { name: "description", content: desc },
        { property: "og:title", content: `${s.title} — Shift Change` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="pt-40 pb-24 text-center">
        <h1 className="text-4xl font-light">Shift not found</h1>
        <p className="mt-3 text-white/60">It may have been claimed or cancelled.</p>
        <Link to="/available" className="mt-6 inline-block text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
          Back to available shifts
        </Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="pt-40 pb-24 text-center text-white/70">
        <h1 className="text-2xl font-light">Something went wrong</h1>
        <p className="mt-2 text-sm">{error.message}</p>
      </div>
    </PageShell>
  ),
  component: ShiftDetail,
});

function formatPay(cents: number, type: "fixed" | "hourly") {
  const dollars = (cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 });
  return type === "hourly" ? `$${dollars}/hr` : `$${dollars}`;
}

const URGENCY_LABEL: Record<string, string> = { now: "Right now", today: "Today", this_week: "This week" };

function ShiftDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { user, isAuthed, loading } = useAuth();
  const { data: shift } = useQuery({ ...shiftQuery(id), initialData: Route.useLoaderData().shift });

  const claim = useMutation({
    mutationFn: useServerFn(claimShift),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shift", id] }),
  });
  const complete = useMutation({
    mutationFn: useServerFn(completeShift),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shift", id] }),
  });
  const cancel = useMutation({
    mutationFn: useServerFn(cancelShift),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shift", id] }),
  });

  if (!shift) return null;

  const isPoster = user?.id === shift.poster_id;
  const isClaimer = user?.id === shift.claimed_by;
  const posterName =
    (shift as any).poster?.display_name ??
    (shift.poster_id ? "A neighbor" : "A neighbor");
  const posterInitials = posterName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <PageShell>
      <div className="pt-28 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <Link to="/available" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
            <ArrowLeft className="h-3 w-3" /> Back to available shifts
          </Link>

          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/50">
              <span>{shift.category}</span>
              <StatusBadge status={shift.status} />
              {shift.urgency === "now" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
                  <Zap className="h-2.5 w-2.5" /> Right now
                </span>
              )}
            </div>
            <h1 className="mt-3 text-4xl md:text-5xl font-light tracking-tight">{shift.title}</h1>
          </div>

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-black text-sm font-medium">
              {posterInitials || "N"}
            </div>
            <div>
              <div className="text-sm text-white">Posted by {posterName}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/50 inline-flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Payment held in escrow on claim
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Meta label="Pay" value={formatPay(shift.pay_cents, shift.pay_type)} />
            <Meta label="Type" value={shift.pay_type === "hourly" ? "Hourly" : "Flat"} icon={<Clock className="h-3 w-3" />} />
            <Meta label="Where" value={shift.location_text} icon={<MapPin className="h-3 w-3" />} />
            <Meta label="When" value={URGENCY_LABEL[shift.urgency]} icon={<Calendar className="h-3 w-3" />} />
          </div>

          <p className="mt-10 whitespace-pre-line text-white/80 leading-relaxed">{shift.description}</p>

          <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {shift.status === "open" && !isPoster && (
              <button
                disabled={claim.isPending || loading}
                onClick={() => {
                  if (!isAuthed) { nav({ to: "/auth", search: { redirect: `/shifts/${id}` } }); return; }
                  claim.mutate({ data: { id } });
                }}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                {claim.isPending ? "Claiming…" : `Claim shift — earn ${formatPay(shift.pay_cents, shift.pay_type)}`}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
            {shift.status === "claimed" && isClaimer && (
              <div className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-emerald-300">
                You claimed this shift — deliver, get paid
              </div>
            )}
            {shift.status === "claimed" && isPoster && (
              <button
                disabled={complete.isPending}
                onClick={() => complete.mutate({ data: { id } })}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                {complete.isPending ? "Marking…" : "Mark complete & release pay"}
              </button>
            )}
            {shift.status === "open" && isPoster && (
              <button
                disabled={cancel.isPending}
                onClick={() => cancel.mutate({ data: { id } })}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-4 text-xs uppercase tracking-[0.3em] text-white/80 hover:bg-white/10 disabled:opacity-50"
              >
                {cancel.isPending ? "Cancelling…" : "Cancel this shift"}
              </button>
            )}
            {(shift.status === "completed" || shift.status === "cancelled") && (
              <div className="rounded-full border border-white/15 bg-white/5 px-6 py-4 text-xs uppercase tracking-[0.3em] text-white/60">
                Shift {shift.status}
              </div>
            )}
          </div>

          {claim.error && (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200">
              {(claim.error as Error).message}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/70 leading-relaxed">
            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40 inline-flex items-center gap-2">
              <ShieldCheck className="h-3 w-3" /> How pay works
            </div>
            <p className="mt-3">
              Payment is secured the moment a shift is claimed. Deliver the work, the poster releases, you get paid — same day. Shifters keep 100%.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    claimed: "border-white/20 bg-white/5 text-white/80",
    completed: "border-white/15 bg-white/5 text-white/60",
    cancelled: "border-red-400/30 bg-red-400/5 text-red-200",
    in_progress: "border-white/20 bg-white/5 text-white/80",
  };
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 ${map[status] ?? "border-white/15 text-white/60"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
        {icon}{label}
      </div>
      <div className="mt-2 text-sm text-white">{value}</div>
    </div>
  );
}
