<template>
  <nuxt-pwa-manifest />

  <v-app class="overflow-hidden">
    <arcana-navbar />

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
