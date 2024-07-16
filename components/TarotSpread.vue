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

const handleCardDrop = (cardName: string, spreadLabel: string) => {
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

const { activeSpread, selectedCards, someCardsSelected } =
  storeToRefs(useTarotSpread());
const tarotSpread = useTarotSpread();
tarotSpread.initSpread();

const { $state, completeFortuneReading, initiateFortuneReading } =
  useFortuneReading();

const revealedCardsSet = ref(new Set());

function revealSpreadComponent() {
  currentSpreadComponent.value.positions.forEach((label) => {
    revealedCardsSet.value.add(label);
  });
}

watch(revealedCardsSet.value, (newSet) => {
  if (newSet.size === activeSpread.value.positions.length) {
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
  reversed: ${card.reversed}
  `;

  const allCardsData = currentSpreadComponent.value.positions.map((label) => {
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
  console.log('getting in-depth reading for:', label, card);
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

const spreadSlotInfoDialog = ref(false);
const activeSlotData = ref({
  position: {} as ITarotSpreadObjectPosition,
  card: null as TarotCard | null,
});
function openSpreadSlotInfoDialog(
  position: ITarotSpreadObjectPosition,
  card: TarotCard
) {
  activeSlotData.value = {
    position,
    card,
  };
  spreadSlotInfoDialog.value = true;
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
  buttonLabel,
  handleButtonClick,
});

onUnmounted(() => {
  tarotSpread.$reset();
});
</script>

<template>
  <div class="w-full px-4 flex flex-col justify-around h-full">
    <card-info-dialog
      v-model="spreadSlotInfoDialog"
      :position-data="activeSlotData.position"
      :card="activeSlotData?.card"
      :disable-deep-reading="inDepthReadCards.has(activeSlotData.position.name)"
      :is-revealed="revealedCardsSet.has(activeSlotData.position.name)"
      @get-deep-reading="getInDepthReading"
    />
    <div
      class="spread-grid gap-6 sm:gap-8"
      :class="activeSpread.id"
    >
      <drop-zone
        v-for="p in activeSpread.positions"
        :key="p.name"
        :label="p.name"
        :zone-id="`zone-${p.name}-${uniqueZoneId}`"
        class="w-[60%] min-w-[3rem]"
        :class="p.name"
        @drop="handleCardDrop"
      >
        <tarot-card
          v-if="selectedCards[p.name]"
          :card="selectedCards[p.name]!"
          :flip="revealedCardsSet.has(p.name)"
        />

        <arcana-button
          class="absolute -bottom-6 right-1/2 !translate-x-1/2"
          size="sm"
          icon
          style="z-index: 100"
          @click="openSpreadSlotInfoDialog(p, selectedCards[p.name]!)"
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
