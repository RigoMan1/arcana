<script setup lang="ts">
import { useDrop } from '@/composables/useDragAndDrop/useDrop';

const props = defineProps<{
  zoneId: string;
  label?: string;
}>();

// function handleDrop(event: any) {
//   if (props.card) return;

//   emit('card-select', {
//     cardName: droppedCardName,
//     spreadLabel: props.label,
//   });
// }

const dropTarget = ref() as Ref<HTMLElement>;
const { isOver, dndState } = useDrop(dropTarget, props.zoneId);
</script>

<template>
  <div
    ref="dropTarget"
    class="drop-zone flex items-center justify-center"
    :class="{ 'border-dashed border-4 bg-violet-950': isOver }"
  >
    <span
      class="flex items-center justify-center absolute px-2 h-6 text-center -top-3 left-1/2
        transform -translate-x-1/2 capitalize bg-zinc-900 border border-zinc-600
        text-zinc-400 font-medium rounded-lg"
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

    <slot :dropZoneData="dndState.dropContainers[props.zoneId] || []" />
  </div>
</template>

<style>
.drop-zone {
  @apply border border-zinc-500 relative p-4 flex-1 h-[400px] rounded-lg;
}
</style>
