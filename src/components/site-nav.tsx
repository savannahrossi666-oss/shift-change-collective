import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Plus } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";

const links = [
  { to: "/opportunities", label: "Find Work" },
  { to: "/community", label: "Creators" },
  { to: "/assessments", label: "Assessments" },
  { to: "/resources", label: "How It Works" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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
          <Link
            to="/assessment"
            className="group hidden md:inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-white/90"
          >
            <Plus className="h-3 w-3" />
            Post a Gig
          </Link>
          <Link
            to="/opportunities"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] backdrop-blur-md transition hover:bg-white/10"
          >
            Earn Today
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
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
              Find Work Now <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              to="/assessment"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-xs text-black"
            >
              <Plus className="h-3 w-3" /> Post a Gig
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
