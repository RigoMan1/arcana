<script setup lang="ts">
import { useTarotSpread } from '~/stores/useTarotSpread';

const { activeSpread } = storeToRefs(useTarotSpread());

defineProps({
  spreadCost: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col h-full w-full justify-around">
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
    <div
      class="rounded-lg bg-secondary-300 bg-opacity-5 flex flex-col overflow-auto mt-2"
    >
      <div class="sticky top-0 w-full bg-[#232429] px-4 pt-4">
        <h2 class="text-center mb-4">{{ activeSpread.name }}</h2>
        <hr class="border-primary-700 w-full" />
      </div>

      <div class="rounded-lg p-4 overflow-auto h-full flex flex-col">
        <div
          class="flex justify-between items-start space-x-4 max-w-sm mx-auto w-full"
        >
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

        <div class="overflow-auto flex flex-col h-full mt-4">
          <p class="text-center text-sm max-w-xl">
            {{ activeSpread?.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
