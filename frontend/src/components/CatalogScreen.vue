<script setup>
import AppIcon from "./AppIcon.vue";
import { formatItemCount } from "../lib/format";

defineProps({
  categories: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(["select-category"]);
</script>

<template>
  <div class="stack-large">
    <div v-if="loading" class="center-state">
      <v-progress-circular color="white" indeterminate />
    </div>

    <div v-else-if="categories.length === 0" class="empty-state">
      <p class="empty-state__title">Меню пока пустое</p>
      <p class="empty-state__body">Категории появятся, когда backend вернёт доступные позиции.</p>
    </div>

    <div v-else class="stack-medium">
      <button
        v-for="category in categories"
        :key="category.id"
        class="card-button"
        type="button"
        :data-testid="`category-${category.id}`"
        @click="$emit('select-category', category.id)"
      >
        <div class="card-button__body">
          <div>
            <h2 class="card-button__title">{{ category.name }}</h2>
            <p class="card-button__meta">{{ formatItemCount(category.products.length) }}</p>
          </div>
          <div class="card-button__icon">
            <AppIcon name="arrow-right" :size="16" />
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
