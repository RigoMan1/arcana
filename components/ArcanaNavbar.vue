<script setup lang="ts">
import { useEnergyStore } from '@/stores/useEnergyStore';
const { $state } = useEnergyStore();

const user = useSupabaseUser();

const supabase = useSupabaseClient();

const logout = async () => {
  await supabase.auth.signOut();
  navigateTo('/auth/login');
};

const energyShop = ref(false);
</script>

<template>
  <v-app-bar class="flex items-center justify-between py-4 px-8 bg-primary-900">
    <energy-shop-dialog v-model="energyShop" />
    <div
      class="space-x-4 flex"
      @click="energyShop = true"
    >
      <!-- basic energy -->
      <div
        class="energy-bar"
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
        class="energy-bar"
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

    <div class="flex space-x-2 items-center">
      <span>{{ user?.email.split('@')[0] }}</span>

      <arcana-button
        size="small"
        variant="text"
        icon
        @click="logout"
      >
        <Icon
          name="fluent:sign-out-20-filled"
          size="2em"
        />
      </arcana-button>
      <!-- <nuxt-link to="/">
        <img
          class="w-10"
          src="/images/logo.png"
          alt=""
        />
      </nuxt-link> -->
      <!-- <arcana-button
        disabled
      >
        1
      </arcana-button> -->
      <!-- <arcana-button> 2 </arcana-button> -->
    </div>
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
  @apply w-16 rounded-full flex items-center p-0.5 justify-center;
  @apply border-2 !bg-primary-800/75 border-primary-800 text-white/30;
}
</style>
