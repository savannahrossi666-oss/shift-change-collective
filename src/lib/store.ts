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

// Skill → category map, so what a neighbor says they can do maps to real task
// categories in the seed data.
const SKILL_TO_CAT: Record<string, string[]> = {
  "Moving & lifting": ["Moving", "Furniture Assembly", "Delivery"],
  "Yard work": ["Yard Work", "Seasonal Work", "Snow Removal"],
  "Cleaning": ["Cleaning", "Organization"],
  "Dog walking / pet care": ["Dog Walking", "House Sitting"],
  "Grocery + errands": ["Grocery Pickup", "Delivery"],
  "Tech help": ["Tech Help", "Computer Repair"],
  "Tutoring": ["Tutoring"],
  "Babysitting": ["Babysitting"],
  "Painting": ["Painting"],
  "Furniture assembly": ["Furniture Assembly"],
  "Snow removal": ["Snow Removal"],
  "Event setup": ["Event Setup"],
  "Photography": ["Photography"],
  "Music lessons": ["Music Lessons"],
  "Elder companionship": ["Elder Assistance", "House Sitting"],
  "Delivery": ["Delivery", "Grocery Pickup"],
};

export function computeProfile(answers: AssessmentAnswers): OpportunityProfile {
  const intent = (answers["intent"] as string) ?? "A little of both";
  const urgency = (answers["urgency"] as string) ?? "This week";
  const skills = ((answers["skills"] as string[]) ?? []).slice(0, 4);
  const neighborhood = (answers["neighborhood"] as string) ?? "your neighborhood";
  const why = (answers["why_here"] as string) ?? "";

  // Archetype from intent + urgency + skills breadth
  let archetype = "The Good Neighbor";
  if (intent.startsWith("I want to earn")) {
    archetype = urgency === "Today" ? "Same-Day Earner" : skills.length >= 4 ? "Handy Helper" : "Everyday Earner";
  } else if (intent.startsWith("I need help")) {
    archetype = urgency === "Today" ? "Busy Household" : "Home Base";
  } else if (intent.startsWith("A little")) {
    archetype = "Community Connector";
  }

  // Recommended categories — either what they said they can do, or a friendly
  // starter set so a "just looking" neighbor still sees a useful feed.
  const cats = new Set<string>();
  for (const s of skills) (SKILL_TO_CAT[s] ?? []).forEach((c) => cats.add(c));
  if (cats.size === 0) ["Moving", "Yard Work", "Cleaning", "Tech Help", "Delivery"].forEach((c) => cats.add(c));

  const strengths = skills.length ? skills : ["Showing up", "Being kind", "Following through"];

  const taglineParts: string[] = [];
  if (neighborhood.trim()) taglineParts.push(`Rooted in ${neighborhood}`);
  if (urgency === "Today") taglineParts.push("ready to move today");
  else if (urgency === "This week") taglineParts.push("looking this week");
  if (why) taglineParts.push(why.toLowerCase());

  const tagline = taglineParts.length
    ? taglineParts.join(" • ")
    : "Ready to help your neighbors — and be helped back.";

  return {
    archetype,
    tagline,
    strengths,
    recommendedCategories: Array.from(cats),
    answers,
    completedAt: new Date().toISOString(),
  };
}
