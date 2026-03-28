# Domain Model

## Entities

| Entity | Purpose | Key fields | Rules |
| --- | --- | --- | --- |
| User | Stores Telegram-identified actor and access state | `id`, `telegram_id`, `role`, `is_blocked`, profile fields | Customer access is automatic after customer-bot activation; blocked users cannot use the app |
| Role assignment | Captures elevated access beyond customer baseline | `user_id`, `role`, assignment metadata | `administrator` and `barista` determine backoffice permissions |
| Menu category | Groups menu items for browsing | `id`, `name`, `sort_order`, `is_active` | Customer catalog is grouped by category |
| Product | Sellable customer-facing item | `id`, `category_id`, `name`, `description`, `base_state`, `is_temporarily_available` | Can expose size and addon configuration rules |
| Product size option | Defines mandatory drink size and price | `id`, `product_id`, `size_code`, `price_rub` | Required for drinks; supported values are `S`, `M`, `L` in v1 |
| Addon group | Defines a selectable addon rule set | `id`, `owner_type`, `owner_id`, `name`, `selection_rule`, `min_count`, `max_count` | May belong to a product or inherited product group; can enforce mutually exclusive choices |
| Addon | Selectable option inside an addon group | `id`, `addon_group_id`, `name`, `price_rub`, `is_temporarily_available` | May be free or paid; not shown as standalone catalog item |
| Cart | Pre-order state for a customer session | `id`, `user_id`, timestamps | Editable until checkout |
| Cart item | Configured product in cart | `id`, `cart_id`, `product_id`, `selected_size`, pricing snapshot | Contains chosen addon selections |
| Pickup slot | Represents a bookable 10-minute interval for current day | `date`, `start_time`, `end_time`, `capacity_limit`, `active_order_count` | Generated within working hours; only current-day slots are available |
| Operating settings | Stores business-hour and slot-capacity configuration | `working_hours_start`, `working_hours_end`, `slot_capacity`, timestamps | Defaults are `09:00-20:00` and capacity `5`; admin-editable |
| Order | Customer order lifecycle aggregate | `id`, `user_id`, `slot`, `status`, `total_rub`, timestamps, `rejection_reason` | Created from cart; status set is fixed for v1 |
| Order item | Snapshot of configured purchased item | `id`, `order_id`, `product_name`, `size`, `unit_price_rub`, `addons`, `line_total_rub` | Preserves order-time pricing and configuration |
| Order audit | Stores accountable barista actions | `order_id`, `confirmed_by`, `ready_by`, `rejected_by`, timestamps | Required for confirm, ready, and reject actions |
| Reminder target / notification log | Supports Telegram notifications and reminders | `user_id`, `channel`, `event_type`, delivery metadata | Used for customer status notifications and barista reminders |

## Data Formats

| Format | Producer | Consumer | Notes |
| --- | --- | --- | --- |
| Customer order summary | Backend | Customer web app | Contains order id, status, total, slot, and visible item summary |
| Backoffice order queue item | Backend | Backoffice web app | Contains customer-facing order details, totals, slot, and available actions |
| Slot availability entry | Backend | Customer web app | Contains slot time range, remaining capacity, and selectable state |
| Menu product detail | Backend | Customer web app | Contains category, product data, size options, addon groups, pricing, and availability |
| Audit snapshot | Backend | Admin/backoffice views, tests | Contains responsible barista ids for tracked actions |

## Validation Rules

- Orders may transition only within the v1 status model: `Created -> Confirmed -> Ready for pickup -> Closed`, with `Rejected` reachable from a pending actionable state according to finalized transition rules.
- Rejection requires a stored reason.
- Slot capacity counts only orders in `Created`, `Confirmed`, and `Ready for pickup`.
- `Rejected` and `Closed` orders do not consume slot capacity.
- Currency values are stored and exposed in integer rubles for v1 behavior.
- Root administrator bootstrap must be idempotent for `ADMIN_TELEGRAM_ID`.
