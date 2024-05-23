<script setup lang="ts">
import { useFortuneReading } from '@/stores/useFortuneReading';
import { fortuneTellers } from '@/constants/fortune-tellers';

const { $state } = useFortuneReading();
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
        class="min-h-[50vh] flex items-center justify-center"
      >
        <fortune-teller-card
          :fortune-teller="fortuneTeller"
          class="w-full overflow-auto"
        />
      </v-slide>
      <template #external-content="{ prev, next, canMoveBack, canMoveForward }">
        <div class="flex justify-around items-center w-full">
          <arcana-button
            :disabled="!canMoveBack"
            class="!px-4"
            @click="prev"
          >
            <Icon
              name="fluent:chevron-left-16-filled"
              size="1.5em"
            />
          </arcana-button>

          <nuxt-link to="/spread-select">
            <arcana-button text="Continue" />
          </nuxt-link>

          <arcana-button
            class="!px-4"
            :disabled="!canMoveForward"
            @click="next"
          >
            <Icon
              name="fluent:chevron-right-16-filled"
              size="1.5em"
            />
          </arcana-button>
        </div>
      </template>
    </v-slides>
  </div>
</template>
