<script setup lang="ts">
import { useDraggableCard } from '@/composables/useDraggableCard';

defineProps<{
  card: TarotCard;
}>();

const cardRef = ref();

const { style, isDragging, resetCard } = useDraggableCard(cardRef, {});

watch(isDragging, (newVal) => {
  if (!newVal) resetCard();
});
</script>

<template>
  <Teleport
    v-if="isDragging"
    to="body"
  >
    <div
      ref="cardRef"
      class="draggable-container"
      :style="style"
    >
      <tarot-card
        class="card"
        :card="card"
      />
    </div>
  </Teleport>
  <div
    v-else
    ref="cardRef"
    class="draggable-container"
    :style="style"
  >
    <tarot-card
      class="card"
      :card="card"
    />
  </div>
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
