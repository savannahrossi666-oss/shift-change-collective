// Onboarding — a "Creator Profile", not a resume.
// The goal is speed and instant discoverability. Every question exists to help
// creators get matched with the right clients (or vice versa) in minutes.

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
  // Why you're here
  { id: "intent", section: "You & your creativity", prompt: "What brings you to Shift Change today?", type: "single",
    helper: "You can switch later. Many creators do both.",
    options: ["I want to earn from my creativity today", "I need creative help today", "A little of both", "Just exploring"] },
  { id: "urgency", section: "You & your creativity", prompt: "How soon do you need this to happen?", type: "single",
    helper: "So we sort your feed to what actually helps.",
    options: ["Today", "This week", "This month", "No rush — I'm building for later"] },

  // Where you work
  { id: "location", section: "Where you work", prompt: "Where's your creative base?", helper: "City or ZIP. Most gigs are remote, some are local.", type: "text" },
  { id: "reach", section: "Where you work", prompt: "How far can you take on work?", type: "single",
    options: ["Fully remote — anywhere", "Remote + my city", "Local only", "Hybrid — I'll travel"] },

  // Creator side
  { id: "skills", section: "What you create", prompt: "What creative skills do you offer?", helper: "Pick as many as fit. Everyone has a creative gift.", type: "multi", min: 1, max: 12,
    options: [
      "Graphic Design", "Logo Design", "Brand Identity",
      "AI Prompt Engineering", "AI Content Creation",
      "Video Editing", "Motion Graphics", "Animation",
      "Music Production", "Audio Mixing", "Voice Acting", "Podcast Editing",
      "Photography", "Photo Editing", "Digital Art", "Illustration",
      "3D Modeling", "UI/UX Design", "Web Design", "Web Development",
      "Copywriting", "Social Media Content", "Presentation Design", "Creative Consulting",
    ] },
  { id: "tools", section: "What you create", prompt: "Which tools do you work in?", type: "multi", min: 0, max: 12,
    options: [
      "Figma", "Adobe Creative Cloud", "Canva",
      "After Effects", "Premiere Pro", "DaVinci Resolve",
      "Ableton", "Logic Pro", "FL Studio",
      "Blender", "Cinema 4D",
      "Midjourney", "Stable Diffusion", "ChatGPT / Claude",
      "Framer", "Webflow",
    ] },
  { id: "level", section: "What you create", prompt: "How would you describe your level?", type: "single",
    options: ["Just starting — learning fast", "Comfortable and building a portfolio", "Working pro", "Senior / studio-level"] },
  { id: "availability", section: "What you create", prompt: "When are you usually free to create?", type: "multi", min: 1, max: 5,
    options: ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekends", "Anytime — full-time freelance"] },
  { id: "hours", section: "What you create", prompt: "How much time do you want to book per week?", type: "single",
    options: ["A few hours", "5–15 hrs", "15–30 hrs", "Full-time — as much as I can get"] },
  { id: "pay_speed", section: "What you create", prompt: "How fast do you need to get paid?", helper: "We support cash, instant transfer, and same-day payout.", type: "single",
    options: ["Today, on delivery", "Same day, any method", "Within a couple days is fine", "Doesn't matter"] },

  // Client side
  { id: "help_types", section: "Creative help you might need", prompt: "What kinds of creative work do you hire for?", type: "multi", min: 0, max: 10,
    options: [
      "Logo / brand identity", "Website / landing page", "UI/UX design",
      "Video editing", "Motion graphics", "Music / audio",
      "AI content + prompts", "Illustration / art",
      "Copy / social content", "Presentation / pitch deck",
    ] },
  { id: "budget", section: "Creative help you might need", prompt: "Typical budget for a creative project?", type: "single",
    options: ["Under $150", "$150–500", "$500–1,500", "$1,500+ for bigger work", "Depends — I decide per project"] },

  // Trust
  { id: "trust", section: "Building trust", prompt: "Which of these are you willing to add to your profile?", helper: "None are required. Each helps clients trust you faster.", type: "multi", min: 0, max: 5,
    options: ["Verify my email + phone", "Verify my ID", "Link my portfolio", "Ask a past client to vouch", "Upload a friendly profile photo"] },

  // Why here
  { id: "why_here", section: "Why you're really here", prompt: "What matters most to you about how this platform works?", type: "single",
    options: [
      "Earn from my creativity today, no waiting",
      "Skip resumes and interviews",
      "Get discovered instantly",
      "Keep the money — no huge platform cut",
      "Flexible, creative work that fits my life",
    ] },
  { id: "connect", section: "Why you're really here", prompt: "Open to becoming a regular for the same clients?", helper: "The best matches turn into ongoing creative relationships.", type: "single",
    options: ["Absolutely — that's the goal", "Sure, when it fits", "One-off projects are fine too", "Not sure yet"] },

  // Human touch
  { id: "bio", section: "Introduce yourself", prompt: "A sentence or two clients will see. Warm > polished.", helper: "Optional. This is how it feels to meet you before they hire you.", type: "text" },
  { id: "value", section: "Introduce yourself", prompt: "One thing you're proud you're great at creating.", helper: "Optional. Might be exactly what someone is hunting for.", type: "text" },
  { id: "portfolio", section: "Introduce yourself", prompt: "Portfolio link (Behance, Dribbble, personal site, IG)?", helper: "Optional but it seriously speeds up matching.", type: "text" },
];
