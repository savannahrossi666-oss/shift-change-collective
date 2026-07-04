import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, TrendingUp, Bookmark, Clock, Bell, Settings, User, ArrowRight, Plus, DollarSign, HeartHandshake, Zap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { OpportunityCard } from "@/components/opportunity-card";
import { OPPORTUNITIES, getOpportunity } from "@/lib/opportunities";
import { store, useStoreVersion } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — Shift Change" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const nav = useNavigate();
  useStoreVersion();
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"earn" | "help">("earn");
  useEffect(() => {
    if (!store.isAuthed()) nav({ to: "/assessment" });
    else setReady(true);
  }, [nav]);

  const assessment = store.getAssessment();
  const profile = store.getProfile();
  const savedIds = store.getSaved();
  const viewedIds = store.getViewed();
  const applications = store.getApplications();

  const saved = savedIds.map(getOpportunity).filter(Boolean) as typeof OPPORTUNITIES;
  const viewed = viewedIds.map(getOpportunity).filter(Boolean) as typeof OPPORTUNITIES;

  const recommended = useMemo(() => {
    const cats = assessment?.recommendedCategories ?? [];
    return OPPORTUNITIES.filter((o) => cats.includes(o.category)).slice(0, 6);
  }, [assessment]);

  const sameDay = OPPORTUNITIES.filter((o) => /today|same-day/i.test(o.tags.join(" ")) || /today/i.test(o.deadline)).slice(0, 6);
  const trending = OPPORTUNITIES.filter((o) => o.trending).slice(0, 4);
  const completion = useMemo(() => {
    if (!profile) return 25;
    const fields = [profile.name, profile.bio, profile.skills.length, profile.location, profile.photo];
    return Math.min(100, 25 + fields.filter(Boolean).length * 15);
  }, [profile]);

  if (!ready) return null;

  return (
    <PageShell>
      <div className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Welcome */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                Welcome to the neighborhood
              </div>
              <h1 className="mt-3 text-4xl md:text-5xl font-light tracking-tight">
                {profile?.name || assessment?.archetype || "Your feed"}
              </h1>
              {assessment && (
                <p className="mt-2 text-sm text-white/60">{assessment.tagline}</p>
              )}
            </div>
            <QuickSearch />
          </div>

          {/* Mode toggle */}
          <div className="mt-10 inline-flex rounded-full border border-white/15 bg-white/[0.03] p-1 text-xs uppercase tracking-[0.25em]">
            <button
              onClick={() => setMode("earn")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 transition ${
                mode === "earn" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              <DollarSign className="h-3 w-3" /> Earn today
            </button>
            <button
              onClick={() => setMode("help")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 transition ${
                mode === "help" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              <HeartHandshake className="h-3 w-3" /> Get help
            </button>
          </div>

          {/* Stat cards */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard icon={<Bookmark className="h-4 w-4" />} label="Saved tasks" value={saved.length} />
            <StatCard icon={<TrendingUp className="h-4 w-4" />} label={mode === "earn" ? "Accepted" : "Posted"} value={applications.length} />
            <StatCard icon={<Clock className="h-4 w-4" />} label="Recently viewed" value={viewed.length} />
            <StatCard icon={<Zap className="h-4 w-4" />} label="Same-day nearby" value={sameDay.length} />
          </div>

          {/* Quick actions */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Link to="/opportunities" className="group flex items-center justify-between rounded-2xl border border-white/15 bg-white/[0.03] p-5 hover:border-white/40 hover:bg-white/[0.05] transition">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/50">For earners</div>
                <div className="mt-2 text-lg font-light">Find work now</div>
              </div>
              <ArrowRight className="h-4 w-4 text-white/60 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/assessment" className="group flex items-center justify-between rounded-2xl bg-white p-5 text-black hover:bg-white/90 transition">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-black/60">For neighbors</div>
                <div className="mt-2 text-lg font-light inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Post a task</div>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/community" className="group flex items-center justify-between rounded-2xl border border-white/15 bg-white/[0.03] p-5 hover:border-white/40 hover:bg-white/[0.05] transition">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/50">Community</div>
                <div className="mt-2 text-lg font-light">Invite a neighbor</div>
              </div>
              <ArrowRight className="h-4 w-4 text-white/60 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Profile completion */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Trust score</div>
                <div className="mt-2 text-2xl font-light">{completion}%</div>
                <p className="mt-1 text-xs text-white/50">Add a photo and neighborhood so neighbors trust you faster.</p>
              </div>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-black transition"
              >
                <User className="h-3 w-3" /> Build trust
              </Link>
            </div>
            <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-white transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
          </div>

          {mode === "earn" ? (
            <>
              <Section title="Same-day tasks near you" kicker="Get paid today" href="/opportunities">
                <Grid opps={sameDay.length ? sameDay : OPPORTUNITIES.slice(0, 6)} />
              </Section>

              <Section title="Recommended for you" kicker="Based on what you can do" href="/opportunities">
                <Grid opps={recommended.length ? recommended : OPPORTUNITIES.slice(0, 6)} />
              </Section>

              <Section title="Saved tasks" kicker={`${saved.length} bookmarked`} href="/opportunities">
                {saved.length ? (
                  <Grid opps={saved.slice(0, 6)} />
                ) : (
                  <EmptyState label="Nothing saved yet. Tap the bookmark on any task to keep it here for later." />
                )}
              </Section>
            </>
          ) : (
            <>
              <Section title="Post a task in 60 seconds" kicker="Neighbors are ready to help">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                  <p className="text-white/70">
                    Tell us what you need, where you are, and when. A trusted neighbor accepts in minutes.
                  </p>
                  <Link to="/assessment" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90 transition">
                    <Plus className="h-3 w-3" /> Post a task
                  </Link>
                </div>
              </Section>
              <Section title="Neighbors who could help" kicker="Rated + verified">
                <Grid opps={recommended.length ? recommended : trending} />
              </Section>
            </>
          )}

          {/* Applications */}
          <Section title="Your task tracker" kicker="Every task, one place">
            {applications.length ? (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                {applications.map((a) => {
                  const o = getOpportunity(a.opportunityId);
                  if (!o) return null;
                  return (
                    <Link
                      key={a.opportunityId}
                      to="/opportunities/$id"
                      params={{ id: o.id }}
                      className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-sm last:border-0 hover:bg-white/[0.03]"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-white">{o.title}</div>
                        <div className="text-white/50">with {o.company} • {o.location}</div>
                      </div>
                      <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/70">
                        {a.status === "Applied" ? "Accepted" : a.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState label="No active tasks yet. Accept one, and it shows up here so you can pick back up in one tap." />
            )}
          </Section>

          {viewed.length > 0 && (
            <Section title="Recently viewed" kicker="Pick back up">
              <Grid opps={viewed.slice(0, 3)} />
            </Section>
          )}

          <Section title="Trending in your area" kicker="What neighbors are booking">
            <Grid opps={trending} />
          </Section>

          {/* Cards */}
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Neighbor profile</div>
              <div className="mt-2 text-xl font-light">{assessment?.archetype ?? "Not set"}</div>
              <Link to="/assessment" className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/70 hover:text-white">
                Update <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40 inline-flex items-center gap-2">
                <Bell className="h-3 w-3" /> Notifications
              </div>
              <div className="mt-3 space-y-2 text-sm text-white/70">
                <div>New same-day task: {sameDay[0]?.title ?? "—"}</div>
                <div>A neighbor rated you 5 ★</div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Settings</div>
              <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
                <Link to="/profile" className="hover:text-white inline-flex items-center gap-2"><Settings className="h-3 w-3" /> Preferences</Link>
                <button
                  onClick={() => { store.setAuthed(false); nav({ to: "/" }); }}
                  className="text-left hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function QuickSearch() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); nav({ to: "/opportunities", search: { q } }); }}
      className="flex w-full md:w-[380px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 backdrop-blur-md"
    >
      <Search className="h-4 w-4 text-white/50" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search tasks nearby…"
        className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
      />
    </form>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between text-white/50">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.3em]">{label}</span>
      </div>
      <div className="mt-4 text-3xl font-light">{value}</div>
    </div>
  );
}

function Section({ title, kicker, href, children }: { title: string; kicker?: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <div className="flex items-end justify-between">
        <div>
          {kicker && <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">{kicker}</div>}
          <h2 className="mt-2 text-2xl md:text-3xl font-light tracking-tight">{title}</h2>
        </div>
        {href && (
          <Link to={href} className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/60 hover:text-white">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Grid({ opps }: { opps: typeof OPPORTUNITIES }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {opps.map((o) => (
        <OpportunityCard key={o.id} o={o} />
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-10 text-center text-sm text-white/50">
      {label}
    </div>
  );
}
