import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

function parseArgs(argv) {
  const args = {
    "--base-url": "http://127.0.0.1:18081",
    "--actors": "tests/e2e/fixtures/actors.json",
    "--rejection": "tests/e2e/fixtures/rejection.json"
  };

  for (let index = 2; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) {
      throw new Error(`Missing value for argument ${key}`);
    }
    args[key] = value;
  }

  return {
    baseUrl: args["--base-url"].replace(/\/+$/, ""),
    actorsFile: args["--actors"],
    rejectionFile: args["--rejection"]
  };
}

async function loadJson(path) {
  const content = await readFile(path, "utf8");
  return JSON.parse(content);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth(baseUrl) {
  const attempts = 30;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/healthz`);
      if (response.ok) {
        return;
      }
    } catch {
      // Service can be unavailable while booting.
    }
    await sleep(1000);
  }
  throw new Error(`Backend is not healthy at ${baseUrl}/healthz`);
}

async function request(baseUrl, { path, method = "GET", actorId, body }) {
  const headers = {};
  if (actorId) {
    headers["x-telegram-id"] = String(actorId);
  }
  if (body !== undefined) {
    headers["content-type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const contentType = response.headers.get("content-type") || "";
  let payload;
  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    payload = { raw: await response.text() };
  }

  return { status: response.status, payload };
}

function pickCartPayload(menuPayload) {
  assert.ok(Array.isArray(menuPayload.categories), "Menu response must contain categories");
  assert.ok(menuPayload.categories.length > 0, "Menu must contain at least one category");

  const category = menuPayload.categories[0];
  assert.ok(Array.isArray(category.products), "Category must contain products");
  assert.ok(category.products.length > 0, "Category must have at least one product");

  const product = category.products[0];
  assert.ok(Array.isArray(product.sizes), "Product must contain sizes");
  assert.ok(product.sizes.length > 0, "Product must have at least one size");

  const selectedAddons = [];
  const addonGroups = Array.isArray(product.addonGroups) ? product.addonGroups : [];
  for (const group of addonGroups) {
    const minCount = Number(group.minCount || 0);
    if (minCount <= 0) {
      continue;
    }
    assert.ok(Array.isArray(group.addons), "Addon group must provide addons");
    assert.ok(group.addons.length >= minCount, "Addon group does not have enough addons");
    for (let index = 0; index < minCount; index += 1) {
      selectedAddons.push(group.addons[index].id);
    }
  }

  return {
    productId: product.id,
    selectedSize: product.sizes[0].sizeCode,
    selectedAddons
  };
}

async function createOrder(baseUrl, customerId) {
  const menu = await request(baseUrl, {
    path: "/customer/menu",
    actorId: customerId
  });
  assert.equal(menu.status, 200, `GET /customer/menu failed for ${customerId}`);

  const cartItemPayload = pickCartPayload(menu.payload);
  const addCartItem = await request(baseUrl, {
    method: "POST",
    path: "/customer/cart/items",
    actorId: customerId,
    body: cartItemPayload
  });
  assert.equal(addCartItem.status, 201, `POST /customer/cart/items failed for ${customerId}`);

  const slots = await request(baseUrl, {
    path: "/customer/slots",
    actorId: customerId
  });
  assert.equal(slots.status, 200, `GET /customer/slots failed for ${customerId}`);
  assert.ok(Array.isArray(slots.payload.slots), "Slots response must contain slots array");
  const slot = slots.payload.slots.find((candidate) => candidate.selectable);
  assert.ok(slot, "No selectable slot returned for customer");

  const create = await request(baseUrl, {
    method: "POST",
    path: "/customer/orders",
    actorId: customerId,
    body: { slotStart: slot.start }
  });
  assert.equal(create.status, 201, `POST /customer/orders failed for ${customerId}`);
  assert.ok(create.payload.id, "Created order must contain id");
  return create.payload;
}

async function main() {
  const { baseUrl, actorsFile, rejectionFile } = parseArgs(process.argv);
  const actors = await loadJson(actorsFile);
  const rejectionFixture = await loadJson(rejectionFile);

  const baristaId = process.env.BARISTA_TELEGRAM_ID || actors.baristaTelegramId;
  const customerId = process.env.CUSTOMER_TELEGRAM_ID || actors.customerTelegramId;
  const secondaryCustomerId =
    process.env.SECONDARY_CUSTOMER_TELEGRAM_ID || actors.secondaryCustomerTelegramId;

  await waitForHealth(baseUrl);
  console.log(`Backend is healthy at ${baseUrl}`);

  console.log("Scenario 1: customer order lifecycle through backoffice transitions");
  const firstOrder = await createOrder(baseUrl, customerId);
  assert.equal(firstOrder.status, "Created", "Order status after creation must be Created");

  const customerHistory = await request(baseUrl, {
    path: "/customer/orders",
    actorId: customerId
  });
  assert.equal(customerHistory.status, 200, "GET /customer/orders failed");
  assert.ok(
    customerHistory.payload.orders.some((order) => order.id === firstOrder.id),
    "Created order not visible in customer history"
  );

  const queue = await request(baseUrl, {
    path: "/backoffice/orders",
    actorId: baristaId
  });
  assert.equal(queue.status, 200, "GET /backoffice/orders failed for barista");
  assert.ok(
    queue.payload.orders.some((order) => order.id === firstOrder.id),
    "Created order not visible in backoffice queue"
  );

  const confirm = await request(baseUrl, {
    method: "POST",
    path: `/backoffice/orders/${firstOrder.id}/confirm`,
    actorId: baristaId
  });
  assert.equal(confirm.status, 200, "Confirm transition failed");
  assert.equal(confirm.payload.status, "Confirmed", "Status after confirm must be Confirmed");

  const markReady = await request(baseUrl, {
    method: "POST",
    path: `/backoffice/orders/${firstOrder.id}/ready`,
    actorId: baristaId
  });
  assert.equal(markReady.status, 200, "Ready transition failed");
  assert.equal(
    markReady.payload.status,
    "Ready for pickup",
    "Status after ready transition must be Ready for pickup"
  );

  const close = await request(baseUrl, {
    method: "POST",
    path: `/backoffice/orders/${firstOrder.id}/close`,
    actorId: baristaId
  });
  assert.equal(close.status, 200, "Close transition failed");
  assert.equal(close.payload.status, "Closed", "Status after close must be Closed");

  console.log("Scenario 2: rejection reason is mandatory and preserved");
  const secondOrder = await createOrder(baseUrl, secondaryCustomerId);
  const rejectWithoutReason = await request(baseUrl, {
    method: "POST",
    path: `/backoffice/orders/${secondOrder.id}/reject`,
    actorId: baristaId,
    body: {}
  });
  assert.equal(rejectWithoutReason.status, 400, "Reject without reason must return 400");

  const rejectWithReason = await request(baseUrl, {
    method: "POST",
    path: `/backoffice/orders/${secondOrder.id}/reject`,
    actorId: baristaId,
    body: { reason: rejectionFixture.reason }
  });
  assert.equal(rejectWithReason.status, 200, "Reject with reason failed");
  assert.equal(rejectWithReason.payload.status, "Rejected", "Status after reject must be Rejected");
  assert.equal(
    rejectWithReason.payload.rejectionReason,
    rejectionFixture.reason,
    "Rejection reason was not persisted"
  );

  console.log("All Slice A QA integration scenarios passed.");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
