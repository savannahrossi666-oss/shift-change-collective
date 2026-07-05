// Craft Assessments — the trust system.
//
// Modular by design: adding a new discipline is a new object in ASSESSMENTS.
// Scoring is deterministic + mock today (localStorage only), but wrapped in an
// `evaluator` interface so an AI + human review pipeline can drop in later
// without touching any UI. See `scoreSubmission` at the bottom.

export type Level = "Emerging" | "Skilled" | "Advanced" | "Expert" | "Master";

export const LEVELS: Level[] = ["Emerging", "Skilled", "Advanced", "Expert", "Master"];

export const RUBRIC = [
  "Creativity",
  "Technical Skill",
  "Communication",
  "Professionalism",
  "Attention to Detail",
  "Problem Solving",
  "Consistency",
] as const;
export type RubricKey = (typeof RUBRIC)[number];

export type TaskKind = "upload" | "prompt" | "timed" | "link" | "portfolio";
export type AcceptKind = "image" | "video" | "audio" | "doc" | "link";

export type AssessmentTask = {
  id: string;
  kind: TaskKind;
  title: string;
  brief: string;
  deliverables: string[];
  accepts?: AcceptKind[];
  timeLimitMin?: number;
  minChars?: number;
};

export type Assessment = {
  id: string;
  category: string;
  title: string;
  tagline: string;
  estMinutes: number;
  skills: string[];
  tasks: AssessmentTask[];
};

export type SubmissionAnswer = {
  text?: string;
  links?: string[];
  files?: { name: string; dataUrl: string; type: string; size: number }[];
  confidence?: number; // 1-5 self-rating
};

export type Score = {
  overall: number;
  level: Level;
  breakdown: Record<RubricKey, number>;
  strengths: string[];
  improve: string[];
  scoredAt: string;
};

export type Submission = {
  assessmentId: string;
  status: "draft" | "submitted" | "scored";
  startedAt: string;
  updatedAt: string;
  answers: Record<string, SubmissionAnswer>;
  practice?: boolean;
  score?: Score;
};

// ---------------- Seed library ----------------

const T = (
  id: string,
  kind: TaskKind,
  title: string,
  brief: string,
  deliverables: string[],
  accepts?: AcceptKind[],
  extras?: Partial<AssessmentTask>,
): AssessmentTask => ({ id, kind, title, brief, deliverables, accepts, ...extras });

