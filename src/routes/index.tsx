import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  ArrowRight, Plus, Search, ShieldCheck, Zap, HeartHandshake, Home, Truck, Leaf, Dog,
  Sparkles, ShoppingBag, Laptop, GraduationCap, Baby, PaintRoller, Wrench, Snowflake,
  PartyPopper, Camera, Music, Package, Car, Sun, DollarSign, Users, MapPin, Clock,
} from "lucide-react";

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
      { title: "Shift Change — Neighbors helping neighbors. Same-day work. Same-day pay." },
      {
        name: "description",
        content:
          "Need money today? Need help today? Shift Change connects neighbors instantly for local tasks — no resumes, no interviews, paid same day.",
      },
      { property: "og:title", content: "Shift Change — People helping people." },
      {
        property: "og:description",
        content:
          "Post a task, find work nearby, get paid the same day. A community-powered local marketplace that keeps money in your neighborhood.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categories = [
  { label: "Moving", icon: Truck },
  { label: "Yard Work", icon: Leaf },
  { label: "Dog Walking", icon: Dog },
  { label: "Cleaning", icon: Sparkles },
  { label: "Grocery Pickup", icon: ShoppingBag },
  { label: "Tech Help", icon: Laptop },
  { label: "Tutoring", icon: GraduationCap },
  { label: "Babysitting", icon: Baby },
  { label: "Painting", icon: PaintRoller },
  { label: "Furniture Assembly", icon: Wrench },
  { label: "Snow Removal", icon: Snowflake },
  { label: "Event Setup", icon: PartyPopper },
  { label: "Photography", icon: Camera },
  { label: "Music Lessons", icon: Music },
  { label: "Elder Assistance", icon: HeartHandshake },
  { label: "Delivery", icon: Package },
  { label: "Car Washing", icon: Car },
  { label: "Seasonal Work", icon: Sun },
];

const sections = [
  {
    id: "earn",
    kicker: "01 — Earn Today",
    title: "Open the app. Accept a task. Get paid today.",
    body: "No applications. No waiting weeks for a paycheck. Real work near you, posted by real neighbors — and paid the same day you finish. Everyone has something valuable to offer, and this is how you finally get to offer it.",
    image: discoverImg.url,
    icon: DollarSign,
    motion: "zoom",
  },
  {
    id: "help",
    kicker: "02 — Get Help Today",
    title: "Post what you need. A trusted neighbor shows up.",
    body: "Sometimes you just need a hand. Furniture moved, a driveway shoveled, a laptop that finally boots. Post a task and a nearby neighbor accepts within minutes — friendly, trusted, and paid fairly for their time.",
    image: createImg.url,
    icon: HeartHandshake,
    motion: "float",
  },
  {
    id: "local",
    kicker: "03 — Keep It Local",
    title: "Money that stays in your neighborhood.",
    body: "Every dollar earned here goes to the person a few doors down — not a corporation with a headquarters two thousand miles away. Small jobs, big impact. Stronger streets are built one task at a time.",
    image: earnImg.url,
    icon: Home,
    motion: "zoom",
  },
];

const stories = [
  {
    quote: "I posted a task at 9am for someone to move a fridge. By 10:15 it was done and I paid the neighbor in cash. It felt like the internet used to feel.",
    name: "Rachel, neighbor",
    role: "Posted a moving task",
  },
  {
    quote: "I picked up my first task on a Tuesday afternoon and had $80 in my hand before dinner. I've never had a job that fast.",
    name: "Malik, earner",
    role: "Furniture assembly + tech help",
  },
  {
    quote: "My mom lives across town. Every week the same neighbor delivers her groceries. She knows him by name now. That means everything.",
    name: "Linda, family member",
    role: "Recurring grocery pickup",
  },
];

