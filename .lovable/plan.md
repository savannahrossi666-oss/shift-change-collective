
# Shift Change — Backend & Marketplace Foundations

Big scope, so I'll stage it in four phases and ship them in order. Each phase leaves the app fully working before the next begins.

## Phase 1 — Accounts (Lovable Cloud + Auth)

- Enable Lovable Cloud (Postgres + Auth).
- Email/password sign-in + Google sign-in (defaults).
- Route structure:
  - `/auth` — public sign-in / sign-up card, preserves `?redirect=` param.
  - `_authenticated/` layout gate (integration-managed) for anything user-scoped.
- Tables:
  - `profiles` (id → auth.users, display_name, avatar_url, bio, city, created_at) with auto-insert trigger on signup.
  - `user_roles` + `app_role` enum + `has_role()` security-definer (for future admin/moderation).
- Header shows account menu / Sign out when signed in; "Sign in" CTA when not.
- Migrate current localStorage saved-shifts + applications to a `saved_shifts` table keyed by `user_id` (kept simple; existing UI keeps working).

## Phase 2 — Real Shifts (post + claim)

- `shifts` table:
  - id, poster_id, title, description, category, city, location_text, pay_cents, urgency (`now`/`today`/`this_week`), duration_minutes, status (`open`/`claimed`/`in_progress`/`completed`/`cancelled`), claimed_by, claimed_at, completed_at, created_at.
- RLS:
  - anon + authenticated can SELECT open shifts (public catalog).
  - poster can SELECT/UPDATE/DELETE own shifts.
  - claimer can SELECT their claimed shifts.
- `/post` stepper writes to `shifts` via `createServerFn` (authenticated). Redirects to the shift detail page on success.
- `/available` + home feeds read live `shifts` (server publishable client for anon reads, narrow `TO anon` SELECT policy on `status = 'open'`).
- `/shifts/$id` detail page with a **Claim** button:
  - Authenticated `createServerFn` that atomically flips `status open → claimed` and sets `claimed_by = auth.uid()` in a single `UPDATE ... WHERE status='open'` (race-safe).
  - After claim, both poster and claimer see it in their dashboards.
- Dashboard split into **Posted** and **Claimed** tabs backed by real data.

## Phase 3 — Payments (Stripe Connect, escrow-style)

- Enable Lovable's Stripe integration.
- Helpers onboard as Stripe **Connect Express** accounts (stored on `profiles.stripe_account_id`).
- Post-a-shift flow captures a **PaymentIntent** with `capture_method: manual` at claim time (funds held, not charged). Helper sees "Payment Verified".
- On completion (poster taps "Mark complete"): capture the PaymentIntent, transfer 100% to helper's connected account. Platform charges $0 commission.
- "Strong Signal" boosts ($2.99 / $5.99) = standard one-off Stripe Checkout on the poster, not tied to helper payout. Adds `boost_tier` + `boost_expires_at` on the shift and bumps ranking in feeds.
- Optional tip after completion → additional transfer to helper.
- Webhook route at `/api/public/webhooks/stripe` verifies signature, updates `payments` table.

## Phase 4 — Messaging

- `conversations` (shift_id, poster_id, claimer_id, unique per shift) + `messages` (conversation_id, sender_id, body, created_at).
- Conversation auto-created when a shift is claimed.
- RLS: only the two participants can read/write.
- Realtime via Supabase channel subscription on `messages` for the open conversation.
- Simple thread UI at `/messages` (list) and `/messages/$conversationId` (thread).

## Technical notes

- All writes go through `createServerFn` + `requireSupabaseAuth`; RLS is the source of truth.
- Public reads (opportunity catalog, shift detail for anon) go through a server publishable client with narrow `TO anon` SELECT policies — never the service-role client.
- No service-role usage outside verified Stripe webhooks.
- Existing localStorage code stays as a thin fallback for unauthenticated visitors browsing the catalog; anything that mutates requires sign-in.
- Shipping order in-thread: **Phase 1 → 2** first (accounts + real shifts working end-to-end), then I'll check in before wiring Stripe Connect and messaging so you can confirm the payment split model and messaging scope.

Ready to start with Phase 1?
