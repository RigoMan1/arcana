<script setup lang="ts">
import { useFortuneTeller } from '~/stores/useFortuneTeller';
import { fortuneTellers } from '@/constants/fortune-tellers';
import type { VSlideControls } from '~/modules/sui/runtime/components/VSlides/VSlides.vue';

const { $state } = useFortuneTeller();
const slides = ref<VSlideControls>();
</script>

<template>
  <div class="px-4 pb-2 flex flex-col h-full space-y-2">
    <div>
      <h1 class="text-center">Choose your reader</h1>
    </div>

    <v-slides
      ref="slides"
      v-model="$state.activeFortuneTellerIndex"
      class="h-full"
    >
      <v-slide
        v-for="fortuneTeller in fortuneTellers"
        :key="fortuneTeller.name"
        class="h-full"
      >
        <fortune-teller-card :fortune-teller="fortuneTeller" />
      </v-slide>
    </v-slides>

    <!-- prev/next -->
    <div class="flex w-full absolute left-0 top-[8.5rem] px-2 v-slide-controls">
      <arcana-button
        :disabled="!slides?.canMoveBack"
        variant="text"
        class="!px-4"
        @click="slides?.prev"
      >
        <Icon
          name="fluent:chevron-left-16-filled"
          size="1.5em"
        />
      </arcana-button>

      <div class="flex-1" />

      <arcana-button
        :disabled="!slides?.canMoveForward"
        variant="text"
        @click="slides?.next"
      >
        <Icon
          name="fluent:chevron-right-16-filled"
          size="1.5em"
        />
      </arcana-button>
    </div>
    <!-- select button-->
    <div class="flex justify-center">
      <nuxt-link to="/spread-select">
        <arcana-button
          class="!px-12"
          text="Select"
        />
      </nuxt-link>
    </div>
  </div>
</template>
