export type Question = {
  id: string;
  section: string;
  prompt: string;
  helper?: string;
  type: "single" | "multi" | "text";
  options?: string[];
  min?: number;
  max?: number;
};

export const QUESTIONS: Question[] = [
  { id: "experience", section: "About you", prompt: "Where are you in your career?", type: "single",
    options: ["Just starting out", "Early career (1–3 yrs)", "Mid-career (4–9 yrs)", "Senior (10+ yrs)", "Between things"] },
  { id: "goal", section: "About you", prompt: "What are you trying to do in the next 6 months?", type: "single",
    options: ["Earn more income", "Pivot into AI work", "Find creative projects", "Land a full-time role", "Explore what's out there"] },
  { id: "interests", section: "Interests", prompt: "Pick the areas that pull you in.", helper: "Choose 2–5.", type: "multi", min: 2, max: 5,
    options: ["AI research", "Writing", "Design", "Programming", "Music", "Photography", "Video", "Marketing", "Product", "Science", "Policy & ethics", "Education"] },
  { id: "skills", section: "Skills", prompt: "Which creative skills are strongest for you?", type: "multi", min: 1, max: 6,
    options: ["Writing", "Visual design", "Filmmaking", "Music production", "Storytelling", "Illustration", "Photography", "Product taste"] },
  { id: "tech", section: "Skills", prompt: "Which technical skills do you have?", type: "multi", min: 0, max: 8,
    options: ["Python", "JavaScript / TypeScript", "SQL", "ML / data", "Prompt engineering", "Design tools (Figma)", "Video tools", "Audio tools", "None yet"] },
  { id: "style", section: "How you work", prompt: "What working style suits you?", type: "single",
    options: ["Solo and independent", "Small team", "Structured full-time", "Cohort-based programs", "Whatever fits the project"] },
  { id: "income", section: "How you work", prompt: "How would you prefer to get paid?", type: "single",
    options: ["Hourly / gig", "Project-based", "Salary", "Grants & residencies", "Passive / creator", "Flexible income"] },
  { id: "industries", section: "Interests", prompt: "Which industries excite you most?", type: "multi", min: 1, max: 5,
    options: ["Consumer tech", "Enterprise / SaaS", "Media & entertainment", "Health & science", "Education", "Climate", "Games", "Finance", "Public sector"] },
  { id: "ai_familiarity", section: "Skills", prompt: "How comfortable are you with AI tools today?", type: "single",
    options: ["Curious beginner", "Casual user", "Power user", "Building with it", "Working on it professionally"] },
  { id: "remote", section: "How you work", prompt: "Where do you want to work from?", type: "single",
    options: ["Fully remote", "Hybrid", "In person", "Doesn't matter"] },
  { id: "availability", section: "How you work", prompt: "How much time can you commit each week?", type: "single",
    options: ["Under 5 hrs", "5–15 hrs", "15–30 hrs", "30+ hrs", "Full-time"] },
  { id: "education", section: "About you", prompt: "What's your highest level of formal education?", type: "single",
    options: ["Self-taught", "Some college", "Bachelor's", "Graduate degree", "PhD"] },
  { id: "portfolio", section: "Assets", prompt: "Do you have a portfolio you're proud of?", type: "single",
    options: ["Yes, polished", "Yes, needs updating", "In progress", "Not yet"] },
  { id: "resume", section: "Assets", prompt: "Is your resume ready to send?", type: "single",
    options: ["Ready", "Needs a refresh", "Rebuilding it", "Not yet"] },
  { id: "software", section: "Skills", prompt: "Which of these do you use regularly?", type: "multi", min: 0, max: 10,
    options: ["ChatGPT / Claude", "Cursor / Copilot", "Midjourney / SD", "Runway / Pika", "Figma", "Notion", "Excel / Sheets", "Descript", "Ableton / Logic"] },
  { id: "pay", section: "Preferences", prompt: "What's your target hourly rate or salary band?", type: "single",
    options: ["Any — I'm learning", "$20–40/hr", "$40–80/hr", "$80–150/hr", "$150k+/yr", "$250k+/yr"] },
  { id: "long_term", section: "Preferences", prompt: "Where do you want to be in 3 years?", type: "single",
    options: ["Running my own studio", "Leading a team inside a startup", "Independent creator", "Researcher / academic", "Financial freedom, flexible life"] },
  { id: "north_star", section: "Preferences", prompt: "One sentence: what does 'a good week' look like?", helper: "Optional. Shapes your feed.", type: "text" },
];
