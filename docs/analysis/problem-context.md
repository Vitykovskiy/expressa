# Problem Context

## Business Problem

Expressa is a Telegram-centric pickup ordering platform for a cafeteria bar. The product must reduce friction between item selection, order placement, and order pickup for customers who interact through a Telegram web app. The current problem space is not generic e-commerce; it is a fast-turnaround beverage and addon flow where customers need quick ordering and predictable pickup.

The operational side has a parallel problem. Baristas and administrators need a single backoffice experience for order processing, temporary availability changes, menu management, and access control. Without this, order handling becomes inconsistent and hard to coordinate during daily service.

## Stakeholders

| Stakeholder | Need | Notes |
| --- | --- | --- |
| Customer | Place a pickup order quickly from Telegram without queue friction | Any user activating the customer bot becomes a customer unless blocked |
| Barista | Process incoming orders and manage temporary availability with minimal operational overhead | Uses the backoffice web app from a dedicated Telegram bot |
| Administrator | Control menu, pricing, working hours, capacity, and access rights | Uses the same backoffice surface with extended permissions |
| Product owner / repository maintainers | Keep architecture, deployment, and documentation manageable in a monorepo | Documentation must remain canonical across sessions |

## Business Context

- Customer access is Telegram-first and URL-only access outside Telegram is not supported for v1.
- Barista and administrator access is also Telegram-first, but through a separate backoffice bot.
- Payment remains offline at pickup, so order lifecycle and notification quality are more important than payment orchestration in v1.
- The project explicitly values maintainable architecture, transparent deployment, and documentation quality as product requirements, not only engineering preferences.

## Risks If Unchanged

- Customers continue to face avoidable friction between menu browsing, configuration, queueing, and pickup.
- Baristas and administrators continue operating without a predictable shared tool for order state handling and temporary availability management.
- Delivery can stall if requirements remain only in transient chat context instead of canonical repository documents.