export const ASSESSMENTS: Assessment[] = [
  {
    id: "graphic-design",
    category: "Graphic Design",
    title: "Graphic Design — Editorial Poster",
    tagline: "Typography, hierarchy, and layout under a real brief.",
    estMinutes: 45,
    skills: ["Typography", "Layout", "Color Theory", "Visual Hierarchy"],
    tasks: [
      T(
        "brief",
        "prompt",
        "Read the brief",
        "A local record label wants a poster for a one-night show: 'Signal / Noise — an evening of ambient electronics'. Date: this Saturday, 9pm. Audience: 20–35, design-literate, expects taste.",
        ["Summarize the tone you'll aim for in 2–3 sentences."],
        undefined,
        { minChars: 120 },
      ),
      T(
        "poster",
        "upload",
        "Deliver the poster",
        "Design an 11×17 poster. Must include the event name, date, time, and label. No stock templates.",
        ["Final poster (PNG/JPG/PDF)", "Optional: a second variant"],
        ["image", "doc"],
      ),
      T(
        "rationale",
        "prompt",
        "Design rationale",
        "In 150–250 words, walk through your typographic and layout choices.",
        ["Written rationale"],
        undefined,
        { minChars: 150 },
      ),
    ],
  },
  {
    id: "logo-design",
    category: "Logo Design",
    title: "Logo Design — Brand Mark Sprint",
    tagline: "One mark, three lockups, a real rationale.",
    estMinutes: 60,
    skills: ["Mark Design", "Vector Craft", "Brand Reasoning"],
    tasks: [
      T("mark", "upload", "Primary mark", "Design a wordmark or symbol for 'Kindred', a neighborhood coffee co-op.", ["Vector or high-res raster"], ["image", "doc"]),
      T("lockups", "upload", "Lockups", "Horizontal, stacked, and monochrome versions on light + dark.", ["Single sheet showing all lockups"], ["image", "doc"]),
      T("why", "prompt", "Why this mark", "Explain your concept in ~200 words.", ["Written rationale"], undefined, { minChars: 150 }),
    ],
  },
  {
    id: "photography",
    category: "Photography",
    title: "Photography — Portrait & Story",
    tagline: "Composition, light, and a coherent point of view.",
    estMinutes: 30,
    skills: ["Composition", "Lighting", "Editing", "Portfolio Sense"],
    tasks: [
      T("series", "upload", "Deliver a 5-image portrait series", "Same subject, five frames, coherent light and edit.", ["5 images, edited"], ["image"]),
      T("edit", "upload", "One before/after", "Show one RAW-to-final treatment.", ["Before + after pair"], ["image"]),
      T("pov", "prompt", "Point of view", "In 100–200 words, describe the story of the series.", ["Written statement"], undefined, { minChars: 100 }),
    ],
  },
  {
    id: "video-editing",
    category: "Video Editing",
    title: "Video Editing — 60-Second Cut",
    tagline: "Pacing, sound design, color, delivery.",
    estMinutes: 90,
    skills: ["Pacing", "Sound", "Color", "Export Craft"],
    tasks: [
      T("cut", "upload", "Deliver a 60-second cut", "Use your own footage or the free provided clip pack. Include titles and a music bed.", ["MP4, H.264, ≤ 100MB, or a link"], ["video", "link"]),
      T("timeline", "upload", "Timeline screenshot", "Show a screenshot of your final timeline.", ["Image of the timeline"], ["image"]),
      T("notes", "prompt", "Editor's notes", "Explain your pacing and color choices.", ["Written notes"], undefined, { minChars: 120 }),
    ],
  },
  {
    id: "music-production",
    category: "Music Production",
    title: "Music Production — 90-Second Sketch",
    tagline: "Original beat, arrangement, and a clean mix.",
    estMinutes: 90,
    skills: ["Arrangement", "Mix", "Sound Design"],
    tasks: [
      T("track", "upload", "Deliver a 90-second sketch", "Original composition. Any genre. Stereo WAV or MP3, or a link.", ["Audio file or link"], ["audio", "link"]),
      T("stems", "upload", "One stem or bounce", "Attach a single stem so we can hear one element in isolation.", ["Audio file"], ["audio"]),
      T("process", "prompt", "Process", "Write ~150 words on your arrangement and mix decisions.", ["Written notes"], undefined, { minChars: 120 }),
    ],
  },
  {
    id: "writing",
    category: "Copywriting",
    title: "Writing — Voice & Craft",
    tagline: "Tone-shifting, headline writing, and a short story beat.",
    estMinutes: 40,
    skills: ["Tone", "Editing", "Headlines", "Storytelling"],
    tasks: [
      T("headlines", "prompt", "Five headlines", "Write five headlines for a local pour-over coffee bar's grand opening. Distinct tones.", ["5 headlines, numbered"], undefined, { minChars: 80 }),
      T("tone", "prompt", "Same message, three tones", "Write a 60-word paragraph promoting the opening — playful, then confident, then editorial.", ["Three paragraphs"], undefined, { minChars: 250 }),
      T("story", "prompt", "Micro-story", "In 150–200 words, write a scene set at that coffee bar's opening morning.", ["Short story"], undefined, { minChars: 150 }),
    ],
  },
  {
    id: "illustration",
    category: "Illustration",
    title: "Illustration — Character in Context",
    tagline: "Character design, composition, line quality.",
    estMinutes: 60,
    skills: ["Character", "Composition", "Line", "Color"],
    tasks: [
      T("character", "upload", "Character sheet", "Design an original character (any style). Front and 3/4 view.", ["Character sheet"], ["image", "doc"]),
      T("scene", "upload", "Character in a scene", "Place the character in an environment that reveals something about them.", ["Final illustration"], ["image", "doc"]),
      T("story", "prompt", "One-paragraph backstory", "Give the character a life in ~120 words.", ["Written backstory"], undefined, { minChars: 100 }),
    ],
  },
  {
    id: "motion-graphics",
    category: "Motion Graphics",
    title: "Motion — Logo Reveal",
    tagline: "Timing, easing, and clean typography in motion.",
    estMinutes: 90,
    skills: ["Timing", "Easing", "Type in Motion"],
    tasks: [
      T("reveal", "upload", "5-second logo reveal", "Animate a supplied or original logo. 1080p, MP4, or link.", ["Video or link"], ["video", "link"]),
      T("frames", "upload", "Key frames", "One image showing 3 keyframes from the animation.", ["Image"], ["image"]),
      T("notes", "prompt", "Motion notes", "Explain the easing and rhythm choices.", ["Written notes"], undefined, { minChars: 100 }),
    ],
  },
  {
    id: "ui-ux",
    category: "UI/UX Design",
    title: "UI/UX — Sign-Up Screen",
    tagline: "Product thinking, hierarchy, and interaction craft.",
    estMinutes: 60,
    skills: ["Product Thinking", "Hierarchy", "Interaction"],
    tasks: [
      T("screens", "upload", "Design 3 screens", "Sign-up, verification, and welcome for a neighborhood creative marketplace.", ["Frames as a single image or PDF"], ["image", "doc"]),
      T("proto", "link", "Prototype link", "Optional: link to a working Figma prototype.", ["Prototype URL"], ["link"]),
      T("rationale", "prompt", "Rationale", "Explain trade-offs in ~200 words.", ["Written rationale"], undefined, { minChars: 150 }),
    ],
  },
  {
    id: "creative-consulting",
    category: "Creative Consulting",
    title: "Creative Consulting — Brand Critique",
    tagline: "Diagnosis, strategy, presentation.",
    estMinutes: 45,
    skills: ["Diagnosis", "Strategy", "Presentation"],
    tasks: [
      T("audit", "prompt", "Audit", "Pick a brand you use weekly. Write a ~250-word critique of its current identity system.", ["Written audit"], undefined, { minChars: 200 }),
      T("plan", "prompt", "90-day plan", "Outline three moves the brand should make in the next 90 days.", ["Numbered list, 1–2 sentences each"], undefined, { minChars: 150 }),
      T("deck", "upload", "One-slide summary", "A single slide (PDF/PNG) presenting your plan.", ["File"], ["image", "doc"]),
    ],
  },
];

