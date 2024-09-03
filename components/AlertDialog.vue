<script setup lang="ts">
import type { Color } from '@/modules/sui/runtime/composables/bem/color';

withDefaults(
  defineProps<{
    loading?: boolean;
    disabled?: boolean;

    icon?: string;
    iconColor?: Color;

    title?: string;
    text?: string;

    secondaryActionText?: string;
    secondaryActionColor?: Color;

    primaryActionText?: string;
    primaryActionColor?: Color;

    color?: 'danger' | 'danger-alt' | 'success';
  }>(),
  {
    iconColor: 'primary',
    icon: '',

    title: '',
    text: '',

    secondaryActionText: '',
    secondaryActionColor: 'light',

    primaryActionText: '',
    primaryActionColor: 'primary',

    color: 'danger',
  }
);

const emit = defineEmits(['click:secondary-action', 'click:primary-action']);
</script>

<template>
  <v-overlay
    activator="#toggle-overlay"
    transition="dialog-transition"
    width="90%"
    max-width="600px"
    persistent
    close-on-back
    class="flex items-center justify-center text-center"
  >
    <div
      class="px-8 !py-12 rounded-lg arcana-card"
      :class="`v-alert--color-${color}`"
    >
      <Icon
        :name="icon"
        :color="iconColor"
        size="3rem"
        class="mx-auto"
      />

      <h3 class="mt-2 text-xl">{{ title }}</h3>

      <p
        v-if="color === 'danger-alt'"
        class="text-sm"
      >
        Report this error to the Arcana team.
      </p>

      <p class="mt-4 text-secondary-100">
        <slot>{{ text }}</slot>
      </p>

      <div class="mt-8 flex space-x-3 justify-center">
        <slot name="actions">
          <arcana-button
            v-if="secondaryActionText"
            :text="secondaryActionText"
            variant="secondary"
            block
            @click="emit('click:secondary-action')"
          />
          <arcana-button
            v-if="primaryActionText"
            :text="primaryActionText"
            :color="primaryActionColor"
            block
            :loading="loading"
            :disabled="disabled"
            @click="emit('click:primary-action')"
          />
        </slot>
      </div>
    </div>
  </v-overlay>
</template>

<style>
.v-alert--color-danger {
  @apply text-red-200;
}

.v-alert--color-danger-alt {
  @apply text-red-200 !bg-red-950/80  border border-red-900;
}

.v-alert--color-success {
  @apply text-secondary-100;
}
</style>
