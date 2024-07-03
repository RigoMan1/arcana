<script setup lang="ts">
defineProps<{
  fortuneTeller: IFortuneTeller;
}>();
</script>

<template>
  <div class="flex flex-col h-full">
    <div>
      <img
        :src="fortuneTeller.image"
        alt="fortune teller"
        class="w-40 h-40 rounded-xl object-cover mx-auto aspect-square"
      />
    </div>

    <div
      class="rounded-lg bg-secondary-300 bg-opacity-5 flex flex-col h-full overflow-auto mt-2"
    >
      <div class="sticky top-0 w-full bg-[#232429] px-4 pt-4">
        <h2 class="text-center mb-4">{{ fortuneTeller.name }}</h2>
        <hr class="border-primary-700 w-full" />
      </div>

      <div
        v-for="trait in fortuneTeller.traits"
        :key="trait.name"
        class="mt-4 p-2"
      >
        <div class="flex space-x-4 w-full">
          <div class="object-cover w-[4rem] flex-shrink-0" />
          <h3 class="text-xs text-zinc-100">{{ trait.name }}</h3>
        </div>
        <div class="flex space-x-4 w-full mt-2">
          <div
            class="object-cover bg-black p-2 w-[4rem] h-[4rem] rounded flex items-center
              justify-center flex-shrink-0"
          >
            <img
              :src="trait.image"
              alt="trait"
              class="w-full h-full object-contain"
            />
          </div>
          <p class="text-zinc-300 text-sm">{{ trait.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
