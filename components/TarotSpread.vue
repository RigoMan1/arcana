<script setup lang="ts">
import { positionPrompts } from '~/constants/systemPrompts';

const emit = defineEmits([
  'remove-card',
  'reveal-fortune',
  'card-selected',
  'react-to-card-drop',
]);

const props = defineProps<{
  tarotDeck: TarotCard[] | null[];
}>();

const { activeSpread, selectedCards } = storeToRefs(useTarotSpread());

const revealedCardsSet = ref(new Set());
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

  // 4. add card to revealed set after 1 second
  emit('react-to-card-drop', { position: spreadLabel, card: foundCard });
  setTimeout(() => {
    revealedCardsSet.value.add(spreadLabel);
  }, 200);
};

const tarotSpread = useTarotSpread();
tarotSpread.initSpread();
onUnmounted(() => {
  tarotSpread.$reset();
});

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
</script>

<template>
  <div class="w-full px-4 flex flex-col justify-around h-full">
    <div
      class="spread-grid gap-6 sm:gap-8"
      :class="activeSpread.id"
    >
      <div
        v-for="p in activeSpread.positions"
        :key="p.name"
        class="w-[70%] min-w-[3rem]"
        :class="p.name"
      >
        <card-info-dialog
          activator="parent"
          :position-data="p"
          :card="selectedCards[p.name]"
          @get-deep-reading="getInDepthReading"
        />
        <drop-zone
          :id="`zone-${p.name}`"
          :label="p.name"
          :zone-id="`zone-${p.name}`"
          @drop="handleCardDrop"
        >
          <tarot-card
            v-if="selectedCards[p.name]"
            :card="selectedCards[p.name]!"
            :flip="revealedCardsSet.has(p.name)"
          />

          <arcana-button
            class="absolute -bottom-3 right-1/2 !translate-x-1/2"
            size="xs"
            icon
            style="z-index: 100"
          >
            <icon
              class="text-lg"
              name="fluent:eye-tracking-24-regular"
            />
          </arcana-button>
        </drop-zone>
      </div>
    </div>
  </div>
</template>
