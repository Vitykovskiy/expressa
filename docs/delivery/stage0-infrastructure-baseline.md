# Stage0 Infrastructure Baseline (Issue #3)

This document is the canonical Stage0 handoff for Slice A infrastructure.

## Scope

- CI baseline for infrastructure assets on every push to `main`
- Automated VPS bootstrap for Docker runtime
- Automated deployment of a baseline containerized service to staging
- Environment variable wiring for `ADMIN_TELEGRAM_ID` and `DISABLE_TG_AUTH`

## Repository Assets

- Workflow: `.github/workflows/stage0-infrastructure.yml`
- Compose manifest: `infra/staging/docker-compose.baseline.yml`
- VPS bootstrap script: `infra/vps/bootstrap.sh`
- VPS deploy script: `infra/vps/deploy-baseline.sh`

## GitHub Secrets Required

- `VPS_HOST`
- `VPS_ROOT_USER`
- `VPS_ROOT_PASSWORD`
- `ADMIN_TELEGRAM_ID`
- `DISABLE_TG_AUTH`

## VPS Runtime Layout

- Base directory: `/opt/expressa/staging`
- Compose file: `/opt/expressa/staging/docker-compose.baseline.yml`
- Env file: `/opt/expressa/staging/.env`
- Baseline service: `expressa-stage0-baseline` on `:18080`

## Verification Contract

The workflow is considered successful only when all checks pass:

1. `ci-baseline` validates shell scripts and compose manifest.
2. `deploy-staging` bootstraps Docker runtime on VPS.
3. `deploy-staging` starts baseline service with Docker Compose.
4. `deploy-staging` returns HTTP 200 from `http://127.0.0.1:18080/` on VPS.

## Operational Notes

- Root-password SSH is temporary. Replace with SSH key authentication before production rollout.
- `ADMIN_TELEGRAM_ID` value can be rotated without code changes by updating GitHub Secret and rerunning the workflow.
- This Stage0 baseline does not deploy business application services. Those are covered by implementation task `#6`.
