<script setup lang="ts">
const dialog = defineModel<boolean>();

const tiers = ref([
  {
    name: 'Basic',
    cost: 1.99,
    yield: 400,
    image: '/images/energy-basic.png',
  },
  {
    name: 'Cosmic',
    cost: 3.99,
    yield: 900,
    image: '/images/energy-cosmic.png',
  },
  {
    name: 'Divine',
    cost: 5.99,
    yield: 1400,
    image: '/images/energy-divine.png',
  },
]);
</script>

<template>
  <v-overlay
    v-model="dialog"
    activator="#toggle-overlay"
    transition="dialog-transition"
    width="90%"
    height="80%"
    persistent
    close-on-back
    class="flex items-center justify-center"
  >
    <div
      class="p-8 rounded-xl text-center relative bg-[#1E1E40] h-full flex flex-col"
    >
      <button
        class="absolute top-4 right-4 text-white"
        @click="dialog = false"
      >
        <icon
          name="fluent:dismiss-20-filled"
          size="1.5rem"
        />
      </button>

      <h2 class="text-2xl font-bold text-white">Energy Shop</h2>
      <p class="text-white mt-2">
        Use your energy to purchase items from the shop.
      </p>

      <div class="space-y-4 mt-6 overflow-y-auto">
        <div
          v-for="tier in tiers"
          :key="tier.name"
          class="arcana-card text-center flex items-center justify-around p-6 w-full"
        >
          <div class="flex flex-col items-center">
            <img
              class="w-12 shadow-blue-400 rounded-full"
              :src="tier.image"
              :alt="tier.name"
            />
            <p class="mt-2 text-green-300 text-xs">+ {{ tier.yield }} Energy</p>
          </div>

          <div>
            <h6 class="text-white mt-2">{{ tier.name }}</h6>
            <h3 class="text-xl font-bold text-white mt-2">${{ tier.cost }}</h3>
          </div>

          <!-- todo: monthly subscription to save money 10% off -->
          <!-- todo: share app for free energy -->
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<style>
.arcana-card {
  background: radial-gradient(
    100% 100% at 50% 5%,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.03) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  backdrop-filter: blur(4px);
  transition: transform 0.2s ease-in-out;
}

.arcana-card-alt {
  position: relative;
  z-index: 2;
  background: #2d2d59;
  border-radius: 0.5rem;
  padding: 1rem;
  backdrop-filter: blur(8px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 1.5px 1.1px rgba(0, 0, 0, 0.034),
    0 3.6px 2.5px rgba(0, 0, 0, 0.048),
    0 6.8px 4.8px rgba(0, 0, 0, 0.06),
    0 12.1px 8.5px rgba(0, 0, 0, 0.072),
    0 22.6px 15.9px rgba(0, 0, 0, 0.086),
    0 54px 38px rgba(0, 0, 0, 0.12);
}
</style>
