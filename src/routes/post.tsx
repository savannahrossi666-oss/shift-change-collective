import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock, DollarSign, MapPin, Zap } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";
import { CATEGORIES } from "@/lib/opportunities";
import { createShift } from "@/lib/shifts.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Post a Shift — Shift Change" },
      { name: "description", content: "Post a shift in 60 seconds. A shifter claims in minutes. Payment held in escrow, released on delivery." },
      { property: "og:title", content: "Post a Shift — Shift Change" },
      { property: "og:description", content: "Real-time marketplace for same-day help. Post a shift, get it claimed in minutes." },
    ],
  }),
  component: PostShiftPage,
});

type Step = 0 | 1 | 2 | 3;

function PostShiftPage() {
  const nav = useNavigate();
  const { isAuthed, loading: authLoading } = useAuth();
  const createFn = useServerFn(createShift);

  const [step, setStep] = useState<Step>(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState<number>(150);
  const [payType, setPayType] = useState<"fixed" | "hourly">("fixed");
  const [location, setLocation] = useState("Remote");
  const [when, setWhen] = useState<"now" | "today" | "this_week">("today");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthed) {
      nav({ to: "/auth", search: { redirect: "/post" }, replace: true });
    }
  }, [authLoading, isAuthed, nav]);

  const canNext =
    (step === 0 && title.trim().length >= 4 && description.trim().length >= 10) ||
    (step === 1 && pay > 0) ||
    (step === 2 && location.trim().length > 0) ||
    step === 3;

  async function publish() {
    setBusy(true); setError(null);
    try {
      const { id } = await createFn({
        data: {
          title: title.trim(),
          description: description.trim(),
          category,
          location_text: location.trim(),
          pay_cents: Math.round(pay * 100),
          pay_type: payType,
          urgency: when,
        },
      });
      nav({ to: "/shifts/$id", params: { id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't publish. Try again.");
      setBusy(false);
    }
  }

  const steps = ["The ask", "Pay", "Where & when", "Review"];

  return (
    <PageShell>
      <PageHeader
        kicker="Post a Shift"
        title="60 seconds. A shifter claims in minutes."
        subtitle="Describe what you need, name your pay, and publish. Payment is held in escrow and released the moment the work is delivered."
      />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <ol className="mb-10 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${i <= step ? "border-white bg-white text-black" : "border-white/20"}`}>
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className={i === step ? "text-white" : ""}>{s}</span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-white/10" />}
            </li>
          ))}
        </ol>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
          {step === 0 && (
            <div className="space-y-6">
              <Field label="What do you need done?" htmlFor="shift-title">
                <input id="shift-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140}
                  placeholder="e.g. 24-hour logo for a launching startup"
                  className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none" />
              </Field>
              <Field label="Category" htmlFor="shift-cat">
                <select id="shift-cat" value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-base text-white focus:border-white/40 focus:outline-none">
                  {CATEGORIES.map((c) => (<option key={c} value={c} className="bg-black">{c}</option>))}
                </select>
              </Field>
              <Field label="Describe it" htmlFor="shift-desc">
                <textarea id="shift-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={2000}
                  placeholder="Scope, tone, deliverables. The clearer, the faster it gets claimed."
                  className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none" />
              </Field>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {(["fixed", "hourly"] as const).map((t) => (
                  <button key={t} onClick={() => setPayType(t)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${payType === t ? "border-white bg-white text-black" : "border-white/15 bg-white/[0.02] hover:border-white/30"}`}>
                    <div className="text-xs uppercase tracking-[0.3em] opacity-70">{t === "fixed" ? "Flat pay" : "Hourly"}</div>
                    <div className="mt-2 text-lg font-light">{t === "fixed" ? "One price, one delivery" : "Pay by the hour"}</div>
                  </button>
                ))}
              </div>
              <Field label={`How much? (${payType === "fixed" ? "USD total" : "USD / hr"})`} htmlFor="shift-pay">
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input id="shift-pay" type="number" min={5} value={pay} onChange={(e) => setPay(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-2xl border border-white/15 bg-black/40 px-10 py-3 text-base text-white focus:border-white/40 focus:outline-none" />
                </div>
                <p className="mt-3 text-xs text-white/50">Shifters keep 100%. Payment held in escrow the moment a shift is claimed.</p>
              </Field>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <Field label="Where" htmlFor="shift-loc">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input id="shift-loc" value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="Remote, or a city / neighborhood"
                    className="w-full rounded-2xl border border-white/15 bg-black/40 px-10 py-3 text-base text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none" />
                </div>
              </Field>
              <Field label="When">
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { v: "now", label: "Right now", icon: Zap },
                    { v: "today", label: "Today", icon: Clock },
                    { v: "this_week", label: "This week", icon: Clock },
                  ] as const).map((o) => (
                    <button key={o.v} onClick={() => setWhen(o.v)}
                      className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm transition ${when === o.v ? "border-white bg-white text-black" : "border-white/15 bg-white/[0.02] hover:border-white/30 text-white/80"}`}>
                      <o.icon className="h-3.5 w-3.5" /> {o.label}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <Row k="Shift" v={title} />
              <Row k="Category" v={category} />
              <Row k="Pay" v={`$${pay}${payType === "hourly" ? "/hr" : " flat"}`} />
              <Row k="Location" v={location} />
              <Row k="When" v={when === "now" ? "Right now" : when === "today" ? "Today" : "This week"} />
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/70">{description}</div>
              {error && (<div className="rounded-2xl border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200">{error}</div>)}
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <button onClick={() => setStep((s) => (Math.max(0, s - 1) as Step))} disabled={step === 0}
              className="text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white disabled:opacity-30">Back</button>
            {step < 3 ? (
              <button onClick={() => canNext && setStep((s) => ((s + 1) as Step))} disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/40">
                Continue <ArrowRight className="h-3 w-3" />
              </button>
            ) : (
              <button onClick={publish} disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-white/90 disabled:opacity-50">
                {busy ? "Publishing…" : "Publish shift"} <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/40">{label}</label>
      {children}
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm">
      <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">{k}</span>
      <span className="text-white">{v}</span>
    </div>
  );
}