export function getAssessment(id: string): Assessment | undefined {
  return ASSESSMENTS.find((a) => a.id === id);
}

// ---------------- Storage (extends the existing `store` conventions) ----------------

const KEY = "sc.assessments";
const isBrowser = () => typeof window !== "undefined";

function readAll(): Record<string, Submission> {
  if (!isBrowser()) return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, Submission>;
  } catch {
    return {};
  }
}
function writeAll(all: Record<string, Submission>) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("sc:store", { detail: { key: KEY } }));
}

export const submissions = {
  all: (): Record<string, Submission> => readAll(),
  get: (id: string): Submission | undefined => readAll()[id],
  upsert: (id: string, patch: Partial<Submission>) => {
    const all = readAll();
    const now = new Date().toISOString();
    const prev: Submission = all[id] ?? {
      assessmentId: id,
      status: "draft",
      startedAt: now,
      updatedAt: now,
      answers: {},
    };
    all[id] = { ...prev, ...patch, updatedAt: now };
    writeAll(all);
    return all[id];
  },
  updateAnswer: (id: string, taskId: string, answer: SubmissionAnswer) => {
    const all = readAll();
    const now = new Date().toISOString();
    const prev: Submission = all[id] ?? {
      assessmentId: id,
      status: "draft",
      startedAt: now,
      updatedAt: now,
      answers: {},
    };
    prev.answers[taskId] = { ...prev.answers[taskId], ...answer };
    prev.updatedAt = now;
    all[id] = prev;
    writeAll(all);
    return prev;
  },
  reset: (id: string) => {
    const all = readAll();
    delete all[id];
    writeAll(all);
  },
  earnedLevels: (): Record<string, Level> => {
    const out: Record<string, Level> = {};
    for (const [id, s] of Object.entries(readAll())) {
      if (s.score) out[id] = s.score.level;
    }
    return out;
  },
};

// ---------------- Evaluator (mock; swappable) ----------------

export interface Evaluator {
  score(assessment: Assessment, submission: Submission): Score;
}

