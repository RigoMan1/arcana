<script setup lang="ts">
import { generateId } from '~/utils/helpers';
const props = defineProps<{
  tarotDeck: TarotCard[] | null[];
  spread: string;
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
  emit('card-selected', formatCard(spreadLabel, foundCard));
};

const labels = {
  'universal-guidance-spread': ['energy', 'theme', 'challenge', 'opportunity'],
  'three-card-cluster': ['past', 'present', 'future'],
} as Record<string, string[]>;

const currentLabels = computed(() => labels[props.spread]);

const createSpread = (spreadLabels: string[]) => {
  const spread: Record<string, any | null> = {
    name: props.spread,
    options: spreadLabels,
  };
  spreadLabels.forEach((label) => {
    spread[label] = null;
  });
  return spread;
};

const selectedCards = ref(createSpread(currentLabels.value));

const allCardsSelected = computed(() => {
  return Object.values(selectedCards.value).every((card) => card !== null);
});

const flipCards = ref(false);
const revealCards = () => (flipCards.value = true);

const formatCard = (position: string, card: TarotCard) =>
  `${position}: ${card.name}`;

const formattedSpread = (cards: any) => {
  const spread = Object.entries(cards).map(([position, card]) => {
    if (position === 'name' || position === 'options') return '';
    return formatCard(position, card);
  });

  return spread.join('\n');
};

function handleClick() {
  revealCards();

  const tarotSpread = `
    <tarot-spread-${props.spread}>
      ${formattedSpread(selectedCards.value)}
    </tarot-spread-${props.spread}>`;

  emit('reveal-fortune', tarotSpread);
}
</script>

<template>
  <div>
    <div class="flex space-x-2 max-w-[640px] mx-auto">
      <drop-zone
        v-for="label in currentLabels"
        :key="label"
        :label="label"
        :zone-id="`zone-${label}-${uniqueZoneId}`"
        class="border border-zinc-500 relative p-4 flex-1 rounded-lg"
        @drop="handleCardSelect"
      >
        <draggable-tarot-card
          v-if="selectedCards[label]"
          :card="selectedCards[label]!"
          :flip="flipCards"
        />
      </drop-zone>
    </div>

    <div>
      <arcana-button
        :disabled="!allCardsSelected"
        class="block mx-auto mt-12"
        @click="handleClick"
      >
        <template v-if="!allCardsSelected"> Pick 3 Cards </template>
        <template v-if="allCardsSelected"> Reveal Fortune </template>
      </arcana-button>
    </div>
  </div>
</template>
