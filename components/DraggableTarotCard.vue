<script setup lang="ts">
import { useDraggableCard } from '@/composables/useDraggableCard';
import { useDrag } from '@/composables/useDragAndDrop/useDrag';

const props = defineProps<{
  card: TarotCard;
}>();

const cardRef = ref();

const { style, isDragging, resetCard } = useDraggableCard(cardRef, {});

watch(isDragging, (newVal) => {
  if (!newVal) resetCard();
});

const { dndState } = useDrag(cardRef, props.card.name);
</script>

<template>
  <Teleport
    :disabled="!isDragging"
    to="body"
  >
    <div
      ref="cardRef"
      :class="{ 'absolute bd top-0 left-0': isDragging }"
      :style="style"
      class="z-20"
    >
      <tarot-card
        class="card"
        :card="card"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.draggable-container {
  position: absolute;
  left: 0;
  top: 0;
  display: inline-block;
  z-index: 10;
  will-change: transform;

  &:active {
    cursor:
      url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/836/hearthstone-grab.png)
        10 2,
      auto;
  }
}
</style>
