<script setup lang="ts">
import { useFortuneTeller } from '~/stores/useFortuneTeller';
import { fortuneTellers } from '@/constants/fortune-tellers';

const { $state } = useFortuneTeller();
</script>

<template>
  <div
    class="w-full px-4 flex flex-col h-full items-center justify-around py-4"
  >
    <h1 class="text-center">Choose your reader</h1>

    <v-slides v-model="$state.activeFortuneTellerIndex">
      <v-slide
        v-for="fortuneTeller in fortuneTellers"
        :key="fortuneTeller.name"
        class="min-h-[50vh] flex items-center justify-center mb-20"
      >
        <fortune-teller-card
          :fortune-teller="fortuneTeller"
          class="w-full overflow-auto"
        />
      </v-slide>
      <!-- controls -->
      <template #external-content="{ prev, next, canMoveBack, canMoveForward }">
        <!-- prev/next -->
        <div
          class="flex justify-around items-center w-full fixed bottom-1/2 px-2"
        >
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
        <div class="flex justify-around items-center w-full fixed bottom-4">
          <nuxt-link
            class="w-full px-20"
            to="/spread-select"
          >
            <arcana-button
              class="w-full"
              text="Select"
            />
          </nuxt-link>
        </div>
      </template>
    </v-slides>
  </div>
</template>
