<script setup lang="ts">
import { PROMPT_BIO_QUERY } from '@/constants/systemPrompts';
import { onboardingSpread } from '@/constants/tarot-spreads';

const chatgpt = useChatgptStore();
const fortuneTeller = useFortuneTeller();
const tarotSessionSpread = useTarotSpread();
const tarotSession = useTarotSession();

onMounted(() => {
  tarotSessionSpread.setActiveSpread(onboardingSpread);
  fortuneTeller.handleTextMessage(PROMPT_BIO_QUERY, 0);
});

const wheelEl = ref() as Ref<any>;

const allCardsData = ref('');
function reactToCardDrop({
  position,
  card,
}: {
  position: string;
  card: TarotCard;
}) {
  const formatCard = (position: string, card: TarotCard) => `
  spread-label: ${position}
  card-name: ${card.name}
  card-image: ${card.image}
  reversed: ${card.reversed}
  `;

  allCardsData.value += formatCard(position, card);

  fortuneTeller.handleTextMessage(
    `
    <tarot-reading-context>
      drawn-cards: ${allCardsData}
    </tarot-reading-context>
    
    ---
    The user has drawn ${card.name} for ${position}:
      - give a very brief intermediary insight (1 sentence) about what the card means in that position, in regards to the users bio or question
      - Avoid general descriptions of the card
      - the response should be very brief, as to not to interrupt as the user continues to draw cards
      - do your best to interprate the user's personal bio or question
      - if
      
      - follow-up up with the user to further discuss the interpretation
      - make the questions specific and related to the user's bio and question
      - if there's opportunity to gather specifics, ask for it, but only if it's crucial information
      eg. names, dates, locations, etc.
      - after the user answers segway to prompt the user draw a card.
      - Language level: B1 - B2
  `,
    0
  );
  tarotSession.toggleMode('chat');
}

// #region  --- quit reading guard ---
async function concludeReading() {
  await fortuneTeller.assesConversation();

  navigateTo('/reader-select');
}

import type { RouteLocationNormalized } from 'vue-router';

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
    tarotSession.$reset();
    tarotSessionSpread.$reset();
    next();
  }
});
// #endregion
</script>

<template>
  <!-- alert to confirm user wants to continue to app -->
  <alert-dialog
    v-model="quitReadingAlert.showDialog"
    color="success"
    title="Complete Reading"
    text="Continue to the app if you're done with the reading."
    icon="fluent:checkmark-circle-24-filled"
    secondary-action-text="Cancel"
    primary-action-text="Continue"
    @click:secondary-action="quitReadingAlert.showDialog = false"
    @click:primary-action="navigateTo(quitReadingAlert.targetRoute?.fullPath)"
  />

  <div class="p-4 flex h-full flex-col">
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

    <div class="flex-1" />

    <tarot-spread @interpret-card-drop="reactToCardDrop" />

    <div class="flex space-x-4">
      <arcana-button
        class="flex-1"
        text="Skip"
        variant="outlined"
        size="sm"
        @click="fortuneTeller.handleTextMessage('skip', 0)"
      />

      <arcana-button
        class="flex-1"
        variant="outlined"
        size="sm"
        text="Continue to app"
        @click="concludeReading"
      />
    </div>

    <div class="flex items-end space-x-2 w-full max-w-sm mx-auto p-4">
      <!-- button: draw card -->
      <div class="flex flex-col items-center">
        <span class="text-xs mb-1 opacity-70"> Draw </span>

        <arcana-button
          class="!px-2 relative"
          :disabled="
            tarotSession.mode === 'read' || tarotSessionSpread.allCardsSelected
          "
          @click="tarotSession.drawCard(wheelEl)"
        >
          <Icon
            name="fluent:playing-cards-20-filled"
            size="2em"
          />
        </arcana-button>
      </div>

      <arcana-text-area
        v-if="
          tarotSession.mode === 'chat' &&
          !tarotSessionSpread.allCardsSelected &&
          !chatgpt.isTyping
        "
        @message="fortuneTeller.handleTextMessage($event, 0)"
      />
    </div>
  </div>
</template>
