<script setup lang="ts">
defineProps<{
  message: IMessage | null;
  show: boolean;
}>();
</script>

<template>
  <transition name="dialog-transition">
    <div
      v-if="show"
      class="absolute top-16 px-4 origin-top"
    >
      <svg
        class="ml-2"
        width="20"
        height="10"
        viewBox="0 0 20 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="0,10 10,0 20,10"
          class="fill-secondary-700"
        />
      </svg>
      <div class="h-full overflow-auto chat-bubble">
        <fortune-teller-message
          v-if="message"
          class="!text-indigo-100"
          :message="message"
        />
      </div>
    </div>
  </transition>
</template>

<style>
.chat-bubble {
  @apply relative rounded-lg bg-secondary-700 p-2 max-h-[40vh] overflow-auto;
}
</style>
