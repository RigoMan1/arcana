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
    max-width="800px"
    close-on-back
    class="flex items-center justify-center"
    
  >
    <!-- close button -->

    <parchment-sheet class="relative">
      <arcana-button
        class="absolute -top-4 -right-2 !rounded-full"
        icon
        @click="dialog = false"
      >
        <icon
          name="fluent:dismiss-20-filled"
          size="1.5rem"
        />
      </arcana-button>

      <fortune-teller-message
        class="h-[80vh] overflow-auto py-8"
        :message="readings[readings.length - 1]"
      />
    </parchment-sheet>
  </v-overlay>
</template>
