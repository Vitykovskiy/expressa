# Slice B Frontend Backoffice Blocker

## Task

- Blocked issue: `#14`
- Follow-up analysis: `#21`
- Scope: backoffice tabs and role UX for barista and administrator

## Status

- Analysis issue `#21`: `partially resolved`
- Remaining blocker: dedicated full-screen `menu` tab mapping is absent in current Admin Figma source

## Resolved By #21

- Corrected full-screen mappings for:
  - orders (`2-455` mobile, `1-2` desktop);
  - availability (`3-281` mobile, `3-2` desktop);
  - users (`3-738` mobile, `3-853` mobile search state, `3-441` desktop);
  - settings (`3-1128` mobile, `3-969` desktop).
- Responsive backoffice shell scope is now explicit: implement both mobile (`TabBar`) and desktop (`SideNav`) variants.

## Remaining Blocker Summary

Frontend issue `#14` is still blocked because menu-tab composition cannot be mapped to a real full-screen frame:

- current menu reference `node-id=2-566` resolves to a `Link` node inside the orders tab bar, not a dedicated menu surface;
- no standalone menu-tab screen (mobile or desktop) was found in the current `Expressa-Admin` file.

## Why This Blocks #14

Issue `#14` definition of done requires:

- orders, availability, and administrator tabs;
- role-based tab visibility;
- reject-reason flow and status transitions;
- frontend verification artifacts for downstream QA.

The current canonical mapping is now sufficient for orders, availability, users, settings, and responsive shell behavior. It is still insufficient for menu-tab implementation without additional design input.

## Evidence

- Canonical mapping source: `docs/analysis/ui-specification.md`
- Verified valid orders frame: `https://www.figma.com/design/gFucXna9RTbuxNmyVukOYD/Expressa-Admin?node-id=2-455`
- Verified valid reject modal: `https://www.figma.com/design/gFucXna9RTbuxNmyVukOYD/Expressa-Admin?node-id=2-721`
- Verified corrected backoffice tab frames:
  - availability: `3-281` (mobile), `3-2` (desktop)
  - users: `3-738` and `3-853` (mobile), `3-441` (desktop)
  - settings: `3-1128` (mobile), `3-969` (desktop)
- Verified unresolved menu reference:
  - `https://www.figma.com/design/gFucXna9RTbuxNmyVukOYD/Expressa-Admin?node-id=2-566` (`Link` node only)

## Required Unblock Output

To unblock `#14`, external design input must provide:

- direct full-screen Figma frame link(s) (`node-id=`) for the backoffice `menu` tab in both mobile and desktop shell variants;
- screen-state coverage for the menu tab at least for `loading`, `editable`, `validation error`, and `save error`;
- explicit confirmation that the provided menu-tab frames cover admin menu-management scope expected by `#14` and current `POST /admin/menu/*` contracts.
