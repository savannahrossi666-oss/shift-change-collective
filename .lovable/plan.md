
# Shift Change → Instant Local Help & Earning Marketplace

This is a full identity pivot, not a copy tweak. The current site is an AI-era opportunity discovery feed (fellowships, AI training, remote roles). You want a community-powered, hyper-local, same-day marketplace where one neighbor needs money and another needs help — connected instantly.

Keeping the visual language you like (black luxury, glassmorphism, cinematic hero video, editorial sections, logo.png), but replacing the *meaning* of every page.

## New product model

Two sides, one platform:
- **Earners** — open the app, see nearby tasks, accept, complete, get paid same-day.
- **Neighbors needing help** — post a task, get matched with trusted local people in minutes.

Core data unit becomes a **Task** (was: Opportunity), with fields: title, category, pay, duration, distance, posted-time, poster, trust badges, description.

Categories seeded from your list: Moving, Yard Work, Dog Walking, Cleaning, Grocery Pickup, Tech Help, Tutoring, Babysitting, Painting, Furniture Assembly, Snow Removal, Event Setup, Photography, Music Lessons, Computer Repair, House Sitting, Elder Assistance, Organization, Car Washing, Delivery, Seasonal Work.

## Page-by-page rewrite

**Home (`/`)**
- Hero keeps the video + logo, but swaps taglines to a dual-question hero:
  - "Need money today?" / "Need help today?" — two glass CTAs: **Find Work Now** and **Post a Task**
  - Sub: "Real people helping real people. Paid same day. Right in your neighborhood."
- Manifesto marquee: Fast · Simple · Human · Local · Same-Day Pay · Neighbors Helping Neighbors …
- Three editorial sections rewritten:
  - **01 — Earn Today** (was Discover): open app → accept nearby task → get paid.
  - **02 — Get Help Today** (was Create): post task → trusted neighbor shows up → done in hours.
  - **03 — Keep It Local** (was Earn): every task strengthens your local economy.
- New "How it works" 3-step strip (Post / Match / Paid).
- Category grid: 12–16 of the task types above as tappable chips.
- "Nearby right now" — sample task cards (mock data) with distance + pay + posted time.
- Trust section: identity check, skills verified, ratings, background checks — framed as *"tools that help neighbors trust neighbors"*, not gatekeeping.
- Testimonials as short neighbor stories.
- FAQ rewritten around speed, payment, safety, local.
- Final CTA: "Your neighborhood is hiring. And helping."

**Assessment (`/assessment`)**
- Repurposed from "Opportunity Profile" to **Neighbor Profile** onboarding.
- Branching: first question — *"Are you here to earn, to get help, or both?"*
- Earner path: skills you have, categories you'll do, availability, radius, transportation, physical work OK?
- Helper path: what you typically need help with, household context, budget comfort.
- Both: ZIP/neighborhood, intro blurb, trust steps (ID, phone, optional background check) — each explained as *"so your neighbors know they can trust you."*
- Result screen: "Welcome to the neighborhood" + archetype (e.g. *Handy Helper*, *Everyday Earner*, *Busy Household*, *Community Connector*) + next step CTA.

**Dashboard (`/dashboard`)**
- Two-mode toggle: **Earn** / **Get Help**.
- Earn mode: "Tasks near you right now" feed, sorted by distance/pay/time; today's earnings; streak; saved tasks.
- Help mode: your open posts, matched neighbors, active tasks, past helpers.
- Quick actions: *Find Work Now*, *Post a Task*, *Invite a Neighbor*.

**Opportunities → Tasks (`/opportunities`, `/opportunities/$id`)**
- Rename in copy to "Tasks" (keep routes to avoid churn; add title/description swap). Optional: add `/tasks` as an alias later.
- List page: search + filters for category, distance, pay, duration, same-day-only.
- Detail page: task, poster card with trust badges, ETA, "Accept & Earn $X" CTA, related nearby tasks.

**Community (`/community`)** — neighbor stories, local heroes, community impact stats ($ kept in-neighborhood).

**Resources (`/resources`)** — practical guides: getting your first task, pricing your time, safety tips, tax basics, growing repeat clients.

**About / Contact / FAQ / Privacy / Terms / Profile** — rewrite copy to the new mission. Profile emphasizes trust badges + neighborhood.

**Nav & Footer** — new primary items: *Find Work* · *Post a Task* · *How It Works* · *Community*. CTA in nav becomes **Post a Task** (secondary: **Find Work**).

## Data changes

- `src/lib/opportunities.ts` → replace seed with ~24 local task samples across the category list (title, category, pay, duration, distance, postedAgo, poster name/initials, trust badges). Keep the exported type name working via alias so existing imports don't break, or rename type to `Task` and update imports.
- `src/lib/assessment.ts` → replace 18 AI-career questions with the neighbor onboarding flow above; new archetype computation.
- `src/lib/store.ts` → keep shape; rename semantic fields where obvious (saved tasks, posted tasks). No backend added.

## Design (unchanged aesthetic, new symbols)

- Keep black + white + glass + logo.png + hero video.
- Add small emoji-free line icons per category (lucide: Truck, Leaf, Dog, Sparkles, ShoppingBag, Laptop, GraduationCap, Baby, PaintRoller, Wrench, Snowflake, PartyPopper, Camera, Music, Home, HeartHandshake, Boxes, Car, Package, Sun).
- New reusable components: `TaskCard`, `CategoryChip`, `TrustBadges`, `HowItWorks`, `DualHero` block.
- No new imagery generated unless you want it — reuse existing three AI artworks for the editorial sections (retitled), or I can generate warm community photography-style stills if you prefer.

## Out of scope for this pass
- Real geolocation, real payments, real matching engine, real chat. All mock/local-state, same as today.
- Backend/Cloud — none added.
- Native mobile.

## Approvals I need before building
1. **Confirm the pivot**: this replaces the AI-opportunities positioning entirely (not an added section). Yes?
2. **Imagery**: reuse the 3 existing AI artworks retitled, or generate new community-style visuals?
3. **Routes**: keep `/opportunities` URL and just relabel to "Tasks" in UI, or add `/tasks` as the new canonical path with a redirect?

Reply with answers (or "go" for: yes pivot / reuse existing art / keep `/opportunities` URL) and I'll build it in one pass.
