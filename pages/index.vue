<script setup lang="ts">
import { shuffleCards } from '@/utils/helpers';
import TarotCards from '~/constants/tarot-card-data';

const tarotDeck = ref(TarotCards) as Ref<TarotCard[] | null[]>;

onMounted(() => (tarotDeck.value = shuffleCards(TarotCards)));

function removeCard(cardIndex: number) {
  tarotDeck.value.splice(cardIndex, 1, null);
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

  <div class="container flex flex-col h-full space-y-8">
    <!-- 1. fortune message  -->
    <div class="h-2/6 flex items-center justify-center">
      <card-selection
        v-if="showCards"
        :tarot-deck="tarotDeck"
      />
      <div
        class="pb-3 pt-1 px-3 overflow-y-auto max-w-4xl h-full flex items-center"
      >
        <transition name="scale">
          <fortune-teller-message
            v-if="mostRecentMessage && !$state.isTyping"
            :message="mostRecentMessage"
          />
        </transition>
      </div>

      <transition name="scale">
        <parchment-sheet v-if="$state.isTyping">
          <span class="animate-pulse"> Seeking insights... 🧙‍♂️ </span>
        </parchment-sheet>
      </transition>
    </div>

    <!-- 2. tarot spread -->
    <div class="h-2/6">
      <tarot-spread
        :tarot-deck="tarotDeck"
        spread="three-card-cluster"
        @remove-card="removeCard"
        @card-selected="handleSingleCardFortune"
      />
    </div>

    <!-- 3. controls -->
    <div class="h-2/6 flex flex-col justify-end pb-8">
      <arcana-text-area
        class="w-2/3 self-center"
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
</style>
