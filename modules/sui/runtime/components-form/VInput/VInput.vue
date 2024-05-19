<script setup lang="ts">
// Components
// import VIcon from '../VIcon/VIcon.vue';
import VMessages from './VMessages.vue';

// Composables
import { makeVInputProps } from './VInputMeta';

// Utilities
import { computed, useSlots } from 'vue';
import { getUid, wrapInArray } from '../../util';

// Types
import type { ComputedRef } from 'vue';
// import type { VMessageSlot } from './VMessages.vue';

export interface VInputSlot {
  id: ComputedRef<string>;
  messagesId: ComputedRef<string>;
}

defineOptions({ name: 'VInput' });

const props = defineProps(makeVInputProps());

defineEmits<{
  'update:modelValue': [boolean];
}>();

const uid = getUid();
const id = computed(() => props.id || `input-${uid}`);
const messagesId = computed(() => `${id.value}-messages`);

const slotProps = computed<VInputSlot>(() => ({
  id,
  messagesId,
  isDisabled: props.disabled,
  isReadonly: props.readonly,
  isValid: !props.error,
}));

const hasErrors = computed(() => props.errorMessages?.length);

const errorMessages = computed(() => {
  return props.errorMessages?.length
    ? wrapInArray(props.errorMessages).slice(0, Math.max(0, +props.maxErrors))
    : [];
});

const messages = computed(() => {
  if (hasErrors.value) {
    return errorMessages.value;
    // } else if (props.hint && (props.persistentHint || props.focused)) {
  } else if (props.hint && props.persistentHint) {
    return props.hint;
  } else {
    return props.messages;
  }
});

const slots = useSlots();
const hasLabel = computed(() => !!slots.label || props.label);
const hasPrepend = computed(() => !!slots.prepend || props.prependIcon);
const hasAppend = computed(() => !!slots.append || props.appendIcon);
const hasMessages = computed(() => messages.value.length > 0);
const hasDetails = computed(
  () =>
    !props.hideDetails ||
    (props.hideDetails === 'auto' && (hasMessages.value || !!slots.details))
);
</script>

<template>
  <div
    class="v-input"
    :class="[
      `v-input--${props.direction}`,
      {
        'v-input--center-affix': props.centerAffix,
        'v-input--error': hasErrors || props.error,
        'v-input--dirty': props.dirty,
        'v-input--disabled': props.disabled,
        'v-input--readonly': props.readonly,
      },
    ]"
  >
    <!-- label -->
    <template v-if="hasLabel">
      <div class="v-input__label">
        <label class="v-label">
          <slot
            name="label"
            :v-bind="slotProps"
          >
            {{ props.label }}
          </slot>
        </label>
      </div>
    </template>

    <!-- prepend -->
    <template v-if="hasPrepend">
      <div class="v-input__prepend">
        <slot
          name="prepend"
          :v-bind="slotProps"
        />
      </div>
    </template>

    <!-- default -->
    <template v-if="$slots.default">
      <div class="v-input__control">
        <slot :v-bind="slotProps" />
      </div>
    </template>

    <!-- append -->
    <template v-if="hasAppend">
      <div class="v-input__append">
        <slot
          name="append"
          :v-bind="slotProps"
        />
      </div>
    </template>

    <!-- details -->
    <template v-if="hasDetails">
      <div
        class="v-input__details"
        :class="{
          'v-input__details--error': hasErrors,
        }"
      >
        <VMessages
          :id="messagesId"
          :active="hasMessages"
          :messages="messages"
        >
          <template #message>
            <slot name="message" />
          </template>
        </VMessages>

        <slot
          name="details"
          :v-bind="slotProps"
        />
      </div>
    </template>
  </div>
</template>
