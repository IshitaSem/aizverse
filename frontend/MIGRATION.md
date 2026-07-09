# AIZVerse — Figma Frontend Integration

This document records the analysis and decisions made while integrating the Figma-AI-generated
frontend into the existing AIZVerse backend. Read this before extending the app further.

## 1. What existed before this change

**Backend** (`aizverse/backend`, untouched except one additive feature — see §4):
Express + TypeScript, 3 feature routers behind JWT auth:
- `POST /api/v1/assistant/chat`
- `POST /api/v1/navigation/route`
- `GET /api/v1/crowd/summary` (staff/security/organizer only)

No route existed to actually *issue* a JWT — `requireAuth` had nothing to authenticate against.

**Figma export** (the uploaded zip): a Vite + React 18 SPA, **not** Next.js. Everything —
13 "pages," all shared UI, all animation variants, all mock data — lived in one 2,765-line
`App.tsx`. Routing was a local `useState<Page>` switch inside `<AnimatePresence>`, not
`react-router` (that package was listed in `package.json` but never imported). Every one of the
48 shadcn/ui components under `components/ui/` and `components/figma/ImageWithFallback.tsx` was
**dead code** — zero imports anywhere in `App.tsx`. Login was a `setTimeout`; the AI chat reply
was a `setTimeout`; every chart/table/list was a hardcoded array at the top of the file.

## 2. Architectural decision: replace the old Next.js scaffold, don't merge into it

An earlier pass on this project produced a Next.js App Router frontend. Next.js's server-rendered
routing is fundamentally incompatible with this export's client-only `page` state machine and
its `AnimatePresence` page-transition choreography — forcing a merge would have meant rewriting
the transitions and risking exactly what the brief said not to break ("match the Figma UI
exactly," "keep the animations"). The Figma Vite app is now the frontend; the Next.js scaffold
is no longer part of the active project.

## 3. Restructuring the monolith

The single `App.tsx` was mechanically split along its own section banners (`// ─── SIDEBAR ───`
etc.) into a feature-based structure — the same markup and logic, just organized:

```
src/
├── app/App.tsx              # thin root: AuthProvider + page-state router only
├── types.ts                 # Page type
├── data/mockData.ts         # all remaining mock arrays, clearly labeled
├── shared/                  # ChartGradients, GlobalStyles, animations, AnimatedBackground,
│                             # primitives (Badge/KpiCard/GlassCard/PremiumButton/...), layout
│                             # (Sidebar/TopNav/AppLayout)
├── pages/                   # one file per page, 13 total
├── lib/api/client.ts        # fetch wrapper (mirrors the backend's contract)
├── lib/auth/AuthContext.tsx # real auth state
└── features/                # per-feature hooks for the 3 wired pages
```

`components/ui/` (48 unused shadcn files) and `components/figma/ImageWithFallback.tsx` were
**not** carried over — they were confirmed unused (zero imports anywhere) and would only have
added unbuilt surface area and unused dependencies. Every dependency they alone required
(`@radix-ui/*`, `cmdk`, `vaul`, `embla-carousel-react`, `react-day-picker`, `date-fns`,
`class-variance-authority`, `input-otp`, `react-resizable-panels`, `sonner`, `tw-animate-css`,
`next-themes`) was pruned from `package.json`, along with dependencies that were unused
*anywhere* in the codebase, including inside the dead `ui/` folder (`@mui/*`, `@emotion/*`,
`@popperjs/core`, `react-popper`, `react-router`, `react-dnd*`, `react-slick`,
`react-responsive-masonry`, `canvas-confetti`). `react`, `react-dom`, and the TypeScript toolchain
were **added** — the original export only listed React as an optional peer dependency and
shipped no `tsconfig.json` at all, which would have failed both type-checking and most editor
tooling.

## 4. Backend change (the one addition)

`POST /api/v1/auth/login` and `POST /api/v1/auth/register` were added, plus a `User` Mongoose
model. This was necessary, not optional — there was no way to "preserve the authentication flow"
against a real backend when no endpoint could issue a token. Everything else in the backend is
untouched; `app.ts` gained exactly two new lines (an import and an `app.use`) to mount the new
router.

## 5. What's actually wired to real data, and what isn't

| Page | Status | Detail |
|---|---|---|
| **Login** | ✅ Real | `AuthContext.loginOrRegister` calls `/auth/login`, falls back to `/auth/register` with the selected role only on a brand-new account (see the comment in `AuthContext.tsx`). Post-login routing uses the account's *actual* stored role, not necessarily whatever the picker had selected. JWT persists in `localStorage`; the app restores the session on refresh and route-guards every non-public page. |
| **AI Stadium Assistant** (`AIChatPage`) | ✅ Real | `useAssistantChat` calls `/assistant/chat` with rolling 20-turn history, matching the backend's cap exactly. The mock seed trimmed down to just the assistant's greeting — the two fake pre-filled conversation turns from the original export were removed, since seeding fake prior messages once the chat is real would be misleading. |
| **Stadium Map** (`StadiumMapPage`) | ✅ Partially real | The five "Navigate to" quick links now call `/navigation/route` and show the AI-generated route summary in a new panel. The six schematic zone-density buttons (A–F) are **still mock** — there's no defined mapping from those visual zone IDs to the backend's `zoneId` scheme, and inventing one wasn't in scope. Flagged with a `TODO(API)` comment at the exact spot. |
| **Crowd Analytics** (`CrowdAnalyticsPage`) | ✅ Partially real | Added a new "AI Operational Summary" panel wired entirely to `GET /api/v1/crowd/summary` (density per zone, AI text summary, risk-zone flags). The three original charts (attendance flow, transport modal split, gate queue analysis) are **still mock** — their data shapes (time series, pie, queue-by-gate) don't correspond to anything the crowd endpoint returns, and forcing a fake mapping would show real-looking numbers next to fabricated structure. Flagged with a `TODO(API)` comment. |
| Fan / Organizer / Volunteer / Security dashboards, Accessibility, Transport, Sustainability, Emergency, Landing | ⬜ Still mock | No corresponding backend endpoints exist today. Left exactly as the Figma export generated them — not silently faked. |

## 6. Verification performed (no network access was available to actually run `npm install`)

- **Bracket/comment-balance sweep** across every generated `.ts`/`.tsx` file (backend and
  frontend) — confirms no stray/mismatched braces from the mechanical extraction.
- **Import/export cross-reference** — every relative and `@/`-aliased import in every file was
  checked against the real exports of its target file. Zero unresolved imports.
- Manually re-read every page that was edited by hand (Login, AIChat, StadiumMap,
  CrowdAnalytics, layout) end to end for prop/type consistency.

This is static verification, not a live build. Run `npm install && npm run dev` (frontend) and
`npm install && npm run dev` (backend) locally and report anything that surfaces — the usual
gap with static checks is a transitive type mismatch that only appears once real `node_modules`
are resolved.

## 7. Next steps if you want more pages wired

Follow the pattern in `src/features/*/use*.ts`: one hook per backend endpoint, injected via
`useAuth()` for the token, typed to match the backend's Zod schema exactly. Adding a backend
endpoint for e.g. Volunteer tasks or Security incidents is a new `features/<name>/` module on the
backend (see the backend's own README) — nothing about this frontend restructuring makes that
harder than it already was.
