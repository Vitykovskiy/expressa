# User Scenarios

## Primary Users

| User type | Goal | Notes |
| --- | --- | --- |
| Customer | Browse menu, configure items, place pickup orders, and review order history | Access through customer Telegram bot web app; blocked users cannot use the app |
| Barista | Review and process orders, manage temporary availability, and receive reminders | Access through backoffice Telegram bot web app |
| Administrator | Operate the same backoffice with expanded control over menu, users, and settings | Can assign barista role and block users |

## Scenarios

### Scenario `CUS-01` Customer places a pickup order

- Trigger: Customer opens the customer web app from Telegram.
- Actor: Customer.
- Preconditions: User has activated the customer bot, is not blocked, and menu data exists.
- Main flow:
  1. Customer browses menu categories and opens a product.
  2. Customer selects a required size when the product is a drink.
  3. Customer selects allowed addons from one or more addon groups.
  4. Customer adds the configured product to the cart.
  5. Customer reviews and edits the cart.
  6. Customer opens pickup-slot selection and chooses an available slot for the current day.
  7. Customer submits the order.
- Expected result: Order is created with status `Created`, occupies slot capacity, and appears in customer order history.
- Failure or edge cases: blocked user cannot proceed; unavailable slot cannot be selected; unavailable item or invalid configuration must block submission; empty cart cannot be submitted.

### Scenario `CUS-02` Customer tracks order history and status notifications

- Trigger: Customer wants to review existing orders or receives a status update.
- Actor: Customer.
- Preconditions: Customer has at least one order or receives Telegram notifications from the customer bot.
- Main flow:
  1. Customer opens order history in the customer web app.
  2. Customer reviews statuses for previous and current orders.
  3. When the order status changes, customer receives a Telegram notification.
  4. If the order is rejected, the customer sees the rejection reason in the notification.
- Expected result: Customer sees the full history of their own orders and receives status-change notifications with rejection context when relevant.
- Failure or edge cases: user must not see another customer's orders; missing notification delivery must not corrupt order history state.

### Scenario `BAR-01` Barista processes an incoming order

- Trigger: A new order enters the queue in status `Created`.
- Actor: Barista.
- Preconditions: User has `barista` role and accesses the backoffice through the backoffice Telegram bot.
- Main flow:
  1. Barista opens the `Orders` tab and reviews incoming orders and total amounts.
  2. Barista confirms the order or rejects it with a reason.
  3. For a confirmed order, barista later marks it `Ready for pickup`.
  4. After offline handoff, barista closes the order.
- Expected result: Status transitions are persisted, customer notifications are triggered, slot-capacity behavior follows status rules, and audit fields capture which barista handled each key action.
- Failure or edge cases: rejection requires a reason; only barista-capable actors may reject; invalid status transitions must be blocked.

### Scenario `BAR-02` Barista manages temporary availability

- Trigger: An item, option, or addon must be temporarily disabled or re-enabled.
- Actor: Barista.
- Preconditions: User has `barista` role and access to the `Availability` tab.
- Main flow:
  1. Barista opens the `Availability` tab.
  2. System loads the full availability read-model, including currently unavailable entities that may need re-enabling.
  3. Barista changes temporary availability for a menu item, option, or addon.
  4. Customer-facing catalog reflects the new availability state for future order attempts.
- Expected result: Availability changes affect ordering behavior without changing menu structure or prices, and previously unavailable entities remain visible for re-enable actions.
- Failure or edge cases: barista must not be able to edit prices or structural menu data; if read-model loading fails, availability mutations must not proceed on stale or partial data.

### Scenario `BAR-03` Barista receives reminders for orders waiting for action

- Trigger: Orders remain in a state that requires barista action.
- Actor: Barista.
- Preconditions: Reminder process is configured and backoffice Telegram bot is connected.
- Main flow:
  1. System identifies orders waiting for action.
  2. System sends periodic reminders to baristas through the backoffice Telegram bot.
  3. Barista returns to the backoffice and processes the order.
- Expected result: Baristas receive actionable reminders for pending work.
- Failure or edge cases: exact reminder cadence remains an analysis follow-up and must be fixed before implementation.

### Scenario `ADM-01` Administrator manages menu and settings

- Trigger: Administrator needs to maintain product offering or operating constraints.
- Actor: Administrator.
- Preconditions: User has `administrator` role and opens the shared backoffice.
- Main flow:
  1. Administrator opens `Menu` to manage categories, products, sizes, addons, and prices.
  2. Administrator opens `Settings` to change working hours and slot capacity.
  3. Changes are saved and become active in customer ordering behavior.
- Expected result: Menu and operational settings are updated through the backoffice and applied consistently.
- Failure or edge cases: administrator-only tabs must not be visible or accessible to baristas.

### Scenario `ADM-02` Administrator manages users and access

- Trigger: Administrator needs to assign roles or block a user.
- Actor: Administrator.
- Preconditions: User has `administrator` role.
- Main flow:
  1. Administrator opens the `Users` tab.
  2. Administrator assigns the `barista` role to a user when required.
  3. Administrator blocks or unblocks a user.
- Expected result: Role and access changes are persisted and enforced in the relevant apps.
- Failure or edge cases: blocked users cannot continue customer flow; root administrator bootstrap remains controlled by `ADMIN_TELEGRAM_ID`.

Record scenarios before contour decomposition.
