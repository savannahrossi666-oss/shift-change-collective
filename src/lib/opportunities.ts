// Creative marketplace seed data.
// The type name "Opportunity" is preserved so existing imports don't churn —
// each record represents a creative gig: a talented person offering a service,
// or a client posting a creative need. Speed + trust + human creativity.

export type Opportunity = {
  id: string;
  title: string;
  /** Poster / creator display name — e.g. "Sarah M." */
  company: string;
  category: string;
  categorySlug: string;
  /** Trust / speed / delivery badges — e.g. ["Same-day","Verified","Remote"] */
  tags: string[];
  payMin: number;
  payMax: number;
  payUnit: "hr" | "project" | "month" | "year" | "stipend";
  /** Turnaround — e.g. "24-hr delivery" */
  hours: string;
  difficulty: "Entry" | "Intermediate" | "Advanced";
  experience: "Beginner" | "Any" | "Mid-level" | "Senior";
  /** True when the gig can be done fully online (most creative work). */
  remote: boolean;
  /** Location — "Remote", or a city for local creative work. */
  location: string;
  /** Deadline / delivery — e.g. "Delivery in 48 hrs" */
  deadline: string;
  /** Tools + creative skills that help. */
  skills: string[];
  summary: string;
  description: string;
  applyUrl: string;
  trending?: boolean;
  featured?: boolean;
  /** Hours ago the gig was posted (mock; 0 = just now). */
  postedDaysAgo: number;
};

