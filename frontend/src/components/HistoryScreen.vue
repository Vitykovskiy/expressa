<script setup>
import AppIcon from "./AppIcon.vue";
import { formatOrderMeta, formatOrderStatus, formatRub } from "../lib/format";

defineProps({
  orders: {
    type: Array,
    required: true
  },
  expandedOrderId: {
    type: Number,
    default: null
  }
});

defineEmits(["toggle-order"]);
</script>

<template>
  <div class="stack-medium">
    <div
      v-for="order in orders"
      :key="order.id"
      class="history-card"
      :class="{ 'history-card--featured': order.status === 'Ready for pickup' }"
      :data-testid="`history-order-${order.id}`"
    >
      <button class="history-card__button" type="button" @click="$emit('toggle-order', order.id)">
        <div class="history-card__top">
          <div class="history-card__identity">
            <strong>Заказ #{{ order.id }}</strong>
            <span class="status-chip" :class="`status-chip--${order.status.replaceAll(' ', '-').toLowerCase()}`">
              {{ formatOrderStatus(order.status) }}
            </span>
          </div>
          <div class="history-card__price">
            <strong>{{ formatRub(order.totalRub) }}</strong>
            <AppIcon name="chevron-down" :size="16" />
          </div>
        </div>
        <p class="history-card__meta">{{ formatOrderMeta(order) }}</p>
      </button>

      <div v-if="expandedOrderId === order.id" class="history-card__details">
        <p v-for="item in order.items" :key="`${order.id}-${item.productName}-${item.selectedSize}`">
          {{ item.productName }} · {{ item.selectedSize }} · {{ formatRub(item.lineTotalRub) }}
        </p>
        <p>Слот: {{ order.slot.start }} - {{ order.slot.end }}</p>
        <p v-if="order.rejectionReason">Причина: {{ order.rejectionReason }}</p>
      </div>
    </div>

    <p v-if="orders.length === 0" class="empty-state__title">
      История пока пустая
    </p>
  </div>
</template>