// A deterministic mock that rewards completeness + effort + self-confidence.
// It never fails a submission — the goal is signal, not exclusion.
export const mockEvaluator: Evaluator = {
  score(a, s) {
    const dims: Record<RubricKey, number> = {
      Creativity: 55,
      "Technical Skill": 55,
      Communication: 55,
      Professionalism: 55,
      "Attention to Detail": 55,
      "Problem Solving": 55,
      Consistency: 55,
    };

    let totalTasks = a.tasks.length;
    let completed = 0;
    let textVolume = 0;
    let fileCount = 0;
    let linkCount = 0;
    let confidence = 0;
    let confidenceN = 0;

    for (const t of a.tasks) {
      const ans = s.answers[t.id];
      if (!ans) continue;
      const hasText = (ans.text ?? "").trim().length >= (t.minChars ?? 40);
      const hasFile = (ans.files?.length ?? 0) > 0;
      const hasLink = (ans.links?.filter(Boolean).length ?? 0) > 0;
      const done =
        t.kind === "prompt" ? hasText :
        t.kind === "upload" ? hasFile :
        t.kind === "link" ? hasLink || hasText :
        t.kind === "portfolio" ? hasLink || hasFile :
        hasText || hasFile || hasLink;
      if (done) completed++;
      textVolume += (ans.text ?? "").length;
      fileCount += ans.files?.length ?? 0;
      linkCount += ans.links?.filter(Boolean).length ?? 0;
      if (ans.confidence) {
        confidence += ans.confidence;
        confidenceN++;
      }
    }

    const completeness = completed / Math.max(1, totalTasks); // 0..1
    const effort = Math.min(1, (textVolume / 800) * 0.5 + (fileCount / 3) * 0.4 + (linkCount / 2) * 0.1);
    const conf = confidenceN ? (confidence / confidenceN) / 5 : 0.6;

    const base = 40 + completeness * 40 + effort * 15 + conf * 5;

    // Slight variation per rubric key so it doesn't look flat
    const drift: Record<RubricKey, number> = {
      Creativity: fileCount > 0 ? 4 : -2,
      "Technical Skill": fileCount > 1 ? 5 : 0,
      Communication: textVolume > 400 ? 5 : -2,
      Professionalism: completeness === 1 ? 4 : 0,
      "Attention to Detail": textVolume > 200 && fileCount > 0 ? 3 : -1,
      "Problem Solving": completeness > 0.6 ? 3 : -1,
      Consistency: fileCount >= totalTasks ? 4 : -1,
    };
    for (const k of RUBRIC) dims[k] = clamp(Math.round(base + drift[k]));

    const overall = Math.round(Object.values(dims).reduce((a, b) => a + b, 0) / RUBRIC.length);
    const level = levelFor(overall);

    const sorted = [...RUBRIC].sort((a, b) => dims[b] - dims[a]);
    const strengths = sorted.slice(0, 2).map((k) => strengthCopy(k));
    const improve = sorted.slice(-2).map((k) => improveCopy(k));

    return { overall, level, breakdown: dims, strengths, improve, scoredAt: new Date().toISOString() };
  },
};

export function scoreSubmission(a: Assessment, s: Submission): Score {
  return mockEvaluator.score(a, s);
}

export function levelFor(score: number): Level {
  if (score >= 92) return "Master";
  if (score >= 80) return "Expert";
  if (score >= 65) return "Advanced";
  if (score >= 50) return "Skilled";
  return "Emerging";
}

export function levelIndex(l: Level): number {
  return LEVELS.indexOf(l);
}

function clamp(n: number, min = 20, max = 99) {
  return Math.max(min, Math.min(max, n));
}

function strengthCopy(k: RubricKey): string {
  return ({
    Creativity: "Original ideas and confident aesthetic choices.",
    "Technical Skill": "Craft and execution came through clearly.",
    Communication: "Clear, considered writing about your work.",
    Professionalism: "Delivered everything asked for, cleanly presented.",
    "Attention to Detail": "The small choices show intention.",
    "Problem Solving": "You framed the brief before jumping in.",
    Consistency: "The work reads as one voice across pieces.",
  })[k];
}
function improveCopy(k: RubricKey): string {
  return ({
    Creativity: "Push one more iteration past the first idea.",
    "Technical Skill": "Tighten execution — export settings, alignment, cleanliness.",
    Communication: "Explain the 'why' — clients hire the thinker, not just the maker.",
    Professionalism: "Complete every deliverable, even the optional ones.",
    "Attention to Detail": "Slow down on the finish. Small details compound.",
    "Problem Solving": "Restate the brief in your own words before starting.",
    Consistency: "Make sure each piece feels like it comes from the same hand.",
  })[k];
}

// UI helpers
export const LEVEL_META: Record<Level, { color: string; ring: string; icon: string }> = {
  Emerging: { color: "text-white/70", ring: "ring-white/20", icon: "◦" },
  Skilled: { color: "text-emerald-300", ring: "ring-emerald-400/30", icon: "◆" },
  Advanced: { color: "text-sky-300", ring: "ring-sky-400/30", icon: "◈" },
  Expert: { color: "text-violet-300", ring: "ring-violet-400/30", icon: "✦" },
  Master: { color: "text-amber-300", ring: "ring-amber-400/40", icon: "★" },
};
