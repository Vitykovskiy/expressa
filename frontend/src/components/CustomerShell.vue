<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  title: {
    type: String,
    default: ""
  },
  subtitle: {
    type: String,
    default: ""
  },
  showBack: {
    type: Boolean,
    default: false
  },
  badgeCount: {
    type: Number,
    default: 0
  },
  historyMode: {
    type: Boolean,
    default: false
  }
});

defineEmits(["back", "open-history", "open-cart"]);
</script>

<template>
  <v-app class="customer-app">
    <v-main class="customer-main">
      <div class="mobile-shell">
        <header class="top-bar">
          <v-btn
            v-if="showBack"
            class="ghost-icon"
            icon
            variant="flat"
            @click="$emit('back')"
          >
            <AppIcon name="arrow-left" :size="18" />
          </v-btn>
          <div v-else class="top-bar__spacer"></div>

          <div class="brand">Ex-pressa ☕</div>

          <div class="top-actions">
            <v-btn
              class="ghost-icon"
              icon
              variant="flat"
              @click="$emit('open-history')"
            >
              <AppIcon :name="historyMode ? 'refresh' : 'history'" :size="17" />
            </v-btn>

            <div class="cart-action">
              <v-btn
                class="ghost-icon"
                icon
                variant="flat"
                @click="$emit('open-cart')"
              >
                <AppIcon name="cart" :size="17" />
              </v-btn>
              <div v-if="badgeCount > 0" class="cart-action__badge">
                {{ badgeCount }}
              </div>
            </div>
          </div>
        </header>

        <section class="screen-header" :class="{ 'screen-header--compact': !title }">
          <p v-if="subtitle" class="screen-header__eyebrow">{{ subtitle }}</p>
          <h1 v-if="title" class="screen-header__title">{{ title }}</h1>
        </section>

        <section class="screen-body">
          <slot />
        </section>
      </div>
    </v-main>
  </v-app>
</template>
