## Craft Assessments — Build Plan

A modular, front-end-first trust system that plugs into existing profiles, search, and cards. Data stays client-side (localStorage via `store.ts`) to match the current app; the architecture is designed so a real backend + AI scoring can drop in later without rewrites.

### 1. Data model (`src/lib/assessments.ts` — new)

```ts
type AssessmentTask = {
  id: string;
  kind: "upload" | "prompt" | "timed" | "link" | "portfolio";
  title: string;
  brief: string;          // the creative challenge
  deliverables: string[]; // what to submit
  accepts?: ("image"|"video"|"audio"|"doc"|"link")[];
  timeLimitMin?: number;
};

type Assessment = {
  id: string;             // e.g. "graphic-design"
  category: string;       // matches opportunities category
  title: string;
  tagline: string;
  estMinutes: number;
  skills: string[];       // rubric dimensions
  tasks: AssessmentTask[];
};

type Submission = {
  assessmentId: string;
  status: "draft" | "submitted" | "scored";
  startedAt: string;
  updatedAt: string;
  answers: Record<string, { text?: string; links?: string[]; files?: {name:string;dataUrl:string;type:string}[] }>;
  score?: { overall: number; level: Level; breakdown: Record<string, number>; strengths: string[]; improve: string[] };
};

type Level = "Emerging" | "Skilled" | "Advanced" | "Expert" | "Master";
```

Seed ~10 assessments covering: Graphic Design, Logo Design, Photography, Video Editing, Music Production, Writing, Illustration, Motion Graphics, UI/UX, Creative Consulting. Framework supports unlimited more — a new category = one object.

Store submissions under `sc.assessments` via existing `store` helpers.

### 2. Scoring (mock, swappable)

`scoreSubmission()` in `assessments.ts` produces a deterministic mock score from submission completeness + self-rated confidence + rubric checks. Returns breakdown across: Creativity, Technical Skill, Communication, Professionalism, Attention to Detail, Problem Solving, Consistency. Wrapped in an `evaluator` interface so a real AI/human evaluator can replace it later without touching UI.

Level thresholds: Emerging <50, Skilled 50–65, Advanced 65–80, Expert 80–92, Master 92+.

### 3. Routes

- `src/routes/assessments.tsx` — **library**: grid of assessment cards by category, filter by "not started / in progress / verified", earned-level badges.
- `src/routes/assessments.$id.tsx` — **detail + take**: intro screen (time, skills, instructions) → practice mode toggle → task-by-task flow with autosave every change → review & submit → results screen with breakdown, strengths, improvement notes, earned level & badge, share to profile.
- Extend `src/routes/profile.tsx` — verification checklist (Identity, Craft Assessed, Portfolio, Reviews, Completed Projects, Response Time, Repeat Clients, Community Favorite) + earned badges wall.
- Extend `src/routes/dashboard.tsx` — "Your assessments" module: in-progress resume, recommended next assessments based on skills.

### 4. Components (`src/components/`)

- `assessment-card.tsx` — library tile with level badge, category, est. time, progress.
- `assessment-badge.tsx` — reusable level badge (`Emerging`→`Master`) with icon + tooltip. Drops into `opportunity-card`, profile, search results.
- `verification-checklist.tsx` — the 8-item trust list.
- `submission-uploader.tsx` — drag-drop for images/video/audio/docs + link inputs, previews, base64 into localStorage (with a soft ~5MB cap warning; production would use Cloud storage).
- `rubric-breakdown.tsx` — radar/bars for the 7 rubric dimensions on results.

### 5. Search & discovery integration

Update `src/routes/opportunities.tsx` filter panel with:
- Craft Assessed (toggle)
- Assessment Level (Emerging+, Skilled+, Advanced+, Expert+, Master)
- Verified Identity (toggle)

Add matching filter logic against a `poster.trust` object on tasks (mocked). Show the level badge on `opportunity-card` next to the poster name.

### 6. Nav & copy

- Add "Assessments" link to `site-nav.tsx`.
- Homepage: small trust strip mentioning "Prove your craft. Earn verified badges." linking to `/assessments` — no redesign of hero.
- FAQ + About: one paragraph each explaining Craft Assessments as optional trust-building, not gatekeeping.

### 7. Explicitly out of scope for this pass

- Real AI evaluator, peer review queue, human moderator dashboard (interfaces are stubbed so they slot in later).
- Real file storage — uploads stay as local base64 previews until Lovable Cloud is enabled.
- Payment/paywall gating on assessments (they're free per your brief).

### 8. Order of implementation (single build turn)

1. `assessments.ts` data + scoring + store helpers
2. Components (`assessment-card`, `assessment-badge`, `verification-checklist`, `submission-uploader`, `rubric-breakdown`)
3. `/assessments` library + `/assessments/$id` take-flow
4. Profile + Dashboard integrations
5. Opportunities filter + card badge
6. Nav link + light homepage/FAQ mentions

### Open questions

1. **Payments** — you were mid-decision on Stripe. Do I keep it parked, or want the Phase-1 Stripe enable to happen after this?
2. **Real file uploads** — assessments genuinely need real storage (images/video/audio submissions). Localstorage base64 works for a demo but will feel fake past ~5MB. Want me to enable Lovable Cloud now so uploads are real from day one, or ship the mock version first?
