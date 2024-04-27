<script setup lang="ts">
import { generateId } from '~/utils/helpers';
import { positionPrompts } from '~/constants/systemPrompts';
const props = defineProps<{
  tarotDeck: TarotCard[] | null[];
}>();

const uniqueZoneId = generateId();

const emit = defineEmits(['remove-card', 'reveal-fortune', 'card-selected']);

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
  'three-card-cluster': ['past', 'present', 'future'],
  'celtic-cross': [
    'past',
    'present',
    'future',
    'challenge',
    'conscious',
    'subconscious',
    'outcome',
    'fears-hopes',
    'influences',
    'advice',
  ],
  'love-spread': ['you', 'past', 'relationship', 'future', 'partner'],
} as Record<string, string[]>;

const activeSpreadIndex = ref(0);
const activeSpread = computed(() => ({
  name: Object.keys(labels)[activeSpreadIndex.value],
  labels: labels[Object.keys(labels)[activeSpreadIndex.value]],
}));

const canGoNext = computed(
  () => activeSpreadIndex.value < Object.keys(labels).length - 1
);
const canGoPrev = computed(() => activeSpreadIndex.value > 0);

function nextSpread() {
  if (canGoNext.value) {
    activeSpreadIndex.value++;
  }
}

function prevSpread() {
  if (canGoPrev.value) {
    activeSpreadIndex.value--;
  }
}

// const currentLabels = computed(() => labels[activeSpread.value.name]);

const createSpread = (spreadLabels: string[]) => {
  const spread: Record<string, any | null> = {};
  spreadLabels.forEach((label) => {
    spread[label] = null;
  });
  return spread;
};

const selectedCards = ref(createSpread(activeSpread.value.labels));
watch(
  () => activeSpread.value,
  () => {
    selectedCards.value = createSpread(activeSpread.value.labels);
  }
);

const someCardsSelected = computed(() => {
  return Object.values(selectedCards.value).some((card) => card !== null);
});

const allCardsSelected = computed(() => {
  return Object.values(selectedCards.value).every((card) => card !== null);
});

// reveal one card at a time
const currentCardIndex = ref(-1); // -1 indicates no card is being revealed yet

const { $state, completeFortuneReading, initiateFortuneReading } =
  useFortuneReading();

const findNextAvailableCardIndex = (startIndex: number): number => {
  let index = startIndex;
  while (
    index < activeSpread.value.labels.length &&
    !selectedCards.value[activeSpread.value.labels[index]]
  ) {
    index++;
  }
  return index;
};

function nextCard() {
  const nextIndex = findNextAvailableCardIndex(currentCardIndex.value + 1);

  if (nextIndex < activeSpread.value.labels.length) {
    currentCardIndex.value = nextIndex; // Move to the next card
  }
}

function checkNextCard() {
  const nextIndexCheck = findNextAvailableCardIndex(currentCardIndex.value + 1);
  if (nextIndexCheck === activeSpread.value.labels.length) {
    completeFortuneReading();
  }
}

const formatSelectedCard = (position: string, card: TarotCard) =>
  `
  spread-label: ${position}
  card-name: ${card.name}`;

const handleButtonClick = () => {
  console.log('handleButtonClick');
  if ($state.fortuneComplete) {
    console.log('Fortune reading complete');
    // refresh the page
    window.location.reload();
    // todo: reset the state
    return;
  }

  if (!$state.fortuneInitiated) {
    initiateFortuneReading();

    const firstIndex = findNextAvailableCardIndex(0);
    if (firstIndex < activeSpread.value.labels.length) {
      currentCardIndex.value = firstIndex; // Start with the first available card
    } else {
      // If no cards are selected, do not start the reveal process
      return;
    }
  } else {
    nextCard();
  }

  checkNextCard();

  const currentCard =
    selectedCards.value[activeSpread.value.labels[currentCardIndex.value]];
  const currentSpreadLabel = activeSpread.value.labels[currentCardIndex.value];

  emit(
    'card-selected',
    formatSelectedCard(currentSpreadLabel, currentCard),
    positionPrompts[currentSpreadLabel],
    activeSpread.value
  );
};

