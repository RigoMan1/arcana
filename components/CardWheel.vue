<script setup lang="ts">
const tarotSession = useTarotSession();

const circle = ref() as Ref<HTMLDivElement | null>;

const cumulativeRotation = ref(0); // Track rotation across spins

const totalCards = tarotSession.tarotDeck.length;
const removedIndexes = ref<number[]>([]);
const isSpinning = ref(false);

const spinCarousel = () => {
  if (isSpinning.value) return;
  tarotSession.cardDrawn = true;
  isSpinning.value = true;

  let targetIndex = Math.floor(Math.random() * totalCards);

  // Generate a new target index if the selected card has been removed
  while (removedIndexes.value.includes(targetIndex)) {
    if (removedIndexes.value.length === totalCards) {
      throw new Error('All cards have been selected. No more spins allowed.');
    }

    targetIndex = Math.floor(Math.random() * totalCards);
  }

  const stepDegrees = 360 / totalCards; // Degrees each card takes up on the circle
  const targetDegrees = stepDegrees * targetIndex; // extra degrees needed to land on the target card

  // Calculate total rotation needed to reach the target index including full spins
  // Ensure we always add at least one full spin (360 degrees) to the cumulative rotation to make the wheel spin
  const fullSpin = 360;
  const fullRotationsDegrees = fullSpin * 2; // Make 3 full rotations for visual effect
  const totalRotation =
    fullRotationsDegrees + (360 - targetDegrees) - (cumulativeRotation.value % 360);

  // Update cumulative rotation
  cumulativeRotation.value += totalRotation;

  const randomDuration = Math.floor(Math.random() * 750) + 1000;

  // Apply the rotation visually
  circle.value.style.transitionDuration = `${randomDuration}ms`;
  circle.value?.style.setProperty('--rotation', `${cumulativeRotation.value}deg`);

  const targetIndexOffset = totalCards / 2;
  const visualTargetIndex = (targetIndex + targetIndexOffset) % totalCards;

  // Ensure the actual cumulative rotation is used for logic without visually exceeding 360 degrees
  circle.value.dataset.rotation = cumulativeRotation.value.toString();

  // Update the selected card index after the animation completes
  setTimeout(() => {
    // I think visualTargetIndex is the order in the shuffled deck 🤷
    tarotSession.selectedCardIndex = visualTargetIndex;
    removedIndexes.value.push(targetIndex);
    isSpinning.value = false;
  }, randomDuration); // Adjust timeout to match your CSS transition
};

const disableSpin = computed(
  () => tarotSession.selectedCardIndex !== null || isSpinning.value
);

defineExpose({
  spinCarousel,
  disableSpin,
});
</script>

