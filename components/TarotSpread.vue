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
  all: [
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
} as Record<string, string[]>;

// const currentLabels = computed(() => labels[props.spread]);
const currentLabels = computed(() => labels['all']);

const createSpread = (spreadLabels: string[]) => {
  const spread: Record<string, any | null> = {};
  spreadLabels.forEach((label) => {
    spread[label] = null;
  });
  return spread;
};

const selectedCards = ref(createSpread(currentLabels.value));

const someCardsSelected = computed(() => {
  return Object.values(selectedCards.value).some((card) => card !== null);
});

// reveal one card at a time
const currentCardIndex = ref(-1); // -1 indicates no card is being revealed yet
const fortuneInitiated = ref(false);
const fortuneComplete = ref(false);

const findNextAvailableCardIndex = (startIndex: number): number => {
  let index = startIndex;
  while (
    index < currentLabels.value.length &&
    !selectedCards.value[currentLabels.value[index]]
  ) {
    index++;
  }
  return index;
};

const handleButtonClick = () => {
  if (!fortuneInitiated.value) {
    fortuneInitiated.value = true; // Start the reveal process

    const firstIndex = findNextAvailableCardIndex(0);
    if (firstIndex < currentLabels.value.length) {
      currentCardIndex.value = firstIndex; // Start with the first available card
    } else {
      // If no cards are selected, do not start the reveal process
      return;
    }
  } else {
    const nextIndex = findNextAvailableCardIndex(currentCardIndex.value + 1);

    if (nextIndex < currentLabels.value.length) {
      currentCardIndex.value = nextIndex; // Move to the next card

      const nextIndexCheck = findNextAvailableCardIndex(
        currentCardIndex.value + 1
      );
      // check if there are any more cards to reveal
      if (nextIndexCheck === currentLabels.value.length) {
        fortuneComplete.value = true;
      }
    }
  }

  const currentCard =
    selectedCards.value[currentLabels.value[currentCardIndex.value]];
  const currentSpreadLabel = currentLabels.value[currentCardIndex.value];

  emit('card-selected', formatSelectedCard(currentSpreadLabel, currentCard));
};
</script>

<template>
  <div class="flex flex-col">
    <div class="spread-grid gap-6 sm:gap-8">
      <drop-zone
        v-for="label in currentLabels"
        :key="label"
        :label="label"
        :zone-id="`zone-${label}-${uniqueZoneId}`"
        class="w-[15vw] min-w-[60px]"
        :class="[
          label,
          {
            'current-card': currentLabels.indexOf(label) === currentCardIndex,
          },
        ]"
        @drop="handleCardSelect"
      >
        <draggable-tarot-card
          v-if="selectedCards[label]"
          :card="selectedCards[label]!"
          :flip="
            fortuneInitiated && currentLabels.indexOf(label) <= currentCardIndex
          "
        />
      </drop-zone>
    </div>

    <div>
      <arcana-button
        v-if="someCardsSelected && !fortuneComplete"
        :disabled="!someCardsSelected"
        class="block mx-auto mt-12"
        @click="handleButtonClick"
      >
        <template v-if="!fortuneInitiated">Reveal Fortune</template>
        <template v-else-if="currentCardIndex < currentLabels.length - 1"
          >Next Card</template
        >
        <template v-else>Reset</template>
      </arcana-button>
    </div>
  </div>
</template>

<style>
.spread-grid {
  display: grid;
  grid-template-areas:
    'outcome     conscious     fears-hopes'
    'past        present       future'
    'influences  subconscious  advice';
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

/* todo: fix the pointer move the class to the outer container */
.current-card {
  position: relative;
  border: 2px solid #d4cbf0;
  box-shadow: 0 0 8px #d4cbf0;
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
  background-color: #d4cbf0;
  z-index: -1;
}
</style>
