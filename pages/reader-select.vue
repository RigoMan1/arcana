<script setup lang="ts">
import { useFortuneTeller } from '~/stores/useFortuneTeller';
import { fortuneTellers } from '@/constants/fortune-tellers';

const { $state } = useFortuneTeller();
</script>

<template>
  <div class="px-4 pb-2 flex flex-col h-full space-y-2">
    <div>
      <h1 class="text-center">Choose your reader</h1>
    </div>

    <v-slides
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
      <!-- controls -->
      <template #external-content="{ prev, next, canMoveBack, canMoveForward }">
        <!-- prev/next -->
        <div class="flex w-full fixed bottom-[70%] px-2 left-0 right-0">
          <arcana-button
            :disabled="!canMoveBack"
            variant="text"
            class="!px-4"
            @click="prev"
          >
            <Icon
              name="fluent:chevron-left-16-filled"
              size="1.5em"
            />
          </arcana-button>

          <div class="flex-1" />

          <arcana-button
            :disabled="!canMoveForward"
            variant="text"
            @click="next"
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
      </template>
    </v-slides>
  </div>
</template>
