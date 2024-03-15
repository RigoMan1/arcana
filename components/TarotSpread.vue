<script setup lang="ts">
defineProps<{
  cards: IThreeCardClusterSpread;
  flipCards: boolean;
}>();

const emit = defineEmits(['select-card']);

const handleCardSelect = (
  cardName: string,
  spreadLabel: ThreeCardClusterSlots
) => {
  emit('select-card', cardName, spreadLabel);
};
</script>

<template>
  <div class="flex space-x-8 mt-8 max-w-[940px] mx-auto">
    <drop-zone
      v-for="card in cards.options"
      :key="card"
      :label="card"
      :zone-id="`zone-${card}`"
      class="border border-zinc-500 relative p-4 flex-1 h-[400px] w-[300px] rounded-lg"
      @drop="handleCardSelect"
    >
      <draggable-tarot-card
        v-if="cards[card]"
        :card="cards[card]!"
        :flip="flipCards"
      />
    </drop-zone>
  </div>
</template>
