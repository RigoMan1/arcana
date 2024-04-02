<script setup lang="ts">
import { useDrop } from '@/composables/useDragAndDrop/useDrop';

const props = defineProps<{
  zoneId: string;
  label?: string;
}>();

const dropTarget = ref() as Ref<HTMLElement>;
const { isOver, dndState } = useDrop(dropTarget, props.zoneId);

const selectedCard = computed(() => {
  const card = dndState.dropContainers[props.zoneId] || [];
  return card.length ? card[0] : [];
});

const emit = defineEmits(['drop']);
watch(selectedCard, (newVal) => {
  emit('drop', newVal, props.label);
});
</script>

<template>
  <div
    ref="dropTarget"
    class="drop-zone flex items-center justify-center"
    :class="{ 'border-dashed border-4 bg-indigo-900/20': isOver }"
  >
    <span
      class="flex text-xs items-center justify-center absolute px-2 h-6 text-center -top-3
        left-1/2 transform -translate-x-1/2 capitalize bg-zinc-900 border
        border-zinc-600 text-zinc-400 font-medium rounded-lg"
    >
      {{ label }}
    </span>

    <!-- <pre>
      isDragging:{{ dndState.isDragging }}
      isOver: {{ isOver }}
      activeDropContainerId:{{ dndState.activeDropContainerId }}
      dragData:{{ dndState.dragData }}
      container-data:{{ dndState.dropContainers }}  
    </pre> -->

    <div class="w-full">
      <slot :drop-zone-data="selectedCard" />
    </div>
  </div>
</template>

<style>
.drop-zone {
  @apply border border-zinc-500 relative p-2 flex-1  rounded-lg;
  aspect-ratio: 11/19;
}
</style>
