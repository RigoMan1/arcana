<script setup lang="ts">
import { useAnonymousUser } from '~/composables/useAnonymousUser';

const appLoaded = ref(false);
const uuid = ref<string>('');

const { getOrCreateAnonymousUser } = useAnonymousUser();
const { initializeEnergy } = useEnergyStore();

onMounted(async () => {
  try {
    uuid.value = await getOrCreateAnonymousUser();
    await initializeEnergy();
    appLoaded.value = true;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <nuxt-pwa-manifest />

  <v-app
    v-if="appLoaded"
    class="overflow-hidden"
  >
    <arcana-navbar />

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
