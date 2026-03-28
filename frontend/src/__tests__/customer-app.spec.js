import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import App from "../App.vue";
import { vuetify } from "../plugins/vuetify";

function response(json, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => json
  });
}

describe("customer app flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("covers catalog -> detail -> cart -> checkout -> history flow", async () => {
    const fetchMock = vi.fn()
      .mockImplementationOnce(() =>
        response({
          categories: [
            {
              id: "cat-coffee",
              name: "Кофе",
              products: [
                {
                  id: "prod-cappuccino",
                  name: "Капучино",
                  description: "Насыщенный вкус.",
                  sizes: [
                    { sizeCode: "S", priceRub: 220 },
                    { sizeCode: "M", priceRub: 260 }
                  ],
                  addonGroups: [
                    {
                      id: "milk",
                      name: "Молоко",
                      selectionRule: "single",
                      minCount: 1,
                      maxCount: 1,
                      addons: [
                        { id: "milk-regular", name: "Обычное", priceRub: 0 },
                        { id: "milk-oat", name: "Овсяное", priceRub: 40 }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        })
      )
      .mockImplementationOnce(() => response({ id: "cart-1", userId: 3, totalRub: 0, items: [] }))
      .mockImplementationOnce(() => response({ orders: [] }))
      .mockImplementationOnce(() =>
        response({
          id: "cart-1",
          userId: 3,
          totalRub: 220,
          items: [
            {
              cartItemId: 1,
              productName: "Капучино",
              selectedSize: "S",
              addons: [{ id: "milk-regular", name: "Обычное", priceRub: 0 }],
              quantity: 1,
              lineTotalRub: 220
            }
          ]
        }, 201)
      )
      .mockImplementationOnce(() =>
        response({
          id: "cart-1",
          userId: 3,
          totalRub: 440,
          items: [
            {
              cartItemId: 1,
              productName: "Капучино",
              selectedSize: "S",
              addons: [{ id: "milk-regular", name: "Обычное", priceRub: 0 }],
              quantity: 2,
              lineTotalRub: 440
            }
          ]
        })
      )
      .mockImplementationOnce(() =>
        response({
          date: "2026-03-28",
          slots: [
            {
              start: "09:00",
              end: "09:10",
              remainingCapacity: 4,
              selectable: true
            }
          ]
        })
      )
      .mockImplementationOnce(() =>
        response({
          id: 1042,
          status: "Created",
          totalRub: 440,
          slot: { start: "09:00", end: "09:10" },
          items: [{ productName: "Капучино", selectedSize: "S", lineTotalRub: 440 }],
          rejectionReason: null,
          createdAt: "2026-03-28T09:00:00.000Z",
          updatedAt: "2026-03-28T09:00:00.000Z"
        }, 201)
      )
      .mockImplementationOnce(() => response({ id: "cart-1", userId: 3, totalRub: 0, items: [] }))
      .mockImplementationOnce(() =>
        response({
          orders: [
            {
              id: 1042,
              status: "Created",
              totalRub: 440,
              slot: { start: "09:00", end: "09:10" },
              items: [{ productName: "Капучино", selectedSize: "S", lineTotalRub: 440 }],
              rejectionReason: null,
              createdAt: "2026-03-28T09:00:00.000Z",
              updatedAt: "2026-03-28T09:00:00.000Z"
            }
          ]
        })
      );

    vi.stubGlobal("fetch", fetchMock);

    const wrapper = mount(App, {
      global: {
        plugins: [vuetify]
      }
    });

    await flushPromises();

    await wrapper.get('[data-testid="category-cat-coffee"]').trigger("click");
    await wrapper.get('[data-testid="product-prod-cappuccino"]').trigger("click");
    await wrapper.get('[data-testid="add-to-cart-prod-cappuccino"]').trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("Корзина");
    expect(wrapper.text()).toContain("Капучино");

    await wrapper.get('[data-testid="cart-line-1"] .mini-icon--plus').trigger("click");
    await flushPromises();

    await wrapper.get('[data-testid="checkout-button"]').trigger("click");
    await flushPromises();
    await wrapper.get('[data-testid="slot-09:00"]').trigger("click");
    await wrapper.get('[data-testid="confirm-order-button"]').trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("История");
    expect(wrapper.text()).toContain("Заказ #1042");
    expect(fetchMock).toHaveBeenCalledTimes(9);
  });
});
