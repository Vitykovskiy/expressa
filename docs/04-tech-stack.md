# Tech Stack

## Current Decision Status

Status: `Frontend stack selected for Slice B; backend baseline retained from Slice A`

The agent must not finalize this file before the business problem and delivery constraints are understood.

## Candidate Stack Summary

| Area | Selected | Why | Alternatives | Risks |
| --- | --- | --- | --- | --- |
| Frontend | Vue 3 + Vuetify 3 + Vite 6 + Vitest | Matches the approved Slice B requirement, supports fast mobile-first iteration from Figma frames, and keeps local verification deterministic | React, Nuxt, plain Vue without component framework | Bundle size must stay controlled; runtime requires explicit proxy/base URL handling when frontend and backend run on different origins |
| Backend | Node.js 20 + Express 4 | Fast deterministic delivery of Slice A contracts with low integration overhead | Fastify, NestJS | No framework-level contract generation; must keep API contracts explicit in docs/tests |
| Data | In-memory store for Slice A backend baseline | Enables immediate contract validation before full persistence decisions in later slices | PostgreSQL-first persistence, SQLite | Data resets on restart; production persistence must be introduced before release closure |
| Infra | GitHub Actions + VPS (Docker Engine + Docker Compose plugin) | Provides deterministic CI and remote runtime bootstrap before feature implementation | Manual VPS setup, self-hosted CI | Root-password-based access is temporary and should be replaced with SSH key flow |

## Official Documentation And Best Practices

- Vue 3
  Official docs: https://vuejs.org/
  Key best practices: use Composition API for screen state, keep UI logic in composables, and prefer explicit props/events across screen components.
  Project conventions: the customer app lives under `frontend/src/`, with `components/`, `composables/`, `lib/`, `plugins/`, and `styles/`.
- Vuetify 3
  Official docs: https://vuetifyjs.com/
  Key best practices: use Vuetify primitives selectively and keep custom layout styling in project CSS when the Figma layout is more specific than stock component patterns.
  Project conventions: Vuetify provides the app shell and button/progress primitives; screen layout and visual tokens are implemented in `frontend/src/styles/main.css`.
- Vite 6
  Official docs: https://vite.dev/
  Key best practices: keep dev-server proxy rules explicit, use ESM-only config, and watch bundle chunking for heavy UI libraries.
  Project conventions: local frontend dev runs on `127.0.0.1:4173` with proxy rules for `/customer`, `/backoffice`, `/admin`, and `/healthz`.
- Vitest
  Official docs: https://vitest.dev/
  Key best practices: test user-visible flows, stub network boundaries, and keep jsdom setup minimal.
  Project conventions: frontend verification uses `npm test` inside `frontend/`.
- Express 4
  Official docs: https://expressjs.com/
  Key best practices: keep contracts explicit in route handlers and back them with direct test coverage.
  Project conventions: backend remains the API provider for the frontend customer flow and must preserve the documented contracts in `docs/analysis/integration-contracts.md`.

## Project Conventions

- Frontend code is plain JavaScript Vue SFCs; this repository does not use FSD, so structure stays flat and task-oriented under `frontend/src/`.
- The customer flow is mobile-first and must stay visually aligned with the mapped Figma frames, including `Nunito`, `#1847e8`, and `#ff5500`.
- Frontend API calls default to a blank `VITE_API_BASE_URL` and use relative requests; local Vite proxy rules bridge to the backend when both apps run on the same host.
- Frontend verification minimum is `npm test` and `npm run build` inside `frontend/`, plus screenshot evidence against the task Figma frames.
- Dependency updates should preserve Node 20 compatibility across both frontend and backend toolchains.

## Risks

- In-memory Slice A backend is not production-safe for durable order history and must be replaced with persistent storage in a follow-up slice before release closure.
- Backend API currently uses header-based actor identity in test mode; production Telegram signature validation path must be enforced in deploy/e2e stages.
- Vuetify adds a sizable client bundle, so future frontend slices should monitor chunk growth as more screens are added.

## Review Trigger

Update this file whenever the selected stack, runtime constraints, or critical practices change.
