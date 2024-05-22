<script setup lang="ts"></script>

<template>
  <div
    class="parchment-content relative flex items-center justify-center sm:px-20 sm:py-12
      px-10"
  >
    <div class="parchment absolute w-full h-full"></div>

    <slot />

    <svg class="hidden">
      <filter id="wavy2">
        <feTurbulence
          x="0"
          y="0"
          baseFrequency="0.02"
          numOctaves="5"
          seed="1"
        />
        <feDisplacementMap
          in="SourceGraphic"
          scale="20"
        />
      </filter>
    </svg>
  </div>
</template>

<style scoped>
.parchment-content {
  color: #7f3300 !important;
}

.parchment {
  padding: 2rem;
  box-shadow:
    2px 3px 20px black,
    0 0 125px #8f5922 inset;
  background: #fffef0;
  filter: url(#wavy2);
  border-radius: 2rem;
}
</style>
