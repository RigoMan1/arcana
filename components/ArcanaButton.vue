<script setup lang="ts">
import { makeVButtonProps } from '~/modules/sui/runtime/components/VButton/VButtonMeta';

defineProps({
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  ...makeVButtonProps(),
});
</script>

<template>
  <v-button v-bind="$props">
    <slot>
      <span v-if="loading">{{ loadingText }}</span>
      <span v-else>{{ text }}</span>
    </slot>
  </v-button>
</template>

<style scoped>
.v-button {
  @apply text-white border border-secondary-600 capitalize;
  @apply rounded-xl;
  @apply whitespace-nowrap cursor-pointer;
  @apply outline-none focus-visible:ring-2 focus-visible:ring-secondary-300;
  transition-duration: 0.1s !important;
  background-size: 200%;
  cursor: pointer;
  background-position: 28% 0;
}

/* sizes */
.v-button--size-xs {
  @apply px-2 text-[10px];
  height: 1.5rem;
  --v-button-scale: 1.6rem;
}

.v-button--size-sm {
  @apply px-3 text-xs;
  height: 2rem;
  --v-button-scale: 2rem;
}

.v-button--size-base {
  @apply px-4 text-base;
  height: 3rem;
}

.v-button--size-lg {
  @apply px-7 text-lg;
  height: 3.75rem;
}

/* color */
.v-button--color-primary:not([data-state='disabled']):not(
    .v-button--variant-secondary
  ) {
  background: linear-gradient(
    180deg,
    theme('colors.secondary.500') 0.29%,
    theme('colors.secondary.600') 58.19%
  );
}

/* states */
.v-button[data-state='disabled'] {
  @apply bg-primary-800 border-primary-700  text-white/30;
  pointer-events: none;
}

.v-button[data-state='loading'] {
  @apply opacity-50;
  pointer-events: none;
}

.v-button:hover {
  background-position: 0 0;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
}

.v-button:active {
  transform: scale(0.98); /* Slightly shrink when clicked */
}

/* variants */
.v-button--variant-text {
  background: transparent !important;
  border-color: transparent !important;
}

.v-button--variant-outlined {
  background: transparent !important;
  @apply border border-secondary-100/25 text-secondary-100;
}

.v-button--variant-secondary {
  @apply bg-surface-800 text-secondary-100 border-transparent;
}
</style>
