<script setup lang="ts">
const props = defineProps<{
  image: string;
  title: string;
  reversed: string;
}>();

const reverse = props.reversed === 'true';
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
        :class="{ 'transform rotate-180': reverse }"
      />
      <slot />
    </p>
  </div>
</template>
