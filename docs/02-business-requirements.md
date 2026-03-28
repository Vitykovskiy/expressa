# Business Requirements

This document captures intake-level requirements. Analysis must refine these into canonical system, UI, and contract artifacts in `docs/analysis/`.

## Business Requirements

- `BR-001`: The product must allow customers to place pickup orders through a mobile Telegram-based flow.
- `BR-002`: The product must provide a unified backoffice web interface for baristas and administrators with role-based access separation.
- `BR-003`: Access to the backoffice must be provided through a dedicated Telegram bot separate from the customer bot.
- `BR-004`: The system must be organized as a monorepo while preserving aligned product scenarios and UX expectations across customer and backoffice experiences.
- `BR-005`: Repository documentation must remain the canonical source of truth for requirements, architecture, and delivery decisions.

## Functional Requirements

- `FR-001`: Customers can browse menu items grouped by category.
- `FR-002`: Customers can configure a product before adding it to the cart.
- `FR-003`: Drink products support a mandatory size choice `S`, `M`, or `L`, and price depends on the selected size.
- `FR-004`: Products may have addon groups that are not exposed as standalone menu items.
- `FR-005`: Addons may be paid or free.
- `FR-006`: Customers may choose multiple addons when allowed by the addon-group rules.
- `FR-007`: The domain model must support mutually exclusive addons inside a single group.
- `FR-008`: Customers can review and edit the cart before order placement.
- `FR-009`: Customers can create an order from the cart and select an available pickup slot.
- `FR-010`: Pickup slots are 10-minute intervals within configured operating hours.
- `FR-011`: Slots are available only for the current day.
- `FR-012`: Default operating hours are `09:00-20:00`, and an administrator can change them.
- `FR-013`: Default slot capacity is 5 active orders, and an administrator can change it.
- `FR-014`: Orders in `Created`, `Confirmed`, and `Ready for pickup` consume slot capacity.
- `FR-015`: Orders in `Rejected` and `Closed` do not consume slot capacity.
- `FR-016`: Order statuses are `Created`, `Confirmed`, `Rejected`, `Ready for pickup`, and `Closed`.
- `FR-017`: A newly created order immediately receives status `Created`.
- `FR-018`: Only a barista can reject an order, and the system must store the rejection reason.
- `FR-019`: A barista can confirm an order, mark it `Ready for pickup`, and close it after offline pickup.
- `FR-020`: Customers can view their order history.
- `FR-021`: Payment happens offline on pickup; in-app payment is out of scope for v1.
- `FR-022`: Customers receive Telegram notifications when order status changes; rejection notifications include the rejection reason.
- `FR-023`: Identity is based on Telegram; any user who activates the customer bot automatically receives customer access.
- `FR-024`: A user blocked by an administrator cannot use the application.
- `FR-025`: The root administrator is defined at deployment time by `ADMIN_TELEGRAM_ID`; on startup the backend must ensure that this user exists in the database with role `administrator`, and repeated startup must remain idempotent.
- `FR-026`: Baristas receive periodic Telegram reminders about orders that are waiting for action.
- `FR-027`: Administrators can manage menu structure, products, prices, and operating hours.
- `FR-028`: Administrators can assign users to the `barista` role.
- `FR-029`: Administrators can block users.
- `FR-030`: Baristas can change temporary availability of menu items, options, and addons, but cannot change prices or menu structure.
- `FR-031`: The system records which barista confirmed an order.
- `FR-032`: The system records which barista marked an order `Ready for pickup`.
- `FR-033`: The system records which barista rejected an order.
- `FR-034`: The backoffice is tab-based with role-restricted access: `Orders` and `Availability` for `barista` and `administrator`; `Menu`, `Users`, and `Settings` only for `administrator`.

## Non-Functional Requirements

- `NFR-001`: Backend must use NestJS.
- `NFR-002`: Frontend applications must use Vue 3 and Vuetify.
- `NFR-003`: The system must be a monorepo with shared tooling and reusable packages.
- `NFR-004`: Architecture must prioritize maintainability, modularity, and clear responsibility boundaries.
- `NFR-005`: Deployment must be transparent, controllable, and easy to operate.
- `NFR-006`: Documentation must be sufficient to continue work without relying on unrecorded session context.
- `NFR-007`: Public UX and business behavior must match agreed product scenarios.
- `NFR-008`: Monetary values are in Russian rubles and rounded to integer values.
- `NFR-009`: Promotions and discount logic are out of scope for v1.
- `NFR-010`: User interfaces must be simple, clear, and adaptive for mobile screens.
- `NFR-011`: The backoffice must support daily operational use by baristas inside the Telegram flow and preserve role separation for administrators.
- `NFR-012`: Every push must deploy or update a VPS-based test environment with database, frontend, and backend containers, then run smoke and e2e tests against it.
- `NFR-013`: Build, smoke, and e2e checks on the VPS test environment must be required for merge.
- `NFR-014`: After merge, the system must perform a production-mode build for the production VPS stream.
- `NFR-015`: In the test environment, Telegram authorization is disabled through `DISABLE_TG_AUTH=true`; when enabled, the backend accepts requests without Telegram validation and uses seeded identifiers.

## Acceptance Expectations

- The customer flow covers menu -> product configuration -> cart -> slot selection -> order history.
- The barista flow covers review -> confirm or reject -> ready -> close, including reminders for orders waiting for action.
- The administrator flow covers menu management, price management, operating hours, slot capacity, barista assignment, and user blocking.
- The menu model supports product groups, drink sizes, addon groups, free addons, and mutually exclusive options.
- Baristas can temporarily enable or disable menu positions and options without changing prices or menu structure.
- Audit history stores which barista confirmed, prepared, or rejected the order.
- Push-based VPS validation runs build, smoke, and e2e before merge.

Detailed implementation-ready acceptance criteria should be fixed in `docs/analysis/version-scope-and-acceptance.md`.

## Open Questions

- What exact reminder interval and escalation behavior should be used for barista Telegram reminders in v1?
- Can an `administrator` perform all order-processing actions available to a `barista`, or should those actions remain explicitly barista-only in the UI and API layer?
- How should the system behave when an item becomes unavailable after it was added to the cart but before order submission?
- Should temporary availability changes reset automatically on a schedule, or remain in effect until changed manually?

## Assumptions

- Telegram is the primary identity and access channel for v1.
- A product can inherit addon groups from its product group.
- The API is designed around the current product behavior and current scenarios rather than generic commerce abstractions.
- The data model is intentionally shaped around the current business rules of v1.
