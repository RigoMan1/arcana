<script setup lang="ts">
defineProps<{
  randomCards: TarotCard[] | null[];
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
    class="bg-parchment-dark deck-container flex mt-8 overflow-auto p-8 mx-auto select-none
      h-[420px]"
  >
    <div
      v-for="(card, cardIndex) in randomCards"
      :key="card ? `${card.name}-${card.arcana}` : cardIndex"
      class="min-w-[233px] border border-zinc-500 relative p-4 first:rounded-l-lg
        last:rounded-r-lg"
    >
      <!-- <img src="iamgesima" /> -->
      <!-- {{ `images/gemstones/${cardIndex % 12}.png` }} -->

      <!-- <span
        class="flex items-center justify-center absolute w-6 h-6 text-center -top-3 left-1/2
          transform -translate-x-1/2 text-xs bg-zinc-900 border border-zinc-600
          text-zinc-400 font-bold rounded-full"
      >
        {{ cardIndex + 1 }}
      </span> -->

      <span
        class="flex p-1.5 items-center justify-center absolute text-center -top-6 left-1/2
          transform -translate-x-1/2 text-xs bg-zinc-900 border border-zinc-600
          text-zinc-400 font-bold rounded-full"
      >
        <!-- {{ cardIndex + 1 }} -->
        <img
          :src="`images/gemstones/${(cardIndex % 12) + 1}.png`"
          alt="gemstone"
          class="h-6 w-6 object-cover"
        />
      </span>
      <draggable-tarot-card
        v-if="card"
        :card="card"
      />
      <div
        v-else
        class="w-[200px] h-full flex items-center justify-center"
      >
        <p class="text-center text-zinc-400">Card removed</p>
      </div>
    </div>
  </div>
</template>

<style>
/* overlay the container at the bottom of the screen over main content */
.deck-container {
  @apply sticky bottom-4 z-20 backdrop-filter transition duration-300 w-[95%] rounded-xl shadow-lg
    border-8 border-amber-950/25;
}
</style>
