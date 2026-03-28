# Slice B Frontend Customer Blocker (Issue #13)

This document records the blocker that paused implementation issue `#13` and the subsequent resolution path.

## Status

- Resolution analysis issue: `#19`
- Analysis status: `resolved`
- Remaining implementation dependency: backend follow-up issue `#20` for cart mutation API support

## Blocking Gaps

- The customer cart is specified as editable in `docs/analysis/ui-specification.md`, and the mapped cart frame shows edit/delete controls, but the available customer API contracts expose only:
  - `GET /customer/cart`
  - `POST /customer/cart/items`
  - `POST /customer/orders`
- No customer contract currently exists for removing cart items, changing quantity, or replacing an existing configuration before checkout.
- The mapped customer file provides only an order-history entry point on the main screen. A dedicated history-screen composition and exact frame mapping are not present in the current customer Figma mapping.

## Why Frontend Cannot Safely Implement

- Implementing cart edit/delete behavior without a contract would force frontend-only assumptions that cannot be persisted to backend state.
- Implementing a full order-history screen without a mapped frame would require inventing unapproved UX for a required acceptance path.

## Required Follow-Up

- System-analysis follow-up issue `#19` must define:
  - customer cart mutation semantics and any required backend/API changes;
  - exact order-history screen composition and direct Figma frame mapping.

## Resolution Outcome

Issue `#19` delivered the missing analysis inputs:

- Dedicated order-history screen is mapped to `https://www.figma.com/design/VrpRnba18dTC80u5XfRfXh/Expressa-Customer?node-id=12-4`.
- Customer cart mutation semantics are explicit (`+/-` quantity controls, `0` quantity removes line).
- Required API change is specified in `docs/analysis/integration-contracts.md` as `POST /customer/cart/items/:id/quantity` with `delta: 1 | -1`.

Frontend issue `#13` now depends on backend implementation issue `#20` instead of unresolved analysis.

## Evidence Source

- Active frontend task: `#13`
- Primary Figma frame: `https://www.figma.com/design/VrpRnba18dTC80u5XfRfXh/Expressa-Customer?node-id=1-3`
- Related customer frames:
  - `https://www.figma.com/design/VrpRnba18dTC80u5XfRfXh/Expressa-Customer?node-id=1-130`
  - `https://www.figma.com/design/VrpRnba18dTC80u5XfRfXh/Expressa-Customer?node-id=1-196`
  - `https://www.figma.com/design/VrpRnba18dTC80u5XfRfXh/Expressa-Customer?node-id=12-276`
