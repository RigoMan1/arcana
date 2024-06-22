<script setup lang="ts">
import { shuffleCards } from '@/utils/helpers';
import TarotCards from '~/constants/tarot-card-data';

const { $state: $fortuneReadingState } = useFortuneReading();
const { activeSpread, allCardsSelected } = storeToRefs(useTarotSpread());

const tarotDeck = ref(TarotCards) as Ref<TarotCard[] | null[]>;

onMounted(() => (tarotDeck.value = shuffleCards(TarotCards, true)));

const user = useSupabaseUser();

onMounted(() => {
  if (user.value?.user_metadata?.name) {
    handleTextMessage(`
  Greet the user.
  - mind the tarot spread
  - be very brief
  `);
  } else {
    handleTextMessage(`
      - Greet the user
      - Ask for their name
      - if the user provides their name, greet them by name
    `);
  }
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

const fortuneTeller = useFortuneTeller();
const { useBasicEnergy } = useEnergyStore();
const { sendMessage, $state } = useChatgptStore();

const lowEnergyAlert = ref(false);
async function handleSendMessage(
  prompt: string,
  userMessage: string,
  messageCost = 0
) {
  fortuneTeller.clearCurrentMessage();

  try {
    await useBasicEnergy(messageCost);

    const readingContext = `
    tarot-spread:${activeSpread.value.name}
    tarot-spread-description:${activeSpread.value.description}
    card-count:${activeSpread.value.labels.length}

    <user-data>
      name: ${user.value?.user_metadata?.name || 'n/a'}
    </user-data>

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
    lowEnergyAlert.value = true;
  }
}

const supabase = useSupabaseClient();
const showCards = ref(false);
function updateUserName(name: string) {
  console.log('updating name in the database with the name:', name);
  supabase.auth.updateUser({
    data: { name },
  });

  handleTextMessage(`
    - Greet the user by their name, and proceed with the reading
    - if the user denies providing their name, we will use "n/a" as the name
  `);
}
async function handleTextMessage(message: string) {
  const messageCost = Math.max(1, Math.ceil(message.length / 20));
  const res = await handleSendMessage(
    `
    ${fortuneTeller.activeFortuneTeller.description}
    ${fortuneTellerPrompt(fortuneTeller.activeFortuneTeller)}
    `,
    message,
    messageCost
  );
  if (res) {
    if (res.function_call) {
      // *handle user name update
      const args = JSON.parse(res.function_call.arguments);
      updateUserName(args.name);
    } else {
      fortuneTeller.setActiveMessage(res);
    }
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
    cardReadingPrompt(positionPrompt, fortuneTeller.activeFortuneTeller),
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
    wholisticPrompt(fortuneTeller.activeFortuneTeller),
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
  showCards.value = newVal === 'read';

  if (newVal === 'chat') fortuneTeller.showMessage();
  else if (newVal === 'read') fortuneTeller.hideMessage();

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
    quitReadingAlert.showDialog = true;
    quitReadingAlert.targetRoute = to;
    next(false);
  } else {
    fortuneTeller.clearCurrentMessage();
    next();
  }
});
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

      <div
        v-if="$state.isTyping"
        class="fortune-oracle"
      >
        <span class="animate-pulse">
          {{ fortuneTeller.activeFortuneTeller.name }} is typing...
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
          :disabled="!allCardsSelected || $state.isTyping"
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
            allCardsSelected
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
