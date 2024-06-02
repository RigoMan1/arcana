<script setup lang="ts">
import { useEnergyStore } from '@/stores/useEnergyStore';
const { $state } = useEnergyStore();

const energyShop = ref(false);

const readerSelectStore = useFortuneTeller();

const route = useRoute();
const path = computed(() => route.path);
</script>

<template>
  <v-app-bar class="flex items-center justify-between p-4">
    <energy-shop-dialog v-model="energyShop" />
    <!--  fortune teller avatar -->
    <nuxt-link
      v-if="path !== '/reader-select'"
      to="/reader-select"
    >
      <img
        :src="readerSelectStore.activeFortuneTeller.image"
        alt="fortune teller"
        class="w-12 h-12 rounded-full"
      />
    </nuxt-link>
    <div
      v-else
      class="w-12 h-12 rounded-full"
    />

    <div
      class="space-x-4 flex energy-bar"
      @click="energyShop = true"
    >
      <!-- basic energy -->
      <div
        class="flex items-center"
        :class="{
          'filter grayscale': $state.basicEnergy === 0,
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

      <!-- buy energy icon -->
      <arcana-button
        size="small"
        icon
        class="items-center !rounded-full !h-8"
      >
        <Icon
          name="fluent:add-20-filled"
          size="1rem"
        />
      </arcana-button>
    </div>

    <arcana-menu />
  </v-app-bar>
</template>

<style scoped>
.glow {
  --glow-color: var(--tw-shadow-color);

  box-shadow:
    0 0 1em var(--glow-color),
    0 0 0.25em var(--glow-color);
}

.energy-bar {
  @apply rounded-full flex items-center p-0.5 justify-center pl-2;
  @apply border-2 !bg-primary-800/75 border-primary-800 text-white/30;
}
</style>
