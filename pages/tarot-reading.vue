<script setup lang="ts">
import { PROMPT_GREETING } from '@/constants/systemPrompts';
import { getRandomQueries } from '@/constants/preset-queries.js';

const presetPrompts = getRandomQueries(4);

onMounted(() => {
  fortuneTeller.handleTextMessage(
    `
    <reading-context>
      <tarot-spread-info>
        tarot-spread:${tarotSessionSpread.activeSpread.name}
        tarot-spread-description:${tarotSessionSpread.activeSpread.description}
        card-count:${tarotSessionSpread.activeSpread.positions.length}
      </tarot-spread-info>

      <user-data>
        ${useProfileStore().bio}
        always respond in user prefered language: ${navigator.language}
      </user-data>
    </reading-context>

    ${PROMPT_GREETING}
    `,
    0
  );
});

const wheelEl = ref() as Ref<any>;

// #region --- fortune reading messaging ---
import { useChatgptStore } from '~/stores/useChatgptStore';
import {
  PROMPT_READING_SINGLE_CARD,
  PROMPT_READING_HOLISTIC,
} from '@/constants/systemPrompts';
import TarotSpread from '~/components/TarotSpread.vue';

const chatgpt = useChatgptStore();
const fortuneTeller = useFortuneTeller();
const tarotSessionSpread = useTarotSpread();
const tarotSession = useTarotSession();

const hasUserInteracted = ref(false);
function handleUserInput(message: string) {
  hasUserInteracted.value = true;
  fortuneTeller.handleTextMessage(message, 0);
}

function reactToCardDrop({
  position,
  card,
}: {
  position: string;
  card: TarotCard;
}) {
  fortuneTeller.handleTextMessage(
    `
    The user has drawn ${card.name} for ${position}:
      - give a very brief intermediary insight (1 sentence) about what the card means in that position, in regards to the user's question
      - Avoid general descriptions of the card
      - the response should be very brief, as to not to interrupt as the user continues to draw cards
      - do not instruct the user to draw more cards
  `,
    0
  );
  tarotSession.toggleMode('chat');
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

  const reading = await fortuneTeller.handleSendMessage({
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

async function handleWholisticReading() {
  const formatCard = (position: string, card: TarotCard) => `
  spread-label: ${position}
  card-name: ${card.name}
  card-image: ${card.image}
  reversed: ${card.reversed}
  `;

  const allCardsData = Object.entries(tarotSessionSpread.selectedCards).map(
    ([position, card]) => formatCard(position, card)
  );

  const userMessage = `
    The user has drawn all cards for
    tarot-spread: ${tarotSessionSpread.activeSpread.name}
    tarot-spread-description: ${tarotSessionSpread.activeSpread.description}
    card-count: ${tarotSessionSpread.activeSpread.positions.length}
    drawn-cards: ${allCardsData.join('\n')}
    give a holstic reading for each group in the tarot spread as whole.
  `;

  const reading = await fortuneTeller.handleSendMessage({
    systemPrompt: PROMPT_READING_HOLISTIC(fortuneTeller.activeFortuneTeller),
    userPrompt: userMessage,
    messageCost: 0,
  });

  if (reading) {
    readings.value.push(reading);
    dialog.value = true;

    await fortuneTeller.assesConversation();

    await fortuneTeller.handleTextMessage(`
      - bid the user farewell
    `);

    showConcludeReading.value = true;
  }
}

// #endregion

// #region  --- quit reading guard ---
import type { RouteLocationNormalized } from 'vue-router';

const quitReadingAlert = reactive({
  showDialog: false,
  targetRoute: null,
}) as {
  showDialog: boolean;
  targetRoute: RouteLocationNormalized | null;
};

// todo: if reading session is complete, don't show alert
onBeforeRouteLeave((to, from, next) => {
  if (!quitReadingAlert.showDialog && !showConcludeReading.value) {
    quitReadingAlert.showDialog = true;
    quitReadingAlert.targetRoute = to;
    next(false);
  } else {
    chatgpt.$reset();
    fortuneTeller.$reset();
    tarotSession.$reset();
    tarotSessionSpread.$reset();
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
          v-show="tarotSession.mode === 'read'"
          ref="wheelEl"
          class="w-full h-full origin-top"
        />
      </transition>

      <div
        v-if="chatgpt.isTyping && tarotSession.mode === 'chat'"
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
      <div
        v-if="!hasUserInteracted"
        class="grid grid-cols-1 gap-3 p-4"
      >
        <div
          v-for="q in presetPrompts"
          :key="q.slice(0, 10)"
          class="h-20 whitespace-normal rounded-lg bg-surface-900 border border-surface-100 flex
            items-center justify-center text-center user-select-none cursor-pointer
            hover:bg-surface-800/50 text-surface-100 text-sm"
          variant="outliend"
          @click="handleUserInput(q)"
        >
          {{ q }}
        </div>
      </div>

      <tarot-spread
        :class="{
          'opacity-0 absolute top-0 pointer-events-none': !hasUserInteracted,
        }"
        @interpret-card-drop="reactToCardDrop"
        @interpret-single="handleSingleCardReading"
      />
    </div>

    <!-- 3. controls -->

    <div class="flex items-end space-x-2 w-full max-w-sm mx-auto p-4">
      <!-- button: draw card -->
      <div class="flex flex-col items-center">
        <span class="text-xs mb-1 opacity-70"> Draw </span>
        <arcana-button
          class="!px-2 relative"
          :disabled="
            tarotSession.mode === 'read' ||
            tarotSessionSpread.allCardsSelected ||
            !hasUserInteracted
          "
          @click="tarotSession.drawCard(wheelEl)"
        >
          <Icon
            name="fluent:playing-cards-20-filled"
            size="2em"
          />
        </arcana-button>
      </div>

      <!-- button: holistic reading -->
      <arcana-button
        v-if="
          tarotSession.mode === 'chat' &&
          tarotSessionSpread.allCardsSelected &&
          !showConcludeReading
        "
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
        @click="navigateTo('/')"
      >
        Conclude Reading
      </arcana-button>

      <arcana-text-area
        v-if="
          tarotSession.mode === 'chat' && !tarotSessionSpread.allCardsSelected
        "
        @message="handleUserInput"
      />
    </div>
  </div>
</template>
