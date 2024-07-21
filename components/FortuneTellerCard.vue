<script setup lang="ts">
defineProps<{
  fortuneTeller: IFortuneTeller;
}>();
</script>

<template>
  <div class="h-full flex flex-col justify-center space-y-[2vh]">
    <div>
      <img
        :src="fortuneTeller.image"
        alt="fortune teller"
        class="rounded-xl object-cover mx-auto aspect-square h-[20vh] min-h-40 max-h-72"
      />
    </div>

    <div
      class="rounded-lg bg-secondary-400/10 flex flex-col overflow-auto mt-2 pb-4"
    >
      <div class="sticky top-0 w-full px-4 pt-4">
        <h2 class="text-center mb-4 text-lg">{{ fortuneTeller.name }}</h2>
        <v-divider />
      </div>

      <div
        v-for="trait in fortuneTeller.traits"
        :key="trait.name"
        class="mt-4 p-2"
      >
        <div class="flex space-x-4 w-full">
          <div class="object-cover w-[4rem] flex-shrink-0" />
          <h3 class="text-sm">{{ trait.name }}</h3>
        </div>
        <div class="flex space-x-4 w-full mt-1">
          <div
            class="object-cover p-2 w-[4rem] h-[4rem] rounded flex items-center justify-center
              flex-shrink-0 bg-seon"
          >
            <img
              :src="trait.image"
              alt="trait"
              class="w-full h-full object-contain"
            />
          </div>
          <p class="text-surface-100 text-sm">
            {{ trait.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
