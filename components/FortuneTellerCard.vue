<script setup lang="ts">
defineProps<{
  fortuneTeller: {
    name: string;
    description: string;
    image: string;
  };
}>();
</script>

<template>
  <div
    class="flex items-center justify-center flex-col p-8 border rounded-lg text-center
      border-primary-500"
  >
    <img
      :src="fortuneTeller.image"
      alt="fortune teller"
      class="w-32 h-32 rounded-full"
    />

    <h2 class="text-xl mt-2">{{ fortuneTeller.name }}</h2>

    <p class="mt-4">{{ fortuneTeller.description }}</p>
  </div>
</template>