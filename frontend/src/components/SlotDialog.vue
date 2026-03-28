<script setup>
import { computed } from "vue";
import { formatRub, formatSlot } from "../lib/format";

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  slotsState: {
    type: Object,
    required: true
  },
  selectedSlot: {
    type: String,
    default: ""
  },
  totalRub: {
    type: Number,
    default: 0
  },
  submitting: {
    type: Boolean,
    default: false
  }
});

const selectableSlots = computed(() => props.slotsState.slots.filter((slot) => slot.selectable));

defineEmits(["close", "select-slot", "confirm"]);
</script>

<template>
  <div v-if="open" class="slot-dialog__backdrop" @click.self="$emit('close')">
    <div class="slot-dialog">
      <div class="slot-dialog__header">
        <h3>Выберите слот</h3>
        <p>{{ slotsState.date || "Сегодня" }}</p>
      </div>

      <div v-if="slotsState.loading" class="center-state">
        <v-progress-circular color="primary" indeterminate />
      </div>

      <p v-else-if="slotsState.error" class="inline-error inline-error--dark">{{ slotsState.error }}</p>

      <div v-else class="slot-dialog__grid">
        <button
          v-for="slot in selectableSlots"
          :key="slot.start"
          class="slot-pill"
          :class="{ 'slot-pill--active': selectedSlot === slot.start }"
          type="button"
          :data-testid="`slot-${slot.start}`"
          @click="$emit('select-slot', slot.start)"
        >
          <span>{{ formatSlot(slot) }}</span>
          <small>{{ slot.remainingCapacity }} мест</small>
        </button>
      </div>

      <v-btn
        class="primary-action primary-action--full"
        color="secondary"
        variant="flat"
        :loading="submitting"
        :disabled="!selectedSlot"
        data-testid="confirm-order-button"
        @click="$emit('confirm')"
      >
        Подтвердить · {{ formatRub(totalRub) }}
      </v-btn>
    </div>
  </div>
</template>
