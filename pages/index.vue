<script setup lang="ts">
import { shuffleCards } from '@/utils/helpers';
import TarotCards from '~/constants/tarot-card-data';

const { $state: $fortuneReadingState } = useFortuneReading();

const tarotDeck = ref(TarotCards) as Ref<TarotCard[] | null[]>;

onMounted(() => (tarotDeck.value = shuffleCards(TarotCards)));

// exposing index from prizewheel to reset the button
const selectedCardIndex = ref(null) as Ref<TarotCard | null>;
function removeCard(cardIndex: number) {
  tarotDeck.value.splice(cardIndex, 1, null);
  selectedCardIndex.value = null;
}

// --- fortune reading logic ---

import { useEnergyStore } from '@/stores/useEnergyStore';
import { useChatgptStore } from '~/stores/useChatgptStore';
import {
  fortuneTellerPrompt,
  cardReadingPrompt,
} from '@/constants/systemPrompts';

const { useBasicEnergy } = useEnergyStore();
const { sendMessage, $state } = useChatgptStore();

async function handleSendMessage(prompt: string, userMessage: string) {
  mostRecentMessage.value = null; // Clear the most recent message

  return await sendMessage({
    system: prompt,
    user: userMessage,
  });
}

const mostRecentMessage = ref() as Ref<IMessage | null>;
async function handleTextMessage(message: string) {
  // calculate cost of message min 1
  const messageCost = Math.max(1, Math.ceil(message.length / 20));

  useBasicEnergy(messageCost);
  const res = await handleSendMessage(
    `
    ${fortuneReadingStore.activeFortuneTeller.description}
    ${fortuneTellerPrompt}
    `,
    message
  );
  if (res) mostRecentMessage.value = res;
}

const dialog = ref(false);
const readings = ref([]) as Ref<IMessage[]>;
const { $state: $readingState } = useFortuneReading();
const fortuneReadingStore = useFortuneReading();

async function handleSingleCardFortune(
  cardPrompt: string,
  positionPrompt: string,
  spread: { name: string; labels: string[] }
) {
  showCards.value = false;
  const userMessage = `
    The user has drawn this card, for
    tarot-spread:${spread.name}
    tarot-spread-card-count: ${spread.labels.length}
    ${cardPrompt}
  `;
  useBasicEnergy(5);
  const reading = await handleSendMessage(
    cardReadingPrompt(positionPrompt, fortuneReadingStore.activeFortuneTeller),
    userMessage
  );

  reading && readings.value.push(reading);
  dialog.value = true;
}

const showCards = ref(false);

const wheelEl = ref() as Ref<any>;
const tarotSpreadEl = ref() as Ref<any>;
</script>

<template>
  <div class="container flex flex-col h-full">
    <div class="flex items-center space-x-4 p-4">
      <img
        :src="fortuneReadingStore.activeFortuneTeller.image"
        alt="fortune teller"
        class="w-12 h-12 rounded-full"
      />

      <h2 class="text-xl mt-2">
        {{ fortuneReadingStore.activeFortuneTeller.name }}
      </h2>
    </div>
    <fortune-readings-dialog
      v-model="dialog"
      :readings="readings"
    />
    <!-- 1. fortune message  -->
    <div class="flex items-center justify-center h-1/6">
      <card-wheel
        v-if="showCards"
        ref="wheelEl"
        v-model="selectedCardIndex"
        class="w-full h-full"
        :tarot-deck="tarotDeck"
      />

      <div
        v-if="!showCards"
        class="px-4 overflow-y-auto max-w-4xl h-full flex items-center"
      >
        <transition name="scale">
          <div
            v-if="mostRecentMessage && !$state.isTyping"
            class="fortune-oracle"
          >
            <fortune-teller-message
              class="!text-indigo-100"
              :message="mostRecentMessage"
            />
          </div>
        </transition>
      </div>

      <transition name="scale">
        <div
          v-if="$state.isTyping && !showCards"
          class="fortune-oracle"
        >
          <span class="animate-pulse"> Seeking insights... 🧙‍♂️ </span>
        </div>
      </transition>
    </div>

    <!-- 2. tarot spread -->

    <div
      class="flex-1"
      style="z-index: 10"
    >
      <tarot-spread
        ref="tarotSpreadEl"
        :tarot-deck="tarotDeck"
        @remove-card="removeCard"
        @card-selected="handleSingleCardFortune"
      />
    </div>

    <!-- 3. controls -->

    <div class="p-4">
      <div
        v-show="showCards || $fortuneReadingState.cardDrawn"
        class="flex items-center justify-between space-x-2 max-w-sm w-full mx-auto"
      >
        <arcana-button
          class="!px-2"
          :disabled="$fortuneReadingState.cardDrawn"
          @click="showCards = false"
        >
          <Icon
            name="fluent:chat-bubbles-question-16-filled"
            size="2em"
          />
        </arcana-button>

        <arcana-button
          v-if="tarotSpreadEl"
          :disabled="!tarotSpreadEl?.allCardsSelected || $state.isTyping"
          @click="tarotSpreadEl?.handleButtonClick"
        >
          {{ tarotSpreadEl?.buttonLabel }}
        </arcana-button>

        <arcana-button
          class="!px-2"
          :disabled="
            wheelEl?.disableSpin ||
            $readingState.fortuneInitiated ||
            tarotSpreadEl?.allCardsSelected
          "
          @click="wheelEl?.spinCarousel"
        >
          <Icon
            name="fluent:arrow-rotate-clockwise-16-filled"
            size="2em"
          />
        </arcana-button>
      </div>

      <div
        v-show="!$fortuneReadingState.cardDrawn && !showCards"
        class="flex items-center space-x-2 w-full max-w-sm mx-auto"
      >
        <arcana-button
          class="!px-2"
          @click="showCards = !showCards"
        >
          <Icon
            name="fluent:playing-cards-20-filled"
            size="2em"
          />
        </arcana-button>
        <arcana-text-area
          v-if="!$readingState.fortuneInitiated"
          class="self-center"
          @message="handleTextMessage"
          @toggle-cards="showCards = true"
        />
      </div>
    </div>
  </div>
</template>

<style>
.chat-bubble {
  @apply p-4 rounded-lg shadow-md text-lg mt-4 max-w-2xl;
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
