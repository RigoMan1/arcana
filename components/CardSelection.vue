<script setup lang="ts">
defineProps<{
  tarotDeck: TarotCard[] | null[];
}>();

const deckContainer = ref<HTMLElement>();

onMounted(() => {
  if (deckContainer.value) {
    deckContainer.value.scrollLeft = deckContainer.value.scrollWidth / 2;
  }
});
</script>

<template>
  <div
    ref="deckContainer"
    class="deck-container flex mt-8 overflow-auto p-4 mx-auto select-none"
  >
    <div
      v-for="(card, cardIndex) in tarotDeck"
      :key="card ? `${card.name}-${card.arcana}` : cardIndex"
      class="min-w-[140px] border border-zinc-500 relative p-4 first:rounded-l-lg
        last:rounded-r-lg"
    >
      <!-- <nuxt-img src="iamgesima" /> -->
      <!-- {{ `images/gemstones/${cardIndex % 12}.png` }} -->

      <!-- <span
        class="flex items-center justify-center absolute w-6 h-6 text-center -top-3 left-1/2
          transform -translate-x-1/2 text-xs bg-zinc-900 border border-zinc-600
          text-zinc-400 font-bold rounded-full"
      >
        {{ cardIndex + 1 }}
      </span> -->

      <span
        class="flex p-1.5 items-center justify-center absolute text-center -top-5 left-1/2
          transform -translate-x-1/2 text-xs bg-zinc-900 border border-zinc-600
          text-zinc-400 font-bold rounded-full"
      >
        <!-- {{ cardIndex + 1 }} -->
        <nuxt-img
          :src="`images/gemstones/${(cardIndex % 12) + 1}.png`"
          alt="gemstone"
          class="h-4 w-4 object-cover"
        />
      </span>
      <draggable-tarot-card
        v-if="card"
        :card="card"
      />
      <div
        v-else
        class="h-full flex items-center justify-center text-xs"
      >
        <p class="text-center text-zinc-400">Card removed</p>
      </div>
    </div>
  </div>
</template>

<style>
.deck-container {
  @apply sticky bottom-4 z-20 backdrop-filter transition duration-300 w-[95%] rounded-xl shadow-lg
    border-8 border-indigo-950/50;
}
</style>
