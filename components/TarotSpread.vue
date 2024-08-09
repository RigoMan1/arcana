<script setup lang="ts">
const emit = defineEmits(['interpret-single', 'interpret-card-drop']);

const tarotSession = useTarotSession();

const { activeSpread, selectedCards } = storeToRefs(useTarotSpread());

const revealedCardsSet = ref(new Set());
const handleCardDrop = (cardName: string, spreadLabel: string) => {
  // 1. find card in deck
  const cardIndex = tarotSession.tarotDeck.findIndex(
    (card: TarotCard) => card?.name === cardName
  );
  if (cardIndex === -1) return;

  // 2. update selected cards
  const foundCard = tarotSession.tarotDeck[cardIndex];
  selectedCards.value[spreadLabel] = foundCard;

  // 3. remove card from deck
  tarotSession.removeCard(cardIndex);

  // 4. add card to revealed set after 1 second
  emit('interpret-card-drop', { position: spreadLabel, card: foundCard });
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

  emit('interpret-single', formattedCard, activeSpread.value);
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
            class="absolute -bottom-4 right-1/2 !translate-x-1/2 !rounded-full"
            size="xs"
            icon
            style="z-index: 100"
          >
            <icon
              class="text-base"
              name="fluent:eye-tracking-24-regular"
            />
            <!-- <icon
              class="text-lg"
              name="fluent:eye-tracking-24-regular"
            /> -->
          </arcana-button>
        </drop-zone>
      </div>
    </div>
  </div>
</template>
