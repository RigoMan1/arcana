<script setup lang="ts">
defineProps<{
  fortuneTeller: IFortuneTeller;
}>();
</script>

<template>
  <div>
    <img
      :src="fortuneTeller.image"
      alt="fortune teller"
      class="w-64 h-64 rounded-xl object-cover mx-auto mt-4 aspect-square"
    />

    <div
      class="flex justify-center flex-col p-4 rounded-lg bg-secondary-300 bg-opacity-5 mt-8"
    >
      <h2 class="text-center mb-4">{{ fortuneTeller.name }}</h2>

      <hr class="border-primary-700 w-full" />

      <h3 class="mt-4">Traits</h3>
      <div
        v-for="trait in fortuneTeller.traits"
        :key="trait.name"
        class="flex space-x-4 items-end p-2 w-full"
      >
        <div class="object-cover bg-black p-2 w-[6rem]">
          <img
            :src="trait.image"
            alt="trait"
          />
        </div>
        <div>
          <h3 class="mt-4 text-sm">{{ trait.name }}</h3>
          <p class="mt-4 text-xs">{{ trait.description }}</p>
        </div>
      </div>

      <h3 class="mt-4">Ability</h3>
      <div class="flex space-x-4 items-end p-2 w-full">
        <div class="object-cover bg-black w-[6rem]">
          <img
            :src="fortuneTeller.ability.image"
            alt="trait"
          />
        </div>

        <div>
          <h3 class="mt-4 text-sm">{{ fortuneTeller.ability.name }}</h3>
          <p class="mt-4 text-xs">{{ fortuneTeller.ability.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
