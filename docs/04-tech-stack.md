# Tech Stack

## Current Decision Status

Status: `Partially defined for Slice A Stage 0 infrastructure; application stack remains TBD`

The agent must not finalize this file before the business problem and delivery constraints are understood.

## Candidate Stack Summary

| Area | Selected | Why | Alternatives | Risks |
| --- | --- | --- | --- | --- |
| Frontend | TBD | TBD | TBD | TBD |
| Backend | TBD | TBD | TBD | TBD |
| Data | TBD | TBD | TBD | TBD |
| Infra | GitHub Actions + VPS (Docker Engine + Docker Compose plugin) | Provides deterministic CI and remote runtime bootstrap before feature implementation | Manual VPS setup, self-hosted CI | Root-password-based access is temporary and should be replaced with SSH key flow |

## Official Documentation And Best Practices

Record only official or primary sources for selected technologies.

Example format:

- Technology:
  Official docs:
  Key best practices:
  Project conventions:

## Project Conventions

- Document language-specific conventions after stack selection.
- Record testing expectations.
- Record migration or deployment conventions.
- Record versioning or dependency update policies.

## Risks

- `<risk tied to a stack choice>`
- `<risk tied to operational complexity>`

## Review Trigger

Update this file whenever the selected stack, runtime constraints, or critical practices change.
