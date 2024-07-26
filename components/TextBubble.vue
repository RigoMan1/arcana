<script setup lang="ts">
const fortuneTeller = useFortuneTeller();
</script>

<template>
  <transition name="dialog-transition">
    <div
      v-if="fortuneTeller.currentMessage && fortuneTeller.displayMessage"
      class="absolute origin-top mr-4 mt-2 max-w-lg"
    >
      <svg
        class="ml-3.5"
        width="20"
        height="10"
        viewBox="0 0 20 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="0,10 10,0 20,10"
          class="fill-secondary-800"
        />
      </svg>
      <div class="h-full overflow-auto chat-bubble">
        <fortune-teller-message
          v-if="fortuneTeller.currentMessage"
          class="!text-indigo-100"
          :message="fortuneTeller.currentMessage"
        />
      </div>
    </div>
  </transition>
</template>

<style>
.chat-bubble {
  @apply relative rounded-lg bg-secondary-800 p-2 max-h-[40vh] overflow-auto;
}
</style>
