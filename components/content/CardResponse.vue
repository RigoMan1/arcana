<script setup lang="ts">
defineProps<{
  image: string;
  title: string;
}>();
</script>

<template>
  <div>
    <div class="flex items-center space-x-4 justify-center">
      <h2 class="text-xl font-bold">{{ title }}</h2>
    </div>

    <p>
      <img
        :src="`images/tarot-deck-classic/${image}`"
        class="w-16 rounded border-2 border-white float-left mr-4 my-0"
        alt="tarot card"
      />
      <slot />
    </p>
  </div>
</template>