<template>
  <div class="prize-wheel relative">
    <div class="carousel-container">
      <div
        ref="circle"
        class="circle"
        :style="`--items: ${totalCards}`"
      >
        <template
          v-for="(card, cardIndex) in tarotSession.tarotDeck"
          :key="cardIndex"
        >
          <div
            v-if="card && tarotSession.selectedCardIndex !== cardIndex"
            class="item-el p-2 text-center text-xs text-zinc-500 transform"
            :style="`--index: ${cardIndex}`"
            :class="{
              'z-50 scale-150 -translate-y-4':
                tarotSession.selectedCardIndex === cardIndex,
            }"
          >
            <span class="text-[10px]">{{ cardIndex + 1 }}</span>
            <tarot-card :card="card" />
          </div>
        </template>

        <!-- wheel -->
        <svg
          viewBox="0 0 393 393"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="path-1-inside-1_194_285"
            fill="white"
          >
            <path
              d="M393 196.5C393 305.024 305.024 393 196.5 393C87.976 393 0 305.024 0 196.5C0 87.976 87.976 0 196.5 0C305.024 0 393 87.976 393 196.5ZM98.25 196.5C98.25 250.762 142.238 294.75 196.5 294.75C250.762 294.75 294.75 250.762 294.75 196.5C294.75 142.238 250.762 98.25 196.5 98.25C142.238 98.25 98.25 142.238 98.25 196.5Z"
            />
          </mask>
          <path
            d="M393 196.5C393 305.024 305.024 393 196.5 393C87.976 393 0 305.024 0 196.5C0 87.976 87.976 0 196.5 0C305.024 0 393 87.976 393 196.5ZM98.25 196.5C98.25 250.762 142.238 294.75 196.5 294.75C250.762 294.75 294.75 250.762 294.75 196.5C294.75 142.238 250.762 98.25 196.5 98.25C142.238 98.25 98.25 142.238 98.25 196.5Z"
            class="fill-surface-900 stroke-surface-800/50"
            stroke-width="4"
            mask="url(#path-1-inside-1_194_285)"
          />
        </svg>
      </div>

      <!-- pointer -->
      <svg
        viewBox="0 0 192 207"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="pointer"
      >
        <path
          d="M96 207L96 45.6827L1.80965e-05 -2.46167e-05L96 207Z"
          class="fill-secondary-300"
        />
        <path
          d="M96 207L96 45.6828L192 1.85966e-05L96 207Z"
          class="fill-secondary-400"
        />
      </svg>
    </div>
    <div class="flex justify-center absolute -bottom-1/4 w-full">
      <transition name="slide-down">
        <div
          v-if="tarotSession.selectedCardIndex !== null"
          style="z-index: 1000"
        >
          <draggable-tarot-card
            class="active-card max-w-24"
            :card="tarotSession.tarotDeck[tarotSession.selectedCardIndex]"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<style>
/* vue3 scale transition */
.slide-down-enter-active {
  transition-duration: 0.3s !important;
  transition-timing-function: var(--v-ease-out) !important;
}

.slide-down-move {
  transition-duration: 0.5s !important;
  transition-property: transform !important;
  transition-timing-function: var(--v-ease-out) !important;
}
.slide-down-enter-from {
  transform: translateY(-3rem);
  scale: 0.9;
}
.slide-down-enter-active {
  transition-property: transform, scale !important;
}

/* --- */

.prize-wheel {
  /* aspect-ratio: 8/7; */
}
.active-card {
  /* position: absolute; */
  /* width: 100px; */
  /* top: 20%;
  left: 44%; */
  z-index: 5000 !important;
}

.carousel-container {
  /* aspect-ratio: 4/3; */
  /* aspect-ratio: 8/7; */
  user-select: none;
  height: 100%;
  max-width: 800px;
  overflow: hidden;
  position: relative;
  /* z-index: 10000; */
  left: 50%;
  transform: translateX(-50%);
}

:root {
  --card-width: 12%;
  --card-height: 12%;
}

.circle {
  /* --size: 60vw; */
  --size: 100%;
  --radius: calc((var(--size) - var(--card-height)) / 2);
  --rotation: 0deg;

  width: var(--size);

  aspect-ratio: 1 / 1;
  position: absolute;
  bottom: 0;
  left: calc(50% - var(--size) / 2);
  rotate: calc(-90deg + var(--rotation));
  transition: rotate 2s cubic-bezier(0.55, 0, 0.1, 1);
}

.item-el {
  --index: 0;
  --step: calc(360deg / var(--items));
  --angle: calc(var(--step) * var(--index));
  --difference: calc((var(--card-height) - var(--card-width)) / 2);
  --x: calc(var(--difference) + var(--radius) + var(--radius) * cos(var(--angle)));
  --y: calc(var(--radius) + var(--radius) * sin(var(--angle)));

  width: var(--card-width);
  height: var(--card-height);
  position: absolute;
  left: var(--x);
  top: var(--y);

  transform-origin: center center;
  rotate: calc(var(--angle) + 90deg);
  transition: transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

.pointer {
  position: absolute;
  width: 6%;
  left: 50%;
  transform: translateX(-50%);
  bottom: 50%;
  z-index: 50;
}
</style>
