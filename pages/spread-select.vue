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
  <div
    class="w-full px-4 flex flex-col h-full items-center justify-around py-4"
  >
    <h1 class="text-center">Choose your spread</h1>

    <v-slides v-model="$state.activeSpreadIndex">
      <!-- controls -->
      <template #external-content="{ prev, next, canMoveBack, canMoveForward }">
        <div class="flex items-center justify-around w-full">
          <arcana-button
            :disabled="!canMoveBack"
            @click="prev"
          >
            <Icon
              name="fluent:chevron-left-16-filled"
              size="1.5em"
            />
          </arcana-button>

          <nuxt-link to="/">
            <arcana-button text="Continue" />
          </nuxt-link>

          <arcana-button
            :disabled="!canMoveForward"
            @click="next"
          >
            <Icon
              name="fluent:chevron-right-16-filled"
              size="1.5em"
            />
          </arcana-button>
        </div>
      </template>

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
              class="aspect-[11/19] rounded border border-secondary-300 bg-secondary-900 w-[32px]"
              :class="[label]"
            >
              <!-- <img
                src="/images/tarot-back.png"
                alt="Tarot Card Back Design"
                class="h-full w-full object-cover"
              /> -->
            </div>
          </div>

          <!-- info -->
          <div class="border rounded-xl border-primary-700 p-4">
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
    </v-slides>
  </div>
</template>

<style></style>
