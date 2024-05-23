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
  <div>
    <img
      :src="fortuneTeller.image"
      alt="fortune teller"
      class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
    />

    <div
      class="flex items-center justify-center flex-col p-4 border rounded-lg text-center
        border-primary-500"
    >
      <h2 class="text-center mb-4">{{ fortuneTeller.name }}</h2>

      <hr class="border-primary-700 w-full" />

      <p class="mt-6">{{ fortuneTeller.description }}</p>
    </div>
  </div>
</template>
