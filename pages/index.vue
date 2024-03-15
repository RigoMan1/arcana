<script setup lang="ts">
import TarotCards from '~/constants/tarot-card-data';

const tarotDeck = ref(TarotCards) as Ref<TarotCard[] | null[]>;

const shuffleCards = () => {
  let shuffled = [...TarotCards]; // Create a shallow copy to avoid modifying the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  tarotDeck.value = shuffled as TarotCard[];
};

const selectedCards = ref({
  name: 'Three Card Cluster',
  past: null,
  present: null,
  future: null,
  options: ['past', 'present', 'future'],
} as IThreeCardClusterSpread);

const handleCardSelect = (
  cardName: string,
  spreadLabel: ThreeCardClusterSlots
) => {
  // 1. find card in deck
  const cardIndex = tarotDeck.value.findIndex(
    (card) => card?.name === cardName
  );
  if (cardIndex === -1) return;

  // 2. update selected cards
  const foundCard = tarotDeck.value[cardIndex];
  selectedCards.value[spreadLabel] = foundCard;

  // 3. remove card from deck
  tarotDeck.value.splice(cardIndex, 1, null);
};

onMounted(() => {
  shuffleCards();
});

const flipCards = ref(false);

const allCardsSelected = computed(() => {
  return Object.values(selectedCards.value).every((card) => card !== null);
});
</script>

<template>
  <div class="container mt-20">
    <div class="flex space-x-8 mt-8 max-w-[940px] mx-auto">
      <drop-zone
        v-for="card in selectedCards.options"
        :key="card"
        :label="card"
        :zone-id="`zone-${card}`"
        class="border border-zinc-500 relative p-4 flex-1 h-[400px] w-[300px] rounded-lg"
        @drop="handleCardSelect"
      >
        <draggable-tarot-card
          v-if="selectedCards[card]"
          :card="selectedCards[card]!"
          :flip="flipCards"
        />
      </drop-zone>
    </div>

    <fortune-reader
      class="mt-12"
      :cards="selectedCards"
      :all-cards-selected="allCardsSelected"
      @reveal-fortune="flipCards = true"
    />
  </div>

  <card-selection
    v-show="!allCardsSelected"
    :tarot-deck="tarotDeck"
  />
</template>

<style>
:root {
  --color-primary: theme('colors.violet.500');
  --color-primary-dark: #1e1e24;
  --color-secondary: #cba135;
}

/* Custom Scrollbar Styles for the Tarot Reading App */
.arcana-scrollbar ::-webkit-scrollbar {
  width: 12px; /* Adjust width of scrollbar */
}

.arcana-scrollbar ::-webkit-scrollbar-track {
  background: #1e1e24;
  border-left: 2px solid var(--color-primary-dark); /* Darken the track to match the thumb */
}

.arcana-scrollbar ::-webkit-scrollbar-thumb {
  background: var(--color-primary); /* Gold thumb */
  border-radius: 6px; /* Rounded corners for the thumb */
  border: 2px solid var(--color-primary-dark); /* Dark border to match the track */
}

.arcana-scrollbar ::-webkit-scrollbar-thumb:hover {
  background: #ffd700; /* Lighter gold when hovered for an interactive feel */
}

.arcana-scrollbar ::-webkit-scrollbar-thumb:active {
  background: #cba135; /* Return to original gold to signify active scrolling */
}
</style>
