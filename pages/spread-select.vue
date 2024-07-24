<script setup lang="ts">
import { useTarotSpread } from '~/stores/useTarotSpread';
import { spreads } from '@/constants/tarot-spreads';
import { useEnergyStore } from '@/stores/useEnergyStore';
import type { VSlideControls } from '~/modules/sui/runtime/components/VSlides/VSlides.vue';

const { $state } = useTarotSpread();
const { activeSpread } = storeToRefs(useTarotSpread());

const BASE_COST_PER_CARD = 60;
const DISCOUNT_PER_CARD = 25;

const spreadCost = computed(() => {
  const numCards = activeSpread.value.positions.length;
  // Apply a discount that increases with the number of cards
  const discount = numCards > 1 ? DISCOUNT_PER_CARD * (numCards - 1) : 0;
  const totalCost = BASE_COST_PER_CARD * numCards - discount;
  return totalCost;
});

const energyStore = useEnergyStore();
async function handleClick() {
  try {
    await energyStore.useBasicEnergy(spreadCost.value);
    navigateTo('/');
  } catch (error) {
    console.error(error);
  }
}

const slides = ref<VSlideControls>();
</script>

<template>
  <div class="px-4 pb-2 flex flex-col h-full justify-around">
    <div>
      <h1 class="text-center text-surface-200 text-xl">Choose your spread</h1>
    </div>

    <v-slides
      ref="slides"
      v-model="$state.activeSpreadIndex"
    >
      <v-slide
        v-for="spread in spreads"
        :key="spread.name"
        class="h-[75vh]"
      >
        <spread-card :spread-cost="spreadCost" />
      </v-slide>

      <!-- prev/next -->
      <div class="flex w-full absolute left-0 px-2 top-[calc(15vw+5vh)]">
        <arcana-button
          :disabled="!slides?.canMoveBack"
          variant="text"
          class="!px-4"
          @click="slides?.prev"
        >
          <Icon
            name="fluent:chevron-left-16-filled"
            size="1.5em"
          />
        </arcana-button>

        <div class="flex-1" />

        <arcana-button
          :disabled="!slides?.canMoveForward"
          variant="text"
          @click="slides?.next"
        >
          <Icon
            name="fluent:chevron-right-16-filled"
            size="1.5em"
          />
        </arcana-button>
      </div>
    </v-slides>

    <arcana-button
      class="w-3/4 self-center"
      text="Select"
      @click="handleClick"
    />
  </div>
</template>
