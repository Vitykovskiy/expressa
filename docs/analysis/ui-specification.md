# UI Specification

## Bounded Slice Note

The active bounded slice in issue `#2` does not include frontend implementation tasks.

Reason:

- the required direct Figma frame links are missing for listed screens;
- frontend implementation tasks must not be created until those links are recorded in a follow-up `system_analysis` issue.

## Screens And Interfaces

| Screen / interface | User | Goal | States | Notes |
| --- | --- | --- | --- | --- |
| Customer menu catalog | Customer | Browse categories and open products | Loading, populated, empty, blocked user, unavailable items | Based on Figma file `Expressa-Customer`; implementation tasks must use direct frame links |
| Product details / configuration | Customer | Select size and addons before adding to cart | Default, invalid config, unavailable option | Drinks require size `S/M/L`; addon groups may allow multiple or mutually exclusive choices |
| Cart | Customer | Review and edit selected items | Empty, populated, validation error | Cart must remain editable before order placement |
| Slot selection / checkout | Customer | Choose an available current-day pickup slot and place the order | Loading, available slots, full slots, submission error, success | Slots are 10-minute intervals within configured working hours |
| Order history | Customer | Review current and past orders | Empty, populated | Must show current user's orders only |
| Backoffice orders tab | Barista, Administrator | Review incoming orders and perform status actions | Empty, queue present, action in progress, transition error | Actions include confirm, reject with reason, ready, close |
| Backoffice availability tab | Barista, Administrator | Toggle temporary availability for items, options, and addons | Loading, editable, save error | Barista can change availability only, not structure or pricing |
| Backoffice menu tab | Administrator | Manage categories, products, sizes, addons, and prices | Loading, editable, validation error | Hidden from barista |
| Backoffice users tab | Administrator | Assign barista role and block users | Loading, editable, validation error | Hidden from barista |
| Backoffice settings tab | Administrator | Manage working hours and slot capacity | Loading, editable, validation error | Hidden from barista |

## Figma Frame Gating

| Screen group | Figma frame link status | Delivery impact |
| --- | --- | --- |
| Customer app screens | Missing | Frontend tasks blocked until follow-up analysis publishes direct frame links (`node-id=`) |
| Backoffice app screens | Missing | Frontend tasks blocked until follow-up analysis publishes direct frame links (`node-id=`) |

## Interaction Rules

- Direct browser URL access outside Telegram is not supported in v1.
- Customer-facing and backoffice surfaces are launched from different Telegram bots.
- Blocked users must be stopped before they can use customer or backoffice features available to them.
- Customer ordering must prevent checkout with invalid configuration, unavailable products, or unavailable slots.
- Rejection flow in backoffice must require a reason before the action is accepted.
- Role-based tab visibility and permission checks must match the backoffice access matrix.

## Validation And Error States

| Surface | Condition | Expected behavior |
| --- | --- | --- |
| Customer app | User is blocked | Access is denied and ordering actions are unavailable |
| Product configuration | Required size not selected | Add-to-cart is blocked with clear validation |
| Product configuration | Addon choice violates group rules | Add-to-cart is blocked with clear validation |
| Slot selection | Slot is full or unavailable | Slot cannot be selected or submitted |
| Cart / checkout | Item became unavailable before submission | Checkout is blocked and the user is prompted to resolve cart contents |
| Backoffice orders | Reject action without reason | Submission is blocked until a reason is provided |
| Backoffice tabs | User lacks required role | Tab is hidden and corresponding route or action is denied |

## Accessibility / UX Notes

- Customer UX must remain simple, clear, and mobile-first inside Telegram web app constraints.
- Backoffice UX must minimize operational friction for daily use by baristas.
- Vuetify implementation should preserve role clarity and fast access to order actions rather than forcing deep navigation.
- Exact `figma_frame` links must be recorded per screen in follow-up analysis before any frontend implementation issue moves to `Ready`.
