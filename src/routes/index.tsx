import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  ArrowRight, Plus, ShieldCheck, Zap, Sparkles, Palette, Type as TypeIcon, Video, Film, Music,
  Mic, Camera, Image as ImageIcon, Brush, Layers, Box, Play, Layout, Code, Globe, PenTool,
  Share2, Presentation, Wand2, DollarSign, Users, Clock, HeartHandshake,
} from "lucide-react";

import logo from "@/assets/logo.png.asset.json";
import heroVideo from "@/assets/hero.mp4.asset.json";
import discoverImg from "@/assets/discover.jpg.asset.json";
import createImg from "@/assets/create.jpg.asset.json";
import earnImg from "@/assets/earn.jpg.asset.json";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { OpportunityCard } from "@/components/opportunity-card";
import { OPPORTUNITIES, shiftsToday, shiftsHighestPay, shiftsNearby, urgencyOf, urgencyLabel, formatPay, type Opportunity } from "@/lib/opportunities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shift Change — Post a shift. Claim a shift. Paid today." },
      {
        name: "description",
        content:
          "A real-time marketplace for same-day work. Post a shift, get it claimed in minutes, pay on delivery. No resumes, no interviews, no waiting weeks.",
      },
      { property: "og:title", content: "Shift Change — Post a shift. Claim a shift. Paid today." },
      {
        property: "og:description",
        content:
          "Real-time shifts, claimed in minutes, paid on delivery. Post a shift or start working now.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categories = [
  { label: "Graphic Design", icon: Palette },
  { label: "Logo Design", icon: PenTool },
  { label: "Brand Identity", icon: TypeIcon },
  { label: "AI Prompt Engineering", icon: Wand2 },
  { label: "AI Content Creation", icon: Sparkles },
  { label: "Video Editing", icon: Video },
  { label: "Motion Graphics", icon: Film },
  { label: "Animation", icon: Play },
  { label: "Music Production", icon: Music },
  { label: "Audio Mixing", icon: Layers },
  { label: "Voice Acting", icon: Mic },
  { label: "Podcast Editing", icon: Mic },
  { label: "Photography", icon: Camera },
  { label: "Photo Editing", icon: ImageIcon },
  { label: "Digital Art", icon: Brush },
  { label: "Illustration", icon: PenTool },
  { label: "3D Modeling", icon: Box },
  { label: "UI/UX Design", icon: Layout },
  { label: "Web Design", icon: Globe },
  { label: "Web Development", icon: Code },
  { label: "Copywriting", icon: TypeIcon },
  { label: "Social Media Content", icon: Share2 },
  { label: "Presentation Design", icon: Presentation },
  { label: "Creative Consulting", icon: Sparkles },
];

const sections = [
  {
    id: "earn",
    kicker: "01 — Earn Today",
    title: "Sell your creativity. Get paid today.",
    body: "No resumes. No interviews. No two-week wait for a paycheck. Open the app, showcase what you create, and connect with someone who needs exactly that. AI is opening doors — not closing them. Your talent has value. Get paid the same day you deliver.",
    image: discoverImg.url,
    icon: DollarSign,
    motion: "zoom",
  },
  {
    id: "discover",
    kicker: "02 — Get Discovered Instantly",
    title: "Post what you need. A creator answers within minutes.",
    body: "Sometimes an idea needs a designer, an editor, a voice, an illustrator — right now, not next month. Post a creative gig and a talented person accepts within minutes. Skip the platforms that skim, the agencies that gatekeep, and the hiring cycles that waste weeks.",
    image: createImg.url,
    icon: HeartHandshake,
    motion: "float",
  },
  {
    id: "community",
    kicker: "03 — Real-time marketplace",
    title: "Shifts, not applications.",
    body: "Post a shift when you need help. Claim a shift when you want to work. No resumes, no interviews, no waiting weeks. See what's happening today, who's available now, what pays best, what's nearby — and move on it in a tap.",
    image: earnImg.url,
    icon: Users,
    motion: "zoom",
  },

];

const stories = [
  {
    quote: "I posted a logo gig at 9am. By lunchtime a designer had shipped it and I paid her on Venmo. It felt like the internet used to feel.",
    name: "Rachel, founder",
    role: "Posted a logo project",
  },
  {
    quote: "I picked up my first video edit on a Tuesday and had $400 in my account before dinner. I've never had freelance work move that fast.",
    name: "Malik, video editor",
    role: "Video + motion graphics",
  },
  {
    quote: "I make Midjourney art. Nobody at a traditional agency would've hired me. Here I've booked five projects in a month, all paid on delivery.",
    name: "Devon, AI artist",
    role: "AI content + digital art",
  },
];

