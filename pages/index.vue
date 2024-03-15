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

// --- Chained Reading Test ---
import { chainedReadingSample } from '@/constants/tarot-options-selection';
console.log(chainedReadingSample);

const step = ref(0);
const currentStep = computed(() => chainedReadingSample.steps[step.value]);
const nextStep = () => {
  if (step.value < chainedReadingSample.steps.length - 1) {
    step.value += 1;
  }
};

// watch all cards selected
watch(allCardsSelected, (newVal) => {
  if (newVal) nextStep();
});

const currentPrompt = computed(() => {
  return chainedReadingSample.steps[step.value].prompt;
});

// todo: combine tarot spread & reading into 1 component
// - selected cards should be scoped to the spread
// - however the deck should be shared
</script>

<template>
  <div class="mt-8 flex justify-center items-center space-x-4">
    <arcana-button
      text="prev"
      :disabled="step === 0"
      @click="step -= 1"
    />
    <arcana-button
      text="next"
      :disabled="step === chainedReadingSample.steps.length - 1"
      @click="step += 1"
    />
  </div>

  <div class="container mt-20">
    <tarot-spread
      :cards="selectedCards"
      :flip-cards="flipCards"
      @select-card="handleCardSelect"
    />

    <fortune-reading
      class="mt-12"
      :cards="selectedCards"
      :all-cards-selected="allCardsSelected"
      @reveal-fortune="flipCards = true"
    />
  </div>

  <!-- v-show="!allCardsSelected" -->
  <card-selection
    v-if="currentStep.type === 'card-select'"
    :tarot-deck="tarotDeck"
  />
</template>
