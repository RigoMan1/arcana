<script setup lang="ts">
import { shuffleCards } from '@/utils/helpers';
import TarotCards from '~/constants/tarot-card-data';
import { PROMPT_GREETING } from '@/constants/systemPrompts';

const tarotDeck = ref(TarotCards) as Ref<TarotCard[] | null[]>;

const { $state: $profile, updateBio } = useProfileStore();

onMounted(() => {
  tarotDeck.value = shuffleCards(TarotCards, true);

  handleTextMessage(
    `
    <reading-context>
      <tarot-spread-info>
        tarot-spread:${activeSpread.value.name}
        tarot-spread-description:${activeSpread.value.description}
        card-count:${activeSpread.value.positions.length}
      </tarot-spread-info>

      <user-data>
        ${$profile.bio}
        always respond in user prefered language: ${navigator.language}
      </user-data>
    </reading-context>

    ${PROMPT_GREETING}
    `,
    0
  );
});

// exposing index from prizewheel to reset the button
const selectedCardIndex = ref(null) as Ref<TarotCard | null>;
function removeCard(cardIndex: number) {
  tarotDeck.value.splice(cardIndex, 1, null);
  selectedCardIndex.value = null;
}

const mode = ref('chat');

function toggleMode(newVal: 'chat' | 'read') {
  if (newVal === 'chat') fortuneTeller.showMessage();
  else if (newVal === 'read') fortuneTeller.hideMessage();

  mode.value = newVal;
}

const wheelEl = ref() as Ref<any>;
function drawCard() {
  toggleMode('read');

  setTimeout(() => {
    wheelEl.value.spinCarousel();
  }, 400);
}

// #region --- fortune reading messaging ---
import { useChatgptStore } from '~/stores/useChatgptStore';
import type { RouteLocationNormalized } from 'vue-router';
import {
  PROMPT_READING_SINGLE_CARD,
  PROMPT_READING_HOLISTIC,
  PROMPT_BIO_ASSESMENT,
} from '@/constants/systemPrompts';

const fortuneTeller = useFortuneTeller();
const { handleSendMessage, handleTextMessage } = useFortuneTeller();
const chatgpt = useChatgptStore();

const { activeSpread, allCardsSelected, selectedCards } =
  storeToRefs(useTarotSpread());

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
async function handleSingleCardReading(
  cardPrompt: string,
  positionPrompt: string
) {
  const userPrompt = `
    Can you provide more in-depth insights for
    ${cardPrompt}
  `;

  const systemPrompt = PROMPT_READING_SINGLE_CARD(
    positionPrompt,
    fortuneTeller.activeFortuneTeller
  );

  const reading = await handleSendMessage({
    systemPrompt,
    userPrompt,
    messageCost: CARD_READING_ENERGY_COST,
  });

  if (reading) {
    readings.value.push(reading);
    dialog.value = true;
  }
}

const showConcludeReading = ref(false);
const WHOLISTIC_READING_ENERGY_COST = 50;
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

  const reading = await handleSendMessage({
    systemPrompt: PROMPT_READING_HOLISTIC(fortuneTeller.activeFortuneTeller),
    userPrompt: userMessage,
    messageCost: WHOLISTIC_READING_ENERGY_COST,
  });

  if (reading) {
    readings.value.push(reading);
    dialog.value = true;

    // todo: improvised complete reading logic
    handleTextMessage(`
      - bid the user farewell
    `);

    const res = await handleSendMessage({
      systemPrompt: '',
      userPrompt: PROMPT_BIO_ASSESMENT,
      messageCost: 0,
    });

    if (res?.content) await updateBio(res.content);
    console.log('bio updated');

    showConcludeReading.value = true;
  }
}
// #endregion

// #region  --- quit reading guard ---
function concludeReading() {
  window.location.href = '/reader-select';
}

const quitReadingAlert = reactive({
  showDialog: false,
  targetRoute: null,
}) as {
  showDialog: boolean;
  targetRoute: RouteLocationNormalized | null;
};

const fortuneReadingStore = useFortuneReading();
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
// #endregion
</script>

<template>
  <div class="container flex flex-col h-full">
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
          v-show="mode === 'read'"
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
          @click="drawCard"
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
