import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Upload, Save } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";
import { VerificationChecklist } from "@/components/verification-checklist";
import { AssessmentBadge } from "@/components/assessment-badge";
import { ASSESSMENTS, submissions } from "@/lib/assessments";
import { store, useStoreVersion, type UserProfile } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Shift Change" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

const empty: UserProfile = {
  name: "", email: "", bio: "", location: "", skills: [], interests: [], experience: "",
};

function ProfilePage() {
  useStoreVersion();
  const [p, setP] = useState<UserProfile>(empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = store.getProfile();
    if (existing) setP(existing);
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    store.setProfile(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setP((prev) => ({ ...prev, photo: reader.result as string }));
    reader.readAsDataURL(f);
  }

  function onResume(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setP((prev) => ({ ...prev, resumeName: f.name }));
  }

  const assessment = store.getAssessment();
  const savedCount = store.getSaved().length;

  return (
    <PageShell>
      <PageHeader kicker="Profile" title="Your profile" subtitle="How members and mentors will see you." />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <form onSubmit={save} className="space-y-10">
          {/* Photo */}
          <div className="flex items-center gap-6">
            <label className="group relative inline-flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.03] cursor-pointer">
              {p.photo ? (
                <img src={p.photo} alt="You" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-5 w-5 text-white/50" />
              )}
              <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            </label>
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Profile photo</div>
              <div className="mt-1 text-sm text-white/60">PNG or JPG. Kept on this device.</div>
            </div>
          </div>

          <Grid>
            <Field label="Full name">
              <input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} required className={inputCls} placeholder="Ada Lovelace" />
            </Field>
            <Field label="Email">
              <input value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} type="email" required className={inputCls} placeholder="you@domain.com" />
            </Field>
            <Field label="Location">
              <input value={p.location} onChange={(e) => setP({ ...p, location: e.target.value })} className={inputCls} placeholder="Brooklyn, NY" />
            </Field>
            <Field label="Experience">
              <input value={p.experience} onChange={(e) => setP({ ...p, experience: e.target.value })} className={inputCls} placeholder="7 yrs product design" />
            </Field>
          </Grid>

          <Field label="Bio">
            <textarea value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} rows={4} className={`${inputCls} resize-none`} placeholder="What you make, who you make it for." />
          </Field>

          <Grid>
            <Field label="Skills (comma-separated)">
              <input value={p.skills.join(", ")} onChange={(e) => setP({ ...p, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className={inputCls} placeholder="Product, Prompt eng, Figma" />
            </Field>
            <Field label="Interests (comma-separated)">
              <input value={p.interests.join(", ")} onChange={(e) => setP({ ...p, interests: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className={inputCls} placeholder="AI, editorial, video" />
            </Field>
            <Field label="LinkedIn">
              <input value={p.linkedin ?? ""} onChange={(e) => setP({ ...p, linkedin: e.target.value })} className={inputCls} placeholder="linkedin.com/in/…" />
            </Field>
            <Field label="GitHub">
              <input value={p.github ?? ""} onChange={(e) => setP({ ...p, github: e.target.value })} className={inputCls} placeholder="github.com/…" />
            </Field>
            <Field label="Website">
              <input value={p.website ?? ""} onChange={(e) => setP({ ...p, website: e.target.value })} className={inputCls} placeholder="your-site.com" />
            </Field>
            <Field label="Portfolio">
              <input value={p.portfolio ?? ""} onChange={(e) => setP({ ...p, portfolio: e.target.value })} className={inputCls} placeholder="Read.cv, Behance, etc." />
            </Field>
          </Grid>

          <Field label="Resume">
            <label className="flex items-center justify-between rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-4 text-sm text-white/70 cursor-pointer hover:bg-white/[0.04]">
              <span>{p.resumeName ? `Attached: ${p.resumeName}` : "Upload PDF or DOCX"}</span>
              <Upload className="h-4 w-4" />
              <input type="file" accept=".pdf,.doc,.docx" onChange={onResume} className="hidden" />
            </label>
          </Field>

          <div className="flex items-center gap-4">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90 transition">
              <Save className="h-3 w-3" /> Save profile
            </button>
            {saved && <span className="text-xs text-white/60">Saved locally.</span>}
          </div>
        </form>

        {/* Trust profile */}
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          <VerificationChecklist
            items={[
              { label: "Identity Verified", done: false, hint: "Coming soon" },
              { label: "Craft Assessed", done: Object.values(submissions.all()).some((s) => s.status === "scored") },
              { label: "Portfolio", done: Boolean(p.portfolio || p.website) },
              { label: "Reviews", done: false },
              { label: "Completed Projects", done: (store.getApplications().filter((a) => a.status === "Offer").length) > 0 },
              { label: "Response Time", done: false },
              { label: "Repeat Clients", done: false },
              { label: "Community Favorite", done: false },
            ]}
          />
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Earned badges</div>
              <Link to="/assessments" className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white">
                Take more →
              </Link>
            </div>
            {(() => {
              const all = submissions.all();
              const earned = ASSESSMENTS.filter((a) => all[a.id]?.score);
              if (!earned.length)
                return (
                  <p className="mt-4 text-sm text-white/50">
                    No assessments completed yet. Craft Assessments are optional — completing one earns
                    you a verified level badge that clients see on your profile and applications.
                  </p>
                );
              return (
                <ul className="mt-4 space-y-3">
                  {earned.map((a) => (
                    <li key={a.id} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="text-white">{a.category}</div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                          Scored {all[a.id].score!.overall}
                        </div>
                      </div>
                      <AssessmentBadge level={all[a.id].score!.level} category={a.category} />
                    </li>
                  ))}
                </ul>
              );
            })()}
          </div>
        </div>

        {/* Legacy assessment + saved recap */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Creator archetype</div>
            <div className="mt-2 text-xl font-light">{assessment?.archetype ?? "Not yet taken"}</div>
            {assessment && <p className="mt-2 text-sm text-white/60">{assessment.tagline}</p>}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Saved gigs</div>
            <div className="mt-2 text-xl font-light">{savedCount}</div>
            <p className="mt-2 text-sm text-white/60">Bookmarks show up on your dashboard.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

const inputCls = "w-full rounded-xl border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">{label}</div>
      <div className="mt-2">{children}</div>
    </label>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>;
}
