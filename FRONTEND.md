# FRONTEND.md

**Owner:** Analdo — Senior Product Designer (agentic/AI-backed workflow)
**Purpose:** This file defines what "done" looks like when frontend work needs to hand off to a backend team. It's written so that any AI agent picking up frontend work for me knows which artifacts to produce, where they live, and why they matter — without me having to re-explain the philosophy every time.

If you are an agent working on this repo, read the **"Instructions for Agents"** section at the bottom before starting.

---

## 1. Core Principle

Storybook shows backend engineers *what* the UI needs to support. It does not tell them *how* to build the API that supports it. Treat Storybook as the front door to a set of integration artifacts — never as a substitute for them.

A backend engineer should be able to open this repo, read this file, and know:
- exactly which endpoints are needed
- exactly what shape each response must take
- exactly which UI states must be handled (loading, empty, error, permission-denied)
- exactly how to verify their real API against what the frontend expects

---

## 2. Deliverables Checklist

Every feature that talks to a backend should ship with the following. Not every item is needed for every feature — use judgment — but check each one off deliberately rather than skipping by default.

- [ ] **API contract** (OpenAPI spec or concise endpoint doc)
- [ ] **Typed frontend API models** aligned to that contract
- [ ] **MSW fixtures** covering realistic states in Storybook
- [ ] **Integration map** (screen/component → endpoint → when it fires)
- [ ] **Auth & permissions matrix**
- [ ] **Error conventions**
- [ ] **Event/analytics schema**
- [ ] **Environment & handoff notes**
- [ ] **Acceptance checklist** for the integration

Details on each below.

---

### 2.1 API Contract

The single source of truth for request/response shape. Prevents "what does this field mean" conversations.

Include:
- Path, method, auth requirement
- Request params/body shape
- Response shape (success + all error variants)
- Pagination approach (cursor vs. offset)
- Status codes used and what triggers each

Format: OpenAPI YAML/JSON if the project can support it; otherwise a markdown table per endpoint is an acceptable minimum viable version. Store in `/contracts/`.

---

### 2.2 Typed Frontend API Models

TypeScript types/interfaces that mirror the contract exactly. These become the enforcement mechanism — if the backend's real response doesn't satisfy the type, it fails loudly instead of silently.

Store alongside the feature, e.g. `features/projects/api.ts`.

---

### 2.3 MSW Fixtures in Storybook

Every meaningful backend response gets a story. Minimum set per feature:

- Default / populated
- Empty
- Loading (with artificial delay)
- Error (500)
- Unauthorized (401)
- Not found (404)
- Edge case relevant to the feature (long content, partial data, etc.)

Backend engineers should be able to open Storybook and see every state their API needs to produce — no need to ask "what happens if there are zero results?"

Fixture data should be realistic enough to double as the informal API contract example (see §2.1).

---

### 2.4 Integration Map

A simple table so nobody has to reverse-engineer which component calls which endpoint.

| Screen / Component | Endpoint | Trigger | Notes |
|---|---|---|---|
| `ProjectList` | `GET /api/projects` | on mount | paginated, 20/page |
| `ProjectList` search | `GET /api/projects?q=` | debounced input | 300ms debounce |
| `ProjectCard` delete | `DELETE /api/projects/:id` | confirm modal | optimistic UI, rollback on error |

---

### 2.5 Auth & Permissions Matrix

Defines what's hidden vs. disabled vs. rejected, and for whom.

| Role | Can view | Can edit | Can delete | UI treatment when denied |
|---|---|---|---|---|
| Admin | ✓ | ✓ | ✓ | — |
| Editor | ✓ | ✓ | ✗ | Delete button hidden |
| Viewer | ✓ | ✗ | ✗ | Edit controls disabled, tooltip explains why |
| Expired session | ✗ | ✗ | ✗ | Redirect to login, preserve return URL |

Be explicit about the difference between **hidden** (not rendered), **disabled** (rendered, greyed out), and **rejected** (rendered, action attempted, server returns 403). Backend needs to know which one the frontend expects for each case.

