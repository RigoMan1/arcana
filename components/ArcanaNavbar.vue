<script setup lang="ts">
import { useEnergyStore } from '@/stores/useEnergyStore';
const { $state, useBasicEnergy } = useEnergyStore();
</script>

<template>
  <div
    class="flex items-center justify-between py-4 px-8 sticky top-0 z-50 arcana-navbar"
  >
    <div class="flex">
      <nuxt-link to="/">
        <img
          class="w-10"
          src="/images/logo.png"
          alt=""
        />
      </nuxt-link>
    </div>

    <div class="space-x-4 flex">
      <!-- basic energy -->

      <div
        class="w-20 rounded-full neu-inset flex items-center p-1 justify-center"
        :class="{
          'filter grayscale':
            $state.basicEnergy === 0 && $state.cosmicEnergy === 0,
        }"
      >
        <img
          class="w-4 shadow-blue-400 rounded-full"
          src="/images/energy-basic.png"
          alt=""
          :class="{ glow: $state.basicEnergy > 0 }"
        />

        <span class="text-white ml-3">
          {{ $state.basicEnergy }}
        </span>
      </div>

      <!-- cosmic energy -->
      <div
        :class="{ 'filter grayscale': $state.cosmicEnergy === 0 }"
        class="w-20 rounded-full neu-inset flex items-center p-1 justify-center shadow-"
      >
        <img
          class="w-4 shadow-purple-400 rounded-full"
          :class="{ glow: $state.cosmicEnergy > 0 }"
          src="/images/energy-cosmic.png"
          alt=""
        />

        <span class="text-white ml-3">
          {{ $state.cosmicEnergy }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glow {
  --glow-color: var(--tw-shadow-color);

  box-shadow:
    0 0 1em var(--glow-color),
    0 0 0.25em var(--glow-color);
}
</style>
