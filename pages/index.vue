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
    <tarot-spread
      :cards="selectedCards"
      :flip-cards="flipCards"
      @select-card="handleCardSelect"
    />

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