export const CATEGORIES = [
  "Graphic Design",
  "Logo Design",
  "Brand Identity",
  "AI Prompt Engineering",
  "AI Content Creation",
  "Video Editing",
  "Motion Graphics",
  "Music Production",
  "Audio Mixing",
  "Voice Acting",
  "Podcast Editing",
  "Photography",
  "Photo Editing",
  "Digital Art",
  "Illustration",
  "3D Modeling",
  "Animation",
  "UI/UX Design",
  "Web Design",
  "Web Development",
  "Copywriting",
  "Social Media Content",
  "Presentation Design",
  "Creative Consulting",
] as const;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const raw: Omit<Opportunity, "categorySlug">[] = [
  {
    id: "logo-startup-24hr",
    title: "24-hour logo for a launching startup",
    company: "Maya R.",
    category: "Logo Design",
    tags: ["Same-day", "Verified", "Remote"],
    payMin: 250, payMax: 400, payUnit: "project",
    hours: "24-hr delivery",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 24 hrs",
    skills: ["Illustrator", "Figma", "Type systems"],
    summary: "Wordmark + monogram for a wellness app launching Friday. Paid on delivery.",
    description: "Warm, editorial, human. Two-round revisions. Full source files. Paid same day you deliver — no waiting on a corporate net-30.",
    applyUrl: "#",
    trending: true, featured: true, postedDaysAgo: 0,
  },
  {
    id: "brand-identity-cafe",
    title: "Full brand identity for a neighborhood café",
    company: "Cross-Street Coffee",
    category: "Brand Identity",
    tags: ["Local", "48-hr start", "Portfolio-ready"],
    payMin: 1200, payMax: 2000, payUnit: "project",
    hours: "2-week build",
    difficulty: "Advanced", experience: "Mid-level", remote: true,
    location: "Local + Remote",
    deadline: "Kickoff this week",
    skills: ["Brand strategy", "Type", "Packaging"],
    summary: "Logo, palette, signage, cup design, and a short brand story.",
    description: "Small independent café, warm neighborhood vibe. Half up front, half on delivery — no invoice runaround.",
    applyUrl: "#",
    featured: true, postedDaysAgo: 0,
  },
  {
    id: "prompt-eng-workflow",
    title: "Design a custom AI prompt library for our team",
    company: "Ellis Studio",
    category: "AI Prompt Engineering",
    tags: ["Remote", "Same-week", "Recurring"],
    payMin: 60, payMax: 120, payUnit: "hr",
    hours: "10-15 hrs",
    difficulty: "Advanced", experience: "Mid-level", remote: true,
    location: "Remote",
    deadline: "Delivery next week",
    skills: ["GPT / Claude", "Midjourney", "Workflow design"],
    summary: "Build a reusable prompt kit for a design studio — copy, imagery, research.",
    description: "You'll structure our prompts, document usage, and train the team over one call. Talent gets paid weekly, cash-fast.",
    applyUrl: "#",
    trending: true, postedDaysAgo: 0,
  },
  {
    id: "midjourney-hero-set",
    title: "Midjourney hero visuals for our product launch",
    company: "Northlight",
    category: "AI Content Creation",
    tags: ["Same-day", "Remote", "Portfolio"],
    payMin: 400, payMax: 700, payUnit: "project",
    hours: "48-hr delivery",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 48 hrs",
    skills: ["Midjourney", "Photoshop", "Art direction"],
    summary: "Ten cinematic hero images for a wellness app landing page.",
    description: "Editorial, moody, human. Delivered as raw + edited. Paid on approval, same day.",
    applyUrl: "#",
    featured: true, postedDaysAgo: 0,
  },
  {
    id: "video-edit-youtube",
    title: "Edit a 12-min YouTube documentary",
    company: "Priya S.",
    category: "Video Editing",
    tags: ["Remote", "Recurring", "Fast pay"],
    payMin: 300, payMax: 500, payUnit: "project",
    hours: "3-day turnaround",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Deliver by Friday",
    skills: ["Premiere Pro", "DaVinci Resolve", "Color"],
    summary: "Footage delivered. Music picked. Just need a great editor. Paid on cut approval.",
    description: "Short doc about a local muralist. Warm pacing, no jump-cut YouTube energy. Ongoing episodes if it clicks.",
    applyUrl: "#",
    postedDaysAgo: 0,
  },
  {
    id: "motion-graphics-launch",
    title: "Motion graphics package for a product launch",
    company: "Trent H.",
    category: "Motion Graphics",
    tags: ["Same-week", "Portfolio-ready"],
    payMin: 800, payMax: 1400, payUnit: "project",
    hours: "1 week",
    difficulty: "Advanced", experience: "Mid-level", remote: true,
    location: "Remote",
    deadline: "Delivery in 7 days",
    skills: ["After Effects", "Cinema 4D", "Sound design"],
    summary: "Three 15-second social spots + one 45-second explainer. Milestones paid weekly.",
    description: "Brand assets provided. We want cinematic — closer to Apple than TikTok. Paid at each milestone.",
    applyUrl: "#",
    trending: true, postedDaysAgo: 1,
  },
  {
    id: "beat-making-artist",
    title: "Original beats for an indie R&B EP",
    company: "Marcus J.",
    category: "Music Production",
    tags: ["Remote", "Royalty split", "Fast pay"],
    payMin: 200, payMax: 500, payUnit: "project",
    hours: "Per track",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "First track in 3 days",
    skills: ["FL Studio", "Ableton", "R&B / soul"],
    summary: "5-track EP, soulful and warm. Cash on delivery per beat.",
    description: "Producer keeps 20% royalty split + upfront fee. Fast, no publisher red tape.",
    applyUrl: "#",
    postedDaysAgo: 0,
  },
  {
    id: "audio-mix-podcast",
    title: "Mix + master a weekly podcast",
    company: "The Kim Family",
    category: "Audio Mixing",
    tags: ["Recurring", "Remote", "Weekly pay"],
    payMin: 90, payMax: 140, payUnit: "project",
    hours: "Per episode",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Every Tuesday",
    skills: ["Logic Pro", "Izotope", "Podcast mastering"],
    summary: "45-min conversation format. Clean up, level, master. Paid every Wednesday.",
    description: "Long-term gig — someone reliable who cares about warmth over loudness. Paid weekly, no invoicing dance.",
    applyUrl: "#",
    featured: true, postedDaysAgo: 0,
  },
  {
    id: "voice-acting-explainer",
    title: "Warm voiceover for a 90-second explainer",
    company: "Ana & Jamal",
    category: "Voice Acting",
    tags: ["Same-day", "Remote"],
    payMin: 150, payMax: 300, payUnit: "project",
    hours: "24-hr delivery",
    difficulty: "Entry", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery tomorrow",
    skills: ["Home studio", "Warm read", "Fast turnaround"],
    summary: "Friendly, conversational, ~180 words. Paid on approval.",
    description: "Script ready to go. Two takes preferred. No agency middlemen — you keep 100%.",
    applyUrl: "#",
    postedDaysAgo: 0,
  },
  {
    id: "photo-portrait-studio",
    title: "Portrait session for a founder headshot",
    company: "The Bello Group",
    category: "Photography",
    tags: ["Local", "One-time"],
    payMin: 300, payMax: 550, payUnit: "project",
    hours: "2-hr shoot",
    difficulty: "Intermediate", experience: "Any", remote: false,
    location: "Local",
    deadline: "This weekend",
    skills: ["Studio lighting", "Retouching"],
    summary: "10 edited portraits, natural + studio looks. Cash on shoot day.",
    description: "Small team of four. Editorial energy, not stock LinkedIn. Delivery via Drive within 48 hrs.",
    applyUrl: "#",
    postedDaysAgo: 1,
  },
  {
    id: "photo-editing-batch",
    title: "Retouch 40 product photos for an e-commerce launch",
    company: "Camila V.",
    category: "Photo Editing",
    tags: ["Same-week", "Remote"],
    payMin: 8, payMax: 15, payUnit: "hr",
    hours: "~10 hrs",
    difficulty: "Entry", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 4 days",
    skills: ["Photoshop", "Clean cutouts", "Color match"],
    summary: "Clean background, color match, subtle skin retouch. Paid on batch delivery.",
    description: "Files provided in Dropbox. Consistent look required. Fast, straightforward, no client scope creep.",
    applyUrl: "#",
    trending: true, postedDaysAgo: 0,
  },
  {
    id: "digital-art-cover",
    title: "Album cover art — surreal digital illustration",
    company: "Devon S.",
    category: "Digital Art",
    tags: ["Portfolio", "Royalty credit"],
    payMin: 400, payMax: 800, payUnit: "project",
    hours: "1 week",
    difficulty: "Advanced", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 7 days",
    skills: ["Procreate", "Photoshop", "Concept art"],
    summary: "Bold, dreamlike, human. Cover credit + full pay on delivery.",
    description: "Indie release. Two rounds of revision, high-res print + streaming sizes. Artist keeps full portfolio rights.",
    applyUrl: "#",
    postedDaysAgo: 1,
  },
  {
    id: "illustration-editorial",
    title: "Editorial illustrations for a Substack essay",
    company: "Eileen T.",
    category: "Illustration",
    tags: ["Same-week", "Remote"],
    payMin: 200, payMax: 350, payUnit: "project",
    hours: "3-day delivery",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 72 hrs",
    skills: ["Illustration", "Editorial style"],
    summary: "Three vignette illustrations to run alongside a 2,000-word essay.",
    description: "Warm, human, a little surreal. Paid on delivery, credit on the post.",
    applyUrl: "#",
    postedDaysAgo: 0,
  },
  {
    id: "3d-modeling-product",
    title: "3D product model for a Kickstarter render",
    company: "Nora K.",
    category: "3D Modeling",
    tags: ["Remote", "Portfolio-ready"],
    payMin: 500, payMax: 900, payUnit: "project",
    hours: "5-day delivery",
    difficulty: "Advanced", experience: "Mid-level", remote: true,
    location: "Remote",
    deadline: "Delivery in 5 days",
    skills: ["Blender", "KeyShot", "Product rendering"],
    summary: "One hero product + three lifestyle renders. Paid at milestone one and delivery.",
    description: "CAD-ish references provided. Cinematic lighting. Small campaign, but the work will be seen everywhere.",
    applyUrl: "#",
    postedDaysAgo: 2,
  },
  {
    id: "animation-explainer",
    title: "2D animated explainer — 60 seconds",
    company: "Rick J.",
    category: "Animation",
    tags: ["Same-week", "Recurring"],
    payMin: 900, payMax: 1500, payUnit: "project",
    hours: "1 week",
    difficulty: "Advanced", experience: "Mid-level", remote: true,
    location: "Remote",
    deadline: "Delivery in 7 days",
    skills: ["After Effects", "Character rigs", "Storyboarding"],
    summary: "Short character-driven explainer. Script + VO delivered.",
    description: "Friendly, editorial style. Milestones paid weekly. Could turn into a series if it lands.",
    applyUrl: "#",
    featured: true, postedDaysAgo: 1,
  },
  {
    id: "uiux-app-redesign",
    title: "Redesign the onboarding for a fitness app",
    company: "Beth W.",
    category: "UI/UX Design",
    tags: ["Remote", "Portfolio-ready"],
    payMin: 1500, payMax: 3000, payUnit: "project",
    hours: "2 weeks",
    difficulty: "Advanced", experience: "Mid-level", remote: true,
    location: "Remote",
    deadline: "Kickoff Monday",
    skills: ["Figma", "Design systems", "Motion specs"],
    summary: "5 screens + motion specs. Paid at wireframe, hi-fi, and handoff.",
    description: "Existing product. Direct hire — no design agency in the middle. Milestone payments, cash-fast.",
    applyUrl: "#",
    postedDaysAgo: 1,
  },
  {
    id: "web-design-portfolio",
    title: "Portfolio website design for a photographer",
    company: "Omar A.",
    category: "Web Design",
    tags: ["Same-week", "Portfolio-ready"],
    payMin: 600, payMax: 1100, payUnit: "project",
    hours: "1 week",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 7 days",
    skills: ["Figma", "Framer", "Typography"],
    summary: "Editorial, gallery-first, cinematic. Handoff to Framer or code.",
    description: "5 pages, mobile-first, moody. Paid at design approval, no drawn-out review cycles.",
    applyUrl: "#",
    postedDaysAgo: 0,
  },
  {
    id: "web-dev-landing",
    title: "Build a Framer landing page from Figma",
    company: "Jules P.",
    category: "Web Development",
    tags: ["Same-week", "Remote"],
    payMin: 700, payMax: 1200, payUnit: "project",
    hours: "5-day build",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 5 days",
    skills: ["Framer", "Next.js", "Animation"],
    summary: "Design is done, animations specced. Ship it clean and fast.",
    description: "One-page marketing site. Paid on live launch. No open-ended retainer trap.",
    applyUrl: "#",
    trending: true, postedDaysAgo: 0,
  },
  {
    id: "copywriting-brand",
    title: "Brand copy for a launching skincare line",
    company: "The Hallens",
    category: "Copywriting",
    tags: ["Remote", "Portfolio"],
    payMin: 400, payMax: 800, payUnit: "project",
    hours: "3-day delivery",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 72 hrs",
    skills: ["Brand voice", "Product copy", "Punchy short-form"],
    summary: "Homepage, three product pages, tone-of-voice doc. Paid on delivery.",
    description: "Warm, human, a little playful. No AI slop — we hired you for you.",
    applyUrl: "#",
    postedDaysAgo: 2,
  },
  {
    id: "social-content-monthly",
    title: "Monthly social content pack (12 posts)",
    company: "Gene L.",
    category: "Social Media Content",
    tags: ["Recurring", "Remote", "Weekly pay"],
    payMin: 500, payMax: 900, payUnit: "month",
    hours: "Ongoing",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "First batch this week",
    skills: ["Canva / Figma", "Copy", "Trend awareness"],
    summary: "12 branded posts, delivered in weekly batches. Paid weekly.",
    description: "Small e-commerce brand. Long-term partnership potential. No agency fees skimmed off the top.",
    applyUrl: "#",
    featured: true, postedDaysAgo: 0,
  },
  {
    id: "presentation-pitch-deck",
    title: "Redesign a 20-slide investor pitch deck",
    company: "The Diazes",
    category: "Presentation Design",
    tags: ["Same-day", "Remote", "Cash-fast"],
    payMin: 350, payMax: 650, payUnit: "project",
    hours: "48-hr delivery",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 48 hrs",
    skills: ["Figma / Keynote", "Data viz", "Type"],
    summary: "Content is written. Make it look like the round they're closing.",
    description: "Editorial, confident, minimal. Paid on delivery — before their next VC call.",
    applyUrl: "#",
    postedDaysAgo: 0,
  },
  {
    id: "creative-consulting-brand",
    title: "1-hour creative direction call for a rebrand",
    company: "Alicia B.",
    category: "Creative Consulting",
    tags: ["Same-day", "Remote", "Cash-fast"],
    payMin: 120, payMax: 250, payUnit: "hr",
    hours: "60 min",
    difficulty: "Advanced", experience: "Senior", remote: true,
    location: "Remote",
    deadline: "Today or tomorrow",
    skills: ["Creative direction", "Brand strategy"],
    summary: "Quick, sharp advice on positioning + visual direction. Paid on the call.",
    description: "No proposal decks, no discovery workshops. One call, real answers, done.",
    applyUrl: "#",
    trending: true, postedDaysAgo: 0,
  },
  {
    id: "podcast-edit-weekly",
    title: "Edit + publish a weekly podcast",
    company: "Nadia F.",
    category: "Podcast Editing",
    tags: ["Recurring", "Remote", "Weekly pay"],
    payMin: 80, payMax: 130, payUnit: "project",
    hours: "Per episode",
    difficulty: "Entry", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Every Monday",
    skills: ["Descript", "Audition", "Show notes"],
    summary: "Trim, level, add intro/outro, publish. Paid every Monday.",
    description: "Weekly interview show. Reliable, warm, cares about the craft. Long-term gig.",
    applyUrl: "#",
    postedDaysAgo: 1,
  },
  {
    id: "graphic-design-merch",
    title: "T-shirt & merch designs for a music tour",
    company: "Rachel + The Loud",
    category: "Graphic Design",
    tags: ["Portfolio", "Royalty split"],
    payMin: 300, payMax: 700, payUnit: "project",
    hours: "1 week",
    difficulty: "Intermediate", experience: "Any", remote: true,
    location: "Remote",
    deadline: "Delivery in 7 days",
    skills: ["Illustrator", "Screen-print prep", "Type"],
    summary: "Three designs, print-ready. Small royalty on sold pieces + upfront pay.",
    description: "Grungy, editorial, human. Direct with the band — no label middlemen.",
    applyUrl: "#",
    postedDaysAgo: 2,
  },
];

