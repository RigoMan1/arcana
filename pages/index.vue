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

function removeCard(cardIndex: number) {
  tarotDeck.value.splice(cardIndex, 1, null);
}

onMounted(() => {
  shuffleCards();
});

// --- Chained Reading Test ---
import { chainedReadingSample } from '@/constants/tarot-options-selection';

const step = ref(0);
const currentStep = computed(() => chainedReadingSample.steps[step.value]);
const nextStep = () => {
  if (step.value < chainedReadingSample.steps.length - 1) {
    step.value += 1;
  }
};

const currentPrompt = computed(() => {
  return chainedReadingSample.steps[step.value].prompt;
});

const spreads = ref([] as string[]);
const addSpread = (spread: string) => spreads.value.push(spread);

watch(
  currentStep,
  (newVal) => {
    if (newVal.type === 'card-select') addSpread(newVal.spread as string);
  },
  { immediate: true }
);
</script>

<template>
  <div class="container mt-20">
    <tarot-spread
      v-for="(spread, spreadIndex) in spreads"
      :key="`spread-${spreadIndex}`"
      :tarot-deck="tarotDeck"
      :spread="spread"
      :prompt="
        currentPrompt || {
          user: '',
          system: '',
        }
      "
      @remove-card="removeCard"
      @all-cards-selected="nextStep"
      @next-step="nextStep"
    />
  </div>

  <card-selection
    v-if="currentStep.type === 'card-select'"
    :tarot-deck="tarotDeck"
  />
</template>
