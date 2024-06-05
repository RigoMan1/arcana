<script setup lang="ts">
import { shuffleCards } from '@/utils/helpers';
import TarotCards from '~/constants/tarot-card-data';

const { $state: $fortuneReadingState } = useFortuneReading();
const { activeSpread } = storeToRefs(useTarotSpread());

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
  wholisticPrompt,
} from '@/constants/systemPrompts';

const { useBasicEnergy } = useEnergyStore();
const { sendMessage, $state } = useChatgptStore();

async function handleSendMessage(
  prompt: string,
  userMessage: string,
  messageCost = 0
) {
  mostRecentMessage.value = null; // Clear the most recent message

  try {
    useBasicEnergy(messageCost);

    const readingContext = `
    tarot-spread:${activeSpread.value.name}
    card-count:${activeSpread.value.labels.length}

    <app-instructions>
      Q: how to draw cards?
      A: 1. click on the icon at the bottom left corner
         2. this will bring up a carousel of cards
         3. spin the carousel to draw a random card
         4. drag the card to a location on the the spread

    </app-instructions>
    `;

    return await sendMessage({
      system: prompt + readingContext,
      user: userMessage,
    });
  } catch (error) {
    alert.value = true;
  }
}

const readerSelectStore = useFortuneTeller();

const mostRecentMessage = ref() as Ref<IMessage | null>;
const chatBubble = ref(false);
async function handleTextMessage(message: string) {
  chatBubble.value = false;
  const messageCost = Math.max(1, Math.ceil(message.length / 20));
  const res = await handleSendMessage(
    `
    ${readerSelectStore.activeFortuneTeller.description}
    ${fortuneTellerPrompt(readerSelectStore.activeFortuneTeller)}
    `,
    message,
    messageCost
  );
  if (res) {
    mostRecentMessage.value = res;
    chatBubble.value = true;
  }
}

const dialog = ref(false);
const readings = ref([]) as Ref<IMessage[]>;
const CARD_READING_ENERGY_COST = 20;
const WHOLISTIC_READING_ENERGY_COST = 50;
const { $state: $readingState } = useFortuneReading();

async function handleSingleCardReading(
  cardPrompt: string,
  positionPrompt: string
) {
  showCards.value = false;

  const userMessage = `
    Can you provide more in-depth insights for
    ${cardPrompt}
  `;

  const reading = await handleSendMessage(
    cardReadingPrompt(positionPrompt, readerSelectStore.activeFortuneTeller),
    userMessage,
    CARD_READING_ENERGY_COST
  );

  if (reading) {
    readings.value.push(reading);
    dialog.value = true;
  }
}

async function handleWholisticReading({ drawnCards }: any) {
  showCards.value = false;
  const userMessage = `
    The user has drawn all cards for
    draw-cards-data: ${drawnCards}
  `;

  const reading = await handleSendMessage(
    wholisticPrompt(readerSelectStore.activeFortuneTeller),
    userMessage,
    WHOLISTIC_READING_ENERGY_COST
  );

  if (reading) {
    readings.value.push(reading);
    dialog.value = true;
  }
}

const showCards = ref(false);

const wheelEl = ref() as Ref<any>;
const tarotSpreadEl = ref() as Ref<any>;

onMounted(() => {
  handleTextMessage(`Hi`);
});

const alert = ref(false);

const mode = ref('chat');

function toggleMode(newVal: 'chat' | 'read') {
  chatBubble.value = newVal === 'chat';
  showCards.value = newVal === 'read';

  mode.value = newVal;
}
</script>

<template>
  <div class="container flex flex-col h-full">
    <insufficient-energy-dialog v-model="alert" />

    <fortune-readings-dialog
      v-model="dialog"
      :readings="readings"
    />
    <!-- 1. fortune message  -->
    <div class="flex items-center justify-center h-1/6">
      <transition name="scale-transition">
        <card-wheel
          v-if="showCards"
          ref="wheelEl"
          v-model="selectedCardIndex"
          class="w-full h-full origin-top"
          :tarot-deck="tarotDeck"
        />
      </transition>

      <v-overlay
        v-model="chatBubble"
        activator="#toggle-overlay"
        transition="dialog-transition"
        width="100%"
        persistent
        no-click-animation
        class="flex justify-center"
        :scrim="false"
      >
        <div
          v-if="!showCards"
          style="z-index: 100"
          class="absolute top-16 px-4 origin-top"
        >
          <svg
            class="ml-2"
            width="20"
            height="10"
            viewBox="0 0 20 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="0,10 10,0 20,10"
              class="fill-secondary-700"
            />
          </svg>
          <div class="h-full overflow-auto chat-bubble">
            <transition name="scale">
              <div v-if="mostRecentMessage">
                <fortune-teller-message
                  class="!text-indigo-100"
                  :message="mostRecentMessage"
                />
              </div>
            </transition>
          </div>
        </div>
      </v-overlay>

      <transition name="scale">
        <div
          v-if="$state.isTyping && !showCards"
          class="fortune-oracle"
        >
          <span class="animate-pulse">
            {{ readerSelectStore.activeFortuneTeller.name }} is typing...
          </span>
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
        @card-selected="handleSingleCardReading"
        @reveal-spread-component="handleWholisticReading"
      />
    </div>

    <!-- 3. controls -->

    <div class="p-4">
      <div
        class="flex items-center space-x-2 w-full max-w-sm mx-auto justify-between"
      >
        <!-- left -->
        <arcana-button
          v-if="mode === 'read'"
          class="!px-2"
          :disabled="$fortuneReadingState.cardDrawn"
          @click="toggleMode('chat')"
        >
          <Icon
            name="fluent:chat-bubbles-question-16-filled"
            size="2em"
          />
        </arcana-button>
        <arcana-button
          v-if="mode === 'chat'"
          class="!px-2"
          @click="toggleMode('read')"
        >
          <Icon
            name="fluent:playing-cards-20-filled"
            size="2em"
          />
        </arcana-button>
        <!-- mid -->
        <arcana-button
          v-if="mode === 'read'"
          :disabled="!tarotSpreadEl?.allCardsSelected || $state.isTyping"
          @click="tarotSpreadEl?.handleButtonClick"
        >
          {{ tarotSpreadEl?.buttonLabel }}
        </arcana-button>

        <arcana-text-area
          v-if="mode === 'chat'"
          class="self-center"
          @message="handleTextMessage"
          @toggle-cards="showCards = true"
        />
        <!-- right -->
        <arcana-button
          v-if="mode === 'read'"
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
    </div>
  </div>
</template>

<style>
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

.chat-bubble {
  @apply relative rounded-lg bg-secondary-700 p-2 max-h-[40vh] overflow-auto;
}
</style>
