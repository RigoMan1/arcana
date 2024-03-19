<script setup lang="ts"></script>

<template>
  <div>
    <div class="fortune-wrap flex flex-wrap">
      <slot />
    </div>

    <div class="flex mt-4 gap-4">
      <reveal-card class="w-1/4">
        <h3>Amethyst</h3>
        <img
          :src="`images/gemstones/2.png`"
          alt="gemstone"
          class="h-10 w-10 object-cover mt-4"
        />
      </reveal-card>

      <!-- daily affirmation -->
      <reveal-card
        class="w-1/4"
        label="Daily Affirmation"
        title="Daily Affirmation"
        message="I am a magnet for miracles."
      />

      <!-- numerology -->
      <reveal-card
        class="w-1/4"
        label="Numerology"
        title="Numerology"
        message="Your life path number is 7. You are a seeker of truth and wisdom."
      />

      <!-- zodiac -->
      <reveal-card
        class="w-1/4"
        label="Zodiac"
        title="Zodiac"
        message="Your sun sign is Cancer. You are intuitive, nurturing, and compassionate."
      />
    </div>

    <!-- card-footer -->
    <div
      class="p-8 bg-parchment-dark sticky bottom-0 z-20 border-t-8 border-t-amber-950/50"
    >
      <fortune-footer />
    </div>
  </div>
</template>

<style>
.fortune-wrap > *:nth-child(1) {
  @apply w-full;
}

/* make 1-9 width 33% */
.fortune-wrap > *:nth-child(2),
.fortune-wrap > *:nth-child(3),
.fortune-wrap > *:nth-child(4),
.fortune-wrap > *:nth-child(5),
.fortune-wrap > *:nth-child(6),
.fortune-wrap > *:nth-child(7),
.fortune-wrap > *:nth-child(8),
.fortune-wrap > *:nth-child(9),
.fortune-wrap > *:nth-child(10) {
  @apply w-1/3;
}
</style>
