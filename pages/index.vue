<script setup lang="ts">
import { useFortuneTeller } from '~/stores/useFortuneTeller';
import { fortuneTellers } from '@/constants/fortune-tellers';
import type { VSlideControls } from '~/modules/sui/runtime/components/VSlides/VSlides.vue';

const { $state } = useFortuneTeller();
const slides = ref<VSlideControls>();
</script>

<template>
  <div class="px-4 pb-2 flex flex-col h-full justify-around">
    <div>
      <h1 class="text-center text-surface-200 text-xl">Choose your reader</h1>
    </div>

    <v-slides
      ref="slides"
      v-model="$state.activeFortuneTellerIndex"
    >
      <v-slide
        v-for="fortuneTeller in fortuneTellers"
        :key="fortuneTeller.name"
        class="h-[75vh] flex"
      >
        <fortune-teller-card :fortune-teller="fortuneTeller" />
      </v-slide>

      <!-- prev/next -->
      <div class="flex w-full absolute left-0 px-2 top-[calc(15vw+5vh)]">
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
    </v-slides>

    <!-- select button-->
    <arcana-button
      class="w-3/4 self-center"
      text="Select"
      to="/spread-select"
    />
  </div>
</template>
