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

    <div class="flex items-center justify-center space-x-2">
      <v-item-group
        v-model="$state.activeFortuneTellerIndex"
        class="flex space-x-2 overflow-x-auto"
        mandatory
      >
        <v-item-slot
          v-for="(fortuneTeller, fortuneTellerIndex) in fortuneTellers"
          :key="fortuneTeller.name"
          v-slot="{ isSelected, toggle }"
          :value="fortuneTellerIndex"
        >
          <v-button
            :class="{ 'opacity-25': !isSelected }"
            class="rounded-xl overflow-hidden aspect-square h-[6vh] max-h-20 flex-shrink-0"
            @click="toggle"
          >
            <nuxt-img
              :src="fortuneTeller.image"
              alt="fortune teller"
              class="object-cover w-full h-full"
              placeholder
            />
          </v-button>
        </v-item-slot>
      </v-item-group>

      <arcana-button
        to="/spread-select"
        variant="primary"
        class="!h-full aspect-square"
        size="none"
      >
        <Icon
          name="fluent:arrow-circle-right-16-regular"
          size="1.5em"
        />
      </arcana-button>
    </div>
  </div>
</template>
