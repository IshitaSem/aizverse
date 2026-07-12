# AIZVerse

**AI-powered Smart Stadium & Tournament Operations platform for FIFA World Cup 2026**

> Built for Hack2Skill Challenge 4: *Smart Stadiums & Tournament Operations*. This README
> describes exactly what is implemented today — no aspirational features, no claims the code
> doesn't back up. See [Scope of this build](#scope-of-this-build) for what's real vs. planned.

---

## Table of contents

- [Problem statement](#problem-statement)
- [Solution](#solution)
- [Scope of this build](#scope-of-this-build)
- [Architecture](#architecture)
- [AI architecture: narrate, don't hallucinate](#ai-architecture-narrate-dont-hallucinate)
- [Features](#features)
- [Technology stack](#technology-stack)
- [Folder structure](#folder-structure)
- [Installation](#installation)
- [Configuration / environment variables](#configuration--environment-variables)
- [Running locally](#running-locally)
- [Testing](#testing)
- [Security](#security)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Deployment](#deployment)
- [Scalability](#scalability)
- [Future scope](#future-scope)
- [License](#license)

---

## Problem statement

Stadiums running a tournament at FIFA World Cup 2026 scale face simultaneous, acute operational
challenges: fans get lost or can't find accessible routes, crowds bottleneck at gates and
concourses, and organizers need a real-time, human-readable view of what's happening across the
venue to make fast decisions. Generative AI can turn raw operational data into clear guidance and
insight — but only if it stays grounded in real data instead of inventing plausible-sounding
numbers, which is a genuine safety concern for a system fans and staff will rely on live.

## Solution

AIZVerse addresses this with three features that share one architectural principle — **the AI
narrates deterministic data; it never generates the data itself**:

1. **AI Stadium Assistant** — conversational Q&A for fan questions (gates, seating, restrooms,
   food queues, accessible routes).
2. **AI Navigation** — routing (fastest / accessible / least-crowded) with an AI-generated
   plain-language walking summary of a deterministically-computed path.
3. **AI Crowd Intelligence** — real-time zone-density monitoring with an AI-generated operational
   summary and risk-zone flags, surfaced on both the primary Organizer Dashboard and a dedicated
   Crowd Analytics view — the same live endpoint, reused rather than duplicated.

## Scope of this build

Being direct about this because overclaiming costs more credibility than it gains: this build
implements the **Smart Stadium Operations** side of the challenge in depth (crowd monitoring,
navigation, AI-assisted decision support) plus a role-based multi-user platform (fan / organizer /
volunteer / security) with real authentication. It does **not** implement **Tournament
Operations** in the sense of match scheduling, team/venue management, or tournament progress
tracking — there's no data model for matches, teams, or venues in this codebase. Extending into
that domain is real, substantial net-new work (new backend models, new CRUD routes, new UI) and
is listed honestly under [Future scope](#future-scope) rather than stubbed out here.

## Architecture

```
┌──────────────────────────┐        ┌───────────────────────────┐
│   Vite + React 18 SPA     │  HTTP  │   Express API              │
│   (feature-based)         │◄──────►│   (feature-based)          │
│                           │  JSON  │                             │
│  src/pages/                │        │  src/features/               │
│   AIChatPage               │        │   stadium-assistant/          │
│   StadiumMapPage           │        │   navigation/                  │
│   OrganizerDashboard   ────┼───┐    │   crowd-intelligence/           │
│   CrowdAnalyticsPage   ────┼───┤    │   auth/                          │
│   ...9 more pages          │   │    │        │                          │
└──────────────────────────┘   │    │        ▼                          │
        both dashboards         │    │  lib/ai/provider.interface        │  ← every feature
        share ONE hook ─────────┘    │        ▲                          │    depends on this
        (useCrowdData)                │        │                          │    interface only
                                       │  lib/ai/providers/                │
                                       │   gemini.provider.ts              │  ← swap point
                                       └───────────────────────────────┘
                                                   │
                                           ┌───────▼────────┐
                                           │  MongoDB Atlas  │
                                           └────────────────┘
```

Both frontend and backend use a **feature-based folder structure**: each feature owns its schema
(Zod), service (business logic + AI call), controller/hook, and components/routes. The frontend
is a client-routed single-page app (page transitions via `framer-motion`/`AnimatePresence`, not a
server-rendered router) — pages past the public landing/login screens are code-split with
`React.lazy` so a first-time visitor's initial bundle only includes the two public pages.

## Challenge 4 objective mapping

Challenge 4 ("Smart Stadiums & Tournament Operations") names eight objectives a GenAI solution
should improve. Here's exactly which are implemented, partially implemented, or planned — not
claimed until they're real:

| Challenge objective | Status | Implementation |
|---|---|---|
| Navigation | ✅ Implemented | `StadiumMapPage` → deterministic routing + AI-narrated walking directions; zone density overlay uses real Crowd Intelligence data when available |
| Crowd Management | ✅ Implemented | `useCrowdData` → real-time zone density + AI operational summary, shown on both Operations Center and Crowd Intelligence. `npm run seed:crowd` populates demo data |
| Operational Intelligence | ✅ Implemented | Same crowd-intelligence pipeline, framed for organizer/security decision-making |
| Real-time Decision Support | ✅ Implemented | Risk-zone flags + AI-suggested actions (e.g. "open Gate D as overflow"), refreshed every 30s |
| Accessibility | ⬜ UI only | `AccessibilityPage` exists with WCAG-oriented copy; not yet backed by a dedicated accessibility API |
| Transportation | ⬜ UI only | `TransportPage` exists; not yet backed by a live transit/parking API |
| Sustainability | ⬜ UI only | `SustainabilityPage` exists; not yet backed by real carbon/waste data |
| Multilingual Assistance | ✅ Implemented | The language selector on the AI Stadium Assistant sends the selected language (en/es/fr/ar/hi/pt) through to Gemini, which is instructed to always respond in it |

## AI architecture: narrate, don't hallucinate

Every AI feature follows the same contract:

```ts
export interface AiProvider {
  readonly name: string;
  generate(messages: AiMessage[], options?: GenerateOptions): Promise<AiGenerationResult>;
}
```

`GeminiProvider` is the only implementation today; swapping in OpenAI/Groq/Claude later is
"implement `AiProvider` in one new file, add one case to `ai.factory.ts`" — no feature code
changes. More importantly for a system operators will rely on live:

- **Route geometry** (steps, distances, landmarks) is computed by a deterministic pathfinding
  function. The AI only turns that into a clear sentence — `navigation.service.test.ts` asserts
  every distance the AI is shown in its prompt exists in the computed route, i.e. the AI cannot
  introduce a distance that isn't real.
- **Crowd density numbers** come from MongoDB, not the model. The AI is explicitly instructed to
  never invent data not present in the input, and only summarizes/recommends actions from real
  readings.

Why this matters for the "hallucination" concern specifically: an LLM confidently inventing a
gate number, a queue time, or a "safe" evacuation direction is a safety issue at stadium scale,
not a cosmetic bug. Grounding the model in real computed/stored data and testing that grounding
is the actual mitigation — not a disclaimer in the UI.

## Features

| Feature | Status | Where it lives |
|---|---|---|
| AI Stadium Assistant | ✅ Real, tested | `AIChatPage` → `POST /api/v1/assistant/chat` |
| AI Navigation | ✅ Real, tested | `StadiumMapPage` → `POST /api/v1/navigation/route` |
| AI Crowd Intelligence | ✅ Real, tested | `OrganizerDashboard` + `CrowdAnalyticsPage` → `GET /api/v1/crowd/summary` (same hook, two integration points) |
| Authentication (register/login, JWT, role-based access) | ✅ Real, tested | `LoginPage` → `POST /api/v1/auth/login` \| `/register` |
| Fan / Volunteer / Security dashboards, Accessibility, Transport, Sustainability, Emergency pages | ⬜ UI scaffolded, no backend yet | `src/pages/*` |
| Tournament operations (matches, teams, venues) | ⬜ Not implemented | See [Future scope](#future-scope) |

## Technology stack

**Frontend:** Vite, React 18, TypeScript, Tailwind CSS v4, `framer-motion`, Recharts,
`React.lazy`/`Suspense` code splitting, Vitest + React Testing Library.

**Backend:** Node.js, Express, TypeScript, MongoDB Atlas + Mongoose, JWT auth (bcrypt-hashed
passwords), Zod validation, Helmet, `express-rate-limit`, Pino structured logging, Vitest +
Supertest.

**AI:** Google Gemini (`@google/generative-ai`) via a swappable provider interface.

## Folder structure

```
AIZVerse/
├── backend/
│   └── src/
│       ├── config/            # env validation (fail-fast, no weak-secret fallback), db, logger
│       ├── lib/ai/            # AiProvider interface, Gemini adapter, factory
│       ├── middleware/        # auth, validate, rate limit, error handler
│       ├── models/            # User, CrowdReading (Mongoose)
│       ├── features/
│       │   ├── auth/
│       │   ├── stadium-assistant/
│       │   ├── navigation/
│       │   └── crowd-intelligence/
│       └── __tests__/
└── frontend/
    ├── src/
    │   ├── app/App.tsx        # thin root: AuthProvider + lazy-loaded page router
    │   ├── pages/              # 13 pages, one file each
    │   ├── shared/              # layout, animations, design-system primitives
    │   ├── features/             # per-feature hooks (useAssistantChat, useRoute, useCrowdData)
    │   │   └── */__tests__/
    │   └── lib/{api,auth}/
    └── MIGRATION.md            # history: why this replaced an earlier Next.js scaffold
```

## Installation

Requires Node.js 20+, npm, and a MongoDB Atlas connection string.

```bash
git clone <your-fork-url> AIZVerse
cd AIZVerse
cd backend && npm install
cd ../frontend && npm install
```

## Configuration / environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

| Variable | Where | Required | Notes |
|---|---|---|---|
| `JWT_SECRET` | backend | **Always** | ≥32 characters, in every environment — not just production. Generate with `openssl rand -base64 32`. The app refuses to boot with a missing, short, or placeholder-looking value. |
| `MONGODB_URI` | backend | Production | Optional in development (routes needing it return an error rather than crashing at boot). |
| `GEMINI_API_KEY` | backend | Production | Optional in development (AI routes return a graceful fallback message instead of crashing). |
| `CLIENT_ORIGIN` | backend | Yes | CORS is locked to exactly this origin. |
| `VITE_API_BASE_URL` | frontend | Yes | Backend API base URL. |

## Running locally

```bash
# Terminal 1 — API
cd backend && npm run dev        # http://localhost:4000

# Once, to populate demo crowd data (Organizer Dashboard / Crowd Intelligence
# will 404 with an empty MongoDB collection otherwise):
cd backend && npm run seed:crowd

# Terminal 2 — Web app
cd frontend && npm run dev        # http://localhost:3000
```

## Testing

```bash
cd backend && npm test            # Vitest: unit + Supertest integration tests
cd frontend && npm test           # Vitest + React Testing Library
```

Backend tests inject a fake `AiProvider`, so they run with no network calls and no API key.
Frontend tests mock the API client the same way. Both suites cover the actually-shipped code —
every test targets a file under `src/`, not scaffolding that isn't part of the running app.

What's covered: service-layer prompt construction and error propagation, the "AI never invents
data" guarantee, auth middleware rejection paths, no-stack-trace-leak-on-error, the
login-or-register fallback logic (and that it only triggers on a 401, not any error), optimistic
UI updates, loading/error states, and the 30-second crowd-data polling behavior.

## Security

- **Input validation** — every request body/query goes through a Zod schema before reaching a
  controller.
- **AuthN/Z** — JWT bearer auth plus role-based authorization; the crowd-intelligence endpoint is
  restricted to staff/security/organizer roles.
- **JWT_SECRET is a hard requirement in every environment** — there is no hardcoded fallback
  secret anywhere in the codebase. A missing, short (<32 char), or placeholder-looking secret
  fails startup immediately with a clear error, regardless of `NODE_ENV`.
- **Rate limiting** — a global floor plus a stricter budget on AI-backed routes specifically.
- **Headers/CORS** — Helmet; CORS locked to a single configured origin, not `*`.
- **Secrets** — all config through validated env vars; `.env` is gitignored everywhere it exists,
  `.env.example` ships placeholders only.
- **No unsafe HTML** — no `dangerouslySetInnerHTML` anywhere in the frontend.
- **Error handling** — centralized handler that never leaks stack traces to clients in production.

## Accessibility

- Skip-to-content link and a `<main>` landmark on every authenticated page (`AppLayout`).
- The chat conversation is an `aria-live="polite"` log — new assistant replies are announced,
  not just visually appended.
- The chat input, voice button, and send button all have explicit `aria-label`s (a placeholder
  alone is not a substitute for a label).
- The stadium map's zone buttons expose their density via `aria-label` and reflect selection
  state via `aria-pressed`, not color alone.
- Visible focus rings (`focus-visible:outline`) tuned for contrast against the dark theme.

This is an honest partial pass, not a full WCAG AA audit — the 9 pages without a wired backend
also don't yet have full accessibility semantics. Extending this pattern (skip links, live
regions, labeled controls) to those pages is straightforward follow-up work, not a redesign.

## Performance

- Pages beyond landing/login are `React.lazy`-loaded — Vite code-splits each into its own chunk,
  so the initial bundle doesn't include all 13 pages.
- The active page is rendered via a plain `switch`, not by constructing all 13 page elements on
  every render.
- Crowd data polls on a 30-second interval (not on every render or user action) and is shared via
  one hook across both dashboards that display it, rather than two independent fetch loops.
- Backend: a single indexed aggregate query per crowd-summary request
  (`{ stadiumId: 1, recordedAt: -1 }`), stateless JWT auth (no server-side session store).

## Deployment

- **Frontend** → Vercel or any static host (`npm run build` outputs to `dist/`).
- **Backend** → Railway, Render, or any Node host (`npm run build && npm start`).
- **Database** → MongoDB Atlas, network-access-restricted in production.

## Scalability

Stateless API (horizontally scalable behind a load balancer), JWT auth (no sticky sessions
required), one compound index on the actual hot query path. No caching layer or job queue yet —
not required at the current feature scope, called out here rather than silently omitted.

## Future scope

- **Tournament Operations** (match scheduling, team/venue management, tournament progress
  tracking) — genuinely new domain, needs new Mongoose models and CRUD routes before any UI
  should claim to support it.
- **Multilingual Assistant** — the assistant's request schema already carries a `language` field
  end-to-end; remaining work is a translation-specific flow for announcements.
- **Accessibility Assistant, Transportation Assistant, Sustainability Assistant, Volunteer
  Copilot, Emergency Decision Support** — each follows the same
  `features/<name>/{schema,service,controller,routes}` pattern already established; none require
  changes to the AI abstraction, auth, or validation layers already in place.

## License

MIT — see `LICENSE`.
