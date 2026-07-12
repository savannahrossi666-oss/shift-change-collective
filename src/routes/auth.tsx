import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — Shift Change" },
      { name: "description", content: "Sign in or create your Shift Change account to post shifts, claim work, and get paid the day you deliver." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function isSafePath(p?: string) {
  return !!p && p.startsWith("/") && !p.startsWith("//");
}

function AuthPage() {
  const nav = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const target = isSafePath(redirect) ? redirect! : "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed in, bounce.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: target, replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) nav({ to: target, replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [nav, target]);

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true); setError(null);
    try {
      sessionStorage.setItem("sc.postAuthRedirect", target);
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth/callback",
      });
      if (result.error) throw result.error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-6 pt-32 pb-24">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/40">Shift Change</div>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-white">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {mode === "signin" ? "Sign in to post or claim shifts." : "Set up your account in seconds."}
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
          <button
            onClick={google}
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <GoogleGlyph /> Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/30">
            <span className="h-px flex-1 bg-white/10" /> or email <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={submitEmail} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/40">Name</label>
                <input
                  id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name"
                  className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/40">Email</label>
              <input
                id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/40">Password</label>
              <input
                id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              {busy ? "One sec…" : mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="h-3 w-3" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-white underline underline-offset-4">
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white/40">
          <Link to="/">← Back to home</Link>
        </div>
      </div>
    </PageShell>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 11.5-4.9 11.5-11.7 0-.8-.1-1.4-.2-2H12z" />
    </svg>
  );
}
