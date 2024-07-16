<script setup lang="ts">
import { makeVDividerProps } from './VDividerMeta';

const props = defineProps(makeVDividerProps());

const ariaOrientation = computed(() =>
  props.vertical ? 'vertical' : 'horizontal'
);

const semanticProps = computed(() =>
  props.decorative
    ? { role: 'none' }
    : {
        'aria-orientation': ariaOrientation.value,
        role: 'separator',
      }
);
</script>

<template>
  <hr
    v-if="!text"
    class="v-hr"
    :class="{
      'v-hr--vertical': props.vertical,
    }"
    :v-bind="semanticProps"
  />

  <div
    v-else
    class="v-divider"
    :class="{
      'v-divider--vertical': props.vertical,
    }"
    :v-bind="semanticProps"
  >
    <hr
      class="v-hr"
      :class="{
        'v-hr--vertical': props.vertical,
      }"
    />

    <div class="v-divider__content">
      <slot>{{ text }}</slot>
    </div>

    <hr
      class="v-hr"
      :class="{
        'v-hr--vertical': props.vertical,
      }"
    />
  </div>
</template>