const faqs = [
  { q: "How fast can I actually get paid?", a: "Most gigs pay same-day — cash, instant transfer, or same-day payout. You deliver, they release, you get paid. No two-week wait." },
  { q: "Do I need a resume or interviews?", a: "No. Show your work, deliver well, get rated. Your portfolio and completed gigs become your résumé — the only one that matters here." },
  { q: "How do you keep it trusted?", a: "Optional ID checks, portfolio verification, past-client vouches, and ratings from real completed gigs. Trust is a tool, not a gate. Each step just helps creators and clients say yes faster." },
  { q: "Local or remote?", a: "Both. Most creative work is remote and global. Some — photography, in-person shoots, local branding — happens in your city. You choose." },
  { q: "What if I'm just starting out?", a: "Everyone has a creative skill. Prompt design, editing, illustration, sound. If you can make something someone needs, you're already qualified. Ratings come with your first gig — not before it." },
];

function Index() {
  const featured = OPPORTUNITIES.filter((o) => o.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black">
      <SiteNav transparent />
      <Hero />

      {/* MANIFESTO STRIP */}
      <section className="relative border-y border-white/10 bg-black py-10 overflow-hidden">
        <div className="flex whitespace-nowrap gap-16 text-sm uppercase tracking-[0.4em] text-white/40 animate-[marquee_50s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16">
              <span>Earn today</span><span>•</span>
              <span>Sell your creativity</span><span>•</span>
              <span>No resumes</span><span>•</span>
              <span>Get discovered instantly</span><span>•</span>
              <span>Human creativity has value</span><span>•</span>
              <span>Fast</span><span>•</span>
              <span>Trusted</span><span>•</span>
              <span>Community over corporations</span><span>•</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">How it works</div>
          <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
            Three steps. No waiting weeks.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { n: "01", t: "Show or post", d: "Show what you create in 60 seconds, or post the creative help you need. No resumes. No proposals." },
              { n: "02", t: "Match in minutes", d: "A talented creator accepts and starts working. Chat, share drafts, get it done — often the same day." },
              { n: "03", t: "Pay on delivery", d: "Release payment when the work is delivered. Cash, instant transfer, or same-day payout. Everyone leaves happy." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <div className="text-xs uppercase tracking-[0.4em] text-white/40">{s.n}</div>
                <div className="mt-4 text-2xl font-light">{s.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {sections.map((s, i) => (
        <EditorialSection key={s.id} section={s} reverse={i % 2 === 1} index={i} />
      ))}

      {/* CATEGORIES GRID */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Everyone has a creative skill</div>
              <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
                Every craft. Every medium. Instant income.
              </h2>
            </div>
            <Link to="/opportunities" className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
              See all gigs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.label}
                to="/opportunities"
                className="group flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                <c.icon className="h-5 w-5 text-white/70 transition group-hover:text-white" />
                <div className="text-sm font-light text-white/85 group-hover:text-white">{c.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE RAILS — the real-time home screen */}
      <LiveRails />

      {/* FEATURED */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/50 inline-flex items-center gap-2">
                <Zap className="h-3 w-3" /> Featured shifts today
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
                Real shifters. Real briefs. Real pay — today.
              </h2>
            </div>
            <Link to="/opportunities" className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
              Claim a shift <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((o) => (
              <OpportunityCard key={o.id} o={o} />
            ))}
          </div>
        </div>
      </section>


      {/* TRUST */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Built on trust</div>
          <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
            Tools that help creators and clients trust each other.
          </h2>
          <p className="mt-6 max-w-2xl text-white/60">
            Verification isn't a gate — it's a handshake. Every badge, every rating, every portfolio link is here so you can start work with confidence and get paid without friction.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { i: ShieldCheck, t: "Identity verified", d: "Optional ID check adds a badge — never a barrier." },
              { i: Users, t: "Client vouches", d: "Past clients can vouch for you in one tap." },
              { i: Sparkles, t: "Ratings from real gigs", d: "Every delivered project builds real, portable reputation." },
              { i: HeartHandshake, t: "Payment on delivery", d: "Money's held ready. You deliver, you get paid same day." },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <f.i className="h-5 w-5 text-white/80" />
                <div className="mt-6 text-lg font-light">{f.t}</div>
                <p className="mt-2 text-sm text-white/60">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Creator stories</div>
          <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
            Creativity, rewarded immediately.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {stories.map((s) => (
              <blockquote key={s.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <p className="text-white/85 leading-relaxed">"{s.quote}"</p>
                <footer className="mt-6">
                  <div className="text-sm text-white">{s.name}</div>
                  <div className="text-xs text-white/50">{s.role}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* DUAL CTA */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 md:grid-cols-2">
          <Link
            to="/opportunities"
            className="group flex flex-col rounded-3xl border border-white/15 bg-white/[0.03] p-10 transition hover:border-white/40 hover:bg-white/[0.06]"
          >
            <DollarSign className="h-6 w-6 text-white/80" />
            <div className="mt-8 text-3xl md:text-4xl font-light tracking-tight">
              Need money today?
            </div>
            <p className="mt-3 text-white/60">
              Skip resumes. Skip interviews. Open the feed, showcase what you create, and get paid the same day.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white group-hover:translate-x-1 transition-transform">
              Find work now <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
          <Link
            to="/assessment"
            className="group flex flex-col rounded-3xl border border-white/15 bg-white p-10 text-black transition hover:bg-white/90"
          >
            <Plus className="h-6 w-6" />
            <div className="mt-8 text-3xl md:text-4xl font-light tracking-tight">
              Need creative help today?
            </div>
            <p className="mt-3 text-black/70">
              Post a gig in 60 seconds. A talented creator accepts in minutes. Delivered, paid, moving on.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] group-hover:translate-x-1 transition-transform">
              Post a gig <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Common questions</div>
          <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">The stuff people ask first.</h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-white/10 last:border-0">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-white marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <Plus className="h-4 w-4 text-white/60 transition-transform group-open:rotate-45" />
                </summary>
                <div className="px-6 pb-6 text-white/70 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/faq" className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
              All FAQ →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative border-t border-white/10 py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Your creativity deserves immediate opportunity</p>
          <h2 className="mt-6 text-4xl md:text-6xl font-light tracking-tight">
            One person needs money. <em className="italic font-serif">Another</em> needs creativity. We connect them instantly.
          </h2>
          <p className="mt-6 text-white/60 max-w-xl mx-auto">
            Talent shouldn't have to wait weeks to earn. Ideas shouldn't have to wait weeks to find the right person. Shift Change is where creativity becomes instant income.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/opportunities"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm uppercase tracking-[0.3em] text-white backdrop-blur-md transition hover:bg-white/10"
            >
              Find work now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/assessment"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              Post a gig
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
      `}</style>
    </div>
  );
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { videoRef.current?.play().catch(() => {}); }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        src={heroVideo.url}
        autoPlay muted loop playsInline preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(1px)" }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.35), transparent 60%)" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <div className="animate-[fade-in_1.2s_ease-out]">
          <img
            src={logo.url}
            alt="Shift Change"
            className="mx-auto w-[min(80vw,620px)] invert brightness-0"
            style={{ filter: "invert(1) drop-shadow(0 0 40px rgba(255,255,255,0.25))" }}
          />
        </div>
        <h1 className="mt-8 text-xs md:text-sm uppercase tracking-[0.6em] text-white/70 animate-[fade-in_1.6s_ease-out]">
          Post a Shift • Claim a Shift • Get paid today
        </h1>

        {/* Dual question hero */}
        <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 animate-[fade-in_2s_ease-out]">
          <Link
            to="/post"
            className="group flex flex-col items-start gap-3 rounded-2xl bg-white p-6 text-left text-black transition hover:bg-white/90"
          >
            <Plus className="h-5 w-5" />
            <div className="text-xl md:text-2xl font-light">I need help.</div>
            <div className="text-xs uppercase tracking-[0.3em] text-black/70">Post a shift in 60s →</div>
          </Link>
          <Link
            to="/available"
            className="group flex flex-col items-start gap-3 rounded-2xl border border-white/20 bg-white/[0.06] p-6 text-left backdrop-blur-xl transition hover:border-white/50 hover:bg-white/[0.1]"
          >
            <Zap className="h-5 w-5 text-white/80" />
            <div className="text-xl md:text-2xl font-light text-white">I want to work.</div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">Claim a shift now →</div>
          </Link>
        </div>

        <p className="mt-10 max-w-xl text-sm md:text-base text-white/70 animate-[fade-in_2.2s_ease-out]">
          A real-time marketplace. Post a shift, get it claimed in minutes, pay on delivery — same day.
        </p>

        <div className="mt-10 flex items-center gap-6 text-[10px] uppercase tracking-[0.35em] text-white/50 animate-[fade-in_2.4s_ease-out]">
          <span className="inline-flex items-center gap-2"><Zap className="h-3 w-3" /> Claim in minutes</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Escrow held</span>
          <span className="hidden md:inline-flex items-center gap-2"><Sparkles className="h-3 w-3" /> Paid same-day</span>
        </div>
      </div>


      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-white/50">
        <div className="flex flex-col items-center gap-2">
          <span>Scroll</span>
          <span className="block h-8 w-px animate-pulse bg-white/40" />
        </div>
      </div>
    </section>
  );
}

function EditorialSection({
  section, reverse, index,
}: { section: (typeof sections)[number]; reverse: boolean; index: number }) {
  const Icon = section.icon;
  return (
    <section id={section.id} className="relative border-t border-white/10 py-24 md:py-40">
      <div className={`mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-20 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
        <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <img
            src={section.image}
            alt={section.title}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-all duration-[1200ms] group-hover:scale-105 group-hover:grayscale-0"
            style={section.motion === "float" ? { animation: "float-slow 8s ease-in-out infinite" } : undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.4em] text-white/70">
            {section.kicker}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/50">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20">
              <Icon className="h-3.5 w-3.5" />
            </span>
            {section.kicker}
          </div>
          <h2 className="mt-6 text-4xl md:text-6xl font-light leading-[1.05] tracking-tight">
            {section.title}
          </h2>
          <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-white/70">
            {section.body}
          </p>
          <div className="mt-10 flex items-center gap-6">
            <Link
              to={index === 1 ? "/assessment" : "/opportunities"}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:text-white"
            >
              {index === 0 ? "Start earning" : index === 1 ? "Post a gig" : "Explore creators"}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-xs uppercase tracking-[0.3em] text-white/30">
              0{index + 1} / 03
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
