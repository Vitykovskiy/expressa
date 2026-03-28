# Architecture

## Purpose

This file is the structural navigation map for implementation, deployment, and testing work.

It complements the analysis package:

- `docs/analysis/` defines the target system and contracts;
- this file maps those decisions onto the actual repository structure and runtime boundaries.

## Repository Structure Map

Record the main applications, packages, services, and infrastructure areas before delivery starts.

If `.ai-dev-template.config.json` sets `architecture.use_fsd` to `true`, describe frontend areas in terms of FSD layers and record the intended boundaries in this file. If it is `false`, document the alternative frontend structure explicitly for later sessions.

| Area | Path | Responsibility | Owned Contour |
| --- | --- | --- | --- |
| `customer-app` | `frontend/` | Slice B customer mobile web app implemented from Figma frames and customer contracts | `frontend` |
| `backend-api` | `backend/` | Slice A and Slice B HTTP contracts for customer and backoffice flows | `backend` |
| `delivery-docs` | `docs/delivery/` | Handoff evidence, runtime notes, and contour-owned completion artifacts | `frontend/backend/devops/qa-e2e` |

## Runtime Modules

Map implemented runtime modules back to the canonical analysis artifacts.

| Runtime module | Repository path | Canonical source | Notes |
| --- | --- | --- | --- |
| `customer shell and screen routing` | `frontend/src/App.vue`, `frontend/src/components/CustomerShell.vue` | `docs/analysis/ui-specification.md`, `docs/analysis/user-scenarios.md` | Mobile shell, top actions, and screen switching for catalog, detail, cart, and history |
| `customer flow state` | `frontend/src/composables/useCustomerApp.js` | `docs/analysis/user-scenarios.md`, `docs/analysis/version-scope-and-acceptance.md` | Coordinates bootstrap, add-to-cart, cart mutation, slot selection, and order history |
| `customer API adapter` | `frontend/src/lib/api.js` | `docs/analysis/integration-contracts.md` | Consumes customer endpoints via relative base URL or explicit `VITE_API_BASE_URL` |
| `frontend visual system` | `frontend/src/styles/main.css` | `docs/analysis/ui-specification.md` | Stores Figma-derived tokens, mobile layout sizing, and customer-screen styling |
| `customer/backoffice API server` | `backend/src/` | `docs/analysis/integration-contracts.md`, `docs/analysis/cross-cutting-concerns.md` | Backend-owned runtime that serves the frontend contracts |

## Contour Boundaries

- Frontend: owns `frontend/`, the customer mobile UI surfaces, Figma-aligned styling, and consumption of the customer HTTP contracts.
- Backend: owns `backend/`, domain rules, in-memory persistence, and the customer/backoffice HTTP contract implementation.
- DevOps: owns runtime composition, CI/CD, and environment wiring for frontend and backend delivery units.
- QA E2E: owns integrated validation suites and cross-contour acceptance evidence at block level.

## Cross-Contour Dependencies

| From contour | To contour | Dependency | Canonical contract |
| --- | --- | --- | --- |
| `frontend` | `backend` | Customer menu, cart, slot, and order APIs consumed by `frontend/src/lib/api.js` | `docs/analysis/integration-contracts.md` |
| `frontend` | `devops` | Local/staging runtime must serve the frontend app with reachable API origin or proxy path | `docs/analysis/cross-cutting-concerns.md` |
| `qa-e2e` | `frontend` | Visual and behavioral validation depends on customer flow handoff evidence and screen coverage | `docs/analysis/ui-specification.md` |

## Deployment Topology

- Environments: local development, staging/test runtime, and later production rollout.
- Delivery units: one frontend SPA from `frontend/` and one backend Node service from `backend/`.
- External integrations: Telegram WebApp host context remains an external boundary; current local verification uses header-based actor simulation.

## Update Rule

Update this file whenever repository structure, contour ownership, runtime module placement, or deployment topology changes.

Do not use this file to invent missing product behavior. Missing behavior belongs in `docs/analysis/`.
