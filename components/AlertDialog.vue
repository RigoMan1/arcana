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

    color?: 'error' | 'success';
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

    color: 'error',
  }
);

const emit = defineEmits(['click:secondary-action', 'click:primary-action']);
</script>

<template>
  <v-overlay
    activator="#toggle-overlay"
    transition="dialog-transition"
    width="90%"
    persistent
    close-on-back
    class="flex items-center justify-center text-center"
  >
    <div
      class="px-8 !py-12 rounded-lg arcana-card-alt"
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
        variant="body-2"
        class="mt-2"
      >
        <slot>{{ text }}</slot>
      </p>

      <div class="mt-8 flex space-x-3 justify-center">
        <slot name="actions">
          <arcana-button
            v-if="secondaryActionText"
            :color="secondaryActionColor"
            :text="secondaryActionText"
            class="opacity-75"
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
.v-alert--color-error {
  @apply text-red-200;
}

.v-alert--color-success {
  @apply text-secondary-100;
}
</style>
