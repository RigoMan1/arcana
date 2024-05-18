<script setup lang="ts">
// Composables
import { makeVMessagesProps } from './VInputMeta';
import { MaybeTransition } from '../../composables/transition';

// Utilities
import { computed } from 'vue';
import { wrapInArray } from '../../util';

defineOptions({ name: 'VMessages' });

const props = defineProps(makeVMessagesProps());

const messages = computed(() => wrapInArray(props.messages));
</script>

<template>
  <maybe-transition
    tag="div"
    :transition="props.transition"
    class="v-messages"
    role="alert"
    aria-live="polite"
  >
    <template v-if="props.active">
      <div
        v-for="(message, i) in messages"
        :key="`${i}-${messages}`"
        class="v-messages__message"
      >
        <slot
          name="message"
          :message="message"
        >
          {{ message }}
        </slot>
      </div>
    </template>
  </maybe-transition>
</template>
