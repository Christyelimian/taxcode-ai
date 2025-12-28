# Platform + IPS Implementation Plan (TaxCode)

This plan integrates:
- `unified enhance platform.md` (unified public platform + premium tools)
- `personalize.md` (Intelligent Personalization System / IPS)

It is written against what already exists in this repo (Next.js app + Firebase auth/session + Firestore user roles + Prisma knowledge base).

---

## 0) Current State (What We Already Have)

### Public website
- **Homepage**: `src/app/page.tsx` (already contains “ecosystem” positioning and links into dashboard tools).
- **Public pages**: `/about`, `/contact`, `/start-here`, `/focus-areas`, `/insights`, `/news`.
- **Header**: `src/components/site-header.tsx` (static links today).

### App/Dashboard
- **Auth gate**: `middleware.ts` (redirects to `/login` for `/dashboard/*`) + `src/components/protected-layout.tsx` (server-side redirect).
- **Firebase session cookie**: `src/lib/session.ts`.
- **User roles in Firestore**: `src/lib/user-roles.ts`.
- **AI assistant**: `/dashboard/assistant` using `src/components/tax-assistant.tsx`.
- **Calculator**: `/dashboard/calculator` with server calc + optional Puter/OpenRouter explanations.
- **Tools page**: `/dashboard/tools` (shows “coming soon” tools).

### Knowledge Base
- **Prisma schema + pgvector**: `prisma/schema.prisma`.
- **KB APIs**: `src/app/api/knowledge/*`.
- **KB dashboard**: `/dashboard/knowledge-base`.

### Important architectural note
- Identity & auth are **Firebase/Firestore**.
- Knowledge base and semantic search are **Postgres/Prisma**.

IPS should therefore store user personalization in **Firestore** (close to auth), while KB content stays in Postgres.

---

## 1) Target Product Shape (From the Two Docs)

### Navigation / information architecture target
- **Top-level**: Learn / Tools / Academy / Pricing / Community / Help
- **Logged-out**: show all, mark premium with 🔒
- **Logged-in Free**: show all; enforce limits; gentle upgrade prompts
- **Logged-in Pro**: unlock; no 🔒; show Pro badge
- **Enterprise**: additional items (Clients/Team/API), multi-entity switching

### IPS scope (personalization layers)
- Identity & context: role, state, tier
- Tax profile (progressive): income type, VAT status, filing frequency, etc.
- Capability: beginner/intermediate/expert; preferred depth
- Behavioral intelligence: pages/tools used, searches, AI questions
- Sensitive financial (opt-in): salary/turnover/expenses… only inside tools

### Key platform modules to support
- **Education**: tax knowledge center, rights, reforms hub, resources, news
- **Tools**: AI assistant, calculators, compliance dashboard, planning lab, docs
- **Academy**: courses, paths by persona, gamification

---

## 2) Implementation Strategy (How We Make It Work With What Exists)

### Principle: don’t fight the current stack
- Store user personalization (IPS) in **Firestore** alongside roles.
- Keep KB in **Prisma/Postgres**.
- Add a thin “Personalization API” to read/write IPS data and to compute a server-approved “personalization state” for rendering.

### Principle: start with safe personalization
We implement **Level 1 (subtle)** first:
- content/tool recommendations
- “continue where you left off”
- role-aware homepage CTA

Only after that do we enable **Level 2/3**:
- navigation reorder
- AI memory
- compliance dashboard personalization

---

## 3) Data Model (Firestore) — IPS v1

Create/extend Firestore document: `users/{uid}` (already exists).

### 3.1 Canonical schema (v1)
- `role`: existing (`user|admin|moderator`) + add `persona` (IPS role): `individual|business_owner|accountant|student`
- `tier`: `free|pro|enterprise` (default `free`)
- `location`: `{ state?: string, lga?: string }`
- `intent`: `{ primary?: 'learn'|'file'|'plan'|'certify', updatedAt?: timestamp }`
- `capability`: `{ level?: 'beginner'|'intermediate'|'expert', explanationDepth?: 'short'|'balanced'|'deep' }`
- `taxProfile`: `{ incomeType?: 'salary'|'business'|'mixed', vatStatus?: 'registered'|'not_registered'|'unknown', filingFrequency?: 'monthly'|'quarterly'|'annually'|'unknown', industry?: string }`
- `consents`: `{ personalizationLevel?: 1|2|3, sensitiveFinancial?: boolean, aiMemory?: boolean }`

