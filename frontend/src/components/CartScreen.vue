<script setup>
import AppIcon from "./AppIcon.vue";
import { formatRub } from "../lib/format";

defineProps({
  cart: {
    type: Object,
    required: true
  },
  mutatingItemId: {
    type: Number,
    default: null
  }
});

defineEmits(["change-quantity", "open-checkout", "go-catalog"]);
</script>

<template>
  <div class="cart-screen">
    <div v-if="cart.items.length === 0" class="cart-empty">
      <div class="cart-empty__icon">🛒</div>
      <p class="cart-empty__title">Пока ничего не добавлено</p>
      <v-btn class="menu-link" variant="flat" @click="$emit('go-catalog')">
        Перейти в меню
      </v-btn>
    </div>

    <div v-else class="stack-medium">
      <div
        v-for="item in cart.items"
        :key="item.cartItemId"
        class="cart-card"
        :data-testid="`cart-line-${item.cartItemId}`"
      >
        <div class="cart-card__content">
          <div>
            <div class="cart-card__header">
              <h3 class="cart-card__title">{{ item.productName }}</h3>
              <span class="tag-chip">{{ item.selectedSize }}</span>
            </div>
            <p v-if="item.addons.length > 0" class="cart-card__addons">
              + {{ item.addons.map((addon) => addon.name).join(", ") }}
            </p>
            <div class="cart-card__footer">
              <span class="cart-card__qty">×{{ item.quantity }}</span>
              <strong class="cart-card__price">{{ formatRub(item.lineTotalRub) }}</strong>
            </div>
          </div>

          <div class="cart-card__actions">
            <button
              class="mini-icon mini-icon--plus"
              type="button"
              :disabled="mutatingItemId === item.cartItemId"
              @click="$emit('change-quantity', item.cartItemId, 1)"
            >
              <AppIcon name="plus" :size="13" />
            </button>
            <button
              class="mini-icon mini-icon--minus"
              type="button"
              :disabled="mutatingItemId === item.cartItemId"
              @click="$emit('change-quantity', item.cartItemId, -1)"
            >
              <AppIcon name="minus" :size="13" />
            </button>
          </div>
        </div>
      </div>

      <div class="total-card">
        <span>Итого</span>
        <strong>{{ formatRub(cart.totalRub) }}</strong>
      </div>
    </div>

    <div class="bottom-bar bottom-bar--cart">
      <v-btn
        class="primary-action primary-action--full"
        color="secondary"
        variant="flat"
        :disabled="cart.items.length === 0"
        data-testid="checkout-button"
        @click="$emit('open-checkout')"
      >
        Оформить заказ · {{ formatRub(cart.totalRub) }}
      </v-btn>
    </div>
  </div>
</template>
