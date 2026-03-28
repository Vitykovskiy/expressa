# Slice B Deploy Evidence (Issue #17)

This document records rollout evidence for deploy task `#17`.

## Deployment Run

- Deployment mode: manual VPS rollout with deterministic build-on-deploy images
- Commit: `bd8287da3739eff54084f4bba3a73404d8f49535`
- Result: `success`

## Rolled Out Artifacts

- Backend image: `expressa-backend:slice-b-bd8287da3739`
- Frontend image: `expressa-frontend:slice-b-bd8287da3739`
- Runtime manifest: `infra/staging/docker-compose.slice-b.yml`
- Runtime env path on VPS: `/opt/expressa/staging/slice-b/.env`

## Target Runtime

- Environment: `staging`
- VPS host: `216.57.105.133`
- Slice B backend endpoint: `http://216.57.105.133:18081`
- Slice B frontend endpoint: `http://216.57.105.133:18082`
- Health endpoint checks:
  - `GET /healthz` on backend -> `200`
  - `GET /healthz` on frontend -> `200`
- Contract endpoint checks:
  - `GET /customer/menu` with `x-telegram-id: 3001` -> `200`
  - `POST /admin/settings` with `x-telegram-id: 1001` and `{}` -> `200`

## Environment Notes

- Slice A staging runtime was stopped before Slice B rollout because both stacks map backend to host port `18081`.
- During deploy verification, QA wrapper execution requires `ADMIN_TELEGRAM_ID=1001` for Slice B admin API checks in this environment.
- `tests/e2e/slice-b-api.e2e.mjs` passes against staging when run with `ADMIN_TELEGRAM_ID=1001`.

## Notes For E2E Task #18

- Deploy task `#17` is the deployment evidence source for integrated validation.
- `#18` should use this deployment evidence together with `docs/delivery/slice-b-qa-handoff.md`.