const faqs = [
  { q: "How fast can I actually get paid?", a: "Most tasks pay same-day — cash, instant transfer, or same-day payout. You finish, they release, you get paid. No two-week wait." },
  { q: "Do I need a resume or interviews?", a: "No. Show up, do the task well, get rated. Your ratings and completed tasks become your résumé — the only one that matters here." },
  { q: "How do you keep it safe?", a: "Optional ID checks, phone verification, background checks, neighbor vouches, and ratings. Trust is a tool, not a gate. You choose how much to add — every step just helps neighbors trust you faster." },
  { q: "How local is 'local'?", a: "As local as your street. You set your radius — walking distance, 2 miles, 5 miles, or anywhere in town — and only see tasks that fit." },
  { q: "What if I'm not skilled?", a: "Everyone is skilled at something. Lifting a couch. Watching a dog. Setting up a TV. Being reliable. The most common task on the platform is 'please help me for an hour' — you're already qualified." },
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
              <span>Same-day pay</span><span>•</span>
              <span>Neighbors helping neighbors</span><span>•</span>
              <span>No resumes</span><span>•</span>
              <span>No interviews</span><span>•</span>
              <span>Fast</span><span>•</span>
              <span>Simple</span><span>•</span>
              <span>Human</span><span>•</span>
              <span>Local money stays local</span><span>•</span>
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
              { n: "01", t: "Post or find", d: "Post a task in 60 seconds, or open the feed and see paid work near you right now." },
              { n: "02", t: "Match in minutes", d: "A trusted neighbor accepts and heads over. Chat, meet, get it done — usually the same day." },
              { n: "03", t: "Pay same day", d: "Release payment when it's finished. Cash, instant transfer, or same-day payout. Everyone leaves happy." },
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
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Everyone has something to offer</div>
              <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
                All the ways neighbors help neighbors.
              </h2>
            </div>
            <Link to="/opportunities" className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
              See all tasks <ArrowRight className="h-3 w-3" />
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

      {/* NEARBY RIGHT NOW */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-white/50 inline-flex items-center gap-2">
                <Zap className="h-3 w-3" /> Nearby right now
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
                Real tasks. Real neighbors. Real pay — today.
              </h2>
            </div>
            <Link to="/opportunities" className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
              Find work now <ArrowRight className="h-3 w-3" />
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
            Tools that help neighbors trust neighbors.
          </h2>
          <p className="mt-6 max-w-2xl text-white/60">
            Verification isn't a gate — it's a handshake. Every badge, every rating, every optional check is here to help you feel comfortable inviting someone to your door, and comfortable knocking on theirs.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { i: ShieldCheck, t: "Identity verified", d: "Optional ID check adds a badge — never a barrier." },
              { i: Users, t: "Neighbor vouches", d: "A trusted neighbor can vouch for you in one tap." },
              { i: Sparkles, t: "Ratings from real jobs", d: "Every completed task builds real, portable reputation." },
              { i: HeartHandshake, t: "Safety check-ins", d: "We text before, during, and after bigger tasks." },
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
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Neighbor stories</div>
          <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-tight">
            Small jobs. Big impact.
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
              Skip resumes. Skip interviews. Open the feed and see paid work waiting in your neighborhood.
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
              Need help today?
            </div>
            <p className="mt-3 text-black/70">
              Post a task in 60 seconds. A trusted neighbor accepts in minutes. Done, paid, moving on.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] group-hover:translate-x-1 transition-transform">
              Post a task <ArrowRight className="h-3 w-3" />
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
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Your neighborhood is hiring — and helping</p>
          <h2 className="mt-6 text-4xl md:text-6xl font-light tracking-tight">
            Real people. <em className="italic font-serif">Real</em> help. Right now.
          </h2>
          <p className="mt-6 text-white/60 max-w-xl mx-auto">
            Life happens fast. Unexpected bills. Unexpected chores. Unexpected chances to earn. Shift Change is where neighbors meet in the moment.
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
              Post a task
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
        <p className="mt-8 text-xs md:text-sm uppercase tracking-[0.6em] text-white/70 animate-[fade-in_1.6s_ease-out]">
          People helping people
        </p>

        {/* Dual question hero */}
        <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 animate-[fade-in_2s_ease-out]">
          <Link
            to="/opportunities"
            className="group flex flex-col items-start gap-3 rounded-2xl border border-white/20 bg-white/[0.06] p-6 text-left backdrop-blur-xl transition hover:border-white/50 hover:bg-white/[0.1]"
          >
            <DollarSign className="h-5 w-5 text-white/80" />
            <div className="text-xl md:text-2xl font-light text-white">Need money today?</div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">Find work now →</div>
          </Link>
          <Link
            to="/assessment"
            className="group flex flex-col items-start gap-3 rounded-2xl bg-white p-6 text-left text-black transition hover:bg-white/90"
          >
            <HeartHandshake className="h-5 w-5" />
            <div className="text-xl md:text-2xl font-light">Need help today?</div>
            <div className="text-xs uppercase tracking-[0.3em] text-black/70">Post a task →</div>
          </Link>
        </div>

        <p className="mt-10 max-w-xl text-sm md:text-base text-white/70 animate-[fade-in_2.2s_ease-out]">
          Real people helping real people. Paid the same day. Right in your neighborhood.
        </p>

        <div className="mt-10 flex items-center gap-6 text-[10px] uppercase tracking-[0.35em] text-white/50 animate-[fade-in_2.4s_ease-out]">
          <span className="inline-flex items-center gap-2"><Zap className="h-3 w-3" /> Same-day pay</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Trusted neighbors</span>
          <span className="hidden md:inline-flex items-center gap-2"><MapPin className="h-3 w-3" /> Hyper-local</span>
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
              {index === 0 ? "Start earning" : index === 1 ? "Post a task" : "Explore local tasks"}
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
