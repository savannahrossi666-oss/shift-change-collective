import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";

const groups = [
  {
    title: "Discover",
    links: [
      { to: "/opportunities", label: "All opportunities" },
      { to: "/opportunities", label: "Trending" },
      { to: "/community", label: "Featured creators" },
    ],
  },
  {
    title: "Members",
    links: [
      { to: "/assessment", label: "Take the assessment" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/profile", label: "Profile" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
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
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-6">
        <div className="col-span-2 md:col-span-2">
          <img src={logo.url} alt="Shift Change" className="h-6 w-auto invert brightness-0" />
          <p className="mt-4 max-w-xs text-sm text-white/50 leading-relaxed">
            A curated feed of emerging ways to work, create, and earn in the age of AI.
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
          <span>Discover • Create • Earn</span>
        </div>
      </div>
    </footer>
  );
}
