<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";
import { formatRub } from "../lib/format";

const props = defineProps({
  categoryName: {
    type: String,
    required: true
  },
  product: {
    type: Object,
    required: true
  },
  draft: {
    type: Object,
    required: true
  },
  errorMessage: {
    type: String,
    default: ""
  },
  submitting: {
    type: Boolean,
    default: false
  }
});

const selectedSizePrice = computed(() => {
  const selected = props.product.sizes.find((size) => size.sizeCode === props.draft.selectedSize);
  return selected?.priceRub ?? props.product.sizes[0]?.priceRub ?? 0;
});

const selectedAddons = computed(() =>
  props.product.addonGroups.flatMap((group) => group.addons).filter((addon) => props.draft.selectedAddonIds.includes(addon.id))
);

const totalRub = computed(() => {
  const addonTotal = selectedAddons.value.reduce((sum, addon) => sum + addon.priceRub, 0);
  return (selectedSizePrice.value + addonTotal) * props.draft.quantity;
});

defineEmits(["toggle-addon", "set-size", "change-quantity", "add-to-cart"]);
</script>

<template>
  <div class="product-detail">
    <div class="product-detail__hero">
      <p class="product-detail__eyebrow">{{ categoryName }}</p>
      <h2 class="product-detail__title">{{ product.name }}</h2>
      <p class="product-detail__price">{{ formatRub(totalRub) }}</p>
    </div>

    <p class="product-detail__description">{{ product.description }}</p>

    <section class="detail-section">
      <p class="detail-section__title">Размер</p>
      <div class="choice-row">
        <button
          v-for="size in product.sizes"
          :key="size.sizeCode"
          class="choice-pill"
          :class="{ 'choice-pill--active': draft.selectedSize === size.sizeCode }"
          type="button"
          :data-testid="`size-${size.sizeCode}`"
          @click="$emit('set-size', size.sizeCode)"
        >
          {{ size.sizeCode }} · {{ formatRub(size.priceRub) }}
        </button>
      </div>
    </section>

    <section
      v-for="group in product.addonGroups"
      :key="group.id"
      class="detail-section"
    >
      <p class="detail-section__title">{{ group.name }}</p>
      <div class="choice-column">
        <button
          v-for="addon in group.addons"
          :key="addon.id"
          class="choice-pill choice-pill--wide"
          :class="{ 'choice-pill--active': draft.selectedAddonIds.includes(addon.id) }"
          type="button"
          :data-testid="`addon-${addon.id}`"
          @click="$emit('toggle-addon', group, addon.id)"
        >
          {{ addon.name }} · {{ formatRub(addon.priceRub) }}
        </button>
      </div>
    </section>

    <p v-if="errorMessage" class="inline-error">{{ errorMessage }}</p>

    <div class="bottom-bar">
      <div class="quantity-control">
        <button
          class="quantity-control__button"
          type="button"
          aria-label="Уменьшить количество"
          @click="$emit('change-quantity', -1)"
        >
          <AppIcon name="minus" :size="16" />
        </button>
        <span class="quantity-control__value">{{ draft.quantity }}</span>
        <button
          class="quantity-control__button"
          type="button"
          aria-label="Увеличить количество"
          @click="$emit('change-quantity', 1)"
        >
          <AppIcon name="plus" :size="16" />
        </button>
      </div>

      <v-btn
        class="primary-action"
        :loading="submitting"
        variant="flat"
        color="secondary"
        :data-testid="`add-to-cart-${product.id}`"
        @click="$emit('add-to-cart')"
      >
        Добавить · {{ formatRub(totalRub) }}
      </v-btn>
    </div>
  </div>
</template>
