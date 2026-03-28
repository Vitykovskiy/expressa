function resolveApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? "";
}

function resolveTelegramId() {
  return import.meta.env.VITE_CUSTOMER_TELEGRAM_ID ?? "3001";
}

async function request(path, { method = "GET", body } = {}) {
  const headers = {
    "x-telegram-id": resolveTelegramId()
  };
  if (body !== undefined) {
    headers["content-type"] = "application/json";
  }

  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const json = await response.json();
  if (!response.ok) {
    const error = new Error(json.error ?? "Request failed");
    error.status = response.status;
    throw error;
  }
  return json;
}

export const customerApi = {
  getMenu() {
    return request("/customer/menu");
  },
  getCart() {
    return request("/customer/cart");
  },
  addCartItem(payload) {
    return request("/customer/cart/items", { method: "POST", body: payload });
  },
  updateCartItemQuantity(cartItemId, delta) {
    return request(`/customer/cart/items/${cartItemId}/quantity`, {
      method: "POST",
      body: { delta }
    });
  },
  getSlots() {
    return request("/customer/slots");
  },
  createOrder(slotStart) {
    return request("/customer/orders", {
      method: "POST",
      body: { slotStart }
    });
  },
  getOrders() {
    return request("/customer/orders");
  }
};
