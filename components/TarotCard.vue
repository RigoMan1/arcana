<script setup lang="ts">
const elementMap: Record<string, string> = {
  cups: 'water',
  pentacles: 'earth',
  swords: 'air',
  wands: 'fire',
};

const props = defineProps<{
  card: TarotCard;
  flip?: boolean;
}>();

const showOverlay = ref(false);
// watch flip and show overlay for 1 second

watch(
  () => props.flip,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        showOverlay.value = true;
      }, 200);
    }
  }
);
</script>

<template>
  <div class="relative">
    <div
      class="card__overlay card__inner glow--inactive"
      :class="{
        'is-flipped': !flip,
        'glow--active': showOverlay,
        'card--major': card.arcana === 'major',
        [`card--${card.suit}`]: card.suit,
        'opacity-0': !showOverlay,
      }"
    >
      <svg v-if="showOverlay">
        <filter id="mysticalGlow">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="2"
            seed="1"
            class="noise-anim"
          >
            <animate
              attributeName="baseFrequency"
              dur="6s"
              values="0.02; 0.0275; 0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>

          <feDisplacementMap
            in="SourceGraphic"
            scale="20"
          />
        </filter>
      </svg>
    </div>

    <div class="card overflow-hidden">
      <div
        class="card__inner rounded-lg border-4 border-zinc-200"
        :class="{ 'is-flipped': !flip }"
      >
        <div
          class="card__front flex items-center text-center justify-center"
          :class="{
            [`card--${card.suit}`]: card.suit,
            'card--major': card.arcana === 'major',
          }"
        >
          <img
            v-if="card.image"
            :src="`images/tarot-deck-classic/${card.image}`"
            :alt="`${card.name} - ${card.arcana}`"
            class="h-full w-full object-cover"
          />
          <div v-else>
            <h1 class="text-3xl font-bold">{{ card.name }}</h1>

            <hr class="my-2 mx-4 opacity-10 border-white" />

            <p class="text-xl font-medium capitalize">
              {{ card.number || card.court }}
            </p>
          </div>
        </div>
        <div class="card__back">
          <img
            src="/images/tarot-back.png"
            alt="Tarot Card Back Design"
            class="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  /*  neon-glow parameters */
  --neon-primary-color: #ff1177;
  --neon-secondary-color: #fff;

  --neon-spread-start: 2px;
  --neon-spread-end: 4px;
  --neon-glow-opacity: 0.5;
}

.card {
  perspective: 1000px;
  user-select: none;
  /* --- */
  pointer-events: none;
  user-drag: none;
  aspect-ratio: 11 / 19;
}

.card__inner {
  width: 100%;
  height: 100%;
  transition: transform 0.5s var(--v-ease-in-out);
  transform-style: preserve-3d;
  cursor: pointer;
}

.card__front,
.card__back {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
}

.card__back {
  transform: rotateY(180deg);
}

.is-flipped {
  transform: rotateY(180deg);
}

/* colors */
.card--major {
  background: radial-gradient(
      ellipse farthest-corner at right bottom,
      #fedb37 0%,
      #fdb931 8%,
      #9f7928 30%,
      #8a6e2f 40%,
      transparent 80%
    ),
    radial-gradient(
      ellipse farthest-corner at left top,
      #ffffff 0%,
      #ffffac 8%,
      #d1b464 25%,
      #5d4a1f 62.5%,
      #5d4a1f 100%
    );

  color: black;
}

.card--cup {
  background-color: theme('colors.blue.300');
  color: theme('colors.blue.900');
  --neon-primary-color: theme('colors.blue.500');
  --neon-secondary-color: theme('colors.blue.300');
}

.card--pentacle {
  background-color: theme('colors.green.300');
  color: theme('colors.green.900');
  --neon-primary-color: theme('colors.green.500');
  --neon-secondary-color: theme('colors.green.300');
}

.card--sword {
  background-color: theme('colors.amber.300');
  color: theme('colors.amber.900');
  --neon-primary-color: theme('colors.amber.500');
  --neon-secondary-color: theme('colors.amber.300');
}

.card--wand {
  background-color: theme('colors.rose.300');
  color: theme('colors.rose.900');
  --neon-primary-color: theme('colors.rose.500');
  --neon-secondary-color: theme('colors.rose.300');
}

.card--major {
  /* gold */
  background-color: #fedb37;
  color: #5d4a1f;
  --neon-primary-color: #fedb37;
  --neon-secondary-color: #5d4a1f;
  --neon-glow-opacity: 1;
}

/* todo: play with opacity and fill mode to replicate a glowing effect  */

@keyframes neon-glow {
  0% {
    box-shadow:
      0 0 calc(var(--neon-spread-start) * 1) var(--neon-secondary-color),
      0 0 calc(var(--neon-spread-start) * 2) var(--neon-secondary-color),
      0 0 calc(var(--neon-spread-start) * 3) var(--neon-secondary-color),
      0 0 calc(var(--neon-spread-start) * 4) var(--neon-primary-color),
      0 0 calc(var(--neon-spread-start) * 7) var(--neon-primary-color),
      0 0 calc(var(--neon-spread-start) * 8) var(--neon-primary-color),
      0 0 calc(var(--neon-spread-start) * 10) var(--neon-primary-color),
      0 0 calc(var(--neon-spread-start) * 15) var(--neon-primary-color);
  }
  100% {
    box-shadow:
      0 0 calc(var(--neon-spread-end) * 1) var(--neon-secondary-color),
      0 0 calc(var(--neon-spread-end) * 2) var(--neon-secondary-color),
      0 0 calc(var(--neon-spread-end) * 3) var(--neon-secondary-color),
      0 0 calc(var(--neon-spread-end) * 4) var(--neon-primary-color),
      0 0 calc(var(--neon-spread-end) * 7) var(--neon-primary-color),
      0 0 calc(var(--neon-spread-end) * 8) var(--neon-primary-color),
      0 0 calc(var(--neon-spread-end) * 10) var(--neon-primary-color),
      0 0 calc(var(--neon-spread-end) * 15) var(--neon-primary-color);
  }
}

.card__overlay {
  @apply absolute top-0 left-0 w-[95%] h-[97%] rounded-lg;
  animation: neon-glow 1s ease-in-out infinite alternate;
  filter: url(#mysticalGlow);
  /* center it */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.glow--inactive {
  --neon-spread-start: 0;
  --neon-spread-end: 0;
}

.glow--active {
  /* --neon-spread-start: 1.5px;
  --neon-spread-end: 2.5px; */
  --neon-spread-start: 2px;
  --neon-spread-end: 3px;
  --neon-glow-opacity: 1;
  opacity: var(--neon-glow-opacity);
}
</style>
