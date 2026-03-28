<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 18
  },
  strokeWidth: {
    type: Number,
    default: 2
  }
});

const iconProps = computed(() => ({
  width: props.size,
  height: props.size,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": props.strokeWidth
}));
</script>

<template>
  <svg v-bind="iconProps">
    <template v-if="name === 'arrow-left'">
      <path d="M15 6L9 12L15 18" />
    </template>
    <template v-else-if="name === 'history'">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v6h6" />
    </template>
    <template v-else-if="name === 'cart'">
      <path d="M4 5h2l2.2 9.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H8.4" />
      <circle cx="10" cy="19" r="1.4" />
      <circle cx="18" cy="19" r="1.4" />
    </template>
    <path v-else-if="name === 'plus'" d="M12 5v14M5 12h14" />
    <path v-else-if="name === 'minus'" d="M5 12h14" />
    <template v-else-if="name === 'refresh'">
      <path d="M20 11a8 8 0 1 0 2 5.3" />
      <path d="M20 4v7h-7" />
    </template>
    <path v-else-if="name === 'chevron-down'" d="M7 10l5 5 5-5" />
    <path v-else-if="name === 'arrow-right'" d="M9 6l6 6-6 6" />
  </svg>
</template>
