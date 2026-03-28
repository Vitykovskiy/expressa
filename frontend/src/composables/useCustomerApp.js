import { computed, reactive } from "vue";
import { customerApi } from "../lib/api";

function buildDraft(product) {
  return {
    selectedSize: product.sizes[0]?.sizeCode ?? "",
    selectedAddonIds: product.addonGroups
      .filter((group) => group.minCount > 0)
      .flatMap((group) => group.addons.slice(0, group.minCount).map((addon) => addon.id)),
    quantity: 1
  };
}

export function useCustomerApp() {
  const state = reactive({
    screen: "catalog",
    categoryId: null,
    productId: null,
    menu: { categories: [] },
    cart: { items: [], totalRub: 0 },
    orders: [],
    bootstrapLoading: true,
    blocked: false,
    globalError: "",
    inlineError: "",
    snackbar: "",
    draft: null,
    cartMutationId: null,
    addToCartLoading: false,
    slotDialogOpen: false,
    slotsState: {
      loading: false,
      error: "",
      date: "",
      slots: []
    },
    selectedSlot: "",
    orderSubmitting: false,
    expandedOrderId: null
  });

  const category = computed(() =>
    state.menu.categories.find((entry) => entry.id === state.categoryId) ?? null
  );

  const product = computed(() =>
    category.value?.products.find((entry) => entry.id === state.productId) ?? null
  );

  const badgeCount = computed(() =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  async function bootstrap() {
    state.bootstrapLoading = true;
    state.globalError = "";
    try {
      const [menu, cart, orders] = await Promise.all([
        customerApi.getMenu(),
        customerApi.getCart(),
        customerApi.getOrders()
      ]);
      state.menu = menu;
      state.cart = cart;
      state.orders = orders.orders;
      state.blocked = false;
    } catch (error) {
      if (error.status === 403) {
        state.blocked = true;
        state.globalError = "Доступ к клиентскому приложению закрыт.";
      } else {
        state.globalError = error.message;
      }
    } finally {
      state.bootstrapLoading = false;
    }
  }

  function openCatalog() {
    state.screen = "catalog";
    state.categoryId = null;
    state.productId = null;
    state.inlineError = "";
  }

  function openCategory(categoryId) {
    state.categoryId = categoryId;
    state.productId = null;
    state.screen = "group";
    state.inlineError = "";
  }

  function openProduct(productId) {
    state.productId = productId;
    state.screen = "detail";
    state.inlineError = "";
    if (product.value) {
      state.draft = buildDraft(product.value);
    }
  }

  function openCart() {
    state.screen = "cart";
    state.inlineError = "";
  }

  function openHistory() {
    state.screen = "history";
    state.inlineError = "";
  }

  function goBack() {
    if (state.screen === "detail") {
      state.screen = "group";
    } else if (state.screen === "group") {
      openCatalog();
    } else if (state.screen === "cart" || state.screen === "history") {
      openCatalog();
    }
  }

  function setSize(sizeCode) {
    state.draft.selectedSize = sizeCode;
    state.inlineError = "";
  }

  function toggleAddon(group, addonId) {
    const selected = new Set(state.draft.selectedAddonIds);
    const groupAddonIds = group.addons.map((addon) => addon.id);
    const selectedInGroup = groupAddonIds.filter((id) => selected.has(id));

    if (selected.has(addonId)) {
      if (selectedInGroup.length <= group.minCount) {
        return;
      }
      selected.delete(addonId);
    } else {
      if (group.selectionRule === "single") {
        groupAddonIds.forEach((id) => selected.delete(id));
      } else if (selectedInGroup.length >= group.maxCount) {
        return;
      }
      selected.add(addonId);
    }

    state.draft.selectedAddonIds = Array.from(selected);
    state.inlineError = "";
  }

  function changeDraftQuantity(delta) {
    state.draft.quantity = Math.max(1, state.draft.quantity + delta);
  }

  function validateDraft() {
    if (!product.value) {
      state.inlineError = "Продукт не найден.";
      return false;
    }
    if (!state.draft.selectedSize) {
      state.inlineError = "Выберите размер.";
      return false;
    }

    for (const group of product.value.addonGroups) {
      const selectedCount = group.addons.filter((addon) =>
        state.draft.selectedAddonIds.includes(addon.id)
      ).length;
      if (selectedCount < group.minCount || selectedCount > group.maxCount) {
        state.inlineError = `Проверьте выбор в блоке «${group.name}».`;
        return false;
      }
    }
    return true;
  }

  async function addToCart() {
    if (!validateDraft()) {
      return;
    }

    state.addToCartLoading = true;
    state.inlineError = "";
    try {
      let snapshot = await customerApi.addCartItem({
        productId: product.value.id,
        selectedSize: state.draft.selectedSize,
        selectedAddons: state.draft.selectedAddonIds
      });
      const createdLine = snapshot.items[snapshot.items.length - 1];

      for (let step = 1; step < state.draft.quantity; step += 1) {
        snapshot = await customerApi.updateCartItemQuantity(createdLine.cartItemId, 1);
      }

      state.cart = snapshot;
      state.snackbar = "Товар добавлен в корзину.";
      openCart();
    } catch (error) {
      state.inlineError = error.message;
    } finally {
      state.addToCartLoading = false;
    }
  }

  async function changeCartQuantity(cartItemId, delta) {
    state.cartMutationId = cartItemId;
    try {
      state.cart = await customerApi.updateCartItemQuantity(cartItemId, delta);
    } catch (error) {
      state.snackbar = error.message;
    } finally {
      state.cartMutationId = null;
    }
  }

  async function openCheckout() {
    state.slotDialogOpen = true;
    state.selectedSlot = "";
    state.slotsState.loading = true;
    state.slotsState.error = "";
    try {
      const result = await customerApi.getSlots();
      state.slotsState = {
        loading: false,
        error: "",
        date: result.date,
        slots: result.slots
      };
    } catch (error) {
      state.slotsState.loading = false;
      state.slotsState.error = error.message;
    }
  }

  function closeCheckout() {
    state.slotDialogOpen = false;
    state.selectedSlot = "";
  }

  async function submitOrder() {
    if (!state.selectedSlot) {
      return;
    }
    state.orderSubmitting = true;
    try {
      await customerApi.createOrder(state.selectedSlot);
      state.cart = await customerApi.getCart();
      const orders = await customerApi.getOrders();
      state.orders = orders.orders;
      state.snackbar = "Заказ оформлен.";
      closeCheckout();
      openHistory();
    } catch (error) {
      state.slotsState.error = error.message;
    } finally {
      state.orderSubmitting = false;
    }
  }

  function toggleHistoryOrder(orderId) {
    state.expandedOrderId = state.expandedOrderId === orderId ? null : orderId;
  }

  return {
    state,
    category,
    product,
    badgeCount,
    bootstrap,
    openCatalog,
    openCategory,
    openProduct,
    openCart,
    openHistory,
    goBack,
    setSize,
    toggleAddon,
    changeDraftQuantity,
    addToCart,
    changeCartQuantity,
    openCheckout,
    closeCheckout,
    submitOrder,
    toggleHistoryOrder
  };
}
