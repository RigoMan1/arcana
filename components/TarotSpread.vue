<script setup lang="ts">
import { generateId } from '~/utils/helpers';
const props = defineProps<{
  tarotDeck: TarotCard[] | null[];
  spread: string; // todo: make this a type
  prompt: Object;
}>();

const uniqueZoneId = generateId();

const emit = defineEmits(['remove-card', 'all-cards-selected', 'next-step']);

const handleCardSelect = (
  cardName: string,
  spreadLabel: ThreeCardClusterSlots
) => {
  // 1. find card in deck
  const cardIndex = props.tarotDeck.findIndex(
    (card) => card?.name === cardName
  );
  if (cardIndex === -1) return;

  // 2. update selected cards
  const foundCard = props.tarotDeck[cardIndex];
  selectedCards.value[spreadLabel] = foundCard;

  // 3. remove card from deck
  emit('remove-card', cardIndex);
};

const labels = {
  'universal-guidance-spread': ['energy', 'theme', 'challenge', 'opportunity'],
  'three-card-cluster': ['past', 'present', 'future'],
} as Record<string, string[]>;

const currentLabels = computed(() => labels[props.spread]);

const createSpread = (spreadLabels: string[]) => {
  const spread: Record<string, any | null> = {
    name: props.spread,
    options: spreadLabels,
  };
  spreadLabels.forEach((label) => {
    spread[label] = null;
  });
  return spread;
};

const selectedCards = ref(createSpread(currentLabels.value));

const allCardsSelected = computed(() => {
  return Object.values(selectedCards.value).every((card) => card !== null);
});

watch(allCardsSelected, (newVal) => {
  if (newVal) emit('all-cards-selected');
});

const flipCards = ref(false);
</script>

<template>
  <div>
    <div class="flex space-x-8 mt-8 max-w-[940px] mx-auto">
      <drop-zone
        v-for="label in currentLabels"
        :key="label"
        :label="label"
        :zone-id="`zone-${label}-${uniqueZoneId}`"
        class="border border-zinc-500 relative p-4 flex-1 h-[400px] w-[300px] rounded-lg"
        @drop="handleCardSelect"
      >
        <draggable-tarot-card
          v-if="selectedCards[label]"
          :card="selectedCards[label]!"
          :flip="flipCards"
        />
      </drop-zone>
    </div>
    <fortune-reading
      class="mt-12"
      :cards="selectedCards"
      :prompt="prompt"
      :all-cards-selected="allCardsSelected"
      @reveal-fortune="flipCards = true"
      @next-step="emit('next-step')"
    />
  </div>
</template>
