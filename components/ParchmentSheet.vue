<script setup lang="ts"></script>

<template>
  <div
    class="parchment-content relative flex items-center justify-center px-20 py-12"
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
  color: #7f3300;
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
/* anim */
:root {
  --scale-duration: 0.3s;
}
.scale-enter-active {
  transition-duration: 0.3s !important;
  transition-timing-function: var(--v-ease-out) !important;
}
.scale-leave-active {
  transition-duration: 0.3s !important;
  transition-timing-function: var(--v-ease-in) !important;
  position: absolute;
}
.scale-move {
  transition-duration: 0.5s !important;
  transition-property: transform !important;
  transition-timing-function: var(--v-ease-out) !important;
}
.scale-leave-to {
  opacity: 0;
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.scale-enter-active,
.scale-leave-active {
  transition-property: transform, opacity !important;
}
</style>
