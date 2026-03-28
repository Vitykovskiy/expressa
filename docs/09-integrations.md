# Integrations

## GitHub Project

- URL: `https://github.com/users/Vitykovskiy/projects/21`
- Board type: `Kanban`
- Required statuses present: `yes`
- Required fields present: `Status`, `Task Type`, `Owner Contour`, `Priority`
- Project item creation verified: `yes`
- Setup validation status: `Validated on 2026-03-28`
- Notes: Repository `Vitykovskiy/expressa` is linked to Project `expressa`; required fields `Status`, `Task Type`, `Owner Contour`, and `Priority` are configured.

## GitHub Issues

- Initiative issue creation verified: `yes`
- Initial seeded `system_analysis` issue verified: `yes`
- Operational issue templates verified: `yes`
- Required task metadata captured by forms: `yes`
- Active-session label `session: active` verified: `yes`
- Labels prepared for workflow use: `yes`
- Notes: Seeded backlog issues are `#1 https://github.com/Vitykovskiy/expressa/issues/1` and `#2 https://github.com/Vitykovskiy/expressa/issues/2`; `#2` carries the sole open `session: active` label.

## Effective Workflow Policy

- Effective `.ai-dev-template.config.json` committed and pushed: `yes`
- Notes: The current setup commit includes the effective repository configuration used during bootstrap.

## Environment Variables

| Variable | Required | Purpose | Stage first needed | Status |
| --- | --- | --- | --- | --- |
| `ADMIN_TELEGRAM_ID` | Yes | Defines the single root administrator to upsert on backend startup | `implementation` | Required by product brief |
| `DISABLE_TG_AUTH` | Yes for test environment | Disables Telegram auth validation in test runs and switches backend to seeded identities | `e2e` | Required by product brief |
| `VPS_HOST` | Yes for VPS operations | Defines the target VPS host for deployment and operational access | `infrastructure` | Present in local `.env` |
| `VPS_ROOT_USER` | Yes for current VPS access flow | Defines the root SSH user for VPS administrative access | `infrastructure` | Present in local `.env` |
| `VPS_ROOT_PASSWORD` | Yes for current VPS access flow | Defines the root password used for VPS administrative access | `infrastructure` | Present in local `.env` |

## Tokens And Secrets

| Secret | Where It Lives | Purpose | Stage first needed | Status |
| --- | --- | --- | --- | --- |
| `gh` auth token | GitHub CLI auth store | Issues and Project automation | `setup` | Validated (`repo`, `project`, `read:org`, `workflow`) |
| `VPS_ROOT_PASSWORD` | Local `.env` | Administrative VPS access for infrastructure and deployment work | `infrastructure` | Present locally; do not commit the value |

## GitHub Token Scope Baseline

Required scopes:

- `repo`
- `project`

Recommended scopes:

- `read:org`
- `workflow`

Validation note:

- token scopes are necessary but not sufficient;
- repository membership, project write access, and branch protection rules must still be validated separately;
- record actual validation results in this file during `setup`;
- report setup or later GitHub-side workflow steps complete after the corresponding side effects are verified.

## Runtime And External Integrations

Document every external system that matters to development, deploy, or e2e validation.

| Integration | Purpose | Stage first needed | Status | Notes |
| --- | --- | --- | --- | --- |
| GitHub Issues | Workflow task tracking and active-session routing | `setup` | Configured | Open issues `#1` and `#2` created successfully through `gh` |
| GitHub Project | Delivery status board and required workflow fields | `setup` | Configured | Project `expressa` linked to repository with validated custom fields and statuses |
| Telegram customer bot | Launches customer web app and sends customer order-status notifications | `implementation` | Planned | Direct URL access outside Telegram is not supported in v1 |
| Telegram backoffice bot | Launches backoffice web app and sends barista reminders and notifications | `implementation` | Planned | Separate bot from customer-facing access path |
| Telegram WebApp auth | Primary identity and access mechanism in production | `implementation` | Planned | Test environment bypasses Telegram validation with `DISABLE_TG_AUTH=true` |
| VPS host access | Deployment target and runtime environment for test and production flows | `infrastructure` | Credentials present locally | Connection details are sourced from local `.env` via `VPS_HOST`, `VPS_ROOT_USER`, and `VPS_ROOT_PASSWORD` |

## Integration Status

- GitHub repository access: `Validated`
- GitHub Project access: `Validated`
- Deployment environment access: `Credentials present locally in .env`
- E2E environment readiness: `Unknown`

## Setup Notes

- Update this file as integrations are connected or changed.
- During `setup`, validate GitHub Issues access and GitHub Project access, and record the actual result here.
- Record verification evidence for the GitHub operating model prepared in `setup`, including project readiness, issue creation ability, and required labels or project fields.
- Do not store production secrets in committed files.
- VPS access variables currently live in local `.env`; document variable names in the repository, but never commit secret values.
- If the project uses a separate secret manager, document the reference location here.
