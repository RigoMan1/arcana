<script setup lang="ts">
import { useTarotSpread } from '~/stores/useTarotSpread';
import { spreads } from '@/constants/tarot-spreads';
import { useEnergyStore } from '@/stores/useEnergyStore';

const { $state } = useTarotSpread();
const { activeSpread } = storeToRefs(useTarotSpread());

const alert = ref(false);

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
    alert.value = true;
  } else {
    navigateTo('/');
  }
}
</script>

<template>
  <div class="px-4 pb-2 flex flex-col h-full space-y-2">
    <div>
      <h1 class="text-center">Choose your spread</h1>
    </div>

    <v-slides
      v-model="$state.activeSpreadIndex"
      class="flex flex-col h-full"
    >
      <v-slide
        v-for="spread in spreads"
        :key="spread.name"
        class="h-full"
      >
        <spread-card :spread-cost="spreadCost" />
      </v-slide>
      <!-- controls -->
      <template #external-content="{ prev, next, canMoveBack, canMoveForward }">
        <!-- prev/next -->
        <div class="flex w-full fixed bottom-[65%] px-2 left-0 right-0">
          <arcana-button
            :disabled="!canMoveBack"
            variant="text"
            class="!px-4"
            @click="prev"
          >
            <Icon
              name="fluent:chevron-left-16-filled"
              size="1.5em"
            />
          </arcana-button>

          <div class="flex-1" />

          <arcana-button
            :disabled="!canMoveForward"
            variant="text"
            @click="next"
          >
            <Icon
              name="fluent:chevron-right-16-filled"
              size="1.5em"
            />
          </arcana-button>
        </div>
        <!-- select button-->
        <div class="flex justify-center">
          <nuxt-link @click="handleClick">
            <arcana-button
              class="!px-12"
              text="Select"
            />
          </nuxt-link>
        </div>
      </template>
    </v-slides>
  </div>
</template>
