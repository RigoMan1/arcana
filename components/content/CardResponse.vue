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
    <h3 class="text-lg font-bold text-left">{{ title }}</h3>
    <div>
      <nuxt-img
        :src="`images/tarot-deck-classic/${image}`"
        class="w-16 rounded border-2 border-white float-left mr-4 my-0"
        alt="tarot card"
        :class="{ 'transform rotate-180': reverse }"
      />
      <slot />
    </div>
  </div>
</template>
