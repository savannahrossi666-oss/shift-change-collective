// Client-side persistence for the neighbor profile, saved tasks, and status.
// All localStorage — no backend required to demo the product.

export type AssessmentAnswers = Record<string, string | string[]>;

export type OpportunityProfile = {
  archetype: string;
  tagline: string;
  strengths: string[];
  recommendedCategories: string[];
  answers: AssessmentAnswers;
  completedAt: string;
};

export type UserProfile = {
  name: string;
  email: string;
  photo?: string;
  bio: string;
  location: string;
  skills: string[];
  interests: string[];
  experience: string;
  linkedin?: string;
  github?: string;
  website?: string;
  portfolio?: string;
  resumeName?: string;
};

export type ApplicationStatus = "Saved" | "Applied" | "Interview" | "Offer" | "Archived";
export type Application = {
  opportunityId: string;
  status: ApplicationStatus;
  updatedAt: string;
  notes?: string;
};

const KEYS = {
  profile: "sc.profile",
  assessment: "sc.assessment",
  saved: "sc.saved",
  apps: "sc.applications",
  viewed: "sc.viewed",
  auth: "sc.auth",
} as const;

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("sc:store", { detail: { key } }));
}

export const store = {
  getProfile: (): UserProfile | null => read<UserProfile | null>(KEYS.profile, null),
  setProfile: (p: UserProfile) => write(KEYS.profile, p),

  getAssessment: (): OpportunityProfile | null => read<OpportunityProfile | null>(KEYS.assessment, null),
  setAssessment: (a: OpportunityProfile) => write(KEYS.assessment, a),

  getSaved: (): string[] => read<string[]>(KEYS.saved, []),
  toggleSaved: (id: string) => {
    const cur = store.getSaved();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
    write(KEYS.saved, next);
    return next;
  },
  isSaved: (id: string) => store.getSaved().includes(id),

  getApplications: (): Application[] => read<Application[]>(KEYS.apps, []),
  setApplicationStatus: (opportunityId: string, status: ApplicationStatus) => {
    const cur = store.getApplications();
    const idx = cur.findIndex((a) => a.opportunityId === opportunityId);
    const entry: Application = { opportunityId, status, updatedAt: new Date().toISOString() };
    if (idx >= 0) cur[idx] = { ...cur[idx], ...entry };
    else cur.unshift(entry);
    write(KEYS.apps, cur);
  },

  getViewed: (): string[] => read<string[]>(KEYS.viewed, []),
  pushViewed: (id: string) => {
    const cur = store.getViewed().filter((x) => x !== id);
    cur.unshift(id);
    write(KEYS.viewed, cur.slice(0, 12));
  },

  isAuthed: () => read<boolean>(KEYS.auth, false),
  setAuthed: (v: boolean) => write(KEYS.auth, v),
};

import { useSyncExternalStore } from "react";

export function useStoreVersion() {
  return useSyncExternalStore(
    (cb) => {
      if (!isBrowser()) return () => {};
      window.addEventListener("sc:store", cb);
      window.addEventListener("storage", cb);
      return () => {
        window.removeEventListener("sc:store", cb);
        window.removeEventListener("storage", cb);
      };
    },
    () =>
      isBrowser()
        ? String(localStorage.length) + ":" + (localStorage.getItem("sc.saved") ?? "")
        : "ssr",
    () => "ssr",
  );
}

// Skill → category map. The onboarding skills already match the seed categories
// one-to-one for creative services, so this is largely a passthrough with a few
// friendly aliases.
const SKILL_TO_CAT: Record<string, string[]> = {
  "Graphic Design": ["Graphic Design", "Logo Design", "Brand Identity"],
  "Logo Design": ["Logo Design", "Brand Identity", "Graphic Design"],
  "Brand Identity": ["Brand Identity", "Logo Design", "Graphic Design"],
  "AI Prompt Engineering": ["AI Prompt Engineering", "AI Content Creation"],
  "AI Content Creation": ["AI Content Creation", "AI Prompt Engineering", "Digital Art"],
  "Video Editing": ["Video Editing", "Motion Graphics"],
  "Motion Graphics": ["Motion Graphics", "Animation", "Video Editing"],
  "Animation": ["Animation", "Motion Graphics"],
  "Music Production": ["Music Production", "Audio Mixing"],
  "Audio Mixing": ["Audio Mixing", "Music Production", "Podcast Editing"],
  "Voice Acting": ["Voice Acting", "Podcast Editing"],
  "Podcast Editing": ["Podcast Editing", "Audio Mixing"],
  "Photography": ["Photography", "Photo Editing"],
  "Photo Editing": ["Photo Editing", "Photography"],
  "Digital Art": ["Digital Art", "Illustration"],
  "Illustration": ["Illustration", "Digital Art"],
  "3D Modeling": ["3D Modeling", "Animation"],
  "UI/UX Design": ["UI/UX Design", "Web Design"],
  "Web Design": ["Web Design", "UI/UX Design", "Web Development"],
  "Web Development": ["Web Development", "Web Design"],
  "Copywriting": ["Copywriting", "Social Media Content"],
  "Social Media Content": ["Social Media Content", "Copywriting", "Graphic Design"],
  "Presentation Design": ["Presentation Design", "Graphic Design"],
  "Creative Consulting": ["Creative Consulting", "Brand Identity"],
};

export function computeProfile(answers: AssessmentAnswers): OpportunityProfile {
  const intent = (answers["intent"] as string) ?? "A little of both";
  const urgency = (answers["urgency"] as string) ?? "This week";
  const skills = ((answers["skills"] as string[]) ?? []).slice(0, 4);
  const location = (answers["location"] as string) ?? "";
  const level = (answers["level"] as string) ?? "";
  const why = (answers["why_here"] as string) ?? "";

  // Archetype from intent + urgency + level + skills breadth
  let archetype = "Creative Multihyphenate";
  if (intent.startsWith("I want to earn")) {
    if (urgency === "Today") archetype = "Same-Day Creator";
    else if (level.startsWith("Senior")) archetype = "Senior Creative-for-Hire";
    else if (skills.length >= 4) archetype = "Creative Multihyphenate";
    else archetype = "Rising Creator";
  } else if (intent.startsWith("I need creative help")) {
    archetype = urgency === "Today" ? "Fast-Moving Founder" : "Creative Client";
  } else if (intent.startsWith("A little")) {
    archetype = "Creative Collaborator";
  }

  // Recommended categories — either what they said they can do, or a friendly
  // starter set so an "exploring" user still sees a useful feed.
  const cats = new Set<string>();
  for (const s of skills) (SKILL_TO_CAT[s] ?? []).forEach((c) => cats.add(c));
  if (cats.size === 0)
    ["Graphic Design", "AI Content Creation", "Video Editing", "Web Design", "Photography"].forEach((c) => cats.add(c));

  const strengths = skills.length ? skills : ["Fast turnaround", "Warm collaboration", "Original work"];

  const taglineParts: string[] = [];
  if (location.trim()) taglineParts.push(`Based in ${location}`);
  if (urgency === "Today") taglineParts.push("ready to ship today");
  else if (urgency === "This week") taglineParts.push("booking this week");
  if (why) taglineParts.push(why.toLowerCase());

  const tagline = taglineParts.length
    ? taglineParts.join(" • ")
    : "Ready to turn creativity into income — today.";

  return {
    archetype,
    tagline,
    strengths,
    recommendedCategories: Array.from(cats),
    answers,
    completedAt: new Date().toISOString(),
  };
}
