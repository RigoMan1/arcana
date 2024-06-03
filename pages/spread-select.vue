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
  <div class="flex flex-col h-full items-center justify-around p-4">
    <!-- <insufficient-energy-dialog v-model="alert" /> -->

    <insufficient-energy-dialog v-model="alert" />

    <h1 class="text-center">Choose your spread</h1>

    <v-slides
      v-model="$state.activeSpreadIndex"
      class="h-[90%]"
    >
      <v-slide
        v-for="spread in spreads"
        :key="spread.name"
        class="w-full flex flex-col h-full items-center justify-center space-y-8"
      >
        <!-- preview -->
        <div
          class="spread-grid mx-auto gap-2"
          :class="activeSpread.id"
        >
          <div
            v-for="label in activeSpread.labels"
            :key="label"
            class="aspect-[11/19] rounded bg-secondary-500 w-[32px] border border-secondary-300"
            :class="[label]"
          ></div>
        </div>

        <!-- info -->
        <div class="rounded-xl p-4 bg-secondary-300 bg-opacity-5 w-full h-1/2">
          <h2 class="text-center mb-4">{{ activeSpread?.name }}</h2>

          <hr class="my-4 border-primary-700" />

          <div
            class="flex justify-between items-start space-x-4 max-w-sm mx-auto w-full"
          >
            <!-- <div class="items-center justify-center flex-col">
                <h6 class="text-xs">Focus Areas</h6>

                <p
                  v-for="area in activeSpread?.focusAreas"
                  :key="area"
                  class="text-xs inline text-ellipsis"
                >
                  {{ area }},
                </p>
              </div> -->

            <div>
              <h6 class="text-xs">Est. Cost</h6>

              <p class="text-xs truncate text-blue-300">
                {{ spreadCost }} Energy
              </p>
            </div>

            <div>
              <h6 class="text-xs">Est. Time</h6>

              <p class="text-xs truncate">
                {{ activeSpread?.estimatedTime }}
              </p>
            </div>
          </div>

          <!-- <hr class="my-4 border-primary-700 opacity-0" /> -->

          <div class="overflow-y-scroll max-h-[10vh] mt-4 p-2">
            <p class="text-center text-sm max-w-xl">
              {{ activeSpread?.description }}
            </p>
          </div>
        </div>
      </v-slide>
      <!-- controls -->
      <template #external-content="{ prev, next, canMoveBack, canMoveForward }">
        <!-- prev/next -->
        <div
          class="flex justify-around items-center w-full fixed bottom-1/2 px-2"
        >
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
        <div class="flex justify-around items-center w-full fixed bottom-4">
          <nuxt-link
            class="w-full px-20"
            @click="handleClick"
          >
            <arcana-button
              class="w-full"
              text="Select"
            />
          </nuxt-link>
        </div>
      </template>
    </v-slides>
  </div>
</template>
