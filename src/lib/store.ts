// Client-side persistence for user profile, saved opps, assessment, and applications.
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

export function useStoreVersion() {
  // returns a value that changes when store writes happen — for cheap re-renders.
  if (!isBrowser()) return 0;
  const { useSyncExternalStore } = require("react") as typeof import("react");
  return useSyncExternalStore(
    (cb: () => void) => {
      const h = () => cb();
      window.addEventListener("sc:store", h);
      window.addEventListener("storage", h);
      return () => {
        window.removeEventListener("sc:store", h);
        window.removeEventListener("storage", h);
      };
    },
    () => localStorage.length + ":" + (localStorage.getItem("sc.saved")?.length ?? 0),
    () => 0,
  );
}

export function computeProfile(answers: AssessmentAnswers): OpportunityProfile {
  const income = (answers["income"] as string) ?? "Flexible income";
  const style = (answers["style"] as string) ?? "Independent";
  const interests = ((answers["interests"] as string[]) ?? []).slice(0, 3);
  const skills = ((answers["skills"] as string[]) ?? []).slice(0, 3);

  const map: Record<string, { archetype: string; cats: string[] }> = {
    "Hourly / gig": { archetype: "The Frontier Freelancer", cats: ["AI Training", "Model Evaluation", "Annotation", "Freelance"] },
    "Project-based": { archetype: "The Independent Operator", cats: ["Freelance", "Prompt Engineering", "Design", "Programming"] },
    "Salary": { archetype: "The Embedded Builder", cats: ["Remote Jobs", "Programming", "Marketing"] },
    "Grants & residencies": { archetype: "The Studio Artist", cats: ["Grants", "Residencies", "Creator Programs", "Fellowships"] },
    "Passive / creator": { archetype: "The Creator", cats: ["Creator Programs", "Writing", "Video", "Music"] },
    "Flexible income": { archetype: "The Portfolio Worker", cats: ["Research Studies", "UX Research", "AI Training", "Freelance"] },
  };
  const pick = map[income] ?? map["Flexible income"];

  return {
    archetype: pick.archetype,
    tagline: `${style} worker leaning into ${interests.join(", ") || "AI-native work"}.`,
    strengths: skills.length ? skills : ["Curiosity", "Adaptability", "Judgment"],
    recommendedCategories: pick.cats,
    answers,
    completedAt: new Date().toISOString(),
  };
}
