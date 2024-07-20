<script setup lang="ts">
import { shuffleCards } from '@/utils/helpers';
import TarotCards from '~/constants/tarot-card-data';

const fortuneReadingStore = useFortuneReading();

const tarotDeck = ref(TarotCards) as Ref<TarotCard[] | null[]>;

onMounted(() => (tarotDeck.value = shuffleCards(TarotCards, true)));

const user = useSupabaseUser();

// Greet user and ask for their name
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

const { useBasicEnergy } = useEnergyStore();
const fortuneTeller = useFortuneTeller();
const chatgpt = useChatgptStore();

const lowEnergyAlert = ref(false);

const userLanguage = ref<string>('es');
onMounted(() => (userLanguage.value = navigator.language));

const { activeSpread, allCardsSelected, selectedCards } =
  storeToRefs(useTarotSpread());

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
    card-count:${activeSpread.value.positions.length}

    <user-data>
      name: ${user.value?.user_metadata?.name || 'n/a'}
      always respond in user prefered language: ${userLanguage.value}
    </user-data>

    <app-instructions>
      Q: how to draw cards?
      A: 1. click on the icon at the bottom left corner
         2. this will bring up a carousel of cards
         3. spin the carousel to draw a random card
         4. drag the card to a location on the the spread

    </app-instructions>
    `;

    return await chatgpt.sendMessage({
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

function reactToCardDrop({
  position,
  card,
}: {
  position: string;
  card: TarotCard;
}) {
  handleTextMessage(`
    The user has drawn ${card.name} for ${position}:
      - give a very brief intermediary insight (1 sentence) about what the card means in that position, in regards to the user's question
      - Avoid general descriptions of the card
      - the response should be very brief, as to not to interrupt as the user continues to draw cards
      - do not instruct the user to draw more cards
  `);
  toggleMode('chat');
}

const dialog = ref(false);
const readings = ref([]) as Ref<IMessage[]>;
const CARD_READING_ENERGY_COST = 20;
const WHOLISTIC_READING_ENERGY_COST = 50;

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

const showConcludeReading = ref(false);
async function handleWholisticReading() {
  const formatCard = (position: string, card: TarotCard) => `
  spread-label: ${position}
  card-name: ${card.name}
  card-image: ${card.image}
  reversed: ${card.reversed}
  `;

  const allCardsData = Object.entries(selectedCards.value).map(
    ([position, card]) => formatCard(position, card)
  );

  const userMessage = `
    The user has drawn all cards for
    tarot-spread: ${activeSpread.value.name}
    tarot-spread-description: ${activeSpread.value.description}
    card-count: ${activeSpread.value.positions.length}
    drawn-cards: ${allCardsData.join('\n')}
    give a holstic reading for each group in the tarot spread as whole.
  `;

  const reading = await handleSendMessage(
    wholisticPrompt(fortuneTeller.activeFortuneTeller),
    userMessage,
    WHOLISTIC_READING_ENERGY_COST
  );

  if (reading) {
    readings.value.push(reading);
    dialog.value = true;

    // todo: improvised complete reading logic
    handleTextMessage(`
      - bid the user farewell
    `);

    showConcludeReading.value = true;
  }
}

function concludeReading() {
  window.location.href = '/reader-select';
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
    chatgpt.$reset();
    fortuneTeller.$reset();
    fortuneReadingStore.$reset();
    next();
  }
});

function handleCardClick() {
  toggleMode('read');

  setTimeout(() => {
    wheelEl.value.spinCarousel();
  }, 400);

  console.log('spinnging the wheel');
}
</script>

<template>
  <div class="container flex flex-col h-full">
    <insufficient-energy-dialog v-model="lowEnergyAlert" />

    <alert-dialog
      v-model="quitReadingAlert.showDialog"
      color="danger"
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
    <!-- 1. wheel & isTyping loader  -->
    <div class="flex items-center justify-center h-1/6">
      <transition name="scale-transition">
        <card-wheel
          v-show="mode === 'read' && showCards"
          ref="wheelEl"
          v-model="selectedCardIndex"
          class="w-full h-full origin-top"
          :tarot-deck="tarotDeck"
        />
      </transition>

      <div
        v-if="chatgpt.isTyping && mode === 'chat'"
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
        @react-to-card-drop="reactToCardDrop"
      />
    </div>

    <!-- 3. controls -->

    <div class="flex items-end space-x-2 w-full max-w-sm mx-auto p-4">
      <!-- button: draw card -->
      <div class="flex flex-col items-center">
        <span class="text-xs mb-1 opacity-70"> Draw </span>
        <arcana-button
          class="!px-2 relative"
          :disabled="mode === 'read' || allCardsSelected"
          @click="handleCardClick"
        >
          <Icon
            name="fluent:playing-cards-20-filled"
            size="2em"
          />
        </arcana-button>
      </div>

      <!-- button: holistic reading -->
      <arcana-button
        v-if="mode === 'chat' && allCardsSelected && !showConcludeReading"
        class="w-full"
        :disabled="chatgpt.isTyping"
        @click="handleWholisticReading"
      >
        Get Holistic Reading
      </arcana-button>

      <arcana-button
        v-if="showConcludeReading"
        class="w-full"
        :disabled="chatgpt.isTyping"
        @click="concludeReading"
      >
        Conclude Reading
      </arcana-button>

      <arcana-text-area
        v-if="mode === 'chat' && !allCardsSelected"
        @message="handleTextMessage"
      />
    </div>
  </div>
</template>
