<script setup lang="ts">
import { VItemGroupSymbol } from './VItemGroupMeta';
import { makeGroupItemProps, useGroupItem } from '../../composables/group';

defineOptions({ name: 'VItem' });
const props = defineProps(makeGroupItemProps());
defineEmits<{ 'group:selected': [boolean] }>();

const {
  isSelected,
  select,
  toggle,
  selectedClass,
  value,
  disabled,
  isFirst,
  isLast,
} = useGroupItem(props, VItemGroupSymbol);
</script>

<template>
  <slot
    :isSelected="isSelected"
    :selectedClass="selectedClass"
    :select="select"
    :toggle="toggle"
    :value="value"
    :disabled="disabled"
    :isFirst="isFirst"
    :isLast="isLast"
  />
</template>
