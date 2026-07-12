import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Signing you in…" }, { name: "robots", content: "noindex" }] }),
  component: Callback,
});

function Callback() {
  const nav = useNavigate();
  useEffect(() => {
    let cancelled = false;
    async function go() {
      const stored = sessionStorage.getItem("sc.postAuthRedirect") ?? "/dashboard";
      sessionStorage.removeItem("sc.postAuthRedirect");
      const target = stored.startsWith("/") && !stored.startsWith("//") ? stored : "/dashboard";
      const { data } = await supabase.auth.getSession();
      if (data.session) { if (!cancelled) nav({ to: target, replace: true }); return; }
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        if (s && !cancelled) nav({ to: target, replace: true });
      });
      setTimeout(() => sub.subscription.unsubscribe(), 15_000);
    }
    go();
    return () => { cancelled = true; };
  }, [nav]);
  return (
    <PageShell>
      <div className="mx-auto max-w-md px-6 pt-40 pb-24 text-center text-white/60">
        Signing you in…
      </div>
    </PageShell>
  );
}
