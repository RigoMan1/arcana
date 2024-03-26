<script setup lang="ts">
import { generateId } from '~/utils/helpers';
const props = defineProps<{
  tarotDeck: TarotCard[] | null[];
  spread: string;
}>();

const uniqueZoneId = generateId();

const emit = defineEmits(['remove-card', 'reveal-fortune', 'card-selected']);

const formatSelectedCard = (position: string, card: TarotCard) =>
  `${position}: ${card.name}`;

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

// reveal one card at a time
const currentCardIndex = ref(-1); // -1 indicates no card is being revealed yet
const fortuneRevealed = ref(false);

const handleButtonClick = () => {
  if (!fortuneRevealed.value) {
    fortuneRevealed.value = true; // Start the reveal process
    currentCardIndex.value = 0; // Start with the first card
  } else if (currentCardIndex.value < currentLabels.value.length - 1) {
    currentCardIndex.value++; // Move to the next card
  } else {
    // Reset or handle the end of the reveal process
    fortuneRevealed.value = false;
    currentCardIndex.value = -1;
  }

  const currentCard =
    selectedCards.value[currentLabels.value[currentCardIndex.value]];
  const currentSpreadLabel = currentLabels.value[currentCardIndex.value];

  emit('card-selected', formatSelectedCard(currentSpreadLabel, currentCard));
};
</script>

<template>
  <div>
    <div class="flex space-x-2 max-w-[640px] mx-auto">
      <drop-zone
        v-for="label in currentLabels"
        :key="label"
        :label="label"
        :zone-id="`zone-${label}-${uniqueZoneId}`"
        class="border border-zinc-500 relative p-4 flex-1 rounded-lg"
        :class="{
          'current-card': currentLabels.indexOf(label) === currentCardIndex,
        }"
        @drop="handleCardSelect"
      >
        <draggable-tarot-card
          v-if="selectedCards[label]"
          :card="selectedCards[label]!"
          :flip="
            fortuneRevealed && currentLabels.indexOf(label) <= currentCardIndex
          "
        />
      </drop-zone>
    </div>

    <div>
      <arcana-button
        :disabled="!allCardsSelected"
        class="block mx-auto mt-12"
        @click="handleButtonClick"
      >
        <template v-if="!fortuneRevealed">Reveal Fortune</template>
        <template v-else-if="currentCardIndex < currentLabels.length - 1"
          >Next Card</template
        >
        <template v-else>Reset</template>
      </arcana-button>
    </div>
  </div>
</template>

<style>
/* todo: fix the pointer move the class to the outer container */
.current-card {
  position: relative;
  border: 2px solid gold;
  box-shadow: 0 0 8px gold;
  z-index: 10;
}

.current-card::after {
  content: '';
  position: absolute;
  bottom: -10px; /* Adjust based on your design */
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 20px;
  height: 20px;
  background-color: gold;
  z-index: -1;
}
</style>
