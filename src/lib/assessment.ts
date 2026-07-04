// Onboarding — a "Neighbor Profile", not a resume.
// The goal is trust, not gatekeeping. Every question exists to help neighbors
// find each other faster and feel safer showing up.

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
  { id: "intent", section: "You & your neighbors", prompt: "What brings you to Shift Change today?", type: "single",
    helper: "You can always switch later. Most neighbors do both.",
    options: ["I want to earn money today", "I need help today", "A little of both", "Just looking around"] },
  { id: "urgency", section: "You & your neighbors", prompt: "How soon do you need this to happen?", type: "single",
    helper: "So we sort your feed to what actually helps.",
    options: ["Today", "This week", "This month", "No rush — I'm building for later"] },

  // Where you are
  { id: "neighborhood", section: "Where you are", prompt: "What neighborhood or ZIP are you in?", helper: "So we show tasks and neighbors close by.", type: "text" },
  { id: "radius", section: "Where you are", prompt: "How far are you willing to travel?", type: "single",
    options: ["Walking distance", "Within 2 miles", "Within 5 miles", "Anywhere in town"] },
  { id: "transport", section: "Where you are", prompt: "How do you get around?", type: "multi", min: 1, max: 4,
    options: ["Walk", "Bike", "Car", "Public transit"] },

  // Earner side
  { id: "skills", section: "What you can offer", prompt: "What kinds of help are you comfortable offering?", helper: "Pick as many as fit. Everyone has something.", type: "multi", min: 1, max: 12,
    options: [
      "Moving & lifting", "Yard work", "Cleaning", "Dog walking / pet care",
      "Grocery + errands", "Tech help", "Tutoring", "Babysitting",
      "Painting", "Furniture assembly", "Snow removal", "Event setup",
      "Photography", "Music lessons", "Elder companionship", "Delivery",
    ] },
  { id: "physical", section: "What you can offer", prompt: "Comfortable with physical work?", type: "single",
    options: ["Yes, love it", "Sometimes", "Prefer non-physical work", "Not right now"] },
  { id: "availability", section: "What you can offer", prompt: "When are you usually free?", type: "multi", min: 1, max: 5,
    options: ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekends", "On call — text me"] },
  { id: "hours", section: "What you can offer", prompt: "How much time a week are you hoping to earn?", type: "single",
    options: ["A few hours", "5–15 hrs", "15–30 hrs", "As many as I can get"] },
  { id: "pay_speed", section: "What you can offer", prompt: "How fast do you need to get paid?", helper: "We support cash, instant transfer, and same-day payout.", type: "single",
    options: ["Today, cash preferred", "Same day, any method", "Within a couple days is fine", "Doesn't matter"] },

  // Help-needed side
  { id: "help_types", section: "What you might need help with", prompt: "What do you typically need a hand with?", type: "multi", min: 0, max: 10,
    options: [
      "Moving heavy stuff", "Yard & lawn", "House cleaning", "Pet care",
      "Errands & pickup", "Tech setup", "Tutoring / homework", "Childcare",
      "Repairs", "Someone to check on a loved one",
    ] },
  { id: "budget", section: "What you might need help with", prompt: "Comfortable budget for the average task?", type: "single",
    options: ["Under $30", "$30–75", "$75–150", "$150+ when it's a big one", "Depends — I'll decide per task"] },

  // Trust
  { id: "trust", section: "Building trust", prompt: "Which of these are you willing to add to your profile?", helper: "None are required. Each one just helps neighbors trust you faster.", type: "multi", min: 0, max: 5,
    options: ["Verify my phone", "Verify my ID", "Optional background check", "Ask a neighbor to vouch for me", "Upload a friendly profile photo"] },
  { id: "checkin", section: "Building trust", prompt: "Do you want us to send safety check-ins during tasks?", type: "single",
    options: ["Yes — text me during and after", "Only for bigger tasks", "No thanks"] },

  // Community
  { id: "why_here", section: "Why you're really here", prompt: "What matters most to you about how this platform works?", type: "single",
    options: [
      "Earn money today, no waiting",
      "Get help today, no hunting",
      "Keep dollars inside my neighborhood",
      "Meet the people who live around me",
      "Flexible work that fits my life",
    ] },
  { id: "connect", section: "Why you're really here", prompt: "Open to becoming a regular for the same neighbors?", helper: "The best matches turn into ongoing relationships.", type: "single",
    options: ["Absolutely — that's the goal", "Sure, when it fits", "One-off tasks are fine too", "Not sure yet"] },

  // Human touch
  { id: "bio", section: "Introduce yourself", prompt: "A sentence or two your neighbors will see. Warm > polished.", helper: "Optional. This is how it feels to meet you before you meet them.", type: "text" },
  { id: "value", section: "Introduce yourself", prompt: "One thing you're proud you're good at.", helper: "Optional. Might be exactly what someone needs help with.", type: "text" },
];