### 3.2 Behavioral tracking (v1)
Store as aggregated counters (cheap + privacy-friendly) + optional events collection:
- `usage`: `{ lastSeenAt, lastPage, pages: { [route]: count }, tools: { [toolId]: count }, aiQuestions: count }`
- Optional: `users/{uid}/events/{eventId}` for audit/debug (can be disabled in production if cost is a concern).

---

## 4) Core System Pieces We Will Add (Code)

### 4.1 Personalization service (server)
- **New**: `src/lib/personalization.ts`
  - `getPersonalizationState(uid)` → merges Firestore profile + computed signals
  - `getNavModel(state)` → returns menu order + locks + highlights
  - `getRecommendations(state)` → returns suggested tools/courses/articles

### 4.2 Personalization API routes
- **New**: `src/app/api/personalization/me/route.ts`
  - `GET`: returns user personalization (sanitized)
  - `PATCH`: updates progressive fields (persona, state, intent, capability)
- **New**: `src/app/api/personalization/event/route.ts`
  - `POST`: record usage event (page view, tool launch, search, AI question)

These routes will verify Firebase session cookie (same pattern as `src/app/api/users/route.ts`).

### 4.3 Client personalization context
- **New**: `src/components/personalization-provider.tsx`
  - fetch `/api/personalization/me`
  - expose `state`, `update()`, `track()`

### 4.4 Navigation system (public + dashboard)
- Update `src/components/site-header.tsx` to use a nav model.
- Evolve the dashboard sidebar in `src/app/dashboard/layout.tsx` to:
  - show Tools/Academy/Compliance groups
  - apply IPS ordering + highlighting
  - show 🔒 and upgrade CTA based on `tier`

### 4.5 Mega Menu system (desktop) + mobile menu
We will implement the mega menu as a **single reusable component** driven by a **typed nav config**.

**Why this matters:** the unified spec has a rich mega menu, and IPS requires reordering/highlighting per persona/tier/intent. A config-driven approach makes personalization deterministic and testable.

**Components**
- **New**: `src/components/mega-menu.tsx`
  - Uses existing UI primitives (likely `src/components/ui/menubar.tsx`, `dropdown-menu.tsx`, and/or `navigation-menu` if present; if not present we’ll stay with existing shadcn primitives already in repo).
  - Handles keyboard navigation, focus trapping, ARIA roles, and “close on escape/outside click”.
- **New**: `src/lib/nav-config.ts`
  - Base menu structure (neutral state)
  - Sections/columns/items metadata: `label`, `href`, `description`, `icon?`, `isPremium?`, `minTier?`, `tags`, `trackId`
- Update `src/components/site-header.tsx`
  - Replace static `<nav>` links with: Learn / Tools / Academy / Pricing / More
  - Each top-level item opens a mega panel on hover/focus (desktop) and on tap (mobile fallback).

**IPS integration**
- `getNavModel(state)` (in `src/lib/personalization.ts`) will transform the base nav config into a **personalized nav model**:
  - reorder columns/items for persona (Individual / Business Owner / Accountant / Student)
  - apply intent-based emphasis (e.g. “file tax” → highlight compliance/tools)
  - apply tier locks (Free shows 🔒; Pro/Enterprise unlock)
  - apply urgency signals (deadlines → “Urgent” badge)

**Behavior tracking hooks**
- Every click in the mega menu calls `track({ type: 'nav_click', trackId })` via the personalization provider.

**Implementation sequencing**
- Phase A: build mega menu with neutral config + locks (no personalization yet).
- Phase E: enable reordering/highlighting from IPS (Level 2+).

---

## 5) Mapping: Spec → Existing Routes/Pages