---

### 2.6 Error Conventions

- Validation errors: expected shape (field-level vs. form-level), how frontend displays them
- Retry behavior: what's auto-retried vs. what requires user action
- Timeout/offline handling: how long before a "still loading" state becomes an error state
- User-facing copy: tone and format for error messages, and whether backend error strings are ever shown directly to users (usually: no — frontend maps error codes to copy)

---

### 2.7 Event / Analytics Schema

| Event name | Trigger | Properties | Fires when |
|---|---|---|---|
| `project_viewed` | Card click | `project_id`, `source` | on navigation to detail view |
| `search_performed` | Debounced input | `query_length`, `result_count` | after results return |

Keeps analytics implementation from being reverse-engineered later, and gives backend/data teams a heads-up on what instrumentation to expect hitting their endpoints.

---

### 2.8 Environment & Handoff Notes

- Required env vars (names only — never actual secrets in this file)
- API base URLs per environment (local/staging/prod)
- Local setup steps to run frontend against a mocked vs. real backend
- Test accounts / roles available in staging

---

### 2.9 Acceptance Checklist (per integration)

Copy this block into a feature's PR or integration doc when a real backend endpoint is ready to connect:

```
- [ ] Response shape matches the documented contract
- [ ] All Storybook states (success/empty/loading/error/permission) reproducible with real API
- [ ] Pagination behaves as specified
- [ ] Auth/permission behavior matches the matrix
- [ ] Error responses map to the correct frontend copy
- [ ] Analytics events fire with correct properties
- [ ] MSW mock removed or flagged as deprecated for this endpoint
```

---

## 3. Recommended Repo Structure

```
src/
├── components/              # Pure UI, no API knowledge
│   ├── button/
│   ├── header/
│   └── footer/
│
├── features/
│   ├── projects/
│   │   ├── ProjectList.stories.tsx
│   │   ├── handlers.ts      # MSW response handlers
│   │   ├── fixtures.ts      # Mock data (doubles as contract example)
│   │   └── api.ts           # Typed models + fetch logic
│   └── profile/
│
├── mocks/
│   ├── browser.ts
│   ├── handlers.ts
│   └── fixtures/
│
└── contracts/
    ├── projects.openapi.yaml
    └── projects.README.md   # human-readable fallback
```

Each feature owns its mock responses, fixtures, stories, and API models together. When a real backend endpoint ships, remove that feature's mock handler and the UI keeps working with minimal disruption — mocks are removed one endpoint at a time, not all at once.

---

## 4. Why This Matters for a Senior Product Design Role

This isn't just documentation hygiene. Producing these artifacts signals that design work extends into frontend architecture, API contracts, and cross-functional handoff — not just visual components. A design system built this way documents **product states** (loading, empty, permission-denied, error) rather than just UI states (button, card, header), which is what backend and QA teams actually need to build against confidently.

---

## 5. Instructions for Agents

If you are an AI agent doing frontend work in this repo:

1. Before starting a new feature, check which of the §2 deliverables already exist for it. Don't assume Storybook stories alone are sufficient.
2. When you add a new endpoint dependency, update the **Integration Map** and **API Contract** in the same PR — don't let them drift.
3. When you add a new role/permission gate, update the **Auth & Permissions Matrix**.
4. Default to creating MSW fixtures for every new API-dependent component, covering at minimum: populated, empty, loading, error, unauthorized.
5. Never invent a backend response shape and leave it undocumented — if you had to guess a shape, write it into `/contracts/` so a human or backend agent can confirm or correct it.
6. Flag (don't silently skip) any deliverable from §2 you're intentionally omitting, and say why, in the PR description.
7. Keep this file itself up to date — if you find a new category of deliverable worth tracking, propose an addition here rather than documenting it somewhere disconnected.

---

## 6. Changelog

| Date | Change |
|---|---|
| 2026-07-17 | Initial version created |
