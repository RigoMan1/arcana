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

      <div class="rounded-lg p-4">
        <h3>Traits</h3>
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
  </div>
</template>