### Learn (Free)
- Keep existing public hubs:
  - `/start-here`, `/focus-areas`, `/insights`, `/news`
- Add (incrementally) new “Learn” entry points from the unified doc:
  - `/reforms-2026` (Reforms hub)
  - `/tax-types/[slug]` (Tax Types library)
  - `/resources` (downloads/templates/glossary)

### Tools (Premium)
- Existing:
  - `/dashboard/assistant`
  - `/dashboard/calculator`
  - `/dashboard/tools`
- Expand tools list (v1):
  - Compliance checker (basic)
  - Deadline tracker (basic)
  - Document generator (basic templates)

### Academy (Freemium)
- Existing admin-facing “Training Modules” area:
  - `/dashboard/modules`
- Build learner-facing Academy v1:
  - `/academy` (public landing)
  - `/dashboard/academy` (logged-in progress + courses)

### Compliance Dashboard
- Start as a thin page under dashboard:
  - `/dashboard/compliance` (new)
  - show upcoming tasks + reminders

---

## 6) AI Assistant Integration with IPS (Memory + Explainable)

### Goal
Make assistant answers aware of persona/tier/location/intent while remaining safe and explainable.

### Approach
- For every assistant request, append a **small “User Context” block** derived from IPS:
  - persona, state, tier, intent, capability.explanationDepth
- Respect `consents.aiMemory`:
  - if off: context is only current-session
  - if on: store conversation summaries in Firestore (not full raw messages by default)

### What changes
- Update `src/components/tax-assistant.tsx` (and `use-ai-chat.ts` if needed) to:
  - fetch personalization state once
  - include context in prompts
  - show “Why am I seeing this?” chips (explainability)

---

## 7) Phased Delivery Plan (MVP → Pro → Enterprise)

### Phase A — Foundation (IPS Level 1 + navigation baseline)
- Firestore schema extension for user profile (`tier`, `persona`, `location`, etc.)
- Personalization API + provider
- Tracking: page views + tool launches + AI question count
- Public header refactor to Learn/Tools/Academy/Pricing skeleton (no mega menus yet)

### Phase B — Unified IA Pages (Public)
- Add `reforms-2026` hub page (static first)
- Add `resources` page + basic taxonomy
- Add `tax-types` library pages (static MD or KB-backed)

### Phase C — Tools expansion + soft paywalls
- Implement “free limits” for AI assistant (e.g., 5 q/month) in API layer
- Add “Coming Soon” tools as functional MVP:
  - compliance checker (rule-based)
  - deadline tracker (calendar)
  - document templates

### Phase D — Academy v1 + gamification scaffolding
- Courses catalog + progress tracking in Firestore
- Badges/XP counters (simple)
- Personalized learning path by persona

### Phase E — Level 2/3 personalization
- Navigation reorder by persona/intent
- More proactive alerts
- AI memory (opt-in)

### Phase F — Enterprise
- Multi-entity profiles
- Team/clients
- API access boundary + rate limits

---

## 8) Risks / Decisions (Documented)

- **Two data stores** (Firestore for users, Postgres for KB) is OK, but we must define clear boundaries.
- **Subscription billing** is not implemented yet; tier will be a Firestore field first (manual/admin) until billing is introduced.
- **Privacy**: keep behavioral tracking aggregated; sensitive data opt-in only.

---

## 9) Success Criteria (What “working” means)

- A logged-in user can set persona + state, and the platform adapts content/tool recommendations.
- Navigation shows 🔒 items and upgrade prompts for Free; Pro unlocks them.
- AI assistant responses reflect persona + explanation depth and show a short “why” explanation.
- Tracking is working (usage counts update) without breaking page performance.

---

## 10) Next Implementation Steps (Concrete)

1. Add Firestore user profile schema fields + update `ensureUserExists()` to initialize them.
2. Build `/api/personalization/me` + `/api/personalization/event`.
3. Add `PersonalizationProvider` and wire it into `src/app/layout.tsx`.
4. Refactor `SiteHeader` to the unified IA skeleton.
5. Update dashboard sidebar to use personalization state (tier/persona) for ordering + locks.




