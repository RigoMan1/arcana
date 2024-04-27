<script setup lang="ts">
defineProps<{
  readings: IMessage[];
}>();
const dialog = defineModel<boolean>();
</script>

<template>
  <v-overlay
    v-model="dialog"
    activator="#toggle-overlay"
    transition="dialog-transition"
    width="90%"
    persistent
    close-on-back
  >
    <!-- close button -->
    <button
      class="flex items-center space-x-2 ml-auto mb-4 mr-4"
      @click="dialog = false"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <span>Close</span>
    </button>

    <parchment-sheet>
      <fortune-teller-message
        class="h-[80vh] overflow-scroll"
        :message="readings[readings.length - 1]"
      />
    </parchment-sheet>
  </v-overlay>
</template>
