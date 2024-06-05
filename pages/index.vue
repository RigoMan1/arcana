<script setup lang="ts">
import { shuffleCards } from '@/utils/helpers';
import TarotCards from '~/constants/tarot-card-data';

const { $state: $fortuneReadingState } = useFortuneReading();
const { activeSpread } = storeToRefs(useTarotSpread());

const tarotDeck = ref(TarotCards) as Ref<TarotCard[] | null[]>;

onMounted(() => (tarotDeck.value = shuffleCards(TarotCards)));
onMounted(() => {
  handleTextMessage(`
  Greet the user.
  - mind the tarot spread
  - be very brief
  `);
});

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
import type { RouteLocationNormalized } from 'vue-router';

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
    tarot-spread-description:${activeSpread.value.description}
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
const showCards = ref(false);
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

const wheelEl = ref() as Ref<any>;
const tarotSpreadEl = ref() as Ref<any>;

const mode = ref('chat');

function toggleMode(newVal: 'chat' | 'read') {
  chatBubble.value = newVal === 'chat';
  showCards.value = newVal === 'read';

  mode.value = newVal;
}

// quit reading guard
const quitReadingAlert = reactive({
  showDialog: false,
  targetRoute: null,
}) as {
  showDialog: boolean;
  targetRoute: RouteLocationNormalized | null;
};

onBeforeRouteLeave((to, from, next) => {
  if (!quitReadingAlert.showDialog) {
    console.log('prevent navigation');
    quitReadingAlert.showDialog = true;
    quitReadingAlert.targetRoute = to;
    next(false);
  } else {
    next();
  }
});

const lowEnergyAlert = ref(false);
</script>

<template>
  <div class="container flex flex-col h-full">
    <insufficient-energy-dialog v-model="lowEnergyAlert" />

    <alert-dialog
      v-model="quitReadingAlert.showDialog"
      color="error"
      title="Quit Reading?"
      text="Are you sure you want to quit the reading?"
      icon="fluent:error-circle-24-filled"
      secondary-action-text="Cancel"
      primary-action-text="Quit Reading"
      @click:secondary-action="quitReadingAlert.showDialog = false"
      @click:primary-action="navigateTo(quitReadingAlert.targetRoute?.fullPath)"
    />

    <fortune-readings-dialog
      v-model="dialog"
      :readings="readings"
    />
    <!-- 1. fortune message  -->
    <div class="flex items-center justify-center h-1/6">
      <transition name="scale-transition">
        <card-wheel
          v-if="mode === 'read' && showCards"
          ref="wheelEl"
          v-model="selectedCardIndex"
          class="w-full h-full origin-top"
          :tarot-deck="tarotDeck"
        />
      </transition>

      <text-bubble
        :message="mostRecentMessage"
        :show="chatBubble"
      />

      <div
        v-if="$state.isTyping"
        class="fortune-oracle"
      >
        <span class="animate-pulse">
          {{ readerSelectStore.activeFortuneTeller.name }} is typing...
        </span>
      </div>
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
