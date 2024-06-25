<script setup lang="ts">
const chatgpt = useChatgptStore();

const props = defineProps<{
  card?: TarotCard;
  positionData: ITarotSpreadObjectPosition;
  disableDeepReading?: boolean;
  isRevealed?: boolean;
}>();

const dialog = defineModel<boolean>();

const emit = defineEmits(['get-deep-reading']);

const elementsMap = new Map([
  ['wand', 'fire'],
  ['cup', 'water'],
  ['sword', 'air'],
  ['pentacle', 'earth'],
]);

function getDeepReading() {
  emit('get-deep-reading', props.positionData, props.card as TarotCard);
  dialog.value = false;
}
</script>

<template>
  <v-overlay
    v-model="dialog"
    transition="dialog-transition"
    width="90%"
    max-height="90%"
    close-on-back
    class="flex items-center justify-center"
  >
    <div
      class="rounded-xl text-center relative bg-[#232429] h-full flex flex-col overflow-auto"
    >
      <arcana-button
        class="absolute top-2 right-2 text-white z-10"
        variant="text"
        size="medium"
        icon
        @click="dialog = false"
      >
        <icon
          name="fluent:dismiss-20-filled"
          size="1.5rem"
        />
      </arcana-button>

      <div class="sticky top-0 w-full bg-[#232429] pt-4 px-4">
        <h2 class="text-center mb-4">{{ positionData.name }}</h2>

        <p class="text-sm">
          {{ positionData.description }}
        </p>

        <hr class="border-primary-700 w-full mt-4" />
      </div>

      <div class="flex flex-col items-center justify-center mt-4">
        <div class="flex space-x-4">
          <div
            v-for="i in ['arcana', 'suit', 'element']"
            :key="i"
          >
            <p class="text-xs capitalize mb-1 text-secondary-200">
              {{ i }}
            </p>

            <!-- slot for arcana -->
            <div v-if="i === 'arcana'">
              <div v-if="card && isRevealed">
                <div
                  class="object-cover bg-zinc-900 p-2 w-16 h-16 rounded text-xs flex items-center
                    justify-center"
                  :class="{ 'text-amber-400': card.arcana === 'major' }"
                >
                  <span>{{ card.arcana }}</span>
                </div>
              </div>
              <div
                v-else
                class="object-cover bg-zinc-900 p-2 w-16 h-16 rounded flex items-center justify-center"
              >
                <span v-show="!card">❔</span>
              </div>
            </div>

            <!-- slot for suit -->

            <div v-else-if="i === 'suit'">
              <div v-if="card && isRevealed && card.suit">
                <div
                  class="object-cover bg-zinc-900 p-2 w-16 h-16 rounded text-xs sprite sprite-suit"
                  :class="card.suit"
                />
              </div>
              <div
                v-else
                class="object-cover bg-zinc-900 p-2 w-16 h-16 rounded flex items-center justify-center"
              >
                <span v-show="!card">❔</span>
              </div>
            </div>

            <!-- slot for element -->
            <div v-else>
              <div v-if="card?.suit && isRevealed">
                <div
                  class="object-cover bg-zinc-900 p-2 w-16 h-16 rounded text-xs sprite sprite-el"
                  :class="elementsMap.get(card.suit as any)"
                />
              </div>
              <div
                v-else
                class="object-cover bg-zinc-900 p-2 w-16 h-16 rounded flex items-center justify-center"
              >
                <span v-show="!card">❔</span>
              </div>
            </div>
          </div>
        </div>

        <!-- chosen card -->
        <template v-if="card">
          <span class="my-2">
            {{ card.name }}
          </span>
          <tarot-card
            :card="card"
            :flip="isRevealed"
            :show-overlay="true"
            class="aspect-[11/19] w-1/3"
          />
        </template>

        <!-- empty card slot -->
        <template v-else>
          <span class="mt-4 mb-2"> no card selected </span>
          <div
            class="object-cover bg-zinc-900 p-2 rounded aspect-[11/19] mt-2 w-1/3 flex items-center
              justify-center"
          >
            <span v-show="!card">❔</span>
          </div>
        </template>

        <arcana-button
          class="mt-6 mb-4"
          size="small"
          :disabled="
            !card || disableDeepReading || chatgpt.isTyping || !isRevealed
          "
          @click="getDeepReading()"
        >
          <span> get deep reading </span>
        </arcana-button>
      </div>
    </div>
  </v-overlay>
</template>

<style>
:root {
  --icon-size: 64px;
  --sheet-cols: 2;
  --sheet-rows: 2;
  --sprite-sheet-elements: url('/images/tarot-metadata/sprite-sheet-elements.png');
  --sprite-sheet-suits: url('/images/tarot-metadata/sprite-sheet-suits.png');
}

.sprite {
  width: var(--icon-size);
  height: var(--icon-size);
  display: inline-block;
  background-size: calc(var(--icon-size) * var(--sheet-cols))
    calc(var(--icon-size) * var(--sheet-rows));
  background-position: calc(var(--x) * var(--icon-size) * -1)
    calc(var(--y) * var(--icon-size) * -1);
}

/* elements */
.sprite-el {
  background-image: var(--sprite-sheet-elements);
  --sheet-cols: 2;
  --sheet-rows: 2;
}

.fire {
  --x: 0;
  --y: 0;
}

.water {
  --x: 1;
  --y: 0;
}

.air {
  --x: 0;
  --y: 1;
}

.earth {
  --x: 1;
  --y: 1;
}

/* suits */
.sprite-suit {
  background-image: var(--sprite-sheet-suits);
}

.wand {
  --x: 0;
  --y: 0;
}

.cup {
  --x: 1;
  --y: 0;
}

.sword {
  --x: 0;
  --y: 1;
}

.pentacle {
  --x: 1;
  --y: 1;
}
</style>
