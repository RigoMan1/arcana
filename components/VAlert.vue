<script setup lang="ts">
import { useColor } from '@/modules/sui/runtime/composables/bem/color';
import type { ColorProps } from '@/modules/sui/runtime/composables/bem/color';

defineOptions({ name: 'VAlert' });

const props = withDefaults(
  defineProps<
    {
      text?: string;
    } & ColorProps
  >(),
  {
    text: undefined,
    color: 'light',
  }
);

const { colorClasses } = useColor(props);
</script>

<template>
  <div
    :class="colorClasses"
    class="flex rounded p-3"
  >
    <p class="ml-2 !font-medium">
      <slot>
        {{ text }}
      </slot>
    </p>
  </div>
</template>

<style scoped>
.v-alert--color-danger {
  @apply bg-red-100 text-red-600;
}

.v-alert--color-success {
  @apply bg-secondary-100 text-secondary-600;
}
</style>
