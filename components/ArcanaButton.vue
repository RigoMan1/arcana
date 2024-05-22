<script setup lang="ts">
defineProps<{
  text?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'text';
  loading?: boolean;
  loadingText?: string;
  icon?: boolean;
}>();
</script>

<template>
  <button
    class="arcana-button arcana-button--color-primary"
    :class="[
      {
        'arcana-button--state-disabled': disabled,
        'arcana-button--variant-text': variant === 'text',
        'arcana-button--icon': icon,
      },
      `arcana-button--size-${size || 'medium'}`,
    ]"
    :tabindex="disabled ? -1 : 0"
  >
    <slot>
      <span v-if="loading">{{ loadingText || 'Loading...' }}</span>
      <span v-else>{{ text }}</span>
    </slot>
  </button>
</template>

<style scoped>
.arcana-button {
  @apply text-white border-2 border-secondary-500;
  @apply rounded-lg;
  @apply whitespace-nowrap cursor-pointer;
  @apply outline-none focus-visible:ring-2 focus-visible:ring-secondary-300;
  transition-duration: 0.2s !important;
  background-size: 200%;
  cursor: pointer;
  background-position: 28% 0;
}

/* sizes */
.arcana-button--size-small {
  @apply px-3 text-xs;
  height: 2rem;
}

.arcana-button--size-medium {
  @apply px-4 text-sm;
  height: 3rem;
}

.arcana-button--size-large {
  @apply px-7 text-lg;
  height: 3.75rem;
}

/* color */
.arcana-button--color-primary:not(.arcana-button--state-disabled) {
  background: linear-gradient(
    86deg,
    theme('colors.secondary.400') 15.29%,
    theme('colors.secondary.600') 58.19%
  );
}

/* variants */
.arcana-button--variant-text {
  background: transparent !important;
  border-color: transparent !important;
}

.arcana-button--icon {
  aspect-ratio: 1;
  padding: 0;
}

/* states */
.arcana-button--state-disabled {
  @apply !bg-primary-800 border-primary-700  text-white/30;
  pointer-events: none;
}

.arcana-button:hover {
  background-position: 0 0;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
}

.arcana-button:active {
  transform: scale(0.98); /* Slightly shrink when clicked */
}
</style>
