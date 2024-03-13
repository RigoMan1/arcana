<script setup lang="ts">
import TarotCards from '~/constants/tarot-card-data';

const randomCards = ref(TarotCards) as Ref<TarotCard[] | null[]>;

const shuffleCards = () => {
  let shuffled = [...TarotCards]; // Create a shallow copy to avoid modifying the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  randomCards.value = shuffled as TarotCard[];
};

// selected cards: past, present, future

const selectedCards = ref({
  past: null,
  present: null,
  future: null,
}) as Ref<Record<string, TarotCard | null>>;

// when the user selects a card, remove it from the deck
const handleCardSelect = (
  cardName: string,
  spreadLabel: 'past' | 'present' | 'future'
) => {
  // 1. find card in deck
  const cardIndex = randomCards.value.findIndex(
    (card) => card?.name === cardName
  );

  if (cardIndex === -1) return; // Card not found, exit early

  const foundCard = randomCards.value[cardIndex];

  // 2. update selected cards
  // selectedCards.value[spreadLabel] = foundCard; // Update selected card
  selectedCards.value = {
    ...selectedCards.value,
    [spreadLabel]: foundCard,
  };
  // 3. remove card from deck
  randomCards.value.splice(cardIndex, 1, null);
};

onMounted(() => {
  shuffleCards();
});

const flipCards = ref(false);
</script>

<template>
  <div class="container mt-20 arcana-scrollbar">
    <div
      class="flex mt-8 overflow-auto p-4 max-w-7xl mx-auto select-none h-[400px]"
    >
      <div
        v-for="(card, cardIndex) in randomCards"
        :key="card ? `${card.name}-${card.arcana}` : cardIndex"
        class="min-w-[233px] border border-zinc-500 relative p-4 first:rounded-l-lg
          last:rounded-r-lg"
      >
        <!-- counter badge on center top of card -->
        <span
          class="flex items-center justify-center absolute w-6 h-6 text-center -top-3 left-1/2
            transform -translate-x-1/2 text-xs bg-zinc-900 border border-zinc-600
            text-zinc-400 font-bold rounded-full"
        >
          {{ cardIndex + 1 }}
        </span>
        <draggable-tarot-card
          v-if="card"
          :card="card"
        />
        <div
          v-else
          class="w-[200px] h-full flex items-center justify-center"
        >
          <p class="text-center text-zinc-400">Card removed</p>
        </div>
      </div>
    </div>

    <!-- Spreads Section -->
    <div class="flex space-x-8 mt-8 max-w-[940px] mx-auto">
      <!-- @card-select="handleCardSelect" -->
      <drop-zone
        v-for="card in ['past', 'present', 'future']"
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
  </div>
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
