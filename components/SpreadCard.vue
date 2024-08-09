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
        class="aspect-[11/19] rounded bg-card-gradient w-[32px] border border-secondary-300/15"
        :class="[label.name]"
      />
    </div>

    <!-- info -->
    <div
      class="rounded-lg bg-secondary-400/10 pb-4 flex flex-col overflow-auto mt-2 border
        border-secondary-500/20"
    >
      <div class="sticky top-0 w-full px-4 pt-4">
        <h2 class="text-center mb-4">{{ activeSpread.name }}</h2>
        <v-divider />
      </div>

      <div class="rounded-lg p-4 overflow-auto h-full flex flex-col">
        <!-- bg-surface-800/50 -->
        <div
          class="flex justify-around items-start space-x-4 max-w-sm mx-auto w-full py-4
            rounded-xl bg-secondary-400/10"
        >
          <div class="text-center">
            <h6 class="text-xs">Cost</h6>

            <nuxt-img
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
          <p class="text-center text-surface-100 text-sm max-w-xl font-medium">
            {{ activeSpread?.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.bg-card-gradient {
  background: theme('colors.indigo.400');
  background-image: radial-gradient(
      ellipse at bottom left,
      rgb(36, 18, 63, 0.4) 0%,
      rgba(82, 245, 151, 0) 50%
    ),
    radial-gradient(
      ellipse at bottom right,
      rgb(30, 36, 86) -30%,
      rgba(88, 204, 248, 0) 70%
    );
}
</style>
