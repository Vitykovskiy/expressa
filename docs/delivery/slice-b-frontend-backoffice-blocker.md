# Slice B Frontend Backoffice Blocker

## Task

- Blocked issue: `#14`
- Follow-up analysis: `#21`
- Scope: backoffice tabs and role UX for barista and administrator

## Status

- Analysis issue `#21`: `resolved`
- Remaining blocker: none

## Resolved By #21

- Corrected full-screen mappings for:
  - orders (`2-455` mobile, `1-2` desktop);
  - availability (`3-281` mobile, `3-2` desktop);
  - menu (`67-3` mobile, `67-5` desktop);
  - users (`3-738` mobile, `3-853` mobile search state, `3-441` desktop);
  - settings (`3-1128` mobile, `3-969` desktop).
- Responsive backoffice shell scope is now explicit: implement both mobile (`TabBar`) and desktop (`SideNav`) variants.
- Menu loading, validation, and save-error feedback may be implemented from shared backoffice interaction rules and contract-driven validation without dedicated Figma frames.

## Remaining Blocker Summary

Frontend issue `#14` is no longer blocked by missing menu-tab mapping. The direct full-screen menu surfaces are now available for both shells:

- mobile menu: `node-id=67-3`;
- desktop menu: `node-id=67-5`.

## Why This Blocks #14

Issue `#14` definition of done requires:

- orders, availability, and administrator tabs;
- role-based tab visibility;
- reject-reason flow and status transitions;
- frontend verification artifacts for downstream QA.

The canonical mapping is now sufficient for orders, availability, menu, users, settings, and responsive shell behavior. `#14` can resume without guessing UI structure.

## Evidence

- Canonical mapping source: `docs/analysis/ui-specification.md`
- Verified valid orders frame: `https://www.figma.com/design/gFucXna9RTbuxNmyVukOYD/Expressa-Admin?node-id=2-455`
- Verified valid reject modal: `https://www.figma.com/design/gFucXna9RTbuxNmyVukOYD/Expressa-Admin?node-id=2-721`
- Verified corrected backoffice tab frames:
  - availability: `3-281` (mobile), `3-2` (desktop)
  - menu: `67-3` (mobile), `67-5` (desktop)
  - users: `3-738` and `3-853` (mobile), `3-441` (desktop)
  - settings: `3-1128` (mobile), `3-969` (desktop)
- Verified desktop menu frame:
  - `https://www.figma.com/design/gFucXna9RTbuxNmyVukOYD/Expressa-Admin?node-id=67-5`

## Required Unblock Output

Unblock output is complete. No further external input is required for `#14` from issue `#21`.
