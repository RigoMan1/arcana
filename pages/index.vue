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

const steps = ref(
  [] as {
    type: string;
    [key: string]: any;
  }[]
);

watch(
  currentStep,
  (newVal) => {
    // if (newVal.type !== 'tarot-reading') steps.value.push(newVal as any);
    steps.value.push(newVal as any);
  },
  { immediate: true }
);
</script>

<template>
  <div class="container mt-20 flex flex-col space-y-20">
    <div
      v-for="($step, stepIndex) in steps"
      :key="`spread-${stepIndex}`"
    >
      <template v-if="$step.type === 'card-select'">
        <tarot-spread
          :tarot-deck="tarotDeck"
          :spread="$step.spread"
          :response-type="$step.responseType"
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
      </template>
      <template v-if="$step.type === 'pick-3'">
        <pick-three-reading />
      </template>
      <template v-if="$step.type === 'farewell'">
        <div class="text-center">
          <h3 class="text-2xl font-bold">Farewell</h3>
          <p class="mt-3">
            May the guidance you seek lead you to the answers you desire
          </p>
        </div>
      </template>
    </div>
  </div>

  <card-selection
    v-if="currentStep.type === 'card-select'"
    :tarot-deck="tarotDeck"
  />
</template>
