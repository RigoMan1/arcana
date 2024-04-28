<script setup lang="ts"></script>

<template>
  <nuxt-pwa-manifest />

  <v-app class="overflow-hidden">
    <arcana-navbar />

    <v-main>
      <nuxt-page />
    </v-main>
  </v-app>
</template>
