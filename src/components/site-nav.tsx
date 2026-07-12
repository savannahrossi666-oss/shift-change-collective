import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Plus, Zap, LogOut, User } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { store, useStoreVersion } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/opportunities", label: "Claim Shifts" },
  { to: "/available", label: "Available Now" },
  { to: "/assessments", label: "Assessments" },
  { to: "/community", label: "Shifters" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  useStoreVersion();
  const { user, isAuthed } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  async function signOut() {
    await supabase.auth.signOut();
    setMenu(false);
    if (typeof window !== "undefined") window.location.href = "/";
  }
  const availableNow = store.isAvailableNow();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        solid ? "backdrop-blur-xl bg-black/60 border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="Shift Change" className="h-6 w-auto invert brightness-0" />
          <span className="hidden sm:inline text-[10px] tracking-[0.4em] uppercase text-white/60">
            Shift Change
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.25em] text-white/60">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-white transition"
              activeProps={{ className: "text-white" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {availableNow && (
            <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
              On shift
            </span>
          )}
          <Link
            to="/post"
            className="group hidden md:inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-white/90"
          >
            <Plus className="h-3 w-3" />
            Post a Shift
          </Link>
          <Link
            to="/available"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] backdrop-blur-md transition hover:bg-white/10"
          >
            <Zap className="h-3 w-3" />
            Claim a Shift
          </Link>
          {isAuthed ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenu((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-white/80 hover:bg-white/10"
                aria-label="Account menu"
              >
                {(user?.email?.[0] ?? "U").toUpperCase()}
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-black/90 p-2 backdrop-blur-xl">
                  <div className="px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/40 truncate">{user?.email}</div>
                  <Link to="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5"><User className="h-3.5 w-3.5" /> Dashboard</Link>
                  <Link to="/profile" onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5"><User className="h-3.5 w-3.5" /> Profile</Link>
                  <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80 hover:bg-white/10"
            >
              Sign in
            </Link>
          )}
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 text-sm uppercase tracking-[0.25em] text-white/70">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 hover:bg-white/5"
            >
              Dashboard
            </Link>
            <Link
              to="/opportunities"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 text-xs"
            >
              Claim a Shift <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              to="/post"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-xs text-black"
            >
              <Plus className="h-3 w-3" /> Post a Shift
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
