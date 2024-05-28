<script setup lang="ts">
import { generateId } from '~/utils/helpers';
import { positionPrompts } from '~/constants/systemPrompts';
const props = defineProps<{
  tarotDeck: TarotCard[] | null[];
}>();

const uniqueZoneId = generateId();

const emit = defineEmits([
  'remove-card',
  'reveal-fortune',
  'card-selected',
  'all-revealed',
]);

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

// const selectedCards = ref(createSpread(activeSpread.value.labels));
const selectedCards = ref({
  past: {
    name: 'The High Priestess',
    arcana: 'major',
    number: 2,
    suit: null,
    court: null,
    image: 'major-02-the-high-priestess.jpg',
  },
  present: {
    name: 'Two of Pentacles',
    arcana: 'minor',
    number: 2,
    suit: 'pentacle',
    court: null,
    image: 'pents-02.jpg',
  },
  future: {
    name: 'Eight of Wands',
    arcana: 'minor',
    number: 8,
    suit: 'wand',
    court: null,
    image: 'wands-08.jpg',
  },
});
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

// const handleButtonClick = () => {
//   if ($state.fortuneComplete) {
//     window.location.href = '/reader-select';

//     return;
//   }

//   if (!$state.fortuneInitiated) {
//     initiateFortuneReading();

//     const firstIndex = findNextAvailableCardIndex(0);
//     if (firstIndex < activeSpread.value.labels.length) {
//       currentCardIndex.value = firstIndex; // Start with the first available card
//     } else {
//       // If no cards are selected, do not start the reveal process
//       return;
//     }
//   } else {
//     nextCard();
//   }

//   checkNextCard();

//   const currentCard =
//     selectedCards.value[activeSpread.value.labels[currentCardIndex.value]];
//   const currentSpreadLabel = activeSpread.value.labels[currentCardIndex.value];

// };

// same logic as above except we will be revealing all cards at once

function handleButtonClick() {
  const formatCard = (position: string, card: TarotCard) =>
    `
  spread-label: ${position}
  card-name: ${card.name}
  card-image: ${card.image}
  `;

  if ($state.fortuneComplete) {
    window.location.href = '/reader-select';
    return;
  }

  if (!$state.fortuneInitiated) {
    initiateFortuneReading();
    // handles all cards being revealed at once
    currentCardIndex.value = activeSpread.value.labels.length - 1;
  } else {
    // handles all cards being revealed at once
    currentCardIndex.value = activeSpread.value.labels.length - 1;
  }

  checkNextCard();

  const allCardsData = activeSpread.value.labels.map((label) => {
    return formatCard(label, selectedCards.value[label]!);
  });

  emit('all-revealed', {
    spread: activeSpread.value.name,
    drawnCards: allCardsData,
  });
}

function getInDepthReading(label: string, card: TarotCard) {
  const formattedCard = `
  spread-label: ${label}
  card-name: ${card.name}`;

  emit(
    'card-selected',
    formattedCard,
    positionPrompts[label],
    activeSpread.value
  );
}

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

        <arcana-button
          v-if="$state.fortuneInitiated"
          class="absolute -bottom-6 right-1/2 !translate-x-1/2"
          size="small"
          icon
          @click="getInDepthReading(label, selectedCards[label]!)"
        >
          <icon
            class="text-xl"
            name="fluent:eye-tracking-24-regular"
          />
        </arcana-button>
      </drop-zone>
    </div>
  </div>
</template>
