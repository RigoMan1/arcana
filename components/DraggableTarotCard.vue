<script setup lang="ts">
import { useDrag, useDraggableEl } from '@/composables/useDragAndDrop';

const props = defineProps<{
  card: TarotCard;
  flip?: boolean;
}>();

const cardRef = ref();
useDrag(cardRef, props.card.name);

const { isDragging, style } = useDraggableEl(cardRef);
</script>

<template>
  <div
    ref="cardRef"
    class="draggable-container min-w-[3rem] w-[12vw]"
    :class="{ 'fixed top-0 left-0 ': isDragging }"
    :style="style"
  >
    <tarot-card
      :card="card"
      :flip="flip"
    />
  </div>
</template>

<style scoped>
.draggable-container {
  z-index: 20;
  will-change: transform;

  &:active {
    cursor:
      url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/836/hearthstone-grab.png)
        10 2,
      auto;
  }
}
</style>
