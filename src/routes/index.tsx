import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowRight, Compass, Sparkles, Coins, TrendingUp, MessageCircle, BookOpen, Plus } from "lucide-react";

import logo from "@/assets/logo.png.asset.json";
import heroVideo from "@/assets/hero.mp4.asset.json";
import discoverImg from "@/assets/discover.jpg.asset.json";
import createImg from "@/assets/create.jpg.asset.json";
import earnImg from "@/assets/earn.jpg.asset.json";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { OpportunityCard } from "@/components/opportunity-card";
import { OPPORTUNITIES } from "@/lib/opportunities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shift Change — Discover the future of work" },
      {
        name: "description",
        content:
          "Shift Change surfaces AI training, remote roles, creative freelance work, research studies, fellowships and creator programs — before they go mainstream.",
      },
      { property: "og:title", content: "Shift Change — Discover the future of work" },
      {
        property: "og:description",
        content: "Discover, create, and earn in the age of AI. A curated feed of emerging opportunities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const sections = [
  {
    id: "discover",
    kicker: "01 — Discover",
    title: "See what's next before it's obvious.",
    body: "Discover AI training programs, research studies, fellowships, creator opportunities, beta testing, remote work, and emerging digital careers before they become saturated. Every opportunity is carefully curated so you spend less time searching and more time building.",
    image: discoverImg.url,
    icon: Compass,
    motion: "zoom",
  },
  {
    id: "create",
    kicker: "02 — Create",
    title: "Build the work only you can make.",
    body: "Discover freelance projects, creator programs, open collaborations, creative tools, and emerging opportunities built for people creating with AI—not competing against it.",
    image: createImg.url,
    icon: Sparkles,
    motion: "float",
  },
  {
    id: "earn",
    kicker: "03 — Earn",
    title: "Get paid on the frontier.",
    body: "Find income where AI is creating opportunity—not replacing people. Explore AI training jobs, model evaluations, research studies, creator programs, freelance projects, grants, fellowships, beta testing, and other emerging income streams. Every opportunity is carefully curated so members discover what's next before it becomes mainstream.",
    image: earnImg.url,
    icon: Coins,
    motion: "zoom",
  },
];

const faqs = [
  { q: "What is Shift Change?", a: "A curated feed of emerging ways to work, create, and earn in the age of AI." },
  { q: "Is it free?", a: "Yes. Browsing, the assessment, and the dashboard are free." },
  { q: "How are opportunities selected?", a: "A small editorial team reviews every listing before it's published." },
];

function Index() {
  const featured = OPPORTUNITIES.filter((o) => o.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black">
      <SiteNav transparent />
      <Hero />

      {/* MANIFESTO STRIP */}
      <section className="relative border-y border-white/10 bg-black py-10 overflow-hidden">
        <div className="flex whitespace-nowrap gap-16 text-sm uppercase tracking-[0.4em] text-white/40 animate-[marquee_40s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16">
              <span>AI Training</span><span>•</span>
              <span>Remote Work</span><span>•</span>
              <span>Creative Freelance</span><span>•</span>
              <span>Research Studies</span><span>•</span>
              <span>Fellowships</span><span>•</span>
              <span>Creator Programs</span><span>•</span>
              <span>Grants & Residencies</span><span>•</span>
            </div>
          ))}
        </div>
      </section>

      {sections.map((s, i) => (
        <EditorialSection key={s.id} section={s} reverse={i % 2 === 1} index={i} />
      ))}

      {/* ASSESSMENT PREVIEW */}
      <section className="relative border-t border-white/10 py-32 overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">The Opportunity Profile</div>
          <h2 className="mt-4 text-4xl md:text-6xl font-light tracking-tight">
            18 questions. A feed built for you.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-white/60">
            Tell us what you make, how you work, and how you want to earn. We turn it into an archetype and a personalized feed of opportunities that actually fit.
          </p>
          <div className="mt-10">
            <Link
              to="/assessment"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
            >
              Take the assessment <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED OPPORTUNITIES */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/50 inline-flex items-center gap-2">
                <TrendingUp className="h-3 w-3" /> Featured this week
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
                Six openings worth looking at now.
              </h2>
            </div>
            <Link to="/opportunities" className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((o) => (
              <OpportunityCard key={o.id} o={o} />
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 gap-12 px-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/50 inline-flex items-center gap-2">
              <MessageCircle className="h-3 w-3" /> Community
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
              You're not doing this alone.
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed">
              Members trade playbooks, unreleased opportunities, and the kind of career advice you can only get from people a few steps ahead.
            </p>
            <Link to="/community" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white">
              Meet the community <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/50 inline-flex items-center gap-2">
              <BookOpen className="h-3 w-3" /> Resources
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
              Playbooks we wish we'd been handed.
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed">
              Guides on pricing, portfolio, interviews, and the actual mechanics of building a career in the AI economy.
            </p>
            <Link to="/resources" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white">
              Read the guides <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">FAQ</div>
          <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">Common questions.</h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-white/10 last:border-0">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-white marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <Plus className="h-4 w-4 text-white/60 transition-transform group-open:rotate-45" />
                </summary>
                <div className="px-6 pb-6 text-white/70">{f.a}</div>
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

      {/* CTA */}
      <section className="relative border-t border-white/10 py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">The shift has already started</p>
          <h2 className="mt-6 text-4xl md:text-6xl font-light tracking-tight">
            Find your <em className="italic font-serif">next</em> before everyone else does.
          </h2>
          <div className="mt-10 flex justify-center">
            <Link
              to="/assessment"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
            >
              Enter Shift Change
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
    <section className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        src={heroVideo.url}
        autoPlay muted loop playsInline preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(1px)" }}
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35), transparent 60%)" }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="animate-[fade-in_1.2s_ease-out]">
          <img
            src={logo.url}
            alt="Shift Change"
            className="mx-auto w-[min(90vw,780px)] invert brightness-0"
            style={{ filter: "invert(1) drop-shadow(0 0 40px rgba(255,255,255,0.25))" }}
          />
        </div>
        <p className="mt-10 text-sm md:text-base uppercase tracking-[0.6em] text-white/70 animate-[fade-in_1.6s_ease-out]">
          Discover <span className="text-white/30 mx-2">•</span> Create <span className="text-white/30 mx-2">•</span> Earn
        </p>
        <div className="mt-12 animate-[fade-in_2s_ease-out]">
          <Link
            to="/assessment"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/30 bg-white/5 px-10 py-4 text-xs uppercase tracking-[0.4em] backdrop-blur-xl transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
          >
            <span className="relative z-10">Enter Shift Change</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
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
              to="/opportunities"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:text-white"
            >
              Explore {section.id}
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
