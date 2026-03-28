# Slice A QA Assets Handoff (Issue #7)

This document defines the reusable QA automation assets produced by issue `#7` for block validation issue `#9`.

## Scope Delivered

- Automated API-level e2e scenarios for the core Slice A customer and backoffice flows.
- Fixture set for actor identities and rejection payloads.
- Executable entrypoint wired into `infra/validation/run-e2e.sh`.
- CI workflow that executes QA assets against a live backend process.

## Repository Assets

- Entrypoint script: `tests/e2e/run.sh`
- Scenario runner: `tests/e2e/slice-a-api.e2e.mjs`
- Fixtures:
  - `tests/e2e/fixtures/actors.json`
  - `tests/e2e/fixtures/rejection.json`
- Validation wrapper: `infra/validation/run-e2e.sh`
- CI workflow: `.github/workflows/slice-a-qa-assets-validation.yml`

## Scenario Coverage

1. Customer menu -> cart -> slot selection -> order creation -> customer history visibility.
2. Backoffice order lifecycle transitions: confirm -> ready -> close.
3. Rejection rule enforcement: reject without reason fails, reject with reason succeeds and persists reason.

## Environment Assumptions

- Backend is reachable via `BASE_URL` (default `http://127.0.0.1:18081`).
- Test mode uses `DISABLE_TG_AUTH=true`.
- Actor identities are supplied by fixtures or environment variables:
  - `BARISTA_TELEGRAM_ID` (default `2001`)
  - `CUSTOMER_TELEGRAM_ID` (default `3001`)
  - `SECONDARY_CUSTOMER_TELEGRAM_ID` (default `3002`)

## Execution Commands

- Local execution against running backend:
  - `BASE_URL=http://127.0.0.1:18081 bash infra/validation/run-e2e.sh`
- Strict mode for pipeline gating:
  - `E2E_STRICT=true BASE_URL=http://127.0.0.1:18081 bash infra/validation/run-e2e.sh`

## Handoff To Issue #9

- Issue `#9` should reuse these assets as the baseline executable contract.
- Issue `#9` remains responsible for full block-level integrated validation against deployed environment `#8`, including go/no-go reporting.
