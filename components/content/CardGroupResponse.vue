<script setup lang="ts">
defineProps<{
  title: string;
  cards?: {
    image: string;
    reversed: string | boolean;
  }[];
}>();
</script>

<template>
  <div>
    <h3 class="text-lg font-bold text-left">{{ title }}</h3>

    <slot />
  </div>
</template>
