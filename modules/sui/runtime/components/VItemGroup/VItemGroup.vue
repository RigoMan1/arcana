<script setup lang="ts">
import { useGroup } from '../../composables/group';
import { makeVItemGroupProps, VItemGroupSymbol } from './VItemGroupMeta';

defineOptions({ name: 'VItemGroup' });
defineEmits<{ 'update:modelValue': any }>();
const props = defineProps(makeVItemGroupProps());

const { isSelected, select, next, prev, selected } = useGroup(
  props,
  VItemGroupSymbol
);
</script>

<template>
  <component :is="props.tag">
    <slot
      :isSelected="isSelected"
      :select="select"
      :next="next"
      :prev="prev"
      :selected="selected"
    />
  </component>
</template>
