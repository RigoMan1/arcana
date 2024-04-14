<script setup lang="ts">
import { shuffleCards } from '@/utils/helpers';
import TarotCards from '~/constants/tarot-card-data';

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
async function handleClick(message: string) {
  // calculate cost of message min 1
  const messageCost = Math.max(1, Math.ceil(message.length / 20));

  console.log('messageCost', messageCost);

  useBasicEnergy(messageCost);
  const res = await handleSendMessage(fortuneTellerPrompt, message);
  if (res) mostRecentMessage.value = res;
}

const dialog = ref(false);
const readings = ref([]) as Ref<IMessage[]>;
async function handleSingleCardFortune(card: string) {
  showCards.value = false;
  const userMessage = `
    The user has drawn this card, for a 3 card cluster spread:
    ${card}
  `;
  useBasicEnergy(5);
  const reading = await handleSendMessage(cardReadingPrompt, userMessage);

  reading && readings.value.push(reading);
  dialog.value = true;
}

const showCards = ref(false);
</script>

<template>
  <fortune-readings-dialog
    v-model="dialog"
    :readings="readings"
  />
  <div class="container flex flex-col h-full space-y-2">
    <!-- 1. fortune message  -->
    <div class="h-1/6 flex items-center justify-center">
      <card-wheel
        v-if="showCards"
        class="w-full h-full"
        v-model="selectedCardIndex"
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
      class="flex-1 items-center justify-center flex"
      style="z-index: 10"
    >
      <tarot-spread
        :tarot-deck="tarotDeck"
        spread="three-card-cluster"
        @remove-card="removeCard"
        @card-selected="handleSingleCardFortune"
      />
    </div>

    <!-- 3. controls -->
    <div class="pb-4 flex items-center justify-center">
      <arcana-text-area
        class="self-center"
        @message="handleClick"
        @toggle-cards="showCards = !showCards"
      />
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
