<script setup lang="ts">
import { useDraggableCard } from '@/composables/useDraggableCard';
import { useDrag } from '@/composables/useDragAndDrop/useDrag';

const props = defineProps<{
  card: TarotCard;
  flip?: boolean;
}>();

const cardRef = ref();
useDrag(cardRef, props.card.name);

const { style, isDragging, resetCard } = useDraggableCard(cardRef, {
  pointerTypes: ['touch', 'mouse'],
});

watch(isDragging, (newVal) => {
  if (!newVal) resetCard();
});
</script>

<template>
  <div
    ref="cardRef"
    class="draggable-container"
    :class="{ 'fixed top-0 left-0 min-w-[100px]': isDragging }"
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
