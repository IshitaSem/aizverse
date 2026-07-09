# AIZVerse

**AI-powered Stadium Intelligence Platform for FIFA World Cup 2026**

> Built for the Hack2Skill Challenge. This repository contains a deep, production-quality
> implementation of three core features — chosen deliberately over a shallow pass at all
> eleven briefed features — plus the shared architecture (AI abstraction, auth, validation,
> testing) that the remaining features would plug into.

---

## Table of contents

- [Project overview](#project-overview)
- [Problem statement](#problem-statement)
- [Solution](#solution)
- [Scope of this build](#scope-of-this-build)
- [Architecture](#architecture)
- [Features](#features)
- [Technology stack](#technology-stack)
- [Folder structure](#folder-structure)
- [Installation](#installation)
- [Configuration / environment variables](#configuration--environment-variables)
- [Running locally](#running-locally)
- [Testing](#testing)
- [Security](#security)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Future scope](#future-scope)
- [License](#license)

---

## Project overview

AIZVerse is a GenAI-enabled stadium operations platform for fans, staff, security, volunteers,
and organizers at FIFA World Cup 2026 venues. It pairs a deterministic backend (routing logic,
crowd data) with a swappable generative-AI layer that **narrates and explains** that data —
it never invents facts the system doesn't already know.

## Problem statement

Stadiums during a tournament of this scale face acute, simultaneous challenges: fans get lost,
crowds bottleneck at gates and concourses, accessibility needs go unmet, and organizers lack a
real-time, human-readable view of what's happening across the venue. A GenAI layer can turn raw
sensor/graph data into clear guidance and operational insight — but only if it's kept honest and
grounded in real data, not left to hallucinate distances, queue times, or safety instructions.

## Solution

AIZVerse addresses this with three tightly-integrated features:

1. **AI Stadium Assistant** — a conversational, multilingual-ready assistant for fan questions.
2. **AI Navigation** — routing (fastest / accessible / least-crowded) with AI-generated,
   plain-language walking directions.
3. **AI Crowd Intelligence** — a live operations dashboard with a zone-by-zone density heatmap
   and an AI-generated operational summary with concrete recommended actions.

### The core architectural constraint

**The AI layer narrates deterministic outputs; it does not generate them.**

- Route *geometry* (steps, distances, landmarks) comes from a routing function
  (`computeRawPath` in `navigation.service.ts` — a stand-in for a real indoor pathfinding graph).
  The AI only turns that into a clear sentence.
- Crowd *density numbers* come from MongoDB (`CrowdReadingModel`). The AI only summarizes and
  recommends actions from those numbers — it's explicitly instructed never to invent data not
  present in the input, and this is asserted directly in `crowd.service.test.ts` and
  `navigation.service.test.ts`.
- This is what makes the assistant safe to deploy at a real venue: a hallucinated gate number or
  invented queue time is a safety issue, not just a UX bug.

## Scope of this build

Building all eleven briefed feature areas (navigation, crowd management, accessibility,
transportation, sustainability, multilingual, operational intelligence, real-time decision
support, volunteer copilot, emergency support, matchday companion) to genuine production quality
in one pass isn't realistic — that's a multi-person, multi-week product. Rather than stub all of
them shallowly, this build does **three end-to-end, fully-tested, production-shaped features**
(Stadium Assistant, Navigation, Crowd Intelligence) and the **shared platform** they sit on
(AI provider abstraction, auth, validation, rate limiting, error handling, logging, test
harness). The remaining features are architected for (see [Future scope](#future-scope)) but not
implemented — adding one is "write a new `features/<name>/` module following the existing
pattern," not "redesign the system."

## Architecture

```
┌─────────────────────────┐        ┌──────────────────────────┐
│   Next.js frontend       │  HTTP  │   Express API             │
│   (feature-based)        │◄──────►│   (feature-based)         │
│                          │  JSON  │                            │
│  features/               │        │  features/                 │
│   stadium-assistant/     │        │   stadium-assistant/        │
│   navigation/            │        │   navigation/                │
│   crowd-intelligence/    │        │   crowd-intelligence/        │
└─────────────────────────┘        │        │                    │
                                    │        ▼                    │
                                    │  lib/ai/provider.interface  │  ← every feature depends on
                                    │        ▲                    │    this interface only
                                    │        │                    │
                                    │  lib/ai/providers/          │
                                    │   gemini.provider.ts        │  ← swap point (add openai.provider.ts,
                                    └──────────────────────────┘     change one line in ai.factory.ts)
                                                │
                                        ┌───────▼────────┐
                                        │  MongoDB Atlas  │
                                        └────────────────┘
```

Both frontend and backend use a **feature-based folder structure**: each feature owns its schema
(Zod), service (business logic + AI call), controller/hook, and components/routes. Nothing reaches
across features directly; shared code lives in `lib/`.

### AI provider abstraction

```ts
// lib/ai/provider.interface.ts
export interface AiProvider {
  readonly name: string;
  generate(messages: AiMessage[], options?: GenerateOptions): Promise<AiGenerationResult>;
}
```

`GeminiProvider` is the only concrete implementation today (per this build's brief — Gemini
first). Every feature service (`assistant.service.ts`, `navigation.service.ts`,
`crowd.service.ts`) takes an `AiProvider` as an **injected, optional parameter** defaulting to
`getAiProvider()`. Two consequences:

- Adding OpenAI, Groq, or Claude later is: implement `AiProvider` in
  `lib/ai/providers/<name>.provider.ts`, add one case to `ai.factory.ts`. No feature code changes.
- Every service is unit-testable with a fake in-memory provider — no network, no API key, no
  flakiness. See `backend/src/__tests__/*.service.test.ts`.

## Features

### 1. AI Stadium Assistant
Multilingual-ready chat (`en`/`es`/`fr`/`ar`/`hi`/`pt` in the request schema) for natural
questions like *"How do I reach Gate B?"* or *"Nearest accessible restroom?"*. Keeps the last 20
turns of history, matching a cap enforced on both client and server. Rate-limited separately from
the platform default because AI calls are more expensive.

### 2. AI Navigation
Three route types — fastest, accessible, least-crowded. Deterministic step/landmark/distance data
is computed server-side; the AI only writes the natural-language walking summary from that exact
data (verified in `navigation.service.test.ts`).

### 3. AI Crowd Intelligence
Organizer/security/staff-only dashboard (role-gated). Reads the latest density reading per zone
from MongoDB, flags zones ≥80% capacity as risk zones, and asks the AI for a short, factual
operational summary with concrete suggested actions (e.g. "open Gate D as overflow").

## Technology stack

**Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion,
TanStack Query, React Hook Form + Zod, Recharts, Leaflet/react-leaflet, Vitest + React Testing
Library.

**Backend:** Node.js, Express, TypeScript, MongoDB Atlas + Mongoose, JWT auth, Zod validation,
Helmet, express-rate-limit, Pino structured logging, Vitest + Supertest.

**AI:** Google Gemini (`@google/generative-ai`) via a swappable provider interface.

## Folder structure

```
aizverse/
├── backend/
│   └── src/
│       ├── config/            # env validation, db connection, logger
│       ├── lib/
│       │   ├── ai/            # AiProvider interface, Gemini adapter, factory
│       │   └── asyncHandler.ts
│       ├── middleware/        # auth, validate, rate limit, error handler
│       ├── models/            # Mongoose schemas
│       ├── features/
│       │   ├── stadium-assistant/
│       │   ├── navigation/
│       │   └── crowd-intelligence/
│       ├── __tests__/         # unit + integration tests
│       ├── app.ts             # Express app factory (testable in isolation)
│       └── server.ts          # boots DB + HTTP listener
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   └── (dashboard)/{assistant,navigation,dashboard}/page.tsx
    ├── features/
    │   ├── stadium-assistant/{components,hooks}
    │   ├── navigation/{components,hooks}
    │   └── crowd-intelligence/{components,hooks}
    ├── components/ui/         # Button, Card, Skeleton primitives
    ├── lib/{api,validation}/
    └── __tests__/
```

## Installation

Requires Node.js 20+, npm, and a MongoDB Atlas connection string.

```bash
git clone <your-fork-url> aizverse
cd aizverse

cd backend && npm install
cd ../frontend && npm install
```

## Configuration / environment variables

Copy the example files and fill in real values — **never commit `.env`**.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

| Variable | Where | Description |
|---|---|---|
| `PORT` | backend | API port (default `4000`) |
| `CLIENT_ORIGIN` | backend | Allowed CORS origin for the frontend |
| `JWT_SECRET` | backend | ≥32-char secret for signing auth tokens |
| `MONGODB_URI` | backend | MongoDB Atlas connection string |
| `AI_PROVIDER` | backend | `gemini` (default; extensible) |
| `GEMINI_API_KEY` | backend | Google Generative AI API key |
| `GEMINI_MODEL` | backend | e.g. `gemini-2.0-flash` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS` | backend | Rate limiter tuning |
| `NEXT_PUBLIC_API_BASE_URL` | frontend | Backend API base URL |

## Running locally

```bash
# Terminal 1 — API
cd backend
npm run dev        # http://localhost:4000

# Terminal 2 — Web app
cd frontend
npm run dev         # http://localhost:3000
```

Visit `/assistant`, `/navigation`, or `/dashboard`.

## Testing

```bash
cd backend && npm test            # Vitest: unit + Supertest integration tests
cd frontend && npm test           # Vitest + React Testing Library
```

Backend tests inject a fake `AiProvider`, so they run with **no network calls and no API key** —
fast and deterministic in CI. Coverage thresholds are enforced via `vitest.config.ts`
(80% lines/statements/functions, 70% branches).

What's covered:
- **Services**: prompt construction, response shaping, error propagation, the "AI never invents
  data" guarantee (`navigation.service.test.ts` asserts every distance the AI receives in its
  prompt exists in the computed route).
- **Middleware/integration**: auth rejection, 404 handling, no-stack-trace-leak on error, request
  size limits (`app.integration.test.ts`).
- **Frontend hooks/components**: optimistic UI updates, loading/error states, accessible chart
  labeling, conditional rendering of the congestion warning.

## Security

- **Input validation** — every request body/query is parsed through a Zod schema before it
  reaches a controller (`validate` middleware); invalid input never reaches business logic.
- **AuthN/Z** — JWT bearer auth (`requireAuth`) plus role-based authorization (`requireRole`);
  the crowd dashboard is restricted to `staff`/`security`/`organizer` roles.
- **Rate limiting** — a global floor plus a stricter budget specifically on AI-backed routes.
- **Headers** — Helmet for standard security headers; `x-powered-by` disabled.
- **CORS** — locked to a configured `CLIENT_ORIGIN`, not `*`.
- **Secrets** — all config through validated env vars (`config/env.ts`); `.env` is gitignored;
  `.env.example` ships with placeholders only.
- **No unsafe HTML** — no `dangerouslySetInnerHTML` anywhere in the frontend; all AI text is
  rendered as plain text.
- **Error handling** — a centralized error handler that never leaks stack traces to clients in
  production (verified in `app.integration.test.ts`).
- **Body size limits** — JSON body capped at 50kb; this API has no legitimate reason to accept
  large payloads.

## Accessibility

- Semantic landmarks (`<main id="main-content">`, skip-to-content link in the root layout).
- Every interactive control has a visible focus ring (`focus-visible:outline`) tuned to the
  floodlight accent for contrast against the dark theme.
- Chat log uses `role="list"`/`role="listitem"` with `aria-live="polite"` so screen readers
  announce new assistant replies.
- The crowd density chart and route map both expose an `aria-label` summarizing their content in
  words, not just visually, for screen-reader users (`role="img"`).
- `prefers-reduced-motion` is respected globally in `globals.css`.
- Route-type selection uses a proper `role="radiogroup"`/`role="radio"` pattern instead of
  unlabeled buttons.

## Deployment

- **Frontend** → Vercel (`vercel --prod` from `frontend/`, or connect the repo in the Vercel
  dashboard; set `NEXT_PUBLIC_API_BASE_URL` in project env vars).
- **Backend** → Railway or Render (`npm run build && npm start`; set all backend env vars from
  the table above in the platform's environment settings).
- **Database** → MongoDB Atlas; the connection string in `MONGODB_URI` should point to a
  network-access-restricted cluster in production.

## Future scope

Following the same `features/<name>/{schema,service,controller,routes}` pattern established
here:

- **Multilingual Assistant** — the schema already carries a `language` field end-to-end; the
  remaining work is a translation-specific route and a language-detection step for the
  matchday-companion and emergency-announcement use cases.
- **Accessibility Assistant** — wheelchair routing already exists as the `accessible` route
  type; extend with screen-reader-specific voice guidance and high-contrast/large-text user
  preferences persisted per account.
- **Transportation Assistant** — a new feature module composing external transit APIs with an
  AI-generated personalized post-match departure plan.
- **Sustainability Assistant**, **Volunteer Copilot**, **Emergency Decision Support**,
  **Organizer Dashboard (full)**, **Matchday Companion** — each is a self-contained feature
  module; none require changes to the AI abstraction, auth, or validation layers already in place.

## License

MIT — see `LICENSE` (add your preferred license file before publishing).
