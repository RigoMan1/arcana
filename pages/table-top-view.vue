<script setup lang="ts">
import TarotCards from '~/constants/tarot-card-data';

const tarotDeck = ref(TarotCards) as Ref<TarotCard[] | null[]>;

const shuffleCards = () => {
  let shuffled = [...TarotCards]; // Create a shallow copy to avoid modifying the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  tarotDeck.value = shuffled as TarotCard[];
};

onMounted(() => shuffleCards());

function removeCard(cardIndex: number) {
  tarotDeck.value.splice(cardIndex, 1, null);
}

// --- fortune reading logic ---

import { useChatgptStore } from '~/stores/useChatgptStore';
import {
  interactiveReaderPrompt,
  interactiveReaderCardReadingPrompt,
} from '@/constants/systemPrompts';
const { sendMessage, $state } = useChatgptStore();

const fortuneMessages = ref([]) as Ref<IMessage[]>;
const mostRecentMessage = ref('') as Ref<IMessage | null>;

async function handleSendMessage(prompt: string, userMessage: string) {
  mostRecentMessage.value = null; // Clear the most recent message

  const res = await sendMessage({
    system: prompt,
    user: userMessage,
  });

  if (res) {
    fortuneMessages.value.push(res); // Update the list of messages
    mostRecentMessage.value = res; // Update the most recent message
  }
}

async function handleClick(message: string) {
  await handleSendMessage(interactiveReaderPrompt, message);
}

async function handleSingleCardFortune(card: string) {
  const userMessage = `
    The user has drawn this card, for a 3 card cluster spread:
    ${card}
  `;
  await handleSendMessage(interactiveReaderCardReadingPrompt, userMessage);
}

const showCards = ref(true);
</script>

<template>
  <div class="container flex flex-col h-full space-y-8">
    <!-- 1. fortune message  -->
    <div class="h-2/6 flex items-center justify-center">
      <transition-group name="scale">
        <div class="pb-3 pt-1 px-3 overflow-y-auto max-w-4xl h-full">
          <fortune-teller-message
            v-if="mostRecentMessage && !$state.isTyping"
            :message="mostRecentMessage"
          />
        </div>

        <parchment-sheet v-if="$state.isTyping">
          <span class="animate-pulse"> Seeking insights... 🧙‍♂️ </span>
        </parchment-sheet>
      </transition-group>
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
    <div class="h-2/6 flex flex-col justify-end">
      <card-selection
        v-if="showCards"
        :tarot-deck="tarotDeck"
      />

      <fortune-reader-text-area
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
