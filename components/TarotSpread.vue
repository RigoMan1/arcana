<script setup lang="ts">
import { generateId } from '~/utils/helpers';
import { positionPrompts } from '~/constants/systemPrompts';
import { useItemProcessor } from '~/composables/useItemProcessor';

const props = defineProps<{
  tarotDeck: TarotCard[] | null[];
}>();

const uniqueZoneId = generateId();

const emit = defineEmits([
  'remove-card',
  'reveal-fortune',
  'card-selected',
  'reveal-spread-component',
]);

const handleCardDrop = (
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

const { $state, completeFortuneReading, initiateFortuneReading } =
  useFortuneReading();

const revealedCardsSet = ref(new Set());

function revealSpreadComponent() {
  currentSpreadComponent.value.labels.forEach((label) => {
    revealedCardsSet.value.add(label);
  });
}

watch(revealedCardsSet.value, (newSet) => {
  if (newSet.size === activeSpread.value.labels.length) {
    completeFortuneReading();
  }
});

const {
  startProcessing,
  next,
  currentIndex: currentSpreadComponentIndex,
} = useItemProcessor(ref(activeSpread.value.components), revealSpreadComponent);

const currentSpreadComponent = computed(() => {
  return activeSpread.value.components[currentSpreadComponentIndex.value];
});

function handleButtonClick() {
  if ($state.fortuneComplete) {
    window.location.href = '/reader-select';
    return;
  }

  const formatCard = (position: string, card: TarotCard) =>
    `
  spread-label: ${position}
  card-name: ${card.name}
  card-image: ${card.image}
  `;

  const allCardsData = currentSpreadComponent.value.labels.map((label) => {
    return formatCard(label, selectedCards.value[label]!);
  });

  emit('reveal-spread-component', {
    spread: activeSpread.value.name,
    drawnCards: allCardsData,
  });

  if (!$state.fortuneInitiated) {
    initiateFortuneReading();
    startProcessing();
  } else {
    next();
  }
}

const inDepthReadCards = ref(new Set());
function getInDepthReading(label: string, card: TarotCard) {
  inDepthReadCards.value.add(label);

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
    } else if (!$state.fortuneComplete) {
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
      :class="activeSpread.id"
    >
      <drop-zone
        v-for="label in activeSpread.labels"
        :key="label"
        :label="label"
        :zone-id="`zone-${label}-${uniqueZoneId}`"
        class="w-[60%] min-w-[3rem]"
        :class="label"
        @drop="handleCardDrop"
      >
        <tarot-card
          v-if="selectedCards[label]"
          :card="selectedCards[label]!"
          :flip="revealedCardsSet.has(label)"
        />

        <arcana-button
          v-if="revealedCardsSet.has(label)"
          :disabled="inDepthReadCards.has(label)"
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
