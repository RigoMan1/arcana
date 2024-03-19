<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(false);

defineProps({
  label: {
    type: String,
    default: 'Reveal',
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
});

// todo: hold to reveal
</script>

<template>
  <div
    class="overflow-hidden p-2 grid-cell"
    @click="isVisible = true"
  >
    <div class="h-full relative ">
      <div
        v-if="!isVisible"
        class="conceal-overlay absolute left-0 top-0 transform bg-zinc-900 w-full h-full flex
          items-center justify-center cursor-pointer rounded-xl"
      >
        <!-- <span>{{ label }}</span> -->
        <span>{{ title }}</span>
      </div>

      <div
        class="inner-shadow w-full h-full border border-zinc-500 bg-zinc-700 rounded-lg shadow
          p-4 flex items-center justify-start flex-col"
      >
        <h3
          v-if="title"
          class="text-xl font-semibold mb-2"
        >
          {{ title }}
        </h3>

        <slot />

        <p v-if="message">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inner-shadow {
  box-shadow: inset 0 0 15px 0 theme('colors.zinc.950');
}

.card {
  transition: transform 0.3s ease;
}

.card-enter-active,
.card-leave-active {
  transition: transform 0.3s ease;
}

.card-enter-from,
.card-leave-to {
  transform: scale(0.96);
}

.card-enter-to,
.card-leave-from {
  transform: scale(1);
}

.conceal-overlay {
  background-image: url('/images/textures/stone.webp');

  background-size: cover;
  background-position: center;
  background-blend-mode: soft-light;
  z-index: 10;

  font-weight: bold;
}

.grid-cell {
  transition: transform 0.3s ease;
}

.grid-cell:hover {
  transform: scale(1.01);
}

.grid-cell:active {
  transform: scale(0.99);
}
</style>
