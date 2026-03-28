# System Modules

## Module List

| Module | Responsibility | Owned contour | Depends on |
| --- | --- | --- | --- |
| Customer Telegram bot integration | Launch customer web app and send customer notifications | backend | Telegram platform, notification subsystem |
| Backoffice Telegram bot integration | Launch backoffice web app and send barista reminders | backend | Telegram platform, reminder subsystem |
| Customer web app | Customer menu, cart, slot selection, and order history UI | frontend | Customer API, Telegram launch context |
| Backoffice web app | Order queue, availability controls, menu admin, user admin, settings UI | frontend | Backoffice API, role permissions, Telegram launch context |
| Identity and access module | Resolve Telegram users, roles, blocked state, and bootstrap administrator | backend | Database, Telegram auth contract, environment variables |
| Catalog module | Categories, products, sizes, addon groups, addon availability | backend | Database, admin/backoffice controls |
| Cart and checkout module | Cart editing, pricing assembly, slot selection, order creation | backend | Catalog module, slot module, identity |
| Slot management module | Generate current-day slots and enforce capacity | backend | Operating settings, order lifecycle |
| Order lifecycle module | Persist orders, status transitions, audit fields, and history | backend | Cart module, slot module, notification subsystem |
| Notification and reminder module | Send customer status notifications and barista reminders | backend | Telegram integrations, order events |
| Admin settings module | Working hours, slot capacity, role management, blocking | backend | Identity, slot, catalog |
| Deployment and test environment | VPS runtime, containers, smoke, and e2e orchestration | devops | CI pipeline, secrets, application services |

## Relationships

| From module | To module | Relationship | Notes |
| --- | --- | --- | --- |
| Customer web app | Cart and checkout module | API | Customer composes cart and creates orders through backend APIs |
| Customer web app | Catalog module | API | Reads categories, products, sizes, addons, and availability |
| Customer web app | Slot management module | API | Reads selectable current-day slots |
| Backoffice web app | Order lifecycle module | API | Reads queue and performs status actions |
| Backoffice web app | Catalog module | API | Changes temporary availability and, for admin, menu structure and pricing |
| Backoffice web app | Admin settings module | API | Updates users, roles, blocked state, working hours, and capacity |
| Order lifecycle module | Notification and reminder module | Event | Order creation and status changes trigger notifications and reminders |
| Slot management module | Order lifecycle module | Data dependency | Capacity depends on active-order status accounting |
| Identity and access module | Customer web app | Auth context | Determines whether a user may use the customer surface |
| Identity and access module | Backoffice web app | Auth context | Determines role-restricted access to tabs and actions |
| Deployment and test environment | All runtime modules | Runtime | Provides VPS-based validation and required merge checks |

## Design Notes

- The architecture should preserve clear boundaries between customer-facing flow, backoffice flow, and Telegram-specific integration concerns.
- Reminder processing should be isolated enough that changing cadence does not force broad changes across unrelated modules.
- Analysis still needs exact screen-to-frame mapping for `ui_screens` before frontend delivery decomposition is complete.
