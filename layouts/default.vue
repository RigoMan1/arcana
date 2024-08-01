<script setup lang="ts">
import { useAnonymousUser } from '~/composables/useAnonymousUser';
import { useEnergyStore } from '@/stores/useEnergyStore';

const appLoaded = ref(false);

const { getOrCreateAnonymousUser, getOrCreateDevUser } = useAnonymousUser();
const { initializeEnergy } = useEnergyStore();
const { fetchBio } = useProfileStore();

onMounted(async () => {
  try {
    process.env.NODE_ENV === 'development'
      ? await getOrCreateDevUser()
      : await getOrCreateAnonymousUser();

    await Promise.all([initializeEnergy(), fetchBio()]);

    appLoaded.value = true;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <nuxt-pwa-manifest />

  <insufficient-energy-dialog />

  <v-app
    v-if="appLoaded"
    class="overflow-hidden max-w-2xl mx-auto"
  >
    <arcana-navbar />

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
