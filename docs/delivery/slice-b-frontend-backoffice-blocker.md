# Slice B Frontend Backoffice Blocker

## Task

- Blocked issue: `#14`
- Follow-up analysis: `#21`, `#22`
- Follow-up implementation: `#23`
- Scope: backoffice tabs and role UX for barista and administrator

## Status

- Analysis issue `#21`: `resolved`
- Analysis issue `#22`: `resolved`
- Backend issue `#23`: `open`
- Remaining blocker: backend implementation of the canonical availability read-model contract from `#22`

## Resolved By #21 And #22

- Corrected full-screen mappings for:
  - orders (`2-455` mobile, `1-2` desktop);
  - availability (`3-281` mobile, `3-2` desktop);
  - menu (`67-3` mobile, `67-5` desktop);
  - users (`3-738` mobile, `3-853` mobile search state, `3-441` desktop);
  - settings (`3-1128` mobile, `3-969` desktop).
- Responsive backoffice shell scope is now explicit: implement both mobile (`TabBar`) and desktop (`SideNav`) variants.
- Menu loading, validation, and save-error feedback may be implemented from shared backoffice interaction rules and contract-driven validation without dedicated Figma frames.
- Canonical availability read-model is now explicit:
  - endpoint `POST /backoffice/availability/list`
  - allowed roles `barista` and `administrator`
  - response must include currently unavailable entities required for re-enable flow

## Remaining Blocker Summary

Issue `#14` is no longer blocked by missing analysis. It remains blocked only by missing backend implementation for contract `POST /backoffice/availability/list` (issue `#23`).

## Unblock Condition For #14

- backend issue `#23` is `Done`
- contract in `docs/analysis/integration-contracts.md` is implemented and test-verified
- issue `#14` dependency list includes `#23` and can move from `Blocked` to `Ready`

## Evidence

- Canonical API contract source: `docs/analysis/integration-contracts.md`
- Canonical UI behavior source: `docs/analysis/ui-specification.md`
- Scenario-level behavior source: `docs/analysis/user-scenarios.md`
