<script setup lang="ts">
import { useTarotSpread } from '~/stores/useTarotSpread';
import { spreads } from '@/constants/tarot-spreads';
import { useEnergyStore } from '@/stores/useEnergyStore';
import type { VSlideControls } from '~/modules/sui/runtime/components/VSlides/VSlides.vue';

const { $state } = useTarotSpread();
const { activeSpread } = storeToRefs(useTarotSpread());

const lowEnergyAlert = ref(false);

const WHOLISTIC_READING_ENERGY_COST = 50;
const MIN_MESSAGE_COST = 10;

const spreadCost = computed(() => {
  return (
    WHOLISTIC_READING_ENERGY_COST * activeSpread.value.components.length +
    MIN_MESSAGE_COST
  );
});

const energyStore = useEnergyStore();
function handleClick() {
  if (energyStore.basicEnergy < spreadCost.value) {
    lowEnergyAlert.value = true;
  } else {
    navigateTo('/');
  }
}

const slides = ref<VSlideControls>();
</script>

<template>
  <insufficient-energy-dialog v-model="lowEnergyAlert" />
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
