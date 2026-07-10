
# Shift Change MVP — "Shifts" Marketplace Pivot

Keep the current black/glass aesthetic, logo, video, AI artwork, Craft Assessments, and route structure. Rewrite data model + copy so everything speaks "Shifts," and add the two core flows: **Post a Shift** and **Claim a Shift**.

## Language changes (site-wide)
- Job / Task / Opportunity / Gig → **Shift**
- Post a Task / Post a Gig → **Post a Shift**
- Apply / Accept → **Claim**
- Worker / Freelancer → **Shifter**
- Client / Poster → **Requester**

## Data model (src/lib/opportunities.ts → shifts.ts)
Extend the `Opportunity` type to a `Shift`:
- `title, description, pay (number + type: fixed|hourly), location {city, lat?, lng?, distanceMi?}`
- `startAt (ISO, defaults to today), duration`
- `photos: string[]`
- `status: 'open' | 'claimed' | 'in_progress' | 'complete'`
- `claimedBy?: shifterId`
- `requester: { id, name, rating, verified }`
- `category` (keep existing creative + add practical: Help Moving, Delivery, Cleaning, Handywork, Photography, Tutoring, Event Help, etc.)
- `urgency: 'now' | 'today' | 'this_week'`

Seed ~20 realistic same-day shifts across categories, mixed urgency.

## New / rewritten routes

**`/` (home)** — keep hero, replace section 03 CTAs and add a live feed strip:
- 🔥 Shifts happening today
- 🟢 Shifters available now
- 📍 Nearby shifts
- 💰 Highest-paying shifts today
  Each is a horizontal-scroll rail of cards, glass style.

**`/post`** (new) — "Post a Shift in 60 seconds"
- Stepper form: Title → Description → Pay → Location → Date/Time (default Today) → Photos (optional) → Review → Publish
- Client-side validation w/ zod, saves to store, redirects to `/shifts/$id`.

**`/shifts`** (rename of `/opportunities` route file kept for links; add new `/shifts.tsx` and redirect old)
- Filters: category, urgency (Now/Today/This week), max distance, min pay, sort
- Search + card grid, "Claim" button on each card.

**`/shifts/$id`** — detail with Claim CTA, requester profile card, message button (stub), photos gallery.

**`/available`** (new) — "I Want to Work"
- Toggle: **Available Now** (persisted in store)
- Travel distance slider
- Skills multi-select
- Live list of matching nearby shifts

**`/dashboard`** — split into two tabs: **Earn** (claimed shifts, available toggle, nearby feed) and **Requests** (posted shifts, status pipeline).

## New components
- `ShiftCard` (replaces OpportunityCard, adds urgency chip, pay badge, distance, Claim button)
- `AvailableNowToggle`
- `LiveFeedRail` (horizontal-scroll section)
- `PostShiftStepper`
- `UrgencyBadge` (Now = pulsing green, Today = amber, This week = muted)

## Store additions (src/lib/store.ts)
- `availableNow: boolean`, `travelDistance: number`, `skills: string[]`
- `postedShifts: Shift[]`, `claimedShifts: string[]`
- Actions: `postShift`, `claimShift`, `toggleAvailable`

## Trust & safety surfaces (design only, no backend)
- Verified checkmark on requester/shifter cards
- Star ratings on profile + shift detail
- "Secure payment held in escrow" badge on detail page
- Message button (opens stub modal)

## Preserved
- Craft Assessments system — badges now render on Shifter profile & detail
- Existing logo, hero video, AI artwork, glass aesthetic, animations
- Route files kept where possible; `/opportunities` becomes an alias/redirect to `/shifts`

## Out of scope for this pass
- Real geolocation / live map (design placeholder card)
- Push notifications (in-app toast only)
- Payments implementation (visual escrow only)
- Realtime backend (all state client-side via store)

Ready to build on approval.
