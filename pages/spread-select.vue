<script setup lang="ts">
import { useTarotSpread } from '~/stores/useTarotSpread';
import { spreads } from '@/constants/tarot-spreads';

const { $state } = useTarotSpread();
const { activeSpread } = storeToRefs(useTarotSpread());

const activeSpreadData = computed(() => {
  return spreads.find((spread) => spread.id === activeSpread.value.name);
});
</script>

<template>
  <div class="w-full flex flex-col h-full items-center justify-around p-4">
    <h1 class="text-center">Choose your spread</h1>

    <v-slides v-model="$state.activeSpreadIndex">
      <v-slide
        v-for="spread in spreads"
        :key="spread.name"
      >
        <div
          class="w-full flex flex-col h-full items-center justify-between space-y-4"
        >
          <!-- preview -->
          <div
            class="spread-grid mx-auto gap-2"
            :class="activeSpread.name"
          >
            <div
              v-for="label in activeSpread.labels"
              :key="label"
              class="aspect-[11/19] rounded bg-secondary-500 w-[32px] border border-secondary-300"
              :class="[label]"
            ></div>
          </div>

          <!-- info -->
          <div class="rounded-xl p-4 bg-secondary-300 bg-opacity-5">
            <h2 class="text-center mb-4">{{ activeSpreadData?.name }}</h2>

            <hr class="my-4 border-primary-700" />

            <div
              class="flex justify-between items-start space-x-4 max-w-sm mx-auto w-full"
            >
              <div class="flex-1 items-center justify-center flex-col">
                <h6 class="text-xs">Focus Areas</h6>

                <p
                  v-for="area in activeSpreadData?.focusAreas"
                  :key="area"
                  class="text-xs inline truncate"
                >
                  {{ area }},
                </p>
              </div>

              <div>
                <h6 class="text-xs">Est. Time</h6>

                <p class="text-xs truncate">
                  {{ activeSpreadData?.estimatedTime }}
                </p>
              </div>
            </div>

            <!-- <hr class="my-4 border-primary-700 opacity-0" /> -->

            <div class="overflow-y-scroll max-h-[10vh] mt-4 p-2">
              <p class="text-center text-sm max-w-xl">
                {{ activeSpreadData?.description }}
              </p>
            </div>
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
            to="/"
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