const buttonLabel = computed(() => {
  if (someCardsSelected.value) {
    if (!$state.fortuneInitiated) {
      return 'Reveal Fortune';
    } else if (
      currentCardIndex.value < activeSpread.value.labels.length - 1 &&
      !$state.fortuneComplete
    ) {
      return 'Next Card';
    } else {
      return 'Conclude Reading';
    }
  }
  return 'Select Cards';
});

defineExpose({
  someCardsSelected,
  allCardsSelected,
  buttonLabel,
  handleButtonClick,
});
</script>

<template>
  <div class="w-full px-4 flex flex-col justify-around h-full">
    <div
      class="flex justify-between items-center space-x-4 max-w-sm mx-auto w-full"
    >
      <arcana-button
        size="small"
        class="!px-2"
        :disabled="!canGoPrev || someCardsSelected"
        @click="prevSpread"
      >
        <Icon
          name="fluent:chevron-left-16-filled"
          size="1.5em"
        />
      </arcana-button>

      <span>
        {{ activeSpread.name.replace(/-/g, ' ') }}
      </span>

      <arcana-button
        size="small"
        class="!px-2"
        :disabled="!canGoNext || someCardsSelected"
        @click="nextSpread"
      >
        <Icon
          name="fluent:chevron-right-16-filled"
          size="1.5em"
        />
      </arcana-button>
    </div>

    <div
      class="spread-grid gap-6 sm:gap-8"
      :class="activeSpread.name"
    >
      <drop-zone
        v-for="label in activeSpread.labels"
        :key="label"
        :label="label"
        :zone-id="`zone-${label}-${uniqueZoneId}`"
        class="w-[60%] min-w-[3rem]"
        :class="[
          label,
          {
            'current-card':
              activeSpread.labels.indexOf(label) === currentCardIndex,
          },
        ]"
        @drop="handleCardSelect"
      >
        <tarot-card
          v-if="selectedCards[label]"
          :card="selectedCards[label]!"
          :flip="
            $state.fortuneInitiated &&
            activeSpread.labels.indexOf(label) <= currentCardIndex
          "
        />
      </drop-zone>
    </div>
  </div>
</template>

<style>
.celtic-cross {
  grid-template-areas:
    'outcome     conscious     fears-hopes'
    'past        present       future'
    'influences  subconscious  advice';
}

.three-card-cluster {
  grid-template-areas:
    'c-1 c-2 c-3'
    'past present future'
    'c-4 c-5 c-6';
}

.love-spread {
  grid-template-areas:
    'a you b'
    'past relationship future'
    'c partner d';
}

.spread-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);

  justify-items: center;
}

.spread-grid .challenge {
  grid-area: 2 / 2 / 3 / 3;
  transform: rotate(-90deg) translate(-1rem, 0rem);
  z-index: 1;
}

.spread-grid .conscious {
  grid-area: conscious;
}

.spread-grid .subconscious {
  grid-area: subconscious;
}

.spread-grid .past {
  grid-area: past;
}

.spread-grid .present {
  grid-area: present;
}

.spread-grid .future {
  grid-area: future;
}

.spread-grid .outcome {
  grid-area: outcome;
}

.spread-grid .fears-hopes {
  grid-area: fears-hopes;
}

.spread-grid .influences {
  grid-area: influences;
}

.spread-grid .advice {
  grid-area: advice;
}

.spread-grid .you {
  grid-area: you;
}

.spread-grid .relationship {
  grid-area: relationship;
}

.spread-grid .partner {
  grid-area: partner;
}

.current-card {
  position: relative;
  border: 2px solid #d4cbf0;
  box-shadow: 0 0 8px #d4cbf0;
  z-index: 10;
}
</style>
