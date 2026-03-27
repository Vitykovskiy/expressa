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

## Tokens And Secrets

| Secret | Where It Lives | Purpose | Stage first needed | Status |
| --- | --- | --- | --- | --- |
| `gh` auth token | GitHub CLI auth store | Issues and Project automation | `setup` | Validated (`repo`, `project`, `read:org`, `workflow`) |

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

## Integration Status

- GitHub repository access: `Validated`
- GitHub Project access: `Validated`
- Deployment environment access: `Unknown`
- E2E environment readiness: `Unknown`

## Setup Notes

- Update this file as integrations are connected or changed.
- During `setup`, validate GitHub Issues access and GitHub Project access, and record the actual result here.
- Record verification evidence for the GitHub operating model prepared in `setup`, including project readiness, issue creation ability, and required labels or project fields.
- Do not store production secrets in committed files.
- If the project uses a separate secret manager, document the reference location here.
