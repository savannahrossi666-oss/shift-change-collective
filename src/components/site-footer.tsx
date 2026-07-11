import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";

const groups = [
  {
    title: "Get Started",
    links: [
      { to: "/opportunities", label: "Find creative work" },
      { to: "/assessment", label: "Post a gig" },
      { to: "/resources", label: "How it works" },
    ],
  },
  {
    title: "Your account",
    links: [
      { to: "/assessment", label: "Join as a creator" },
      { to: "/dashboard", label: "My dashboard" },
      { to: "/profile", label: "My profile" },
    ],
  },
  {
    title: "Community",
    links: [
      { to: "/community", label: "Creator stories" },
      { to: "/about", label: "About us" },
      { to: "/contact", label: "Contact" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/70 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-6">
        <div className="col-span-2 md:col-span-2">
          <img src={logo.url} alt="Shift Change" className="h-6 w-auto invert brightness-0" />
          <p className="mt-4 max-w-xs text-sm text-white/50 leading-relaxed">
            People helping people. A creative marketplace built for immediate income, instant discovery, and human creativity — rewarded today.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">{g.title}</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {g.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-4 px-6 py-6 text-[10px] uppercase tracking-[0.35em] text-white/40">
          <span>© {new Date().getFullYear()} Shift Change</span>
          <span>Fast • Trusted • Authentic • Creative</span>
        </div>
      </div>
    </footer>
  );
}
