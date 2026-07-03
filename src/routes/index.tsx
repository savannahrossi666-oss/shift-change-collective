import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Compass, Sparkles, Coins } from "lucide-react";

import logo from "@/assets/logo.png.asset.json";
import heroVideo from "@/assets/hero.mp4.asset.json";
import discoverImg from "@/assets/discover.jpg.asset.json";
import createImg from "@/assets/create.jpg.asset.json";
import earnImg from "@/assets/earn.jpg.asset.json";

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
        content:
          "Discover, create, and earn in the age of AI. A curated feed of emerging opportunities.",
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
    body: "A curated stream of AI training programs, remote roles, research studies, and fellowships — filtered by people who spend their days looking.",
    image: discoverImg.url,
    icon: Compass,
  },
  {
    id: "create",
    kicker: "02 — Create",
    title: "Build the work only you can make.",
    body: "Freelance briefs, creator programs, and open collaborations for the people composing new mediums with machines instead of replacing themselves with them.",
    image: createImg.url,
    icon: Sparkles,
  },
  {
    id: "earn",
    kicker: "03 — Earn",
    title: "Get paid on the frontier.",
    body: "From data labeling and model evals to residencies and grants — the income streams emerging alongside AI, surfaced early and vetted.",
    image: earnImg.url,
    icon: Coins,
  },
];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black">
      {/* NAV */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-black/40 border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-xs tracking-[0.35em] uppercase text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Shift Change
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.25em] text-white/60">
            <a href="#discover" className="hover:text-white transition">Discover</a>
            <a href="#create" className="hover:text-white transition">Create</a>
            <a href="#earn" className="hover:text-white transition">Earn</a>
          </nav>
          <button className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] backdrop-blur-md transition hover:bg-white hover:text-black">
            Enter
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* HERO */}
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

      {/* THREE SECTIONS */}
      {sections.map((s, i) => (
        <EditorialSection key={s.id} section={s} reverse={i % 2 === 1} index={i} />
      ))}

      {/* CTA */}
      <section className="relative border-t border-white/10 py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">The shift has already started</p>
          <h2 className="mt-6 text-4xl md:text-6xl font-light tracking-tight">
            Find your <em className="italic font-serif">next</em> before everyone else does.
          </h2>
          <div className="mt-10 flex justify-center">
            <button className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm uppercase tracking-[0.3em] text-black transition hover:bg-white/90">
              Enter Shift Change
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-4 px-6 py-8 text-xs uppercase tracking-[0.3em] text-white/40">
          <span>© {new Date().getFullYear()} Shift Change</span>
          <span>Discover • Create • Earn</span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        src={heroVideo.url}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), transparent 60%)",
        }}
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

        <p
          className="mt-10 text-sm md:text-base uppercase tracking-[0.6em] text-white/70 animate-[fade-in_1.6s_ease-out]"
        >
          Discover <span className="text-white/30 mx-2">•</span> Create{" "}
          <span className="text-white/30 mx-2">•</span> Earn
        </p>

        <div className="mt-12 animate-[fade-in_2s_ease-out]">
          <button className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/30 bg-white/5 px-10 py-4 text-xs uppercase tracking-[0.4em] backdrop-blur-xl transition-all duration-500 hover:border-white hover:bg-white hover:text-black">
            <span className="relative z-10">Enter</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Scroll cue */}
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
  section,
  reverse,
  index,
}: {
  section: (typeof sections)[number];
  reverse: boolean;
  index: number;
}) {
  const Icon = section.icon;
  return (
    <section
      id={section.id}
      className="relative border-t border-white/10 py-24 md:py-40"
    >
      <div
        className={`mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-20 ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <img
            src={section.image}
            alt={section.title}
            className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
            loading="lazy"
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
          <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-white/60">
            {section.body}
          </p>
          <div className="mt-10 flex items-center gap-6">
            <button className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:text-white">
              Explore {section.id}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </button>
            <span className="text-xs uppercase tracking-[0.3em] text-white/30">
              0{index + 1} / 03
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