export const OPPORTUNITIES: Opportunity[] = raw.map((o) => ({
  ...o,
  categorySlug: slug(o.category),
}));

export function getOpportunity(id: string) {
  return OPPORTUNITIES.find((o) => o.id === id);
}

export function formatPay(o: Opportunity) {
  const unit = { hr: "/hr", project: " flat", month: "/mo", year: "/yr", stipend: " total" }[o.payUnit];
  const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`);
  return o.payMin === o.payMax ? `${fmt(o.payMin)}${unit}` : `${fmt(o.payMin)}–${fmt(o.payMax)}${unit}`;
}

export function postedLabel(hoursAgo: number) {
  if (hoursAgo <= 0) return "Just posted";
  if (hoursAgo === 1) return "1 hr ago";
  if (hoursAgo < 24) return `${hoursAgo} hrs ago`;
  const d = Math.round(hoursAgo / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

/** Derived urgency band — feeds "Happening today" / "This week" rails. */
export type Urgency = "now" | "today" | "this_week";
export function urgencyOf(o: Opportunity): Urgency {
  const s = (o.tags.join(" ") + " " + o.deadline).toLowerCase();
  if (/same-day|today|24-hr|24 hr|next hour|now/.test(s)) return "now";
  if (/48-hr|48 hr|tomorrow|this week|same-week/.test(s)) return "today";
  return "this_week";
}
export function urgencyLabel(u: Urgency) {
  return u === "now" ? "Live now" : u === "today" ? "Today" : "This week";
}

/** Rails for the homepage live feed. */
export function shiftsToday() {
  return OPPORTUNITIES.filter((o) => urgencyOf(o) !== "this_week").slice(0, 8);
}
export function shiftsHighestPay() {
  return [...OPPORTUNITIES].sort((a, b) => b.payMax - a.payMax).slice(0, 8);
}
export function shiftsNearby() {
  return OPPORTUNITIES.filter((o) => !o.remote || /local/i.test(o.location)).concat(
    OPPORTUNITIES.filter((o) => o.remote).slice(0, 4),
  ).slice(0, 8);
}

