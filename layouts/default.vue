<script setup lang="ts">
import { useAnonymousUser } from '~/composables/useAnonymousUser';

const uuid = ref<string>('');
const { getOrCreateAnonymousUser } = useAnonymousUser();

onMounted(async () => {
  uuid.value = await getOrCreateAnonymousUser();
});

const { initializeEnergy } = useEnergyStore();

onMounted(async () => {
  initializeEnergy();
});
</script>

<template>
  <nuxt-pwa-manifest />

  <v-app class="overflow-hidden">
    <arcana-navbar />

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
