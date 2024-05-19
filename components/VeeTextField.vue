<script setup lang="ts">
import { makeVInputProps } from '@/modules/sui/runtime/components-form/VInput/VInputMeta';

const props = defineProps({
  ...makeVInputProps(),
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
  prependInner: {
    type: String,
    default: '',
  },
  appendInner: {
    type: String,
    default: '',
  },
});

const { value, errorMessage, validate } = useField(() => props.name);

const hasBlurred = ref(false);

const handleBlur = () => {
  hasBlurred.value = true;
  validate();
};

const slots = useSlots();

const hasPrependInner = computed(
  () => !!slots.prependOuter || !!props.prependInner
);
const hasAppendInner = computed(
  () => !!slots.appendOuter || !!props.appendInner
);
</script>

<template>
  <v-input
    class="v-text-field"
    :error-messages="hasBlurred ? errorMessage : ''"
    :label="label"
    :class="props.class"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
  >
    <template
      v-if="$slots.labelHint"
      #labelHint
    >
      <slot name="labelHint" />
    </template>

    <template
      v-if="$slots.label"
      #label
    >
      <slot name="label" />
    </template>

    <template
      v-if="$slots.prependOuter"
      #prepend
    >
      <slot name="prependOuter" />
    </template>

    <template #default>
      <div class="v-text-field__container">
        <div
          v-if="hasPrependInner"
          key="prepend-inner"
          class="v-text-field__prepend-inner"
        >
          <slot
            key="prepend-inner"
            name="prependInner"
          />
        </div>

        <input
          v-model="value"
          class="v-text-field__input w-full"
          :name="name"
          :placeholder="placeholder"
          v-bind="$attrs"
          @blur="handleBlur"
        />

        <div
          v-if="hasAppendInner"
          key="append-inner"
          class="v-text-field__append-inner"
        >
          <slot
            key="append-inner"
            name="appendInner"
          />
        </div>
      </div>
    </template>

    <template
      v-if="$slots.appendOuter"
      #append
    >
      <slot name="appendOuter" />
    </template>
  </v-input>
</template>

<style>
.v-text-field {
  --v-icon-size: 20px;
}

.v-text-field__prepend-inner .v-icon,
.v-text-field__append-inner .v-icon {
  @apply text-[#A4A9AF];
}

.v-text-field__input {
  @apply inline-flex items-center justify-start gap-2 self-stretch rounded-lg  bg-primary-900 px-3.5 py-3 shadow-sm border border-primary-700;
  @apply shrink grow basis-0 text-base font-normal leading-normal text-gray-500;
  @apply outline-none focus:border-primary-600;
}

.v-text-field__input::placeholder {
  @apply text-gray-400;
}

.v-text-field .v-input__prepend .v-button,
.v-text-field .v-input__append .v-button {
  @apply h-full;
}

.v-text-field__container {
  @apply relative w-full;
}

.v-text-field__prepend-inner,
.v-text-field__append-inner {
  @apply absolute inset-y-0 flex items-center;
}

.v-text-field:has(.v-text-field__prepend-inner) .v-text-field__input {
  @apply pl-10;
}

.v-text-field:has(.v-text-field__append-inner) .v-text-field__input {
  @apply pr-10;
}

.v-text-field__prepend-inner {
  @apply left-0 pl-3;
}

.v-text-field__append-inner {
  @apply right-0 pr-3;
}
</style>
