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

const { activeSpread } = storeToRefs(useTarotSpread());

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
    window.location.href = '/reader-select';

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
