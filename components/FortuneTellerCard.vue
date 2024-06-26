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

      <div class="rounded-lg">
        <template
          v-for="trait in fortuneTeller.traits"
          :key="trait.name"
        >
          <h3 class="mt-4 text-sm pl-3">{{ trait.name }}</h3>
          <div class="flex space-x-4 items-end p-2 w-full">
            <div class="object-cover bg-black p-2 w-[6rem] rounded">
              <img
                :src="trait.image"
                alt="trait"
              />
            </div>
            <div>
              <p class="mt-4 text-xs">{{ trait.description }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
