<script setup>
import { formatRub } from "../lib/format";

defineProps({
  category: {
    type: Object,
    required: true
  }
});

defineEmits(["select-product"]);
</script>

<template>
  <div class="stack-medium">
    <button
      v-for="product in category.products"
      :key="product.id"
      class="product-card"
      type="button"
      :data-testid="`product-${product.id}`"
      @click="$emit('select-product', product.id)"
    >
      <h2 class="product-card__title">{{ product.name }}</h2>
      <p class="product-card__meta">Напиток</p>

      <div class="product-card__chips">
        <span
          v-for="size in product.sizes"
          :key="size.sizeCode"
          class="price-chip"
        >
          {{ size.sizeCode }} · {{ formatRub(size.priceRub) }}
        </span>
      </div>
    </button>
  </div>
</template>
