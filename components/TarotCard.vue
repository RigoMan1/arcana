<script setup lang="ts">
const elementMap: Record<string, string> = {
  cups: 'water',
  pentacles: 'earth',
  swords: 'air',
  wands: 'fire',
};

defineProps<{
  card: TarotCard;
}>();

const isFlipped = ref(true);

const toggleFlip = () => (isFlipped.value = !isFlipped.value);
</script>

<template>
  <div
    class="card overflow-hidden p-2"
    @click="toggleFlip"
  >
    <div
      class="card__inner rounded-lg border-4 border-zinc-200"
      :class="{ 'is-flipped': isFlipped }"
    >
      <div
        class="card__front flex items-center text-center justify-center"
        :class="{
          [`card--${card.suit}`]: card.suit,
          'card--major': card.arcana === 'major',
        }"
      >
        <div>
          <h1 class="text-3xl font-bold">{{ card.name }}</h1>

          <hr class="my-2 mx-4 opacity-10 border-white" />

          <p class="text-xl font-medium capitalize">
            {{ card.number || card.court }}
          </p>
        </div>
        <!-- <img
            :src="card.image"
            alt="The Fool Tarot Card"
            class="h-full w-full object-cover"
          /> -->
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
</template>

<style>
.card {
  perspective: 1000px;
  width: 200px;
  height: 300px;
  user-select: none;
  /* --- */
  pointer-events: none;
  user-drag: none;
  user-select: none;
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
}

.card--pentacle {
  background-color: theme('colors.green.300');
  color: theme('colors.green.900');
}

.card--sword {
  background-color: theme('colors.yellow.300');
  color: theme('colors.yellow.900');
}

.card--wand {
  background-color: theme('colors.rose.300');
  color: theme('colors.rose.900');
}
</style>
