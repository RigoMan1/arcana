<script setup lang="ts">
// Composables
import { useGroup } from '../../composables/group';
import {
  makeVExpansionPanelsProps,
  VExpansionPanelSymbol,
} from './VExpansionPanelsMeta';

defineOptions({ name: 'VExpansionPanels' });
const props = defineProps(makeVExpansionPanelsProps());
defineEmits<{ 'update:modelValue': [boolean] }>();

// @ts-ignore
useGroup(props, VExpansionPanelSymbol);
</script>

<template>
  <component
    :is="props.tag"
    class="v-expansion-panels"
  >
    <slot />
  </component>
</template>
