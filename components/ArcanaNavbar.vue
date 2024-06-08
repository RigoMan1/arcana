<script setup lang="ts">
import { useEnergyStore } from '@/stores/useEnergyStore';
const { $state } = useEnergyStore();

const energyShop = ref(false);

const readerSelectStore = useFortuneTeller();

const route = useRoute();
const path = computed(() => route.path);

const maxLightness = 50;
const maxGlowEnergyThreshold = 1800;

const lightness = computed(() => {
  if ($state.basicEnergy === 0) {
    return 0;
  } else if ($state.basicEnergy >= maxGlowEnergyThreshold) {
    return maxLightness;
  } else {
    return ($state.basicEnergy / maxGlowEnergyThreshold) * maxLightness;
  }
});
const orbColor = computed(() => {
  return `hsl(200, 100%, ${lightness.value}%)`;
});
</script>

<template>
  <v-app-bar class="flex items-center justify-between p-4">
    <energy-shop-dialog v-model="energyShop" />
    <!--  fortune teller avatar -->
    <div
      v-if="path !== '/reader-select'"
      id="ft-avatar"
    >
      <nuxt-link to="/reader-select">
        <img
          :src="readerSelectStore.activeFortuneTeller.image"
          alt="fortune teller"
          class="w-12 h-12 rounded-full"
        />
      </nuxt-link>
    </div>
    <div
      v-else
      class="w-12 h-12 rounded-full"
    />

    <div
      class="space-x-4 flex energy-bar"
      @click="energyShop = true"
    >
      <!-- basic energy -->
      <div class="flex items-center">
        <div
          class="orb"
          :style="`--orb-color: ${orbColor}`"
        >
          <img
            class="w-5 rounded-full"
            src="/images/energy-basic.png"
            alt=""
          />
        </div>

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
.orb {
  border-radius: 50%;
  box-shadow:
    0 0 1em var(--orb-color),
    0 0 0.25em var(--orb-color);
  position: relative;
}

.orb img {
  filter: grayscale(100%);
}

.orb::after {
  content: '';
  width: 20px;
  height: 20px;

  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background-color: var(--orb-color);
  mix-blend-mode: screen;
}

.energy-bar {
  @apply rounded-full flex items-center p-0.5 justify-center pl-2;
  @apply border-2 !bg-primary-800/75 border-primary-800 text-white/30;
}
</style>
