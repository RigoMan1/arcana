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
        v-for="label in activeSpread.positions"
        :key="label.name"
        class="aspect-[11/19] rounded bg-secondary-500 w-[32px] border border-secondary-300"
        :class="[label.name]"
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
          class="flex justify-between items-start space-x-4 max-w-sm mx-auto w-full
            bg-zinc-900/40 p-3 rounded-xl"
        >
          <div class="text-center">
            <h6 class="text-xs">Est. Cost</h6>

            <img
              class="w-3.5 rounded-full inline mr-1"
              src="/images/energy-basic.png"
              alt=""
            />

            <span class="text-xs truncate text-blue-300 font-sans">
              {{ spreadCost }}
            </span>
          </div>

          <div class="text-center">
            <h6 class="text-xs">Est. Time</h6>

            <Icon
              name="fluent:clock-20-filled"
              size="1rem"
              class="mr-1"
            />

            <span class="text-xs truncate font-sans capitalize">
              {{ activeSpread?.estimatedTime }}
            </span>
          </div>
        </div>

        <div class="overflow-auto flex flex-col h-full mt-4">
          <p class="text-center text-zinc-300 text-sm max-w-xl">
            {{ activeSpread?.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
